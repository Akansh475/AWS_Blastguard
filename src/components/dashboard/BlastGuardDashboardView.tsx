import React, { useState, useMemo } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { ChangeRequestsPanel } from './ChangeRequestsPanel';
import { SelectedRequestPanel } from './SelectedRequestPanel';
import { FloatingChatbotWidget } from './FloatingChatbotWidget';
import { InteractiveImpactStudio } from './InteractiveImpactStudio';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
import { DASHBOARD_CHANGE_REQUESTS, DashboardChangeRequest } from '../../data/mockData';

interface BlastGuardDashboardViewProps {
  onNavigateHome?: () => void;
}

export const BlastGuardDashboardView: React.FC<BlastGuardDashboardViewProps> = ({
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'history' | 'settings'>('requests');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('cr-01');
  const [filterType, setFilterType] = useState<'All' | 'Pending' | 'Approved' | 'Blocked'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isImpactStudioOpen, setIsImpactStudioOpen] = useState(false);

  // Filter requests based on search query and status tab
  const filteredRequests = useMemo(() => {
    return DASHBOARD_CHANGE_REQUESTS.filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.environment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.target.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (filterType === 'Pending') return req.status === 'Pending';
      if (filterType === 'Approved') return req.status === 'Approved';
      if (filterType === 'Blocked') return req.status === 'Blocked';
      return true;
    });
  }, [searchQuery, filterType]);

  // Selected request details
  const selectedRequest: DashboardChangeRequest =
    DASHBOARD_CHANGE_REQUESTS.find((r) => r.id === selectedTicketId) ||
    DASHBOARD_CHANGE_REQUESTS[0];

  return (
    <div className="min-h-screen text-[#18181B] flex flex-col p-4 sm:p-6 lg:p-8 selection:bg-[#F89C26]/30 selection:text-[#18181B] relative overflow-hidden bg-[#FEF4CD]">
      {/* Background Texture Image */}
      <div
        className="fixed inset-0 pointer-events-none bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url('/assets/dashboard-bg.png')` }}
      />

      {/* Ambient optical backlights to showcase glass transparency & refraction */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FCE7AF]/35 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full bg-[#FDE293]/30 blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-24 left-1/4 w-[500px] h-[350px] rounded-full bg-[#FCD790]/25 blur-3xl pointer-events-none z-0" />

      {/* Main Page Container */}
      <div className="w-full max-w-[1520px] mx-auto flex flex-col gap-5 sm:gap-6 relative z-10 pb-16">
        {/* ========================================================================= */}
        {/* TOP FLOATING GLASS HEADER (WITH CENTERED NAVIGATION TOOLBAR) */}
        {/* ========================================================================= */}
        <DashboardHeader
          onNavigateHome={onNavigateHome}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* ========================================================================= */}
        {/* MAIN BODY: 2-COLUMN LAYOUT (54% CHANGE REQUESTS | 46% SELECTED DETAILS) */}
        {/* ========================================================================= */}
        {activeTab === 'requests' && (
          <main className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start w-full">
            {/* LEFT / MAIN PANEL: CHANGE REQUESTS (54% width) */}
            <div className="w-full lg:w-[54%] shrink-0">
              <ChangeRequestsPanel
                requests={filteredRequests}
                selectedId={selectedRequest.id}
                onSelect={setSelectedTicketId}
                filter={filterType}
                setFilter={setFilterType}
              />
            </div>

            {/* RIGHT PANEL: SELECTED REQUEST DETAILS & IMPACT OVERVIEW (46% width) */}
            <div className="w-full lg:w-[46%] flex-1 min-w-0">
              <SelectedRequestPanel
                request={selectedRequest}
                onViewImpact={() => setIsImpactStudioOpen(true)}
              />
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AUDIT TRAIL & HISTORY VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <main className="w-full">
            <HistoryView />
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SAFETY SETTINGS VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <main className="w-full">
            <SettingsView />
          </main>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FLOATING CHATBOT WIDGET (BOTTOM-RIGHT MASCOT ASSISTANT) */}
      {/* ========================================================================= */}
      <FloatingChatbotWidget
        request={selectedRequest}
        onOpenImpactStudio={() => setIsImpactStudioOpen(true)}
      />

      {/* ========================================================================= */}
      {/* FULL INTERACTIVE BLAST RADIUS STUDIO MODAL (TOPOLOGY, REPLAY, AI PIPELINE) */}
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
