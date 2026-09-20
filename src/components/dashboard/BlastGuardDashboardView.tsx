import React, { useState, useMemo } from 'react';
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
  const [selectedRequestId, setSelectedRequestId] = useState<string>('cr-01');
  const [filterType, setFilterType] = useState<'All' | 'Pending' | 'Approved' | 'Blocked'>('All');
  const [isImpactStudioOpen, setIsImpactStudioOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Selected request details
  const selectedRequest: DashboardChangeRequest = useMemo(() => {
    return (
      DASHBOARD_CHANGE_REQUESTS.find((r) => r.id === selectedRequestId) ||
      DASHBOARD_CHANGE_REQUESTS[0]
    );
  }, [selectedRequestId]);

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
      await BlastGuardApiClient.analyzeRequest(selectedRequest.id);
      await BlastGuardApiClient.explainRequest(selectedRequest.id, true);
    } catch (err) {
      console.error('Analysis trigger failed:', err);
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
        requests={DASHBOARD_CHANGE_REQUESTS}
        selectedRequestId={selectedRequestId}
        onSelectRequest={setSelectedRequestId}
        activeSection={activeSection}
        onOpenImpactStudio={() => setIsImpactStudioOpen(true)}
        onTriggerAnalyze={handleTriggerAnalyze}
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
