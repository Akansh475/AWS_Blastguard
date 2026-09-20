import React, { useState, useEffect, useMemo } from 'react';
import { AppRail, ActiveNavSection } from './AppRail';
import { MainWorkspace } from './MainWorkspace';
import { SelectedRequestPanel } from './SelectedRequestPanel';
import { FloatingChatbotWidget } from './FloatingChatbotWidget';
import { InteractiveImpactStudio } from './InteractiveImpactStudio';
import { DASHBOARD_CHANGE_REQUESTS, DashboardChangeRequest } from '../../data/mockData';
import { BlastGuardApiClient } from '../../services/apiClient';

interface BlastGuardDashboardViewProps {
  onNavigateHome?: () => void;
}

export const BlastGuardDashboardView: React.FC<BlastGuardDashboardViewProps> = ({
  onNavigateHome,
}) => {
  // Navigation states
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('dashboard');
  const [requestsList, setRequestsList] = useState<DashboardChangeRequest[]>(DASHBOARD_CHANGE_REQUESTS);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('cr-01');
  const [filterType, setFilterType] = useState<'All' | 'Pending' | 'Approved' | 'Blocked'>('All');
  const [isImpactStudioOpen, setIsImpactStudioOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // 1. Fetch live requests from Express Backend on Mount
  useEffect(() => {
    let isMounted = true;

    async function loadBackendRequests() {
      try {
        const backendRequests = await BlastGuardApiClient.listRequests();
        if (isMounted && backendRequests && backendRequests.length > 0) {
          setIsBackendConnected(true);
          // Map backend request response to DashboardChangeRequest
          const mapped: DashboardChangeRequest[] = backendRequests.map((br) => {
            const isBlocked = br.status === 'BLOCKED' || br.decision === 'BLOCK';
            const isApproved = br.status === 'SAFE' || br.status === 'APPROVED' || br.decision === 'ALLOW';
            const statusFormatted: 'Blocked' | 'Approved' | 'Pending' = isBlocked
              ? 'Blocked'
              : isApproved
              ? 'Approved'
              : 'Pending';

            let riskLevel: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
            const score = br.riskScore ?? 50;
            if (score >= 80) riskLevel = 'Critical';
            else if (score >= 60) riskLevel = 'High';
            else if (score >= 30) riskLevel = 'Medium';

            const actionLabel = br.action === 'DELETE' ? 'Delete' : br.action === 'CREATE' ? 'Create' : 'Update';

            return {
              id: br.requestId,
              title: `${actionLabel} ${br.resourceId}`,
              action: actionLabel,
              target: br.resourceId,
              resourceName: br.resourceId,
              resourceType: br.resourceType || 'Subnet',
              serviceCategory: (br.resourceType?.toLowerCase().includes('database') || br.resourceType?.toLowerCase().includes('rds'))
                ? 'RDS'
                : (br.resourceType?.toLowerCase().includes('ecs') || br.resourceType?.toLowerCase().includes('ec2'))
                ? 'EC2'
                : (br.resourceType?.toLowerCase().includes('lambda'))
                ? 'Lambda'
                : (br.resourceType?.toLowerCase().includes('iam') || br.resourceType?.toLowerCase().includes('kms'))
                ? 'IAM'
                : 'VPC',
              environment: br.environment === 'PRODUCTION' ? 'Production' : br.environment === 'STAGING' ? 'Staging' : 'Dev',
              region: br.region || 'ap-south-1',
              status: statusFormatted,
              statusColor: isBlocked ? 'red' : isApproved ? 'green' : 'amber',
              riskScore: br.riskScore ?? (isBlocked ? 87 : isApproved ? 18 : 45),
              riskLevel,
              affectedResources: br.affectedResources ?? (isBlocked ? 11 : 0),
              criticalServices: br.criticalServices ?? (isBlocked ? 3 : 0),
              externalDependencies: br.externalDependencies ?? (isBlocked ? 2 : 0),
              decisionTitle: isBlocked ? 'Change Blocked' : isApproved ? 'Change Approved' : 'Review Required',
              decisionMessage: isBlocked
                ? 'This change may impact critical production services.'
                : 'Safe to deploy with zero blast radius.',
              actionIcon: actionLabel === 'Delete' ? 'trash' : 'server',
              timeAgo: 'Just now',
            };
          });

          // Merge with predefined mock requests so complete topology details are available
          const existingIds = new Set(mapped.map((m) => m.id));
          const combined = [
            ...mapped,
            ...DASHBOARD_CHANGE_REQUESTS.filter((d) => !existingIds.has(d.id)),
          ];
          setRequestsList(combined);
        }
      } catch (err) {
        console.warn('Backend live fetch failed, using pre-seeded digital twin:', err);
      }
    }

    loadBackendRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  // Selected request details
  const selectedRequest: DashboardChangeRequest = useMemo(() => {
    return (
      requestsList.find((r) => r.id === selectedRequestId) ||
      requestsList[0] ||
      DASHBOARD_CHANGE_REQUESTS[0]
    );
  }, [selectedRequestId, requestsList]);

  // Handle section changes from AppRail
  const handleSelectSection = (section: ActiveNavSection) => {
    setActiveSection(section);
    if (section === 'impact') {
      setIsImpactStudioOpen(true);
    }
  };

  // Trigger analysis for the current request
  const handleTriggerAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await BlastGuardApiClient.analyzeRequest(selectedRequest.id);
      if (result) {
        // Update local request state with real backend analysis results
        setRequestsList((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id
              ? {
                  ...r,
                  riskScore: result.riskScore,
                  riskLevel: result.severity === 'CRITICAL' ? 'Critical' : result.severity === 'HIGH' ? 'High' : 'Low',
                  status: result.decision === 'BLOCK' ? 'Blocked' : 'Approved',
                  statusColor: result.decision === 'BLOCK' ? 'red' : 'green',
                  affectedResources: result.affectedResources,
                  criticalServices: result.criticalServices,
                  externalDependencies: result.externalDependencies,
                  decisionTitle: result.decision === 'BLOCK' ? 'Change Blocked' : 'Change Approved',
                  decisionMessage: result.summary,
                }
              : r
          )
        );
      }
      await BlastGuardApiClient.explainRequest(selectedRequest.id, true);
    } catch (err) {
      console.warn('Analysis trigger executed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle search query submit (e.g. "Delete subnet-07", "Terminate ec2-01", etc.)
  const handleSearchSubmit = async (query: string) => {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();

    // Check if query matches an existing request ID or resource
    const existing = requestsList.find(
      (r) =>
        r.id.toLowerCase() === cleanQuery.toLowerCase() ||
        r.resourceName.toLowerCase() === cleanQuery.toLowerCase() ||
        r.title.toLowerCase().includes(cleanQuery.toLowerCase())
    );

    if (existing) {
      setSelectedRequestId(existing.id);
      return;
    }

    // Otherwise create a live change request on the backend and analyze it!
    setIsAnalyzing(true);
    try {
      const action = cleanQuery.toLowerCase().startsWith('create')
        ? 'CREATE'
        : cleanQuery.toLowerCase().startsWith('modify')
        ? 'UPDATE'
        : 'DELETE';

      const words = cleanQuery.split(' ');
      const resourceId = words.length > 1 ? words[words.length - 1] : cleanQuery;
      const actionLabel = action === 'DELETE' ? 'Delete' : action === 'CREATE' ? 'Create' : 'Update';

      const created = await BlastGuardApiClient.createRequest({
        action,
        resourceId,
        resourceType: resourceId.startsWith('subnet') ? 'Subnet' : resourceId.startsWith('sg') ? 'SecurityGroup' : 'EC2',
        region: 'ap-south-1',
        environment: 'PRODUCTION',
      });

      if (created && created.requestId) {
        const analyzed = await BlastGuardApiClient.analyzeRequest(created.requestId);
        const isBlocked = analyzed.decision === 'BLOCK';

        const newReq: DashboardChangeRequest = {
          id: created.requestId,
          title: `${actionLabel} ${resourceId}`,
          action: actionLabel,
          target: resourceId,
          resourceName: resourceId,
          resourceType: 'Subnet',
          serviceCategory: 'VPC',
          environment: 'Production',
          region: 'ap-south-1',
          status: isBlocked ? 'Blocked' : 'Approved',
          statusColor: isBlocked ? 'red' : 'green',
          riskScore: analyzed.riskScore || (isBlocked ? 87 : 18),
          riskLevel: analyzed.severity === 'CRITICAL' ? 'Critical' : 'High',
          affectedResources: analyzed.affectedResources || (isBlocked ? 11 : 0),
          criticalServices: analyzed.criticalServices || (isBlocked ? 3 : 0),
          externalDependencies: analyzed.externalDependencies || (isBlocked ? 2 : 0),
          decisionTitle: isBlocked ? 'Change Blocked' : 'Change Approved',
          decisionMessage: analyzed.summary || 'Analyzed by BlastGuard AI',
          actionIcon: actionLabel === 'Delete' ? 'trash' : 'server',
          timeAgo: 'Just now',
        };

        setRequestsList((prev) => [newReq, ...prev]);
        setSelectedRequestId(newReq.id);
      }
    } catch (err) {
      console.warn('Live request creation/analysis finished:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col lg:flex-row selection:bg-[#FF7A30]/30 selection:text-[#18181B] overflow-x-hidden font-sans">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR RAIL (WIDTH 240px) */}
      {/* ========================================================================= */}
      <AppRail
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onNavigateHome={onNavigateHome}
      />

      {/* ========================================================================= */}
      {/* 2. MAIN CENTER WORKSPACE (FLEX-1) */}
      {/* ========================================================================= */}
      <MainWorkspace
        request={selectedRequest}
        requests={requestsList}
        selectedRequestId={selectedRequestId}
        onSelectRequest={setSelectedRequestId}
        activeSection={activeSection}
        onOpenImpactStudio={() => setIsImpactStudioOpen(true)}
        onTriggerAnalyze={handleTriggerAnalyze}
        onSearchChange={handleSearchSubmit}
        isAnalyzing={isAnalyzing}
        filter={filterType}
        setFilter={setFilterType}
        onBackHome={onNavigateHome}
      />

      {/* ========================================================================= */}
      {/* 3. RIGHT RISK ANALYSIS PANEL (WIDTH 340px) */}
      {/* ========================================================================= */}
      <SelectedRequestPanel
        request={selectedRequest}
        onViewImpact={() => setIsImpactStudioOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 4. FLOATING CHATBOT WIDGET */}
      {/* ========================================================================= */}
      <FloatingChatbotWidget
        request={selectedRequest}
        onOpenImpactStudio={() => setIsImpactStudioOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 5. FULL INTERACTIVE IMPACT STUDIO MODAL */}
      {/* ========================================================================= */}
      <InteractiveImpactStudio
        isOpen={isImpactStudioOpen}
        onClose={() => setIsImpactStudioOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
};

export default BlastGuardDashboardView;
