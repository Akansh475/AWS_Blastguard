import React from 'react';
import { Trash2, Shield, Server, Database, Cpu, Key, Layers, Network } from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';

interface RequestDetailsColumnProps {
  request: DashboardChangeRequest;
}

export const RequestDetailsColumn: React.FC<RequestDetailsColumnProps> = ({ request }) => {
  // Select appropriate icon
  const renderActionIcon = () => {
    switch (request.actionIcon) {
      case 'trash':
        return <Trash2 className="w-5 h-5 text-[#E03131]" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-[#16A34A]" />;
      case 'server':
        return <Server className="w-5 h-5 text-[#D97706]" />;
      case 'database':
        return <Database className="w-5 h-5 text-[#16A34A]" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-[#6B7280]" />;
      case 'key':
        return <Key className="w-5 h-5 text-[#16A34A]" />;
      default:
        return <Layers className="w-5 h-5 text-[#6B7280]" />;
    }
  };

  // Status badge style
  let statusBadgeClass = 'bg-white/50 text-[#4B5563] backdrop-blur-md border border-white/70 shadow-xs';
  if (request.status === 'Blocked') statusBadgeClass = 'bg-[#FFECEC]/85 text-[#E03131] border border-[#FCD5CF]/80 backdrop-blur-md shadow-xs';
  if (request.status === 'Approved') statusBadgeClass = 'bg-[#ECFDF5]/85 text-[#16A34A] border border-[#BBF7D0]/80 backdrop-blur-md shadow-xs';
  if (request.status === 'Pending') statusBadgeClass = 'bg-[#FEF3C7]/85 text-[#D97706] border border-[#FDE68A]/80 backdrop-blur-md shadow-xs';

  // Environment badge style
  let envBadgeClass = 'bg-white/50 text-[#4B5563] backdrop-blur-md border border-white/70 shadow-xs';
  if (request.environment === 'Production') envBadgeClass = 'bg-[#FFECEC]/85 text-[#E03131] border border-[#FCD5CF]/80 backdrop-blur-md shadow-xs';
  if (request.environment === 'Staging') envBadgeClass = 'bg-[#FEF3C7]/85 text-[#D97706] border border-[#FDE68A]/80 backdrop-blur-md shadow-xs';
  if (request.environment === 'Dev') envBadgeClass = 'bg-white/60 text-[#4B5563] border border-white/80 backdrop-blur-md shadow-xs';

  // Risk Gauge Stroke Color & Angle
  // Circle circumference for r=46 is 2 * PI * 46 = 289
  const score = request.riskScore;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  // Arc is ~260 degrees gauge
  const maxArc = circumference * 0.75;
  const strokeDashoffset = maxArc - (score / 100) * maxArc;

  let gaugeColor = '#EF4444';
  let riskBadgeClass = 'bg-[#FFECEC]/90 text-[#E03131] border border-[#FCD5CF]/80 backdrop-blur-md';
  if (score < 30) {
    gaugeColor = '#22C55E';
    riskBadgeClass = 'bg-[#ECFDF5]/90 text-[#16A34A] border border-[#BBF7D0]/80 backdrop-blur-md';
  } else if (score < 70) {
    gaugeColor = '#F59E0B';
    riskBadgeClass = 'bg-[#FEF3C7]/90 text-[#D97706] border border-[#FDE68A]/80 backdrop-blur-md';
  }

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* ========================================================================= */}
      {/* TOP CARD: CHANGE REQUEST DETAILS */}
      {/* ========================================================================= */}
      <div className="glass-panel p-5 sm:p-6 flex flex-col gap-5 shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
        {/* Header: Action Icon + Title + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#FFECEC] border border-[#FCD5CF]/60 flex items-center justify-center shrink-0 shadow-sm">
              {renderActionIcon()}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#8E8E93]">
                CHANGE REQUEST
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#18181B] mt-0.5 whitespace-nowrap">
                {request.title}
              </h3>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${statusBadgeClass}`}>
            {request.status}
          </span>
        </div>

        {/* Metadata Key-Value Rows */}
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 pt-3 border-t border-black/5 text-xs">
          {/* Resource */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[#71717A] font-medium min-w-[55px]">Resource</span>
            <div className="flex items-center gap-1.5 font-semibold text-[#18181B] whitespace-nowrap">
              <div className="p-1 rounded-md bg-white/60 border border-white/70 shrink-0">
                <Network className="w-3.5 h-3.5 text-[#52525B]" />
              </div>
              <span className="whitespace-nowrap">{request.resourceName}</span>
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[#71717A] font-medium min-w-[55px]">Type</span>
            <span className="font-semibold text-[#18181B] whitespace-nowrap">{request.resourceType}</span>
          </div>

          {/* Region */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[#71717A] font-medium min-w-[55px]">Region</span>
            <span className="font-semibold text-[#18181B] whitespace-nowrap">{request.region}</span>
          </div>

          {/* Environment */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[#71717A] font-medium min-w-[55px]">Environment</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${envBadgeClass}`}>
              {request.environment}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM CARD: IMPACT OVERVIEW */}
      {/* ========================================================================= */}
      <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4 shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
        <h3 className="text-base font-bold text-[#18181B]">
          Impact Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Left: Donut Risk Gauge (Cols 1-6) */}
          <div className="sm:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                {/* Background Track */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#FEE2E2"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={maxArc}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Active Progress */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={gaugeColor}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={maxArc}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#18181B] leading-none">
                  {request.riskScore}
                </span>
                <span className="text-[11px] font-semibold text-[#8E8E93] mt-0.5">
                  / 100
                </span>
              </div>
            </div>

            {/* Risk Badge */}
            <span className={`-mt-3 px-3 py-0.5 rounded-full text-xs font-bold ${riskBadgeClass} z-10 shadow-sm`}>
              {request.riskLevel}
            </span>
          </div>

          {/* Right: Metrics Numbers (Cols 7-12) */}
          <div className="sm:col-span-6 flex flex-col justify-center gap-3.5 pl-0 sm:pl-2">
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#18181B] leading-tight">
                {request.affectedResources}
              </div>
              <div className="text-xs font-medium text-[#71717A]">
                Affected resources
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-black text-[#18181B] leading-tight">
                {request.criticalServices}
              </div>
              <div className="text-xs font-medium text-[#71717A]">
                Critical services
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-black text-[#18181B] leading-tight">
                {request.externalDependencies}
              </div>
              <div className="text-xs font-medium text-[#71717A]">
                External dependencies
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
