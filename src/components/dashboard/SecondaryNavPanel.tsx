import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Network,
  Server,
  Database,
  History,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Radio,
  Search,
  Mic,
  Headphones,
  Sliders,
  Shield,
  ExternalLink
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';
import { ActiveNavSection } from './AppRail';

export type ChannelId =
  | 'requests-all'
  | 'requests-pending'
  | 'requests-approved'
  | 'requests-blocked'
  | 'infra-resources'
  | 'infra-dependencies'
  | 'infra-impact'
  | 'workspace-history'
  | 'workspace-settings';

interface SecondaryNavPanelProps {
  activeSection: ActiveNavSection;
  onSelectSection: (section: ActiveNavSection) => void;
  activeChannel: ChannelId;
  onSelectChannel: (channel: ChannelId) => void;
  requests: DashboardChangeRequest[];
  selectedRequestId: string;
  onSelectRequest: (id: string) => void;
  onNewRequest?: () => void;
  onOpenImpactStudio: () => void;
}

export const SecondaryNavPanel: React.FC<SecondaryNavPanelProps> = ({
  activeSection,
  onSelectSection,
  activeChannel,
  onSelectChannel,
  requests,
  selectedRequestId,
  onSelectRequest,
  onNewRequest,
  onOpenImpactStudio,
}) => {
  const [isChangeControlOpen, setIsChangeControlOpen] = useState(true);
  const [isInfraOpen, setIsInfraOpen] = useState(true);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

  // Status counts
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const blockedCount = requests.filter((r) => r.status === 'Blocked').length;

  return (
    <aside className="w-[280px] sm:w-[300px] shrink-0 bg-[#DDF8C3] border-r border-[#BCE99A] flex flex-col justify-between select-none h-screen sticky top-0 shadow-xs">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (BLASTGUARD + Status Indicator) */}
      {/* ========================================================================= */}
      <div className="p-4 border-b border-[#BCE99A] bg-[#D4F7B2]/90 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-[0.14em] uppercase text-[#1E4726]">
                BLASTGUARD
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FF9900]/20 text-[#B45309] border border-[#FF9900]/40">
                PROD
              </span>
            </div>
            <div className="text-[11px] font-semibold text-[#54825A]">
              Infrastructure Safety
            </div>
          </div>

          {/* Connected Pill Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#BBF7D0] text-[#15803D] text-[11px] font-bold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span>AWS Connected</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHANNELS LIST (DISCORD-STYLE CATEGORIES) */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 custom-scrollbar">
        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 1: CHANGE CONTROL */}
        {/* ----------------------------------------------------------------------- */}
        <div className="space-y-1">
          <button
            onClick={() => setIsChangeControlOpen(!isChangeControlOpen)}
            className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider uppercase text-[#54825A] hover:text-[#1E4726] transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-1">
              {isChangeControlOpen ? (
                <ChevronDown className="w-3 h-3 text-[#54825A] group-hover:text-[#1E4726]" />
              ) : (
                <ChevronRight className="w-3 h-3 text-[#54825A] group-hover:text-[#1E4726]" />
              )}
              <span>CHANGE CONTROL</span>
            </div>
            <span className="text-[10px] font-bold text-[#1E4726] bg-[#C4EFA0] px-1.5 py-0.5 rounded-full border border-[#AEDF86]">
              {totalCount}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {isChangeControlOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-0.5 overflow-hidden pl-1"
              >
                {/* 1. All Requests */}
                <button
                  onClick={() => {
                    onSelectSection('requests');
                    onSelectChannel('requests-all');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeChannel === 'requests-all' && activeSection === 'requests'
                      ? 'bg-[#BAF084] text-[#1E4726] font-bold shadow-xs border border-[#9FE65E]'
                      : 'text-[#2C5A35] hover:bg-[#CCF4A9] hover:text-[#1E4726]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#54825A]">#</span>
                    <span>Requests</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#1E4726]">
                    {totalCount}
                  </span>
                </button>

                {/* 2. Pending Review */}
                <button
                  onClick={() => {
                    onSelectSection('requests');
                    onSelectChannel('requests-pending');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeChannel === 'requests-pending'
                      ? 'bg-[#FEF3C7] text-[#D97706] font-semibold'
                      : 'text-[#4B5563] hover:bg-[#E5E7EB]/50 hover:text-[#171717]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span>Pending Review</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-1.5 py-0.5 rounded-full border border-[#FDE68A]">
                    {pendingCount}
                  </span>
                </button>

                {/* 3. Approved */}
                <button
                  onClick={() => {
                    onSelectSection('requests');
                    onSelectChannel('requests-approved');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeChannel === 'requests-approved'
                      ? 'bg-[#ECFDF5] text-[#16A34A] font-semibold'
                      : 'text-[#4B5563] hover:bg-[#E5E7EB]/50 hover:text-[#171717]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span>Approved</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] px-1.5 py-0.5 rounded-full border border-[#BBF7D0]">
                    {approvedCount}
                  </span>
                </button>

                {/* 4. Blocked (Subtle Red Indicator) */}
                <button
                  onClick={() => {
                    onSelectSection('requests');
                    onSelectChannel('requests-blocked');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeChannel === 'requests-blocked'
                      ? 'bg-[#FFECEC] text-[#E03131] font-semibold border border-[#FCD5CF]'
                      : 'text-[#4B5563] hover:bg-[#FFECEC]/60 hover:text-[#E03131]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span>Blocked</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#E03131] bg-[#FFECEC] px-1.5 py-0.5 rounded-full border border-[#FCD5CF]">
                    {blockedCount}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 2: INFRASTRUCTURE */}
        {/* ----------------------------------------------------------------------- */}
        <div className="space-y-1">
          <button
            onClick={() => setIsInfraOpen(!isInfraOpen)}
            className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider uppercase text-[#54825A] hover:text-[#1E4726] transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-1">
              {isInfraOpen ? (
                <ChevronDown className="w-3 h-3 text-[#54825A] group-hover:text-[#1E4726]" />
              ) : (
                <ChevronRight className="w-3 h-3 text-[#54825A] group-hover:text-[#1E4726]" />
              )}
              <span>INFRASTRUCTURE</span>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isInfraOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-0.5 overflow-hidden pl-1"
              >
                {/* 1. AWS Resources */}
                <button
                  onClick={() => {
                    onSelectSection('impact');
                    onSelectChannel('infra-resources');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeChannel === 'infra-resources'
                      ? 'bg-[#BAF084] text-[#1E4726] font-bold shadow-xs border border-[#9FE65E]'
                      : 'text-[#2C5A35] hover:bg-[#CCF4A9] hover:text-[#1E4726]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-[#54825A]" />
                    <span>AWS Resources</span>
                  </div>
                  <span className="text-[10px] text-[#54825A]">VPC / RDS</span>
                </button>

                {/* 2. Dependency Graph */}
                <button
                  onClick={() => {
                    onSelectSection('impact');
                    onSelectChannel('infra-dependencies');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeChannel === 'infra-dependencies'
                      ? 'bg-[#BAF084] text-[#1E4726] font-bold shadow-xs border border-[#9FE65E]'
                      : 'text-[#2C5A35] hover:bg-[#CCF4A9] hover:text-[#1E4726]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-[#54825A]" />
                    <span>Dependency Graph</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#15803D]">Live</span>
                </button>

                {/* 3. Impact Analysis */}
                <button
                  onClick={() => {
                    onOpenImpactStudio();
                    onSelectChannel('infra-impact');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeChannel === 'infra-impact'
                      ? 'bg-[#BAF084] text-[#1E4726] font-bold border border-[#9FE65E] shadow-xs'
                      : 'text-[#2C5A35] hover:bg-[#CCF4A9] hover:text-[#1E4726]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>Impact Studio</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[#15803D]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 3: WORKSPACE */}
        {/* ----------------------------------------------------------------------- */}
        <div className="space-y-1">
          <button
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider uppercase text-[#54825A] hover:text-[#1E4726] transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-1">
              {isWorkspaceOpen ? (
                <ChevronDown className="w-3 h-3 text-[#54825A] group-hover:text-[#1E4726]" />
              ) : (
                <ChevronRight className="w-3 h-3 text-[#54825A] group-hover:text-[#1E4726]" />
              )}
              <span>WORKSPACE</span>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isWorkspaceOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-0.5 overflow-hidden pl-1"
              >
                {/* 1. History */}
                <button
                  onClick={() => {
                    onSelectSection('history');
                    onSelectChannel('workspace-history');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeSection === 'history' || activeChannel === 'workspace-history'
                      ? 'bg-[#BAF084] text-[#1E4726] font-bold shadow-xs border border-[#9FE65E]'
                      : 'text-[#2C5A35] hover:bg-[#CCF4A9] hover:text-[#1E4726]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-[#54825A]" />
                    <span>History</span>
                  </div>
                  <span className="text-[10px] text-[#54825A]">Audit</span>
                </button>

                {/* 2. Settings */}
                <button
                  onClick={() => {
                    onSelectSection('settings');
                    onSelectChannel('workspace-settings');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeSection === 'settings' || activeChannel === 'workspace-settings'
                      ? 'bg-[#BAF084] text-[#1E4726] font-bold shadow-xs border border-[#9FE65E]'
                      : 'text-[#2C5A35] hover:bg-[#CCF4A9] hover:text-[#1E4726]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 text-[#54825A]" />
                    <span>Settings</span>
                  </div>
                  <span className="text-[10px] text-[#54825A]">Rules</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* QUICK ACTIVE CHANGE REQUESTS LIST */}
        {/* ----------------------------------------------------------------------- */}
        <div className="pt-2 border-t border-[#BCE99A]">
          <div className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-[#54825A]">
            ACTIVE QUEUE
          </div>
          <div className="space-y-1 mt-1">
            {requests.slice(0, 4).map((req) => {
              const isSelected = req.id === selectedRequestId;
              const isBlocked = req.status === 'Blocked';
              const isApproved = req.status === 'Approved';

              return (
                <button
                  key={req.id}
                  onClick={() => {
                    onSelectRequest(req.id);
                    onSelectSection('requests');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-2 border-[#15803D] shadow-xs'
                      : 'bg-[#EAFCD6]/80 hover:bg-[#FFFFFF] border border-[#BCE99A]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-bold text-[#1E4726] truncate">
                      {req.title}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isBlocked
                          ? 'bg-[#EF4444]'
                          : isApproved
                          ? 'bg-[#22C55E]'
                          : 'bg-[#F59E0B]'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#54825A] mt-0.5">
                    <span>{req.environment}</span>
                    <span className={isBlocked ? 'text-[#EF4444] font-bold' : ''}>
                      {req.riskScore}/100
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM USER PROFILE FOOTER (DISCORD-INSPIRED APPLE POLISH) */}
      {/* ========================================================================= */}
      <div className="p-3 border-t border-[#BCE99A] bg-[#D4F7B2]/95 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#15803D] to-[#BAF084] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
            <span>PE</span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#D4F7B2]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#1E4726] truncate leading-tight">
              Platform Eng
            </div>
            <div className="text-[10px] text-[#54825A] truncate leading-tight">
              Admin • ap-south-1
            </div>
          </div>
        </div>

        {/* Quick Icon Controls */}
        <div className="flex items-center gap-1 text-[#54825A]">
          <button
            title="Mute Notifications"
            className="p-1 rounded-md hover:bg-[#C5F4A0] hover:text-[#1E4726] transition-colors"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
          <button
            title="Audio Settings"
            className="p-1 rounded-md hover:bg-[#C5F4A0] hover:text-[#1E4726] transition-colors"
          >
            <Headphones className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              onSelectSection('settings');
              onSelectChannel('workspace-settings');
            }}
            title="Safety Settings"
            className="p-1 rounded-md hover:bg-[#C5F4A0] hover:text-[#1E4726] transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
