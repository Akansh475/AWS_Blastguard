import React from 'react';
import { DashboardChangeRequest } from '../../data/mockData';
import { WorkspaceHeader } from './WorkspaceHeader';
import { AffectedInfrastructureGraph } from './AffectedInfrastructureGraph';
import { AIExplanationCard } from './AIExplanationCard';
import { ChangeRequestsFeed } from './ChangeRequestsFeed';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
import { ActiveNavSection } from './AppRail';
import { ChannelId } from './SecondaryNavPanel';

interface MainWorkspaceProps {
  request: DashboardChangeRequest;
  requests: DashboardChangeRequest[];
  selectedRequestId: string;
  onSelectRequest: (id: string) => void;
  activeSection: ActiveNavSection;
  activeChannel?: ChannelId;
  onOpenImpactStudio: () => void;
  onTriggerAnalyze?: () => void;
  onSearchChange?: (query: string) => void;
  isAnalyzing?: boolean;
  filter?: 'All' | 'Pending' | 'Approved' | 'Blocked';
  setFilter?: (filter: 'All' | 'Pending' | 'Approved' | 'Blocked') => void;
  onBackHome?: () => void;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  request,
  requests,
  selectedRequestId,
  onSelectRequest,
  activeSection,
  activeChannel,
  onOpenImpactStudio,
  onTriggerAnalyze,
  onSearchChange,
  isAnalyzing,
  filter = 'All',
  setFilter,
  onBackHome,
}) => {
  // If user selected History or Settings section, show dedicated views
  if (activeSection === 'history' || activeChannel === 'workspace-history') {
    return (
      <div className="flex-1 bg-[#FAF7F2] min-h-screen p-6 sm:p-8 overflow-y-auto">
        <HistoryView />
      </div>
    );
  }

  if (activeSection === 'settings' || activeChannel === 'workspace-settings') {
    return (
      <div className="flex-1 bg-[#FAF7F2] min-h-screen p-6 sm:p-8 overflow-y-auto">
        <SettingsView />
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#FAF7F2] min-h-screen p-5 sm:p-6 lg:p-7 overflow-y-auto flex flex-col gap-6 select-none font-sans custom-scrollbar">
      {/* 1. TOP BAR + REQUEST METADATA */}
      <WorkspaceHeader
        request={request}
        onOpenImpactStudio={onOpenImpactStudio}
        onTriggerAnalyze={onTriggerAnalyze}
        onSearchChange={onSearchChange}
        isAnalyzing={isAnalyzing}
        onBack={onBackHome}
      />

      {/* 2. CENTRAL IMPACT TOPOLOGY GRAPH */}
      <AffectedInfrastructureGraph
        request={request}
        onOpenImpactStudio={onOpenImpactStudio}
      />

      {/* 3. BOTTOM THREE INTELLIGENCE CARDS */}
      <AIExplanationCard
        request={request}
      />

      {/* 4. OPTIONAL CHANGE REQUESTS FEED ACCORDION/LIST (if activeSection === 'requests' or viewing full queue) */}
      {activeSection === 'requests' && setFilter && (
        <div className="pt-2">
          <ChangeRequestsFeed
            requests={requests}
            selectedId={selectedRequestId}
            onSelectRequest={onSelectRequest}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
      )}
    </main>
  );
};

export default MainWorkspace;
