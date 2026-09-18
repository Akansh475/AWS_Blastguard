import React from 'react';
import { Cpu, Network, Lock, Activity, CheckCircle2, ShieldCheck, Terminal, Layers, ArrowRight, Server, Database, Globe } from 'lucide-react';
import { AGENT_PIPELINE } from '../data/mockData';

export const FeaturesBento: React.FC = () => {
  return (
    <section id="features" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-[#07090e] border-t border-white/5 relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-orange-500/[0.035] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-[#ff5c28]" />
            <span>ENGINEERING CAPABILITIES</span>
          </div>

          <h2 className="text-[clamp(2.5rem,4.5vw,4.2rem)] font-light tracking-tight text-white leading-[1.02]">
            PRE-FLIGHT INTELLIGENCE.<br />
            <span className="font-normal text-white">BUILT FOR AWS AT SCALE.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            BlastGuard combines automated graph algorithms, multi-agent AI orchestration, and Cedar policy evaluation into an autonomous pre-execution safety gate.
          </p>
        </div>

        {/* Bento Grid (2x2 / Asymmetric Apple Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: 7-Agent Autonomous Pipeline (Cols 1-7) */}
          <div className="lg:col-span-7 p-8 rounded-3xl apple-glass-card flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-mono font-bold tracking-wider uppercase text-cyan-400">
                  <Activity className="w-4 h-4" />
                  <span>7-AGENT MULTI-PIPELINE ORCHESTRATION</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Autonomous
                </span>
              </div>

              <h3 className="text-2xl font-mono font-bold text-white tracking-tight">
                Specialized Agents for Every Safety Dimension
              </h3>

              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Seven purpose-built agents collaborate in real-time to analyze change tickets from ingestion to final safety gate enforcement.
              </p>
            </div>

            {/* Agent Mini Pipeline Stepper */}
            <div className="space-y-2 pt-2">
              {AGENT_PIPELINE.slice(0, 4).map((agent, i) => (
                <div
                  key={agent.id}
                  className="p-3 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="font-bold text-white mr-2">{agent.name}</span>
                    <span className="text-slate-400 text-[11px] hidden sm:inline">{agent.role}</span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Deterministic Cedar Policy Engine (Cols 8-12) */}
          <div className="lg:col-span-5 p-8 rounded-3xl apple-glass-card flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-orange-400">
                <Lock className="w-4 h-4" />
                <span>FORMAL VERIFICATION</span>
              </div>

              <h3 className="text-2xl font-mono font-bold text-white tracking-tight">
                AWS Cedar Policy Engine
              </h3>

              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Evaluate organizational guardrails with sub-millisecond deterministic logic, blocking unauthorized production changes.
              </p>
            </div>

            {/* Cedar Code Snippet Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto shadow-inner">
              <div className="text-slate-500 text-[10px] uppercase pb-1">// AWS Cedar Safety Gate Policy</div>
              <div><span className="text-purple-400">permit</span> (</div>
              <div className="pl-4">principal == <span className="text-amber-300">Role::"SeniorEngineer"</span>,</div>
              <div className="pl-4">action in [<span className="text-emerald-300">Action::"ModifyNetwork"</span>],</div>
              <div className="pl-4">resource is <span className="text-cyan-300">AWS::EC2::Subnet</span></div>
              <div>) <span className="text-purple-400">when</span> &#123; <span className="text-red-400">context.riskScore &lt; 50</span> &#125;;</div>
            </div>
          </div>

          {/* Card 3: Quantitative Blast Radius Scoring (Cols 1-5) */}
          <div className="lg:col-span-5 p-8 rounded-3xl apple-glass-card flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-red-400">
                <ShieldCheck className="w-4 h-4" />
                <span>PRE-FLIGHT SCORING</span>
              </div>

              <h3 className="text-2xl font-mono font-bold text-white tracking-tight">
                Algorithmic Risk Index (0–100)
              </h3>

              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Computes topological distance, revenue volume, downstream database replicas, and tier criticality into a single actionable index.
              </p>
            </div>

            {/* Live Score Dial Display */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between font-mono">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Risk Evaluation</span>
                <span className="text-4xl font-extralight text-red-400 tracking-tighter">
                  87 <span className="text-sm font-light text-slate-500">/ 100</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 block">Gate Status</span>
                <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold uppercase inline-block">
                  BLOCKED
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Live Digital Twin & Graph Traversal (Cols 6-12) */}
          <div className="lg:col-span-7 p-8 rounded-3xl apple-glass-card flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-emerald-400">
                  <Network className="w-4 h-4" />
                  <span>VPC TOPOLOGY DIGITAL TWIN</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  us-east-1 · ap-south-1
                </span>
              </div>

              <h3 className="text-2xl font-mono font-bold text-white tracking-tight">
                Graph Mining for Live VPC Assets
              </h3>

              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Traces direct and indirect dependencies across EC2 instances, ENIs, RDS Multi-AZ clusters, and S3 immutable backup vaults.
              </p>
            </div>

            {/* Interactive Graph Node Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-cyan-500/30 text-center space-y-1">
                <Globe className="w-4 h-4 text-cyan-400 mx-auto" />
                <span className="text-white block font-bold truncate">Internet ALB</span>
                <span className="text-[10px] text-slate-400 block">5.2M req/day</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-red-500/30 text-center space-y-1">
                <Server className="w-4 h-4 text-red-400 mx-auto" />
                <span className="text-white block font-bold truncate">subnet-07</span>
                <span className="text-[10px] text-red-300 block">Origin Target</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-red-500/30 text-center space-y-1">
                <Activity className="w-4 h-4 text-red-400 mx-auto" />
                <span className="text-white block font-bold truncate">Payment API</span>
                <span className="text-[10px] text-red-300 block">Direct Outage</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-amber-500/30 text-center space-y-1">
                <Database className="w-4 h-4 text-amber-400 mx-auto" />
                <span className="text-white block font-bold truncate">Aurora PG</span>
                <span className="text-[10px] text-amber-300 block">Cascade Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
