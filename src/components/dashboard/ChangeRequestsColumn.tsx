import React from 'react';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';

interface ChangeRequestsColumnProps {
  requests: DashboardChangeRequest[];
  selectedId: string;
  onSelect: (id: string) => void;
  filter: 'All' | 'Pending' | 'Approved' | 'Blocked';
  setFilter: (filter: 'All' | 'Pending' | 'Approved' | 'Blocked') => void;
}

export const ChangeRequestsColumn: React.FC<ChangeRequestsColumnProps> = ({
  requests,
  selectedId,
  onSelect,
  filter,
  setFilter,
}) => {
  return (
    <section className="glass-panel p-5 flex flex-col gap-3.5 w-full select-none shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
      {/* 1. Header: Title + Count + Filter Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#18181B]">
            Change Requests
          </h2>
          <span className="w-6 h-6 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#18181B] font-bold text-xs flex items-center justify-center shadow-xs">
            {requests.length}
          </span>
        </div>
        <button
          className="w-8 h-8 rounded-xl bg-white/45 hover:bg-white/75 backdrop-blur-md border border-white/65 text-[#52525B] flex items-center justify-center transition-all cursor-pointer shadow-xs"
          title="Filter and Sort"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {(['All', 'Pending', 'Approved', 'Blocked'] as const).map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#18181B] text-white shadow-md'
                  : 'bg-white/45 hover:bg-white/75 text-[#52525B] backdrop-blur-md border border-white/60 shadow-xs'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Requests List */}
      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[520px] pr-1 custom-scrollbar">
        {requests.map((req) => {
          const isSelected = req.id === selectedId;

          // Color dot style
          let dotColorClass = 'bg-[#9CA3AF]';
          if (req.statusColor === 'red') dotColorClass = 'bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.55)]';
          if (req.statusColor === 'green') dotColorClass = 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.55)]';
          if (req.statusColor === 'amber') dotColorClass = 'bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.55)]';

          return (
            <div
              key={req.id}
              onClick={() => onSelect(req.id)}
              className={`group flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FFF0ED]/90 to-[#FFE4DF]/70 border border-white/90 shadow-[0_4px_18px_rgba(239,68,68,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md'
                  : 'hover:bg-white/55 hover:border-white/70 border border-transparent backdrop-blur-sm'
              }`}
            >
              {/* Left: Status Dot + Title + Metadata */}
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColorClass}`} />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-[#18181B] truncate">
                    {req.title}
                  </div>
                  <div className="text-[11px] font-medium text-[#71717A] truncate">
                    {req.serviceCategory} • {req.region} • {req.environment}
                  </div>
                </div>
              </div>

              {/* Right: Timestamp + Chevron */}
              <div className="flex items-center gap-1.5 text-[#8E8E93] shrink-0 ml-2">
                <span className="text-[11px] font-medium">{req.timeAgo}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#18181B] translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
              </div>
            </div>
          );
        })}

        {requests.length === 0 && (
          <div className="p-8 text-center text-xs font-medium text-[#71717A]">
            No change requests found.
          </div>
        )}
      </div>
    </section>
  );
};
