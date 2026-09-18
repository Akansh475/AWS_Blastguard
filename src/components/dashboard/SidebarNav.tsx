import React from 'react';
import { Layers, Clock, Settings } from 'lucide-react';

interface SidebarNavProps {
  activeTab: 'requests' | 'history' | 'settings';
  setActiveTab: (tab: 'requests' | 'history' | 'settings') => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-full lg:w-44 glass-panel p-3 flex flex-row lg:flex-col gap-2 shrink-0 select-none shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
      {/* 1. Requests (Active) */}
      <button
        onClick={() => setActiveTab('requests')}
        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
          activeTab === 'requests'
            ? 'bg-gradient-to-r from-[#FDD663]/95 to-[#FCE280]/80 text-[#18181B] border border-white/80 shadow-[0_4px_14px_rgba(253,214,99,0.35),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md'
            : 'text-[#52525B] hover:bg-white/55 hover:text-[#18181B] border border-transparent hover:border-white/60 backdrop-blur-sm'
        }`}
      >
        <Layers className="w-4 h-4 shrink-0" />
        <span>Requests</span>
      </button>

      {/* 2. History */}
      <button
        onClick={() => setActiveTab('history')}
        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
          activeTab === 'history'
            ? 'bg-gradient-to-r from-[#FDD663]/95 to-[#FCE280]/80 text-[#18181B] border border-white/80 shadow-[0_4px_14px_rgba(253,214,99,0.35),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md'
            : 'text-[#52525B] hover:bg-white/55 hover:text-[#18181B] border border-transparent hover:border-white/60 backdrop-blur-sm'
        }`}
      >
        <Clock className="w-4 h-4 shrink-0" />
        <span>History</span>
      </button>

      {/* 3. Settings */}
      <button
        onClick={() => setActiveTab('settings')}
        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
          activeTab === 'settings'
            ? 'bg-gradient-to-r from-[#FDD663]/95 to-[#FCE280]/80 text-[#18181B] border border-white/80 shadow-[0_4px_14px_rgba(253,214,99,0.35),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md'
            : 'text-[#52525B] hover:bg-white/55 hover:text-[#18181B] border border-transparent hover:border-white/60 backdrop-blur-sm'
        }`}
      >
        <Settings className="w-4 h-4 shrink-0" />
        <span>Settings</span>
      </button>
    </aside>
  );
};
