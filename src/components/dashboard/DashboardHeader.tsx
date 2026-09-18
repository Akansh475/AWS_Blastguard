import React from 'react';
import { Search, Bell, ChevronDown, Layers, Clock, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  onNavigateHome?: () => void;
  activeTab: 'requests' | 'history' | 'settings';
  setActiveTab: (tab: 'requests' | 'history' | 'settings') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onNavigateHome,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="w-full glass-panel px-5 sm:px-6 py-3 flex items-center justify-between gap-4 select-none shadow-[0_10px_35px_rgba(210,180,110,0.12)]">
      {/* ========================================================================= */}
      {/* LEFT: BRAND LOGO + TITLE + SUBTITLE */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-4 cursor-pointer shrink-0" onClick={onNavigateHome}>
        <div className="flex items-center gap-2.5 select-none">
          {/* Stylized AWS Orange Chevron Icon */}
          <div className="w-7 h-7 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#F89C26]" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-[0.18em] uppercase text-[#18181B]">
            BLASTGUARD
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-px bg-black/15 hidden md:block" />

        {/* Subtitle */}
        <span className="text-xs sm:text-sm font-medium text-[#71717A] hidden lg:block select-none">
          Infrastructure safety for AWS
        </span>
      </div>

      {/* ========================================================================= */}
      {/* CENTER: FLOATING PILL SEGMENTED TOOLBAR (REQUESTS | HISTORY | SETTINGS) */}
      {/* ========================================================================= */}
      <div className="flex items-center p-1 rounded-full bg-white/40 backdrop-blur-md border border-white/70 shadow-inner">
        {/* 1. Requests (Active) */}
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-[#FDD663] text-[#18181B] shadow-[0_2px_10px_rgba(253,214,99,0.45)]'
              : 'text-[#52525B] hover:text-[#18181B] hover:bg-white/40'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>Requests</span>
        </button>

        {/* 2. History */}
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#FDD663] text-[#18181B] shadow-[0_2px_10px_rgba(253,214,99,0.45)]'
              : 'text-[#52525B] hover:text-[#18181B] hover:bg-white/40'
          }`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>History</span>
        </button>

        {/* 3. Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#FDD663] text-[#18181B] shadow-[0_2px_10px_rgba(253,214,99,0.45)]'
              : 'text-[#52525B] hover:text-[#18181B] hover:bg-white/40'
          }`}
        >
          <Settings className="w-3.5 h-3.5 shrink-0" />
          <span>Settings</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT: SEARCH + NOTIFICATIONS + PROFILE */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Search Bar Pill */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-36 sm:w-56 pl-8 pr-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/70 text-xs font-medium text-[#18181B] placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#F89C26]/40 transition-all shadow-xs"
          />
        </div>

        {/* Notification Bell Button */}
        <button
          className="relative w-8 h-8 rounded-full bg-white/60 hover:bg-white/90 border border-white/75 backdrop-blur-md flex items-center justify-center text-[#3F3F46] transition-all shadow-xs cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F89C26] ring-2 ring-white" />
        </button>

        {/* User Profile Pill */}
        <button
          className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-white/60 hover:bg-white/90 border border-white/75 backdrop-blur-md text-xs font-bold text-[#18181B] transition-all shadow-xs cursor-pointer select-none"
        >
          <div className="w-6 h-6 rounded-full bg-[#EADCC0] text-[#3F3F46] font-bold text-[11px] flex items-center justify-center">
            YK
          </div>
          <ChevronDown className="w-3 h-3 text-[#71717A]" />
        </button>
      </div>
    </header>
  );
};
