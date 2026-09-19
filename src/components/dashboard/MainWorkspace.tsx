import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Database,
  Layers,
  MapPin,
  Server,
  Network,
  Lock,
  FileText,
  Activity,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
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
  activeChannel: ChannelId;
  onOpenImpactStudio: () => void;
  onTriggerAnalyze?: () => void;
  isAnalyzing?: boolean;
  filter: 'All' | 'Pending' | 'Approved' | 'Blocked';
  setFilter: (filter: 'All' | 'Pending' | 'Approved' | 'Blocked') => void;
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
  isAnalyzing,
  filter,
  setFilter,
}) => {
  // If user selected History or Settings section/channel, show dedicated views
  if (activeSection === 'history' || activeChannel === 'workspace-history') {
    return (
      <div className="flex-1 bg-[#EDFCE2] min-h-screen p-6 sm:p-8 overflow-y-auto">
        <HistoryView />
      </div>
    );
  }

  if (activeSection === 'settings' || activeChannel === 'workspace-settings') {
    return (
      <div className="flex-1 bg-[#EDFCE2] min-h-screen p-6 sm:p-8 overflow-y-auto">
        <SettingsView />
      </div>
    );
  }

  // Risk gauge color calculation
  const score = request.riskScore;
  const isBlocked = request.status === 'Blocked';
  const isApproved = request.status === 'Approved';

  return (
    <div className="flex-1 bg-[#EDFCE2] min-h-screen flex flex-col overflow-y-auto">
      {/* 1. Compact Engineering Header */}
      <WorkspaceHeader
        request={request}
        onOpenImpactStudio={onOpenImpactStudio}
        onTriggerAnalyze={onTriggerAnalyze}
        isAnalyzing={isAnalyzing}
      />

      {/* 2. Main Workspace Body */}
      <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full flex flex-col gap-6">
        {/* ========================================================================= */}
        {/* 2.1. FOUR COMPACT METADATA TILES */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Tile 1: Resource */}
          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#BCE99A] shadow-xs flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#54825A] uppercase tracking-wider">
              Resource
            </span>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#1E4726] truncate">
              <Database className="w-3.5 h-3.5 text-[#15803D]" />
              <span className="truncate">{request.resourceName}</span>
            </div>
          </div>

          {/* Tile 2: Type */}
          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#BCE99A] shadow-xs flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#54825A] uppercase tracking-wider">
              Type
            </span>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#1E4726] truncate">
              <Layers className="w-3.5 h-3.5 text-[#54825A]" />
              <span className="truncate">{request.resourceType}</span>
            </div>
          </div>

          {/* Tile 3: Region */}
          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#BCE99A] shadow-xs flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#54825A] uppercase tracking-wider">
              Region
            </span>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#1E4726] truncate">
              <MapPin className="w-3.5 h-3.5 text-[#54825A]" />
              <span className="truncate">{request.region}</span>
            </div>
          </div>

          {/* Tile 4: Environment */}
          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#BCE99A] shadow-xs flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#54825A] uppercase tracking-wider">
              Environment
            </span>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#1E4726] truncate">
              <Server className="w-3.5 h-3.5 text-[#EF4444]" />
              <span className="truncate">{request.environment}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2.2. PRIMARY VISUAL SECTION: IMPACT OVERVIEW (COHESIVE ANALYSIS CARD) */}
        {/* ========================================================================= */}
        <div className="bg-[#FFFFFF] border border-[#BCE99A] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAFCD6]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#EF4444]" />
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[#1E4726]">
                IMPACT OVERVIEW
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#54825A]">
              Analysis Engine: Person 1 Intelligence
            </span>
          </div>

          {/* Unified Score + 3 Big Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Giant Risk Score & Severity Gauge (Cols 1-5) */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-[#FFECEC] to-[#FFF5F5] border border-[#FCD5CF] flex flex-col items-center text-center gap-2 shadow-xs">
              <div className="text-[11px] font-bold text-[#E03131] tracking-wider uppercase">
                RISK SCORE
              </div>
              <div className="text-4xl sm:text-5xl font-black text-[#1E4726] tracking-tight">
                {score} <span className="text-2xl font-bold text-[#71717A]">/ 100</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF4444] text-white text-xs font-black uppercase tracking-wider shadow-xs">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{request.riskLevel} SEVERITY</span>
              </div>
              <p className="text-[11px] text-[#54825A] mt-1 font-medium">
                Calculated across dependencies in <span className="font-bold text-[#1E4726]">{request.environment}</span>
              </p>
            </div>

            {/* Right: Three Large Primary Metrics (Cols 6-12) */}
            <div className="md:col-span-7 grid grid-cols-3 gap-3 sm:gap-4">
              {/* Metric 1: Affected Resources */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex flex-col items-center text-center justify-center gap-1 hover:border-[#15803D]/60 transition-colors shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-[#1E4726]">
                  {request.affectedResources}
                </div>
                <div className="text-[11px] font-bold text-[#54825A] leading-tight">
                  Affected Resources
                </div>
              </div>

              {/* Metric 2: Critical Services */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF5F5] border border-[#FCD5CF] flex flex-col items-center text-center justify-center gap-1 hover:border-[#EF4444]/60 transition-colors shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-[#EF4444]">
                  {request.criticalServices}
                </div>
                <div className="text-[11px] font-bold text-[#54825A] leading-tight">
                  Critical Services
                </div>
              </div>

              {/* Metric 3: External Dependencies */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex flex-col items-center text-center justify-center gap-1 hover:border-[#15803D]/60 transition-colors shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-[#1E4726]">
                  {request.externalDependencies}
                </div>
                <div className="text-[11px] font-bold text-[#54825A] leading-tight">
                  External Dependencies
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2.3. AFFECTED INFRASTRUCTURE DEPENDENCY TREE GRAPH */}
        {/* ========================================================================= */}
        <AffectedInfrastructureGraph
          request={request}
          onOpenImpactStudio={onOpenImpactStudio}
        />

        {/* ========================================================================= */}
        {/* 2.4. COMPACT AI EXPLANATION LAYER (ASK BLASTGUARD) */}
        {/* ========================================================================= */}
        <AIExplanationCard request={request} />

        {/* ========================================================================= */}
        {/* 2.5. POLICY & SECURITY GUARDRAILS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Policy Compliance Card */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#BCE99A] shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#EF4444]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1E4726]">
                Policy Guardrails
              </h4>
            </div>
            <div className="p-3 rounded-xl bg-[#FFECEC] border border-[#FCD5CF] text-xs">
              <div className="font-bold text-[#E03131]">
                POL-001: Production Change Approval Required
              </div>
              <div className="text-[#52525B] text-[11px] mt-0.5">
                Deleting {request.resourceName} violates automated deployment perimeter guardrails.
              </div>
            </div>
          </div>

          {/* Security Perimeter Findings Card */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#BCE99A] shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#B45309]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1E4726]">
                Security Analysis
              </h4>
            </div>
            <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs">
              <div className="font-bold text-[#B45309]">
                PERIMETER_ISOLATION: Active ENIs Bound
              </div>
              <div className="text-[#52525B] text-[11px] mt-0.5">
                Target has active interfaces with no standby failover in alternate AZ.
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2.6. CHANGE REQUESTS FEED (DISCORD-STYLE LIST OF ALL REQUESTS) */}
        {/* ========================================================================= */}
        <ChangeRequestsFeed
          requests={requests}
          selectedId={selectedRequestId}
          onSelectRequest={onSelectRequest}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
    </div>
  );
};
