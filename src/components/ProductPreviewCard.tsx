import React, { useState } from 'react';
import { ArrowRight, Trash2, AlertTriangle, ShieldX, Activity, Lock, CheckCircle2 } from 'lucide-react';

export const ProductPreviewCard: React.FC = () => {
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <div className="w-full max-w-md rounded-3xl apple-glass-card p-6 sm:p-7 text-slate-100 transition-all duration-500 shadow-2xl relative overflow-hidden group">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Ticket Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-red-400 block">
              CHANGE REQUEST CR-8842
            </span>
            <span className="text-xs font-mono text-slate-400">
              AWS Terraform Pipeline
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-[10px] font-mono font-bold tracking-wider uppercase text-red-300">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          HIGH RISK
        </span>
      </div>

      {/* Target Resource Definition */}
      <div className="space-y-1 mb-4 p-3.5 rounded-2xl bg-slate-950/50 border border-white/5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
          Target Action & Resource
        </span>
        <div className="text-xl sm:text-2xl font-mono font-light text-white flex items-center justify-between">
          <div>
            <span className="text-red-400 font-medium">DELETE </span>
            subnet-07
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            ap-south-1
          </span>
        </div>
      </div>

      {/* Real-time Telemetry Impact Matrix */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Direct Services</span>
          <span className="text-sm font-bold text-red-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            7 Components
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Revenue Traffic</span>
          <span className="text-sm font-bold text-amber-400">
            2.4M req/hr
          </span>
        </div>
      </div>

      {/* Cedar Policy Barrier Status */}
      <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/25 flex items-center justify-between mb-5 text-xs font-mono">
        <div className="flex items-center gap-2 text-red-400">
          <Lock className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px]">Cedar Policy: VIOLATION</span>
        </div>
        <span className="text-[10px] text-red-300 font-bold uppercase">
          Gate: BLOCKED
        </span>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10">
        <a
          href="#live-preview"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff5c28] hover:bg-orange-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-orange-950/40"
        >
          <span>SIMULATE BLAST RADIUS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>

        <span className="text-[10px] font-mono text-slate-400">
          Pre-flight check
        </span>
      </div>
    </div>
  );
};
