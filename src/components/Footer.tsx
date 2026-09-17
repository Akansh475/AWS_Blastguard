import React from 'react';
import { Shield, Terminal, Cloud, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-6 sm:px-10 lg:px-16 bg-[#07090e] border-t border-white/5 text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5c28]" />
              <span className="font-bold tracking-[0.2em] uppercase text-white text-sm">
                BLASTGUARD
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-light leading-relaxed">
              Autonomous infrastructure blast-radius intelligence and Cedar policy safety barrier for AWS.
            </p>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (ap-south-1)</span>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Product</h5>
            <ul className="space-y-2 text-[11px] font-light">
              <li><a href="#features" className="hover:text-white transition-colors">7-Agent Multi-Pipeline</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">VPC Digital Twin</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Cedar Policy Engine</a></li>
              <li><a href="#live-preview" className="hover:text-white transition-colors">Live Simulation Lab</a></li>
            </ul>
          </div>

          {/* Architecture Col */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Architecture</h5>
            <ul className="space-y-2 text-[11px] font-light">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Terraform Ingestion</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Graph Traversal</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Safety Gate Barrier</a></li>
              <li><a href="#problem" className="hover:text-white transition-colors">Blast Radius Index</a></li>
            </ul>
          </div>

          {/* Security & Enterprise Col */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Security & Compliance</h5>
            <ul className="space-y-2 text-[11px] font-light">
              <li><a href="#" className="hover:text-white transition-colors">Zero-Agent IAM AssumeRole</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SOC2 Type II Report</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AWS Well-Architected</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy & Data Governance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} BlastGuard Inc. All rights reserved. AWS is a trademark of Amazon.com, Inc.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Security Whitepaper</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
