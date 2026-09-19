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
    <div className="bg-[#FFFFFF] border border-[#BCE99A] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      {/* Header: Title + Search + Filter Pills + + New Request */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#BCE99A]/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#1E4726] tracking-tight">
              CHANGE REQUESTS
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#DCF8C6] text-[#1E4726] text-xs font-bold border border-[#BCE99A]">
              {requests.length} requests
            </span>
          </div>
          <p className="text-xs text-[#54825A]">
            Select a proposed infrastructure change to inspect its blast radius
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#54825A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#F4FDEE] border border-[#BCE99A] text-xs text-[#1E4726] placeholder-[#54825A] focus:outline-none focus:ring-1 focus:ring-[#15803D] w-40 sm:w-48"
            />
          </div>

          {/* + New Request Button */}
          <button
            onClick={onNewRequest || (() => alert('Submit new change request'))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#BAF084] hover:bg-[#A8EB6C] text-[#1E4726] text-xs font-black transition-all shadow-xs active:scale-98 cursor-pointer border border-[#8CD94B]"
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
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#276735] text-white shadow-xs'
                  : 'bg-[#F4FDEE] hover:bg-[#DCF8C6] text-[#54825A] border border-[#BCE99A]'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-[#54825A]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests Feed List (Discord-Style Horizontal Rows) */}
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
              className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FFFFFF] border-2 border-[#15803D] shadow-[0_4px_16px_rgba(22,163,74,0.12)]'
                  : 'bg-[#FFFFFF] hover:bg-[#F4FDEE] border-[#BCE99A]'
              }`}
            >
              {/* Left: Status Icon + Title + Meta */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Status Indicator Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    isBlocked
                      ? 'bg-[#FFECEC] text-[#EF4444] border border-[#FCD5CF]'
                      : isApproved
                      ? 'bg-[#ECFDF5] text-[#16A34A] border border-[#BBF7D0]'
                      : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                  }`}
                >
                  {isBlocked && <X className="w-4 h-4 stroke-[3]" />}
                  {isApproved && <Check className="w-4 h-4 stroke-[3]" />}
                  {isPending && <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />}
                </div>

                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-[#1E4726] truncate group-hover:text-[#15803D] transition-colors">
                    {req.title}
                  </div>
                  <div className="text-[11px] text-[#54825A] flex items-center gap-2 mt-0.5">
                    <span>{req.serviceCategory}</span>
                    <span>•</span>
                    <span>{req.region}</span>
                    <span>•</span>
                    <span className="font-bold text-[#1E4726]">{req.environment}</span>
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
                  <div className="text-[10px] text-[#54825A] mt-0.5 font-medium">
                    {req.timeAgo}
                  </div>
                </div>

                <ArrowRight
                  className={`w-4 h-4 text-[#54825A] group-hover:translate-x-0.5 transition-transform ${
                    isSelected ? 'text-[#15803D]' : ''
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
