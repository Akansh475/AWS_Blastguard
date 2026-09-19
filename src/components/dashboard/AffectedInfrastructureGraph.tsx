import React from 'react';
import {
  Network,
  Database,
  Server,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Zap
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
  return (
    <div className="bg-[#FFFFFF] border border-[#BCE99A] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      {/* Header with Title and "Open 3D Impact Studio" Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#DCF8C6] border border-[#BCE99A] flex items-center justify-center text-[#15803D]">
            <Network className="w-4 h-4 text-[#15803D]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1E4726] tracking-tight">
              Affected Infrastructure
            </h3>
            <p className="text-[11px] text-[#54825A]">
              Direct & downstream blast radius dependency tree
            </p>
          </div>
        </div>

        <button
          onClick={onOpenImpactStudio}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#BAF084] hover:bg-[#A8EB6C] border border-[#8CD94B] text-xs font-bold text-[#1E4726] transition-all hover:shadow-xs active:scale-98 cursor-pointer shadow-xs"
        >
          <span>Open Impact Studio</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#1E4726]" />
        </button>
      </div>

      {/* Node-and-Connection Tree Graph */}
      <div className="relative bg-[#F4FDEE] border border-[#BCE99A] rounded-xl p-5 overflow-hidden">
        {/* Subtle grid background pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#1E4726 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 lg:gap-8 justify-between">
          {/* LEVEL 1: ROOT ORIGIN RESOURCE (AWS ORANGE) */}
          <div className="flex flex-col items-center shrink-0 w-full md:w-auto">
            <div className="relative p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#FF9900] shadow-[0_4px_16px_rgba(255,153,0,0.15)] flex flex-col items-center gap-2 min-w-[170px] text-center">
              <span className="px-2 py-0.5 rounded-full bg-[#FFF7D6] text-[#FF9900] border border-[#FFD54F]/60 text-[10px] font-bold uppercase tracking-wider">
                Root Origin
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#FFF7D6] flex items-center justify-center text-[#FF9900] font-black">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-[#171717] truncate">
                  {request.resourceName}
                </div>
                <div className="text-[10px] text-[#6B7280]">
                  {request.environment} • VPC Core
                </div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#EF4444] mt-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Target Deletion
            </span>
          </div>

          {/* Connection Lines (Arrow) */}
          <div className="hidden md:flex flex-col items-center justify-center text-[#9CA3AF] shrink-0">
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#FF9900] to-[#EF4444]" />
            <span className="text-[9px] font-bold text-[#6B7280] mt-1">Blast Path</span>
          </div>

          {/* LEVEL 2: DIRECT IMPACT CRITICAL SERVICES */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* 1. Payment API Service (Red - Critical) */}
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#FCD5CF] shadow-xs hover:shadow-sm transition-shadow flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFECEC] text-[#EF4444] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                <Server className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#171717] truncate">
                    Payment API
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FFECEC] text-[#EF4444]">
                    CRITICAL
                  </span>
                </div>
                <div className="text-[10px] text-[#6B7280] mt-0.5">
                  Revenue Critical • 2.4M req/hr
                </div>
                {/* Secondary dependent link */}
                <div className="mt-1.5 pt-1.5 border-t border-[#F3F4F6] flex items-center gap-1 text-[10px] text-[#6B7280]">
                  <ArrowRight className="w-3 h-3 text-[#EF4444]" />
                  <span>Aurora Multi-AZ DB Cluster</span>
                </div>
              </div>
            </div>

            {/* 2. Authentication Broker (Red - Critical) */}
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#FCD5CF] shadow-xs hover:shadow-sm transition-shadow flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFECEC] text-[#EF4444] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#171717] truncate">
                    Auth & Session Broker
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FFECEC] text-[#EF4444]">
                    CRITICAL
                  </span>
                </div>
                <div className="text-[10px] text-[#6B7280] mt-0.5">
                  Tier 0 Security • 3.1M req/hr
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-[#F3F4F6] flex items-center gap-1 text-[10px] text-[#6B7280]">
                  <Zap className="w-3 h-3 text-[#F59E0B]" />
                  <span>Token Verification Gateway</span>
                </div>
              </div>
            </div>

            {/* 3. Order Fulfillment Service (Yellow - Warning) */}
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#FDE68A] shadow-xs hover:shadow-sm transition-shadow flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                <Server className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#171717] truncate">
                    Order Core Service
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FEF3C7] text-[#D97706]">
                    WARNING
                  </span>
                </div>
                <div className="text-[10px] text-[#6B7280] mt-0.5">
                  Tier 1 Critical • 1.8M req/hr
                </div>
              </div>
            </div>

            {/* 4. External Cloud Dependency (Neutral Gray) */}
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs hover:shadow-sm transition-shadow flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] text-[#6B7280] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#171717] truncate">
                    External Gateway
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-[#F3F4F6] text-[#6B7280]">
                    EXTERNAL
                  </span>
                </div>
                <div className="text-[10px] text-[#6B7280] mt-0.5">
                  Third-party webhook ingress
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
