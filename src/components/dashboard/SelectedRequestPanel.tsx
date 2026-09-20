import React from 'react';
import {
  AlertTriangle,
  Database,
  Layers,
  Link2,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  X,
  Radio,
  Server
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';

interface SelectedRequestPanelProps {
  request: DashboardChangeRequest;
  onViewImpact: () => void;
}

export const SelectedRequestPanel: React.FC<SelectedRequestPanelProps> = ({
  request,
  onViewImpact,
}) => {
  const score = request.riskScore;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  // Arc is ~220 degrees
  const arcLength = circumference * 0.65;
  const strokeDashoffset = arcLength - (score / 100) * arcLength;

  return (
    <aside className="w-full lg:w-[330px] xl:w-[350px] shrink-0 bg-[#FFFFFF] border-l border-[#EFE8DF] p-5 sm:p-6 flex flex-col justify-between gap-5 select-none font-sans shadow-[ -2px_0_12px_rgba(180,160,140,0.04)]">
      <div className="flex flex-col gap-5">
        {/* ========================================================================= */}
        {/* 1. HEADER (Risk Analysis + ✕ CRITICAL) */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#EF4444]" />
            <h2 className="text-sm font-black text-[#18181B] tracking-tight">
              Risk Analysis
            </h2>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[#EF4444] text-xs font-black flex items-center gap-1">
            <X className="w-3.5 h-3.5 stroke-[3]" />
            <span>CRITICAL</span>
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 2. RISK GAUGE (87/100 ARC + TEXT) */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative w-40 h-28 flex items-center justify-center">
            <svg className="w-40 h-40 -rotate-[150deg] transform" viewBox="0 0 160 160">
              {/* Background Arc Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#FEE2E2"
                strokeWidth="14"
                fill="transparent"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Active Progress Gradient Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#EF4444"
                strokeWidth="14"
                fill="transparent"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Centered Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
              <span className="text-4xl font-black text-[#18181B] leading-none tracking-tight">
                {score}
              </span>
              <span className="text-xs font-bold text-[#71717A] mt-0.5">
                / 100
              </span>
            </div>
          </div>

          {/* Subtext */}
          <p className="text-xs text-center font-medium text-[#52525B] max-w-[240px] mt-1 leading-snug">
            High chance of service disruption across production environment.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 3. THREE METRIC COUNTER TILES */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Affected */}
          <div className="p-2.5 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] flex flex-col items-center text-center">
            <span className="text-xl font-black text-[#E11D48] leading-none">
              {request.affectedResources}
            </span>
            <span className="text-[10px] font-semibold text-[#71717A] leading-tight mt-1">
              Affected Resources
            </span>
          </div>

          {/* Critical */}
          <div className="p-2.5 rounded-2xl bg-[#FFF4EB] border border-[#FED7AA] flex flex-col items-center text-center">
            <span className="text-xl font-black text-[#EA580C] leading-none">
              {request.criticalServices}
            </span>
            <span className="text-[10px] font-semibold text-[#71717A] leading-tight mt-1">
              Critical Services
            </span>
          </div>

          {/* External */}
          <div className="p-2.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex flex-col items-center text-center">
            <span className="text-xl font-black text-[#2563EB] leading-none">
              {request.externalDependencies}
            </span>
            <span className="text-[10px] font-semibold text-[#71717A] leading-tight mt-1">
              External Dependencies
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. RECOMMENDED DECISION CARD */}
        {/* ========================================================================= */}
        <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FED7D7] flex flex-col gap-1.5 shadow-2xs">
          <span className="text-[11px] font-medium text-[#71717A]">
            Recommended Decision
          </span>
          <div className="flex items-center justify-between text-[#EF4444] cursor-pointer hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#EF4444] text-white flex items-center justify-center">
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs font-black tracking-wide">
                BLOCK CHANGE
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#EF4444]" />
          </div>
          <p className="text-[10.5px] text-[#71717A] font-medium leading-tight mt-0.5">
            This change poses a high risk to critical services.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 5. KEY FINDINGS LIST */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#18181B]" />
            <h3 className="text-xs font-black text-[#18181B] tracking-tight">
              Key Findings
            </h3>
          </div>

          <div className="space-y-2">
            {/* Finding 1 */}
            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-xl bg-[#FFF1F2] text-[#EF4444] flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#18181B] leading-tight">
                  Payment API will be unavailable
                </div>
                <div className="text-[10.5px] text-[#71717A] leading-tight mt-0.5 font-medium">
                  This subnet hosts the primary payment service.
                </div>
              </div>
            </div>

            {/* Finding 2 */}
            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-xl bg-[#FFF4EB] text-[#EA580C] flex items-center justify-center shrink-0 mt-0.5">
                <Database className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#18181B] leading-tight">
                  RDS database will be affected
                </div>
                <div className="text-[10.5px] text-[#71717A] leading-tight mt-0.5 font-medium">
                  Primary database in the same subnet.
                </div>
              </div>
            </div>

            {/* Finding 3 */}
            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#18181B] leading-tight">
                  Violates POLICY-002
                </div>
                <div className="text-[10.5px] text-[#71717A] leading-tight mt-0.5 font-medium">
                  Production subnets require senior approval.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Full Report Button */}
        <button
          onClick={onViewImpact}
          className="w-full py-2.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#EFE8DF] text-xs font-bold text-[#18181B] flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <span>View Full Report</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FF7A30]" />
        </button>
      </div>

      {/* Handwritten Footer */}
      <div className="text-center pt-2">
        <span className="font-handwriting text-sm text-[#B45309]/80 rotate-1 block">
          Build safely. Deploy confidently. ♡
        </span>
      </div>
    </aside>
  );
};

export default SelectedRequestPanel;
