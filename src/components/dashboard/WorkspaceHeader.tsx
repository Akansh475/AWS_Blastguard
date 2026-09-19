import React from 'react';
import {
  Search,
  Bell,
  User,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Play,
  Network,
  Sparkles,
  Share2,
  RefreshCw,
  X,
  Check
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';

interface WorkspaceHeaderProps {
  request: DashboardChangeRequest;
  onOpenImpactStudio: () => void;
  onTriggerAnalyze?: () => void;
  isAnalyzing?: boolean;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  request,
  onOpenImpactStudio,
  onTriggerAnalyze,
  isAnalyzing,
}) => {
  const isBlocked = request.status === 'Blocked';
  const isApproved = request.status === 'Approved';

  return (
    <header className="bg-[#E7FAD6]/95 border-b border-[#BCE99A] backdrop-blur-md px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10 select-none shadow-xs">
      {/* Left: Breadcrumb + Request Title + Status Pill */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#54825A]">
              {request.serviceCategory} CHANGE REQUEST
            </span>
            <span className="text-[#9FE65E]">•</span>
            <span className="text-[10px] font-semibold text-[#54825A]">
              {request.region}
            </span>
          </div>

          <div className="flex items-center gap-2.5 mt-0.5 min-w-0">
            <h1 className="text-base sm:text-lg font-black text-[#1E4726] tracking-tight truncate">
              {request.title}
            </h1>

            {/* Status Pill */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                isBlocked
                  ? 'bg-[#FFECEC] text-[#EF4444] border border-[#FCD5CF]'
                  : isApproved
                  ? 'bg-[#ECFDF5] text-[#16A34A] border border-[#BBF7D0]'
                  : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
              }`}
            >
              {isBlocked && <X className="w-3 h-3 stroke-[3]" />}
              {isApproved && <Check className="w-3 h-3 stroke-[3]" />}
              <span>{request.status}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Action Controls + Notification & User */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Re-Analyze Button */}
        {onTriggerAnalyze && (
          <button
            onClick={onTriggerAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DCF8C6] hover:bg-[#D4F7B2] border border-[#BCE99A] text-xs font-bold text-[#1E4726] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#15803D] ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
          </button>
        )}

        {/* Open 3D Impact Studio Button */}
        <button
          onClick={onOpenImpactStudio}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#BAF084] hover:bg-[#A8EB6C] border border-[#8CD94B] text-xs font-black text-[#1E4726] transition-all shadow-xs active:scale-98 cursor-pointer"
        >
          <Network className="w-3.5 h-3.5 text-[#1E4726]" />
          <span className="hidden sm:inline">Impact Studio</span>
        </button>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-[#BCE99A] mx-1" />

        {/* Notifications Icon */}
        <button
          title="Notifications"
          className="relative p-2 rounded-xl text-[#54825A] hover:bg-[#DCF8C6] hover:text-[#1E4726] transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#15803D] to-[#BAF084] flex items-center justify-center text-white font-black text-xs shrink-0 ring-2 ring-[#BCE99A] shadow-xs">
          <span>PE</span>
        </div>
      </div>
    </header>
  );
};
