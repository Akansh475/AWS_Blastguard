import React, { useState } from 'react';
import {
  Layers,
  AlertTriangle,
  Link2,
  ArrowRight,
  Shield,
  MapPin,
  Network,
  Database,
  X,
  Check,
  Server,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Info
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';
import { ServiceIcon } from './ServiceIcon';
import { BlastGuardApiClient } from '../../services/apiClient';
import { ExplanationRecord } from '../../ai/types/explanation.model';

interface SelectedRequestPanelProps {
  request: DashboardChangeRequest;
  onViewImpact: () => void;
}

export const SelectedRequestPanel: React.FC<SelectedRequestPanelProps> = ({
  request,
  onViewImpact,
}) => {
  const [explanation, setExplanation] = useState<ExplanationRecord | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  // Risk Gauge Stroke calculation
  const score = request.riskScore;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // Arc is ~260 degrees gauge
  const maxArc = circumference * 0.78;
  const strokeDashoffset = maxArc - (score / 100) * maxArc;

  let gaugeColor = '#EF4444';
  let riskBadgeClass = 'bg-[#FFECEC] text-[#E03131] border border-[#FCD5CF]';
  if (score < 30) {
    gaugeColor = '#22C55E';
    riskBadgeClass = 'bg-[#ECFDF5] text-[#16A34A] border border-[#BBF7D0]';
  } else if (score < 70) {
    gaugeColor = '#F59E0B';
    riskBadgeClass = 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]';
  }

  const isBlocked = request.status === 'Blocked';
  const isApproved = request.status === 'Approved';

  const handleFetchExplanation = async () => {
    if (explanation) {
      setIsExplanationOpen(!isExplanationOpen);
      return;
    }

    setIsLoadingExplanation(true);
    setExplanationError(null);
    try {
      const result = await BlastGuardApiClient.explainRequest(request.id);
      setExplanation(result);
      setIsExplanationOpen(true);
    } catch (err) {
      setExplanationError(err instanceof Error ? err.message : 'Could not generate explanation');
      setIsExplanationOpen(true);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full select-none">
      {/* ========================================================================= */}
      {/* 1. TOP CARD: CHANGE REQUEST DETAILS & 4 METADATA CARDS */}
      {/* ========================================================================= */}
      <section className="glass-panel p-6 sm:p-7 flex flex-col gap-6 shadow-[0_12px_40px_rgba(210,180,110,0.14)]">
        {/* Header: Action Icon + Title + Status Pill */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* 3D Outline Wireframe Box in Red Square */}
            <div className="w-14 h-14 rounded-2xl bg-[#FFECEC] border border-[#FCD5CF] flex items-center justify-center shrink-0 shadow-xs">
              <ServiceIcon category={request.serviceCategory} className="w-7 h-7" isRed={true} />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#8E8E93]">
                CHANGE REQUEST
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight mt-0.5 truncate">
                {request.title}
              </h1>
              <div className="text-xs font-medium text-[#71717A] mt-0.5">
                Requested 2 minutes ago
              </div>
            </div>
          </div>

          {/* Status Badge Pill (✕ Blocked / ✓ Approved / • Pending) */}
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs ${
              isBlocked
                ? 'bg-[#FFECEC] text-[#E03131] border border-[#FCD5CF]'
                : isApproved
                ? 'bg-[#ECFDF5] text-[#16A34A] border border-[#BBF7D0]'
                : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
            }`}
          >
            {isBlocked && <X className="w-3.5 h-3.5 stroke-[3]" />}
            {isApproved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>{request.status}</span>
          </span>
        </div>

        {/* 4 Compact Metadata Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* 1. Resource */}
          <div className="p-3 rounded-2xl bg-white/55 border border-white/80 backdrop-blur-md flex flex-col gap-1.5 shadow-xs">
            <span className="text-[11px] font-medium text-[#71717A]">Resource</span>
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#18181B] truncate">
              <div className="p-0.5 rounded text-[#52525B]">
                <Database className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{request.resourceName}</span>
            </div>
          </div>

          {/* 2. Type */}
          <div className="p-3 rounded-2xl bg-white/55 border border-white/80 backdrop-blur-md flex flex-col gap-1.5 shadow-xs">
            <span className="text-[11px] font-medium text-[#71717A]">Type</span>
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#18181B] truncate">
              <div className="p-0.5 rounded text-[#52525B]">
                <Network className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{request.resourceType}</span>
            </div>
          </div>

          {/* 3. Region */}
          <div className="p-3 rounded-2xl bg-white/55 border border-white/80 backdrop-blur-md flex flex-col gap-1.5 shadow-xs">
            <span className="text-[11px] font-medium text-[#71717A]">Region</span>
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#18181B] truncate">
              <div className="p-0.5 rounded text-[#52525B]">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{request.region}</span>
            </div>
          </div>

          {/* 4. Environment */}
          <div className="p-3 rounded-2xl bg-white/55 border border-white/80 backdrop-blur-md flex flex-col gap-1.5 shadow-xs">
            <span className="text-[11px] font-medium text-[#71717A]">Environment</span>
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#18181B] truncate">
              <div className="p-0.5 rounded text-[#52525B]">
                <Server className="w-3.5 h-3.5" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#FFECEC] text-[#E03131] border border-[#FCD5CF] text-[10px] font-bold">
                {request.environment}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BOTTOM CARD: IMPACT OVERVIEW + METRICS + AI EXPLANATION */}
      {/* ========================================================================= */}
      <section className="glass-panel p-6 sm:p-7 flex flex-col gap-6 shadow-[0_12px_40px_rgba(210,180,110,0.14)]">
        {/* Header: "Impact Overview" + "View Impact →" Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
            Impact Overview
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchExplanation}
              disabled={isLoadingExplanation}
              className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 backdrop-blur-md text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isLoadingExplanation ? 'Analyzing...' : isExplanationOpen ? 'Hide AI Explanation' : 'Why was this blocked?'}</span>
              {isExplanationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onViewImpact}
              className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/60 hover:bg-white border border-white/85 backdrop-blur-md text-xs font-bold text-[#18181B] transition-all shadow-xs hover:shadow active:scale-98 cursor-pointer"
            >
              <span>View Impact</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Centerpiece: Risk Gauge (Left) + 3 Metrics Cards (Right) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Left: Circular Risk Visualization (Cols 1-5) */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                {/* Background Track */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="#FEE2E2"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={maxArc}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Active Progress Arc */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke={gaugeColor}
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={maxArc}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl sm:text-5xl font-black text-[#18181B] leading-none tracking-tight">
                  {request.riskScore}
                </span>
                <span className="text-xs font-semibold text-[#8E8E93] mt-1">
                  / 100
                </span>
              </div>
            </div>

            {/* Critical Pill Badge */}
            <span className={`-mt-4 px-4 py-1 rounded-full text-xs font-bold ${riskBadgeClass} z-10 shadow-xs backdrop-blur-md`}>
              {request.riskLevel}
            </span>
          </div>

          {/* Right: 3 Large Stacked Metric Cards (Cols 6-12) */}
          <div className="sm:col-span-7 flex flex-col gap-2.5">
            {/* Metric 1: 11 Affected resources */}
            <div className="p-3.5 rounded-2xl bg-white/55 hover:bg-white/80 border border-white/80 backdrop-blur-md flex items-center gap-4 shadow-xs transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/80 border border-white flex items-center justify-center text-[#18181B] shrink-0 shadow-2xs">
                <Layers className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#18181B] leading-none tracking-tight">
                  {request.affectedResources}
                </div>
                <div className="text-xs font-medium text-[#71717A] mt-0.5">
                  Affected resources
                </div>
              </div>
            </div>

            {/* Metric 2: 3 Critical services */}
            <div className="p-3.5 rounded-2xl bg-white/55 hover:bg-white/80 border border-white/80 backdrop-blur-md flex items-center gap-4 shadow-xs transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2F2] border border-[#FCD5CF] flex items-center justify-center text-[#E03131] shrink-0 shadow-2xs">
                <AlertTriangle className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#18181B] leading-none tracking-tight">
                  {request.criticalServices}
                </div>
                <div className="text-xs font-medium text-[#71717A] mt-0.5">
                  Critical services
                </div>
              </div>
            </div>

            {/* Metric 3: 2 External dependencies */}
            <div className="p-3.5 rounded-2xl bg-white/55 hover:bg-white/80 border border-white/80 backdrop-blur-md flex items-center gap-4 shadow-xs transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/80 border border-white flex items-center justify-center text-[#18181B] shrink-0 shadow-2xs">
                <Link2 className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#18181B] leading-none tracking-tight">
                  {request.externalDependencies}
                </div>
                <div className="text-xs font-medium text-[#71717A] mt-0.5">
                  External dependencies
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Structured AI Explanation Card */}
        {isExplanationOpen && explanation && (
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 backdrop-blur-md flex flex-col gap-3.5 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                  Amazon Bedrock AI Safety Explanation
                </span>
              </div>
              <span className="text-[10px] text-amber-800/80 font-mono">
                {explanation.model}
              </span>
            </div>

            <div className="text-xs font-bold text-amber-900 leading-snug">
              {explanation.explanation.headline}
            </div>

            <p className="text-xs text-amber-900/90 leading-relaxed bg-white/60 p-3 rounded-xl border border-amber-100">
              {explanation.explanation.summary}
            </p>

            {/* Key Reasons / Why Blocked */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Why This Decision Was Made:
              </span>
              <ul className="text-xs text-amber-900/90 flex flex-col gap-1 pl-1">
                {Array.isArray(explanation.explanation.whyBlocked) ? (
                  explanation.explanation.whyBlocked.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{explanation.explanation.whyBlocked}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Recommended Actions */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Recommended Next Steps:
              </span>
              <ul className="text-xs text-amber-900/90 flex flex-col gap-1 pl-1">
                {explanation.explanation.recommendedActions?.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* AI Summary Card (Static Fallback when collapsed) */}
        {!isExplanationOpen && (
          <div className="p-4 rounded-2xl bg-white/55 border border-white/80 backdrop-blur-md flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-white/80 border border-white flex items-center justify-center text-[#18181B] shrink-0 shadow-2xs mt-0.5">
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#18181B]">AI Summary</span>
                <span className="px-2 py-0.2 rounded-full bg-[#E0E7FF] text-[#4F46E5] text-[10px] font-extrabold uppercase tracking-wide">
                  BEDROCK
                </span>
              </div>
              <p className="text-xs text-[#52525B] leading-relaxed mt-1">
                This change will delete a subnet in a production VPC and impact 11 resources across 3 critical services.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

