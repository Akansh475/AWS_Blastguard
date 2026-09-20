import React, { useState } from 'react';
import {
  Maximize2,
  Plus,
  Minus,
  Lock,
  RotateCcw,
  Network,
  Database,
  Server,
  Cloud,
  Layers,
  Cpu,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Radio
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';

interface AffectedInfrastructureGraphProps {
  request: DashboardChangeRequest;
  onOpenImpactStudio: () => void;
}

export const AffectedInfrastructureGraph: React.FC<AffectedInfrastructureGraphProps> = ({
  request,
  onOpenImpactStudio,
}) => {
  const [activeTab, setActiveTab] = useState<
    'graph' | 'affected' | 'analysis' | 'policies' | 'recommendations'
  >('graph');
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className="bg-[#FFFFFF] border border-[#EFE8DF] rounded-3xl p-5 sm:p-6 shadow-sm shadow-[rgba(180,160,140,0.06)] flex flex-col gap-4 font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION TABS ROW */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-1 overflow-x-auto gap-3">
        <div className="flex items-center gap-6 text-xs sm:text-sm font-bold shrink-0">
          <button
            onClick={() => setActiveTab('graph')}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === 'graph'
                ? 'text-[#FF7A30]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>Impact Graph</span>
            {activeTab === 'graph' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A30] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('affected')}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === 'affected'
                ? 'text-[#FF7A30]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>Affected Resources ({request.affectedResources})</span>
            {activeTab === 'affected' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A30] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === 'analysis'
                ? 'text-[#FF7A30]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>Agent Analysis</span>
            {activeTab === 'analysis' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A30] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === 'policies'
                ? 'text-[#FF7A30]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>Policy Checks</span>
            {activeTab === 'policies' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A30] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === 'recommendations'
                ? 'text-[#FF7A30]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>Recommendations</span>
            {activeTab === 'recommendations' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A30] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. GRAPH CONTROL BAR & LEGEND */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Legend Pills */}
        <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
          <span className="flex items-center gap-1.5 text-[#EF4444]">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            Critical
          </span>
          <span className="flex items-center gap-1.5 text-[#F97316]">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            Affected
          </span>
          <span className="flex items-center gap-1.5 text-[#3B82F6]">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            Related
          </span>
          <span className="flex items-center gap-1.5 text-[#9CA3AF]">
            <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
            Unrelated
          </span>
        </div>

        {/* View Mode Toggle: Graph | List */}
        <div className="flex items-center p-1 rounded-full bg-[#FAF7F2] border border-[#EFE8DF] text-xs font-bold shadow-2xs">
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
              viewMode === 'graph'
                ? 'bg-[#FFFFFF] text-[#18181B] shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Graph
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#FFFFFF] text-[#18181B] shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE TOPOLOGY GRAPH CANVAS */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[460px] sm:h-[490px] rounded-2xl bg-[#FFFDF8] border border-[#F3EDE4] overflow-hidden flex items-center justify-center">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#E8DFD3 1.2px, transparent 1.2px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Left Floating Zoom / Fit Toolbar */}
        <div className="absolute left-4 top-4 flex flex-col gap-1.5 bg-[#FFFFFF] border border-[#EFE8DF] rounded-2xl p-1.5 shadow-sm z-20">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
            className="w-7 h-7 rounded-xl hover:bg-[#FAF7F2] text-[#71717A] hover:text-[#18181B] flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
            className="w-7 h-7 rounded-xl hover:bg-[#FAF7F2] text-[#71717A] hover:text-[#18181B] flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenImpactStudio}
            className="w-7 h-7 rounded-xl hover:bg-[#FAF7F2] text-[#71717A] hover:text-[#18181B] flex items-center justify-center transition-colors cursor-pointer"
            title="Maximize Viewport"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            className="w-7 h-7 rounded-xl hover:bg-[#FAF7F2] text-[#71717A] hover:text-[#18181B] flex items-center justify-center transition-colors cursor-pointer"
            title="Lock Viewport"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Handwritten "See the bigger picture" Callout */}
        <div className="absolute right-14 top-20 hidden md:flex flex-col items-center select-none z-10">
          <span className="font-handwriting text-base text-[#D97706] rotate-6">
            See the bigger picture
          </span>
          <svg className="w-10 h-10 -rotate-12 text-[#D97706]/70 stroke-current fill-none mt-0.5" viewBox="0 0 40 40">
            <path d="M10 5 Q 30 15 25 35" strokeWidth="1.8" strokeDasharray="3 3" />
            <polygon points="25,35 22,28 29,30" fill="currentColor" />
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* RADIAL SVG CONNECTOR LINES */}
        {/* ========================================================================= */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Curves from Center (50%, 50%) to Perimeter Nodes */}
          {/* Top: VPC (50%, 14%) */}
          <path d="M 50% 50% Q 50% 32% 50% 16%" stroke="#10B981" strokeWidth="1.8" strokeDasharray="4 4" fill="none" opacity="0.75" />
          {/* Top-Right: Auth Service (74%, 22%) */}
          <path d="M 50% 50% Q 62% 36% 72% 22%" stroke="#F59E0B" strokeWidth="1.8" fill="none" opacity="0.75" />
          {/* Right: User Service (76%, 42%) */}
          <path d="M 50% 50% Q 64% 46% 74% 42%" stroke="#F59E0B" strokeWidth="1.8" fill="none" opacity="0.75" />
          {/* Bottom-Right: Redis Cache (74%, 62%) */}
          <path d="M 50% 50% Q 62% 56% 72% 62%" stroke="#3B82F6" strokeWidth="1.8" fill="none" opacity="0.75" />
          {/* Far Bottom-Right: Backup Service (76%, 80%) */}
          <path d="M 50% 50% Q 64% 68% 74% 80%" stroke="#3B82F6" strokeWidth="1.8" strokeDasharray="3 3" fill="none" opacity="0.75" />
          {/* Bottom Center: Internal ALB (50%, 82%) */}
          <path d="M 50% 50% Q 50% 66% 50% 82%" stroke="#3B82F6" strokeWidth="1.8" fill="none" opacity="0.75" />
          {/* Left: Payment DB (28%, 56%) */}
          <path d="M 50% 50% Q 38% 54% 28% 56%" stroke="#F97316" strokeWidth="2.2" fill="none" opacity="0.85" />
          {/* Bottom-Left: Read Replica (28%, 74%) */}
          <path d="M 28% 56% Q 28% 66% 28% 74%" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.75" />
          {/* Top-Left: Payment API (26%, 32%) */}
          <path d="M 50% 50% Q 38% 40% 28% 32%" stroke="#EF4444" strokeWidth="2.2" fill="none" opacity="0.85" />
          <path d="M 28% 32% Q 28% 44% 28% 56%" stroke="#EF4444" strokeWidth="1.8" strokeDasharray="3 3" fill="none" opacity="0.75" />
        </svg>

        {/* ========================================================================= */}
        {/* GRAPH NODES (EXACT COMPOSITION MATCHING ATTACHED IMAGE) */}
        {/* ========================================================================= */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* 1. TOP: VPC prod-vpc (Soft Green Pill) */}
          <div className="absolute top-[8%] left-[50%] -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] shadow-xs cursor-pointer hover:scale-105 transition-transform z-10">
            <Cloud className="w-3.5 h-3.5 text-[#16A34A]" />
            <div className="text-left">
              <div className="text-[9px] font-bold text-[#16A34A] leading-tight">VPC</div>
              <div className="text-xs font-black text-[#18181B] leading-tight">prod-vpc</div>
            </div>
          </div>

          {/* 2. TOP-RIGHT: Auth Service (Soft Amber Pill) */}
          <div className="absolute top-[18%] left-[72%] -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] shadow-xs cursor-pointer hover:scale-105 transition-transform z-10">
            <Server className="w-3.5 h-3.5 text-[#D97706]" />
            <div className="text-left">
              <div className="text-[11px] font-black text-[#18181B] leading-tight">Auth Service</div>
              <div className="text-[9px] font-semibold text-[#71717A] leading-tight">ECS Service</div>
            </div>
          </div>

          {/* 3. RIGHT: User Service (Soft Amber Pill) */}
          <div className="absolute top-[38%] left-[74%] -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] shadow-xs cursor-pointer hover:scale-105 transition-transform z-10">
            <Server className="w-3.5 h-3.5 text-[#D97706]" />
            <div className="text-left">
              <div className="text-[11px] font-black text-[#18181B] leading-tight">User Service</div>
              <div className="text-[9px] font-semibold text-[#71717A] leading-tight">ECS Service</div>
            </div>
          </div>

          {/* 4. BOTTOM-RIGHT: Redis Cache (Soft Blue Pill) */}
          <div className="absolute top-[58%] left-[72%] -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] shadow-xs cursor-pointer hover:scale-105 transition-transform z-10">
            <Database className="w-3.5 h-3.5 text-[#2563EB]" />
            <div className="text-left">
              <div className="text-[11px] font-black text-[#18181B] leading-tight">Redis Cache</div>
              <div className="text-[9px] font-semibold text-[#71717A] leading-tight">ElastiCache</div>
            </div>
          </div>

          {/* 5. FAR BOTTOM-RIGHT: Backup Service (Soft Blue Pill) */}
          <div className="absolute top-[76%] left-[74%] -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] shadow-xs cursor-pointer hover:scale-105 transition-transform z-10">
            <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
            <div className="text-left">
              <div className="text-[11px] font-black text-[#18181B] leading-tight">Backup Service</div>
              <div className="text-[9px] font-semibold text-[#71717A] leading-tight">Lambda</div>
            </div>
          </div>

          {/* 6. BOTTOM CENTER: Internal ALB (Soft Blue Pill) */}
          <div className="absolute top-[78%] left-[50%] -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] shadow-xs cursor-pointer hover:scale-105 transition-transform z-10">
            <Network className="w-3.5 h-3.5 text-[#2563EB]" />
            <div className="text-left">
              <div className="text-[11px] font-black text-[#18181B] leading-tight">Internal ALB</div>
              <div className="text-[9px] font-semibold text-[#71717A] leading-tight">Load Balancer</div>
            </div>
          </div>

          {/* 7. TOP-LEFT: Payment API (Soft Coral Pill) */}
          <div className="absolute top-[28%] left-[26%] -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1F2] border border-[#FECDD3] shadow-xs cursor-pointer hover:scale-105 transition-transform z-10">
            <Server className="w-3.5 h-3.5 text-[#E11D48]" />
            <div className="text-left">
              <div className="text-[11px] font-black text-[#18181B] leading-tight">Payment API</div>
              <div className="text-[9px] font-semibold text-[#71717A] leading-tight">ECS Service</div>
            </div>
          </div>

          {/* 8. LEFT: Payment DB (Soft Orange Pill) */}
          <div className="absolute top-[52%] left-[26%] -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF4EB] border border-[#FED7AA] shadow-xs cursor-pointer hover:scale-105 transition-transform z-10">
            <Database className="w-3.5 h-3.5 text-[#EA580C]" />
            <div className="text-left">
              <div className="text-[11px] font-black text-[#18181B] leading-tight">Payment DB</div>
              <div className="text-[9px] font-semibold text-[#71717A] leading-tight">RDS (Primary)</div>
            </div>
          </div>

          {/* 9. BOTTOM-LEFT: Read Replica (Soft Yellow Pill) */}
          <div className="absolute top-[70%] left-[26%] -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEFCE8] border border-[#FEF08A] shadow-xs cursor-pointer hover:scale-105 transition-transform z-10">
            <Database className="w-3.5 h-3.5 text-[#CA8A04]" />
            <div className="text-left">
              <div className="text-[11px] font-black text-[#18181B] leading-tight">Read Replica</div>
              <div className="text-[9px] font-semibold text-[#71717A] leading-tight">RDS (Replica)</div>
            </div>
          </div>

          {/* 10. CENTER ROOT TARGET: subnet-07 with glowing red halo */}
          <div className="relative flex flex-col items-center justify-center z-20 cursor-pointer">
            {/* Glowing red background pulse ring */}
            <div className="absolute w-28 h-28 rounded-full bg-[#EF4444]/15 animate-ping" />
            <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-[#FFE4E6] to-[#FECDD3] blur-md" />

            <div className="relative px-5 py-3 rounded-full bg-[#FFFFFF] border-2 border-[#EF4444] shadow-md shadow-[#EF4444]/20 flex flex-col items-center text-center">
              <div className="w-7 h-7 rounded-full bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center mb-0.5">
                <AlertTriangle className="w-4 h-4 text-[#EF4444] stroke-[2.5]" />
              </div>
              <span className="text-xs font-black text-[#18181B] tracking-tight leading-tight">
                {request.resourceName}
              </span>
              <span className="text-[9.5px] font-extrabold text-[#EF4444] uppercase tracking-wider leading-tight">
                VPC Subnet
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CANVAS BOTTOM STATUS BAR */}
        {/* ========================================================================= */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
          {/* Blast Radius Counter Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md border border-[#EFE8DF] shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center">
              <Radio className="w-3 h-3 text-[#9333EA]" />
            </div>
            <div className="text-xs text-[#18181B] font-bold">
              Blast Radius: <span className="font-extrabold text-[#18181B]">{request.affectedResources} resources</span> • <span className="text-[#EF4444] font-extrabold">{request.criticalServices} critical services</span>
            </div>
          </div>

          {/* View Fullscreen Button */}
          <button
            onClick={onOpenImpactStudio}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/95 hover:bg-[#FFFFFF] border border-[#EFE8DF] hover:border-[#FED7AA] text-xs font-extrabold text-[#18181B] shadow-2xs transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#FF7A30]" />
            <span>View Fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffectedInfrastructureGraph;
