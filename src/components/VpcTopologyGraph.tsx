import React from 'react';
import { Globe, Server, Database, Activity, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface VpcTopologyGraphProps {
  isSimulation?: boolean;
}

export const VpcTopologyGraph: React.FC<VpcTopologyGraphProps> = ({ isSimulation = true }) => {
  return (
    <div className="w-full rounded-2xl bg-slate-950/80 border border-white/10 p-5 sm:p-6 relative overflow-hidden shadow-2xl font-mono text-xs">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-white tracking-wider text-[11px] uppercase">
            VPC us-east-1 / ap-south-1 Digital Twin
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          {isSimulation ? (
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 font-bold animate-pulse">
              ⚠ RISK PROPAGATION ACTIVE
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              ● 42 DEPENDENCIES HEALTHY
            </span>
          )}
        </div>
      </div>

      {/* Internet Gateway / ALB Node */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/10">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">Internet Gateway / ALB</span>
          <span className="text-slate-500">•</span>
          <span className="text-[10px] text-slate-300">5.2M req/day</span>
        </div>
      </div>

      {/* Grid of Availability Zones & Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        {/* Subnet 07 & Payment API Cluster (AZ-a) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-red-500/30 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] uppercase text-red-400 font-bold flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              Subnet-07 (Prod-Network)
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold uppercase">
              Target
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-red-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span className="text-white font-semibold">Payment API Core</span>
              </div>
              <span className="text-[10px] text-red-400 font-bold">OUTAGE</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-200">Order Fulfillment</span>
              </div>
              <span className="text-[10px] text-amber-400">DEGRADED</span>
            </div>
          </div>
        </div>

        {/* Database & Disaster Recovery Cluster (AZ-b) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Aurora PG (Multi-AZ Cluster)
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
              Cascade Risk
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-200">Primary Writer Instance</span>
              </div>
              <span className="text-[10px] text-amber-300">IO LOCK</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Glacier DR Vault</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">SECURE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
