import React, { useState, useMemo } from 'react';
import { AppRail, ActiveNavSection } from './AppRail';
import { SecondaryNavPanel, ChannelId } from './SecondaryNavPanel';
import { MainWorkspace } from './MainWorkspace';
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
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('requests');
  const [activeChannel, setActiveChannel] = useState<ChannelId>('requests-all');
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
    if (section === 'requests') {
      setActiveChannel('requests-all');
    } else if (section === 'impact') {
      setActiveChannel('infra-dependencies');
    } else if (section === 'history') {
      setActiveChannel('workspace-history');
    } else if (section === 'settings') {
      setActiveChannel('workspace-settings');
    }
  };

  // Handle channel selection from SecondaryNavPanel
  const handleSelectChannel = (channel: ChannelId) => {
    setActiveChannel(channel);
    if (channel === 'requests-all') {
      setFilterType('All');
      setActiveSection('requests');
    } else if (channel === 'requests-pending') {
      setFilterType('Pending');
      setActiveSection('requests');
    } else if (channel === 'requests-approved') {
      setFilterType('Approved');
      setActiveSection('requests');
    } else if (channel === 'requests-blocked') {
      setFilterType('Blocked');
      setActiveSection('requests');
    } else if (channel === 'infra-impact') {
      setIsImpactStudioOpen(true);
    } else if (channel === 'workspace-history') {
      setActiveSection('history');
    } else if (channel === 'workspace-settings') {
      setActiveSection('settings');
    }
  };

  // Trigger analysis for the current request
  const handleTriggerAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await BlastGuardApiClient.analyzeRequest(selectedRequest.id);
      // Automatically refresh explanation
      await BlastGuardApiClient.explainRequest(selectedRequest.id, true);
    } catch (err) {
      console.error('Analysis trigger failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDFCE2] text-[#1E4726] flex selection:bg-[#BAF084]/60 selection:text-[#1E4726] overflow-x-hidden font-sans">
      {/* ========================================================================= */}
      {/* 1. FAR-LEFT APPLICATION RAIL (WIDTH ~68px) */}
      {/* ========================================================================= */}
      <AppRail
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onNavigateHome={onNavigateHome}
      />

      {/* ========================================================================= */}
      {/* 2. SECONDARY DISCORD-STYLE NAVIGATION PANEL (WIDTH ~300px) */}
      {/* ========================================================================= */}
      <SecondaryNavPanel
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        activeChannel={activeChannel}
        onSelectChannel={handleSelectChannel}
        requests={DASHBOARD_CHANGE_REQUESTS}
        selectedRequestId={selectedRequestId}
        onSelectRequest={(id) => {
          setSelectedRequestId(id);
          setActiveSection('requests');
        }}
        onOpenImpactStudio={() => setIsImpactStudioOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 3. LARGE CENTRAL ANALYSIS WORKSPACE (FLEX-1 DOMINANT AREA) */}
      {/* ========================================================================= */}
      <MainWorkspace
        request={selectedRequest}
        requests={DASHBOARD_CHANGE_REQUESTS}
        selectedRequestId={selectedRequestId}
        onSelectRequest={setSelectedRequestId}
        activeSection={activeSection}
        activeChannel={activeChannel}
        onOpenImpactStudio={() => setIsImpactStudioOpen(true)}
        onTriggerAnalyze={handleTriggerAnalyze}
        isAnalyzing={isAnalyzing}
        filter={filterType}
        setFilter={setFilterType}
      />

      {/* ========================================================================= */}
      {/* 4. FLOATING CHATBOT WIDGET (BOTTOM-RIGHT FLOATING MASCOT ASSISTANT) */}
      {/* ========================================================================= */}
      <FloatingChatbotWidget
        request={selectedRequest}
        onOpenImpactStudio={() => setIsImpactStudioOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 5. FULL 3D/2D INTERACTIVE IMPACT STUDIO MODAL */}
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
