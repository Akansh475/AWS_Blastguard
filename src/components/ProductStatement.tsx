import React from 'react';
import { ArrowRight, ShieldCheck, Network, Lock, Cpu } from 'lucide-react';

export const ProductStatement: React.FC = () => {
  return (
    <section id="statement" className="relative py-28 sm:py-36 px-6 sm:px-10 lg:px-16 bg-[#07090e] border-t border-white/5 overflow-hidden">
      {/* Delicate background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/[0.035] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-10 relative z-10">
        {/* Small Brand Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c28]" />
          <span>AUTONOMOUS PRE-FLIGHT INTELLIGENCE</span>
        </div>

        {/* Large Clean Product Statement */}
        <h2 className="text-[clamp(2.8rem,5.5vw,5.2rem)] font-light tracking-tight text-white leading-[1.02] max-w-4xl mx-auto select-none">
          SEE THE IMPACT<br />
          <span className="font-normal text-white">BEFORE EXECUTION.</span>
        </h2>

        {/* Small Explanatory Copy */}
        <p className="text-base sm:text-lg md:text-xl font-light text-slate-300/85 max-w-2xl mx-auto leading-relaxed">
          BlastGuard analyzes AWS infrastructure dependencies, security, policy, and blast radius before a production change is made.
        </p>

        {/* Primary Dashboard / Command Center CTA */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => {
              alert('Redirecting to the BlastGuard Enterprise Command Center...');
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white hover:bg-[#ff5c28] text-slate-950 hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-2xl hover:shadow-orange-900/30 hover:-translate-y-0.5"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4 text-[#ff5c28] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
          </button>
        </div>

        {/* Minimal Micro Highlights Grid */}
        <div className="pt-12 sm:pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Dependency Graph</span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Maps live VPC routes, service interfaces, and databases before modification.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
              <Lock className="w-4 h-4 text-orange-400" />
              <span>Cedar Policy Engine</span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Enforces organizational safety gates and mandatory senior approvals.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Multi-Agent Simulation</span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Projects downstream telemetry, latency, and revenue-critical outage risks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
