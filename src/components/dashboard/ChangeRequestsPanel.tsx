import React from 'react';
import { ChevronRight, Plus, Check, X } from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';
import { ServiceIcon } from './ServiceIcon';

interface ChangeRequestsPanelProps {
  requests: DashboardChangeRequest[];
  selectedId: string;
  onSelect: (id: string) => void;
  filter: 'All' | 'Pending' | 'Approved' | 'Blocked';
  setFilter: (filter: 'All' | 'Pending' | 'Approved' | 'Blocked') => void;
  onNewRequest?: () => void;
}

export const ChangeRequestsPanel: React.FC<ChangeRequestsPanelProps> = ({
  requests,
  selectedId,
  onSelect,
  filter,
  setFilter,
  onNewRequest,
}) => {
  // Count stats
  const totalCount = 8;
  const pendingCount = 3;
  const approvedCount = 3;
  const blockedCount = 2;

  return (
    <section className="glass-panel p-6 sm:p-7 flex flex-col gap-5 w-full select-none shadow-[0_12px_40px_rgba(210,180,110,0.14)]">
      {/* ========================================================================= */}
      {/* 1. HEADER: Title + Count Badge + "+ New Request" Button */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
            Change Requests
          </h2>
          <span className="w-6 h-6 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#18181B] font-bold text-xs flex items-center justify-center shadow-xs">
            {totalCount}
          </span>
        </div>

        {/* + New Request Button */}
        <button
          onClick={onNewRequest || (() => alert('Create New Change Request dialog.'))}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/60 hover:bg-white/95 border border-white/85 backdrop-blur-md text-xs font-bold text-[#18181B] transition-all shadow-xs hover:shadow active:scale-98 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Request</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER PILLS: All 8 | Pending 3 | Approved 3 | Blocked 2 */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 custom-scrollbar">
        {[
          { label: 'All', count: totalCount, key: 'All' as const },
          { label: 'Pending', count: pendingCount, key: 'Pending' as const },
          { label: 'Approved', count: approvedCount, key: 'Approved' as const },
          { label: 'Blocked', count: blockedCount, key: 'Blocked' as const },
        ].map((item) => {
          const isActive = filter === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#18181B] text-white shadow-md'
                  : 'bg-white/45 hover:bg-white/75 text-[#52525B] backdrop-blur-md border border-white/65 shadow-xs'
              }`}
            >
              <span>{item.label}</span>
              <span className={`text-[11px] font-semibold ${isActive ? 'text-white/80' : 'text-[#71717A]'}`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. REQUESTS LIST: Spacious horizontal rows */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2 pt-1">
        {requests.map((req) => {
          const isSelected = req.id === selectedId;
          const isRed = req.statusColor === 'red';

          return (
            <div
              key={req.id}
              onClick={() => onSelect(req.id)}
              className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FFF0ED]/95 to-[#FFE6E1]/75 border border-[#FCD5CF] shadow-[0_4px_18px_rgba(239,68,68,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-md'
                  : 'hover:bg-white/55 hover:border-white/75 border border-transparent backdrop-blur-sm'
              }`}
            >
              {/* Left: Service Outline Icon + Title + Metadata */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Service Icon Container */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected && isRed
                      ? 'bg-[#FFECEC] border border-[#FCD5CF]'
                      : 'bg-white/60 border border-white/80'
                  }`}
                >
                  <ServiceIcon category={req.serviceCategory} className="w-5 h-5" isRed={isSelected && isRed} />
                </div>

                {/* Title & Subtext */}
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-bold text-[#18181B] truncate">
                    {req.title}
                  </div>
                  <div className="text-xs font-medium text-[#71717A] truncate mt-0.5">
                    {req.serviceCategory} • {req.region} • {req.environment}
                  </div>
                </div>
              </div>

              {/* Right: Timestamp + Status Icon + Chevron */}
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-xs font-medium text-[#8E8E93]">
                  {req.timeAgo}
                </span>

                {/* Status Indicator Circle */}
                {req.statusColor === 'red' && (
                  <div className="w-5 h-5 rounded-full bg-[#EF4444] text-white flex items-center justify-center shadow-xs">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                {req.statusColor === 'green' && (
                  <div className="w-5 h-5 rounded-full bg-[#22C55E] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                {req.statusColor === 'amber' && (
                  <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center shadow-xs">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
                {req.statusColor === 'gray' && (
                  <div className="w-5 h-5 rounded-full bg-[#9CA3AF] flex items-center justify-center shadow-xs">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}

                {/* Chevron */}
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-[#18181B] translate-x-0.5' : 'text-[#A1A1AA] group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {requests.length === 0 && (
          <div className="p-8 text-center text-xs font-semibold text-[#71717A]">
            No change requests match this filter.
          </div>
        )}
      </div>
    </section>
  );
};
