import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Check,
  X,
  Clock,
  ArrowRight,
  Filter,
  Layers,
  Database,
  Server,
  Shield,
  Trash2
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';
import { ServiceIcon } from './ServiceIcon';

interface ChangeRequestsFeedProps {
  requests: DashboardChangeRequest[];
  selectedId: string;
  onSelectRequest: (id: string) => void;
  filter: 'All' | 'Pending' | 'Approved' | 'Blocked';
  setFilter: (filter: 'All' | 'Pending' | 'Approved' | 'Blocked') => void;
  onNewRequest?: () => void;
}

export const ChangeRequestsFeed: React.FC<ChangeRequestsFeedProps> = ({
  requests,
  selectedId,
  onSelectRequest,
  filter,
  setFilter,
  onNewRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter requests
  const filtered = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.environment.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (filter === 'Pending') return req.status === 'Pending';
      if (filter === 'Approved') return req.status === 'Approved';
      if (filter === 'Blocked') return req.status === 'Blocked';
      return true;
    });
  }, [requests, searchQuery, filter]);

  return (
    <div className="bg-[#FFFFFF] border border-[#EFE8DF] rounded-3xl p-5 sm:p-6 shadow-sm shadow-[rgba(180,160,140,0.06)] flex flex-col gap-4 font-sans select-none">
      {/* Header: Title + Search + Filter Pills + + New Request */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#F2ECE4]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
              CHANGE REQUESTS
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#18181B] text-xs font-bold border border-[#EFE8DF]">
              {requests.length} requests
            </span>
          </div>
          <p className="text-xs text-[#71717A]">
            Select a proposed infrastructure change to inspect its blast radius
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DF] text-xs text-[#18181B] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#FF7A30] w-40 sm:w-48"
            />
          </div>

          {/* + New Request Button */}
          <button
            onClick={onNewRequest || (() => alert('Submit new change request'))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF7A30] hover:bg-[#E86518] text-white text-xs font-black transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['All', 'Pending', 'Approved', 'Blocked'] as const).map((tab) => {
          const isActive = filter === tab;
          const count =
            tab === 'All'
              ? requests.length
              : requests.filter((r) => r.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#FFF4EB] text-[#FF7A30] border border-[#FED7AA] shadow-2xs'
                  : 'bg-[#FAF7F2] hover:bg-[#FFFFFF] text-[#71717A] border border-[#EFE8DF]'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] ${isActive ? 'text-[#FF7A30]' : 'text-[#71717A]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests Feed List */}
      <div className="flex flex-col gap-2">
        {filtered.map((req) => {
          const isSelected = req.id === selectedId;
          const isBlocked = req.status === 'Blocked';
          const isApproved = req.status === 'Approved';
          const isPending = req.status === 'Pending';

          return (
            <div
              key={req.id}
              onClick={() => onSelectRequest(req.id)}
              className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FFFFFF] border-2 border-[#FF7A30] shadow-sm shadow-[#FF7A30]/10'
                  : 'bg-[#FFFFFF] hover:bg-[#FAF7F2] border-[#EFE8DF]'
              }`}
            >
              {/* Left: Status Icon + Title + Meta */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Status Indicator Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    isBlocked
                      ? 'bg-[#FFF1F2] text-[#EF4444] border border-[#FECDD3]'
                      : isApproved
                      ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                      : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                  }`}
                >
                  {isBlocked && <X className="w-4 h-4 stroke-[3]" />}
                  {isApproved && <Check className="w-4 h-4 stroke-[3]" />}
                  {isPending && <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />}
                </div>

                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-[#18181B] truncate group-hover:text-[#FF7A30] transition-colors">
                    {req.title}
                  </div>
                  <div className="text-[11px] text-[#71717A] flex items-center gap-2 mt-0.5">
                    <span>{req.serviceCategory}</span>
                    <span>•</span>
                    <span>{req.region}</span>
                    <span>•</span>
                    <span className="font-bold text-[#18181B]">{req.environment}</span>
                  </div>
                </div>
              </div>

              {/* Right: Timestamp + Risk Score Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <div
                    className={`text-xs font-black tracking-wide ${
                      isBlocked
                        ? 'text-[#EF4444]'
                        : isApproved
                        ? 'text-[#16A34A]'
                        : 'text-[#D97706]'
                    }`}
                  >
                    {req.riskLevel.toUpperCase()} • {req.riskScore}/100
                  </div>
                  <div className="text-[10px] text-[#71717A] mt-0.5 font-medium">
                    {req.timeAgo}
                  </div>
                </div>

                <ArrowRight
                  className={`w-4 h-4 text-[#71717A] group-hover:translate-x-0.5 transition-transform ${
                    isSelected ? 'text-[#FF7A30]' : ''
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChangeRequestsFeed;
