import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Sun,
  Bell,
  ChevronDown,
  ArrowLeft,
  Box,
  Layers,
  MapPin,
  Server,
  User,
  Calendar,
  X,
  Check
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';

interface WorkspaceHeaderProps {
  request: DashboardChangeRequest;
  onOpenImpactStudio: () => void;
  onTriggerAnalyze?: () => void;
  isAnalyzing?: boolean;
  onBack?: () => void;
  onSearchChange?: (query: string) => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  request,
  onOpenImpactStudio,
  onTriggerAnalyze,
  isAnalyzing,
  onBack,
  onSearchChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isBlocked = request.status === 'Blocked';
  const isApproved = request.status === 'Approved';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) onSearchChange(searchQuery);
  };

  return (
    <div className="w-full flex flex-col gap-5 select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP GLOBAL SEARCH + USER UTILITIES BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Central Wide Pill Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-2xl relative flex items-center bg-[#FFFFFF] border border-[#EFE8DF] rounded-full px-4 py-2.5 shadow-sm shadow-[rgba(180,160,140,0.06)] hover:border-[#FED7AA] focus-within:border-[#FF7A30] focus-within:ring-2 focus-within:ring-[#FF7A30]/10 transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#FF7A30] shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What infrastructure change would you like to analyze? e.g. Delete subnet-07, Modify security group..."
            className="w-full bg-transparent text-xs text-[#18181B] placeholder-[#9CA3AF] focus:outline-none font-medium"
          />
          <button
            type="submit"
            className="w-7 h-7 rounded-full bg-[#FF7A30] hover:bg-[#E86518] text-white flex items-center justify-center shrink-0 ml-2 shadow-xs transition-all cursor-pointer active:scale-95"
            title="Analyze change"
          >
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </form>

        {/* Right: Theme Toggle + Notifications + User Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Handwritten Annotation */}
          <div className="hidden xl:block font-handwriting text-sm text-[#B45309] -rotate-2 select-none pr-1">
            Small changes, Big impact. Let's make them safe.
          </div>

          {/* Theme Toggle (Sun) */}
          <button
            className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#EFE8DF] hover:bg-[#FFF9E6] text-[#F59E0B] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            title="Light Theme"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            className="relative w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#EFE8DF] hover:bg-[#FAF7F2] text-[#71717A] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] border-2 border-white" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EFE8DF] shadow-2xs cursor-pointer hover:border-[#FED7AA] transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#E0E7FF] text-[#4F46E5] font-black text-xs flex items-center justify-center">
              AM
            </div>
            <span className="text-xs font-bold text-[#18181B]">Akansh</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHANGE REQUEST DETAIL ACTION BAR + METADATA CHIPS STRIP */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-3.5">
        {/* Title Row with Back Button + Status */}
        <div className="flex items-center gap-3 flex-wrap">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-bold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Back</span>
            </button>
          )}

          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
            {request.title}
          </h1>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs ${
              isBlocked
                ? 'bg-[#FFF0F0] text-[#EF4444] border border-[#FECDD3]'
                : isApproved
                ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
            }`}
          >
            {isBlocked && <X className="w-3.5 h-3.5 stroke-[3]" />}
            {isApproved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>{request.status}</span>
          </span>
        </div>

        {/* Six Clean White Metadata Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Tile 1: Resource */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] border border-[#EFE8DF] shadow-2xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <Box className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#71717A] font-medium leading-none">
                Resource
              </div>
              <div className="text-xs font-extrabold text-[#18181B] truncate mt-0.5">
                {request.resourceName}
              </div>
            </div>
          </div>

          {/* Tile 2: Type */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] border border-[#EFE8DF] shadow-2xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#71717A] font-medium leading-none">
                Type
              </div>
              <div className="text-xs font-extrabold text-[#18181B] truncate mt-0.5">
                {request.resourceType}
              </div>
            </div>
          </div>

          {/* Tile 3: Region */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] border border-[#EFE8DF] shadow-2xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#FFF4EB] text-[#EA580C] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#71717A] font-medium leading-none">
                Region
              </div>
              <div className="text-xs font-extrabold text-[#18181B] truncate mt-0.5">
                {request.region}
              </div>
            </div>
          </div>

          {/* Tile 4: Environment */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] border border-[#EFE8DF] shadow-2xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#71717A] font-medium leading-none">
                Environment
              </div>
              <div className="text-xs font-extrabold text-[#18181B] truncate mt-0.5">
                {request.environment}
              </div>
            </div>
          </div>

          {/* Tile 5: Requested By */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] border border-[#EFE8DF] shadow-2xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#71717A] font-medium leading-none">
                Requested by
              </div>
              <div className="text-xs font-extrabold text-[#18181B] truncate mt-0.5">
                Akansh Mehra
              </div>
            </div>
          </div>

          {/* Tile 6: Date */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] border border-[#EFE8DF] shadow-2xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#F4F4F5] text-[#71717A] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#71717A] font-medium leading-none">
                Today, 10:24 AM
              </div>
              <div className="text-xs font-extrabold text-[#18181B] truncate mt-0.5">
                Sep 17, 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHeader;
