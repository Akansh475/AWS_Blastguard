import React from 'react';
import { Terminal, Cpu, ShieldCheck, ArrowRight, GitPullRequest, Search, FileCode } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-[#07090e] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400">
            <GitPullRequest className="w-3.5 h-3.5 text-[#ff5c28]" />
            <span>EXECUTION WORKFLOW</span>
          </div>

          <h2 className="text-[clamp(2.5rem,4.5vw,4.2rem)] font-light tracking-tight text-white leading-[1.02]">
            FROM PULL REQUEST TO<br />
            <span className="font-normal text-white">SAFETY GATE ENFORCEMENT.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            BlastGuard plugs seamlessly into your existing CI/CD pipelines, intercepting change plans and analyzing blast radius before AWS apply commands run.
          </p>
        </div>

        {/* 3 Step Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl apple-glass-card space-y-6 relative group">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-mono font-extralight text-slate-600 group-hover:text-orange-400 transition-colors">
                01
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase font-semibold">
                Intercept
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-mono font-bold text-white tracking-tight">
                Plan Ingestion
              </h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Captures Terraform plan JSON, CloudFormation changesets, or CDK synth output in GitHub Actions or GitLab CI.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 font-mono text-[11px] text-slate-400 space-y-1">
              <span className="text-orange-400 block">$ terraform plan -out=tfplan</span>
              <span className="text-slate-500 block">✓ Hook: blastguard pre-flight</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl apple-glass-card space-y-6 relative group">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-mono font-extralight text-slate-600 group-hover:text-cyan-400 transition-colors">
                02
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase font-semibold">
                Simulate
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-mono font-bold text-white tracking-tight">
                Graph Traversal & Agents
              </h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                7 AI agents mine live AWS telemetry, map VPC route tables, and simulate thousands of cascading failure scenarios.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 font-mono text-[11px] text-cyan-300 space-y-1">
              <span className="block">● 7 direct & 11 indirect links</span>
              <span className="text-slate-400 block">✓ Digital twin constructed (840ms)</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl apple-glass-card space-y-6 relative group">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-mono font-extralight text-slate-600 group-hover:text-emerald-400 transition-colors">
                03
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase font-semibold">
                Enforce
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-mono font-bold text-white tracking-tight">
                Safety Barrier Decision
              </h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Evaluates Cedar governance rules. High-risk changes are blocked at the CI/CD gate with full executive audit logs.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/20 font-mono text-[11px] text-red-300 space-y-1">
              <span className="font-bold block">✕ GATE ENFORCED: BLOCK APPLY</span>
              <span className="text-slate-400 block">Requires Senior SRE Sign-off</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
