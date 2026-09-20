import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  GitPullRequest,
  Network,
  Server,
  Bot,
  ShieldCheck,
  TrendingUp,
  FileBarChart,
  Settings,
  Shield,
  Radio,
  Home
} from 'lucide-react';

export type ActiveNavSection =
  | 'dashboard'
  | 'requests'
  | 'impact'
  | 'infrastructure'
  | 'agents'
  | 'policies'
  | 'analytics'
  | 'reports'
  | 'history'
  | 'settings';

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
  const navItems: Array<{
    id: ActiveNavSection;
    label: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Change Requests', icon: GitPullRequest },
    { id: 'impact', label: 'Impact Studio', icon: Network },
    { id: 'infrastructure', label: 'Infrastructure', icon: Server },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'policies', label: 'Policies', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-[230px] lg:w-[245px] shrink-0 bg-[#FFFFFF] border-r border-[#EFE8DF] flex flex-col justify-between p-4 select-none z-20 h-screen sticky top-0 shadow-[2px_0_12px_rgba(180,160,140,0.04)] font-sans">
      {/* 1. TOP BRAND HEADER */}
      <div className="flex flex-col gap-6">
        {/* Logo & Tagline */}
        <div
          onClick={onNavigateHome}
          className="flex items-start gap-3 cursor-pointer group pt-1"
        >
          {/* Brand Shield Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF9248] to-[#FF6B20] flex items-center justify-center text-white shadow-md shadow-[#FF7A30]/20 shrink-0 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base tracking-tight text-[#18181B]">
                CloudGuard <span className="text-[#FF7A30]">AI</span>
              </span>
            </div>
            <p className="text-[10.5px] text-[#71717A] leading-tight mt-0.5 font-medium">
              Before you change production, know what will break.
            </p>
          </div>
        </div>

        {/* 2. NAVIGATION MENU LIST */}
        <nav className="flex flex-col gap-1 w-full">
          {navItems.map((item) => {
            const isActive =
              activeSection === item.id ||
              (activeSection === 'requests' && item.id === 'requests') ||
              (activeSection === 'dashboard' && item.id === 'dashboard');
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-[#FFF4EB] text-[#FF7A30] shadow-xs'
                    : 'text-[#52525B] hover:bg-[#FAF7F2] hover:text-[#18181B]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#FF7A30] stroke-[2.4]' : 'text-[#71717A] stroke-[1.8]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. BOTTOM SECTION: AWS STATUS + MASCOT MOTTO */}
      <div className="flex flex-col gap-3 pt-4 border-t border-[#F2ECE4]">
        {/* AWS Live Connected Box */}
        <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-xl bg-[#DCFCE7] flex items-center justify-center shrink-0">
              <Radio className="w-3.5 h-3.5 text-[#16A34A] animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#18181B] truncate">
                AWS Connected
              </div>
              <div className="text-[10px] text-[#71717A] truncate font-medium">
                ap-south-1 • Production
              </div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
        </div>

        {/* Mascot Box */}
        <div className="p-3 rounded-2xl bg-[#FFF9E6] border border-[#FDE68A]/60 flex flex-col items-center text-center gap-1.5 relative overflow-hidden">
          <div className="w-12 h-10 flex items-center justify-center">
            <img
              src="/mascot-icon.svg"
              alt="Mascot"
              className="w-9 h-9 object-contain"
            />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-[#18181B] tracking-tight">
              Safer Infrastructure
            </div>
            <div className="text-[10.5px] font-bold text-[#D97706]">
              Happier Engineers
            </div>
          </div>
          <span className="text-[9px] text-[#8C827A] font-medium mt-0.5">
            CloudGuard AI
          </span>
        </div>
      </div>
    </aside>
  );
};

export default AppRail;
