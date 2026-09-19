import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Home,
  Layers,
  Network,
  Clock,
  Sparkles,
  Settings,
  HelpCircle,
  Radio
} from 'lucide-react';

export type ActiveNavSection = 'requests' | 'impact' | 'history' | 'ai' | 'settings';

interface AppRailProps {
  activeSection: ActiveNavSection;
  onSelectSection: (section: ActiveNavSection) => void;
  onNavigateHome?: () => void;
}

export const AppRail: React.FC<AppRailProps> = ({
  activeSection,
  onSelectSection,
  onNavigateHome,
}) => {
  const navItems: Array<{ id: ActiveNavSection; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'requests', label: 'Change Requests', icon: Layers },
    { id: 'impact', label: 'Impact & Topology', icon: Network },
    { id: 'history', label: 'Audit History', icon: Clock },
    { id: 'ai', label: 'Ask BlastGuard AI', icon: Sparkles },
    { id: 'settings', label: 'Safety Settings', icon: Settings },
  ];

  return (
    <aside className="w-[68px] shrink-0 bg-[#D4F7B2] border-r border-[#BCE99A] flex flex-col items-center py-4 justify-between select-none z-20 h-screen sticky top-0 shadow-xs">
      {/* Top: Brand Logo Avatar */}
      <div className="flex flex-col items-center gap-5 w-full">
        {/* Brand Icon (Mascot / Shield) */}
        <button
          onClick={onNavigateHome}
          title="BlastGuard Home"
          className="group relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#BAF084] to-[#A4EB67] border border-[#8CD94B]/60 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 cursor-pointer"
        >
          <img
            src="/mascot-icon.svg"
            alt="BlastGuard"
            className="w-6 h-6 object-contain"
          />
          {/* Active online pulse dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#16A34A] border-2 border-[#D4F7B2] ring-1 ring-black/5" />
        </button>

        {/* Thin Divider */}
        <div className="w-8 h-[1px] bg-[#BCE99A]" />

        {/* Navigation Item Rail */}
        <nav className="flex flex-col items-center gap-2.5 w-full px-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <div key={item.id} className="relative group w-full flex justify-center">
                {/* Active Left Indicator Bar (Discord-style) */}
                {isActive && (
                  <motion.div
                    layoutId="activeRailIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#1E4726]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Rail Button */}
                <button
                  onClick={() => onSelectSection(item.id)}
                  title={item.label}
                  className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#BAF084] text-[#1E4726] shadow-xs font-bold border border-[#9FE65E]'
                      : 'text-[#54825A] hover:bg-[#C5F4A0] hover:text-[#1E4726]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                </button>

                {/* Tooltip on Hover */}
                <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-[#1E4726] text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                  {item.label}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Rail Actions */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {/* Live AWS Connection Badge Indicator */}
        <div
          title="AWS ap-south-1 Connected"
          className="w-10 h-10 rounded-xl bg-[#C5F4A0] border border-[#BCE99A] flex items-center justify-center text-[#16A34A] cursor-default shadow-xs"
        >
          <Radio className="w-4 h-4 animate-pulse text-[#15803D]" />
        </div>

        {/* Exit to Landing Home Button */}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            title="Exit to Landing"
            className="w-10 h-10 rounded-xl text-[#54825A] hover:bg-[#C5F4A0] hover:text-[#1E4726] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[1.8]" />
          </button>
        )}
      </div>
    </aside>
  );
};
