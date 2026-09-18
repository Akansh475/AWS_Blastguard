import React from 'react';
import { Terminal, Shield, CheckCircle2, Lock, Cpu, Cloud, Layers, FileCode } from 'lucide-react';

const ECOSYSTEM_TOOLS = [
  { name: 'Terraform', type: 'IaC Engine', badge: 'v1.0+' },
  { name: 'AWS CloudFormation', type: 'Native Stacks', badge: 'Full Support' },
  { name: 'AWS CDK', type: 'TypeScript / Python', badge: 'Synthesizer' },
  { name: 'GitHub Actions', type: 'CI/CD Pipeline', badge: 'Pre-Flight Hook' },
  { name: 'GitLab CI', type: 'Enterprise Pipeline', badge: 'Runner Native' },
  { name: 'AWS Control Tower', type: 'Multi-Account Org', badge: 'SCP Native' },
];

export const IntegrationsSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-[#07090e] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400">
            <Cloud className="w-3.5 h-3.5 text-[#ff5c28]" />
            <span>ENTERPRISE ECOSYSTEM</span>
          </div>

          <h2 className="text-[clamp(2.5rem,4.5vw,4.2rem)] font-light tracking-tight text-white leading-[1.02]">
            WORKS NATIVELY WITH<br />
            <span className="font-normal text-white">YOUR EXISTING AWS TOOLCHAIN.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Zero proprietary agents. Zero invasive daemon sets. BlastGuard connects via read-only AWS IAM AssumeRole to evaluate infrastructure changes in milliseconds.
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ECOSYSTEM_TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="p-5 rounded-2xl apple-glass-card text-center space-y-2 group hover:border-[#ff5c28]/40 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-slate-300 mx-auto group-hover:text-orange-400 group-hover:scale-110 transition-all">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-mono text-sm font-bold text-white truncate">{tool.name}</h4>
                <p className="font-mono text-[10px] text-slate-400 truncate">{tool.type}</p>
              </div>
              <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-300">
                {tool.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Enterprise Security Pillar Strip */}
        <div className="p-8 rounded-3xl apple-glass-card grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-slate-300 border border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-white uppercase text-[12px]">Zero-Agent IAM AssumeRole</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                Least-privilege read-only AWS metadata access. No daemons in your production VPCs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-white uppercase text-[12px]">SOC2 Type II & FedRAMP Ready</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                Cryptographically signed immutable audit logs for all production change evaluations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#ff5c28] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-white uppercase text-[12px]">AWS Well-Architected Pillar</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                Directly aligns with AWS Security, Reliability, and Operational Excellence pillars.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
