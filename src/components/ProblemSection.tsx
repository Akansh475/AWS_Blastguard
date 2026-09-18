import React from 'react';
import { Network, ShieldAlert, Cpu, AlertOctagon, TrendingDown, RefreshCw } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-[#07090e] border-t border-white/5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] font-mono tracking-[0.25em] uppercase text-red-400 font-semibold">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>THE PRODUCTION PROBLEM</span>
          </div>

          <h2 className="text-[clamp(2.5rem,4.5vw,4.2rem)] font-light tracking-tight text-white leading-[1.02]">
            ONE CHANGE IN TERRAFORM.<br />
            <span className="font-normal text-white">UNINTENDED DOWNTIME.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Modern AWS architectures are deeply interconnected. Security groups, subnets, transit gateways, and database clusters form complex dependency chains that standard linting and plan files cannot predict.
          </p>
        </div>

        {/* 3 Core Architecture Risk Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl apple-glass-card space-y-4 group hover:border-red-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-mono font-bold text-white tracking-tight">
              Hidden Dependency Cascades
            </h3>

            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Deleting an apparently empty subnet can silently sever elastic network interfaces (ENIs) for Payment APIs, triggering cascading multi-AZ database failovers.
            </p>

            <div className="pt-2 text-xs font-mono text-red-300/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>Avg detection: 42 mins post-deploy</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl apple-glass-card space-y-4 group hover:border-amber-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-mono font-bold text-white tracking-tight">
              Policy & Perimeter Drift
            </h3>

            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Security group modifications and IAM trust boundary adjustments slip through pull requests when nested across deep modular Terraform infrastructure code.
            </p>

            <div className="pt-2 text-xs font-mono text-amber-300/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Violates Cedar governance gates</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl apple-glass-card space-y-4 group hover:border-orange-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff5c28] group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-mono font-bold text-white tracking-tight">
              Blast Radius Blindness
            </h3>

            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Engineers lack a pre-execution impact score. Without automated blast radius intelligence, teams only calculate financial and operational damage during incident post-mortems.
            </p>

            <div className="pt-2 text-xs font-mono text-orange-300/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>BlastGuard blocks before execution</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
