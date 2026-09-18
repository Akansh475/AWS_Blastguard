import React, { useState } from 'react';
import { CHANGE_REQUESTS_LIST } from '../data/mockData';
import { ChangeRequestItem } from '../types';
import { ShieldX, ShieldCheck, Activity, RefreshCw, Lock, Network } from 'lucide-react';
import { VpcTopologyGraph } from './VpcTopologyGraph';

export const LiveSimulationPreview: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('cr-8842');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const selectedTicket: ChangeRequestItem =
    CHANGE_REQUESTS_LIST.find((t) => t.id === selectedId) || CHANGE_REQUESTS_LIST[0];

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
    }, 800);
  };

  return (
    <section id="live-preview" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-[#07090e] border-t border-white/5 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/[0.025] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono tracking-[0.25em] uppercase text-cyan-400 font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>INTERACTIVE SIMULATION LAB</span>
            </div>

            <h2 className="text-[clamp(2.4rem,4.2vw,3.8rem)] font-light tracking-tight text-white leading-[1.02]">
              TEST REAL PRODUCTION CHANGES.<br />
              <span className="font-normal text-white">OBSERVE THE SAFETY BARRIER.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Select an AWS change request below to see how BlastGuard's agents discover dependencies, map topological risk, and enforce Cedar policies in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-300 border border-white/15 hover:border-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin text-orange-400' : ''}`} />
              <span>{isEvaluating ? 'Simulating...' : 'Run Simulation'}</span>
            </button>
          </div>
        </div>

        {/* Change Request Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CHANGE_REQUESTS_LIST.slice(0, 3).map((ticket) => {
            const isSelected = ticket.id === selectedId;
            return (
              <button
                key={ticket.id}
                onClick={() => setSelectedId(ticket.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-300 font-mono ${
                  isSelected
                    ? 'bg-slate-900/90 border-[#ff5c28] shadow-lg shadow-orange-950/20 ring-1 ring-orange-500/30'
                    : 'bg-slate-950/40 hover:bg-slate-900/50 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">
                    {ticket.ticketId}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase ${
                      ticket.status === 'BLOCKED'
                        ? 'bg-red-500/15 border-red-500/30 text-red-300'
                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="text-sm text-slate-200 truncate">
                  <span className="text-red-400 font-semibold">{ticket.action} </span>
                  {ticket.target}
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5 text-[10px] text-slate-400">
                  <span>{ticket.region}</span>
                  <span className={ticket.riskLevel === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    Risk: {ticket.riskScore}/100
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Simulation Dashboard Window (Apple Glass Surface) */}
        <div className="rounded-3xl apple-glass-card p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Change Details & Digital Twin Graph (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-xs font-bold text-white uppercase">
                    Target: {selectedTicket.target}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  VPC: {selectedTicket.vpc}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {selectedTicket.reason}
              </p>
            </div>

            {/* Live Interactive Digital Twin Graph */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  VPC Topology Propagation Matrix
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">● Active Digital Twin</span>
              </div>

              <VpcTopologyGraph isSimulation={selectedTicket.status === 'BLOCKED'} />
            </div>
          </div>

          {/* Right Column: Risk Dial, Cedar Evaluation, Safety Barrier Verdict (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Risk Verdict Box */}
            <div
              className={`p-6 rounded-3xl border shadow-2xl space-y-5 font-mono ${
                selectedTicket.status === 'BLOCKED'
                  ? 'bg-red-950/25 border-red-500/40 shadow-red-950/30'
                  : 'bg-emerald-950/25 border-emerald-500/40 shadow-emerald-950/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  BlastGuard Verdict
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    selectedTicket.status === 'BLOCKED'
                      ? 'bg-red-500/20 border-red-500/40 text-red-300'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>

              {/* Big Dial */}
              <div className="border-y border-white/10 py-4 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Risk Score</span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-5xl font-extralight tracking-tighter ${
                        selectedTicket.riskScore > 75
                          ? 'text-red-400'
                          : selectedTicket.riskScore > 40
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedTicket.riskScore}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block">Risk Level</span>
                  <span
                    className={`text-sm font-bold uppercase ${
                      selectedTicket.riskLevel === 'CRITICAL' ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {selectedTicket.riskLevel}
                  </span>
                </div>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase block">Direct Services</span>
                  <span className="text-base font-bold text-red-400">
                    {selectedTicket.directImpactCount} services
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase block">Indirect Replicas</span>
                  <span className="text-base font-bold text-amber-400">
                    {selectedTicket.indirectImpactCount} components
                  </span>
                </div>
              </div>

              {/* Cedar Policy Check */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px] uppercase">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Policy Check: {selectedTicket.policyResult}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Cedar policy <code className="text-orange-300">PRODUCTION_CHANGE_REQUIRES_APPROVAL</code> enforced.
                </p>
              </div>

              {/* Enforce Action */}
              <div className="pt-1">
                <button
                  onClick={() => alert(`Safety Gate active: ${selectedTicket.status} applied for ${selectedTicket.target}.`)}
                  className={`w-full py-3 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                    selectedTicket.status === 'BLOCKED'
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {selectedTicket.status === 'BLOCKED' ? <ShieldX className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{selectedTicket.status === 'BLOCKED' ? 'SAFETY BARRIER: BLOCK APPLY' : 'PERMIT & EXECUTE APPLY'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
