import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { GitFork, Server, Database, Shield, Radio, Activity, Lock } from 'lucide-react';
import { INFRA_NODES } from '../../data/mockData';

export const Phase5BlastRadiusTopology: React.FC = () => {
  const { smoothProgress, mouse } = useScrollProgress();

  const isVisible = smoothProgress >= 0.50 && smoothProgress <= 0.66;

  let opacity = 1;
  if (smoothProgress < 0.52) {
    opacity = (smoothProgress - 0.50) / 0.02;
  } else if (smoothProgress > 0.63) {
    opacity = 1 - (smoothProgress - 0.63) / 0.03;
  }
  opacity = Math.max(0, Math.min(1, opacity));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: opacity,
            x: mouse.x * 4,
            y: mouse.y * 4,
            transition: { duration: 0.35, ease: 'easeOut' }
          }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.25 } }}
          className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end items-start p-6 md:p-12"
        >
          <div className="w-full max-w-md pointer-events-auto rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 p-4 md:p-5 shadow-2xl space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-red-500/15 border border-red-500/30 text-red-400">
                  <GitFork className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400">
                  BLAST RADIUS TOPOLOGY
                </span>
              </div>
              <span className="text-[10px] font-mono text-red-300 animate-pulse">
                Affected Graph
              </span>
            </div>

            {/* Target Root */}
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500 text-red-300 flex items-center justify-between font-mono text-xs">
              <span className="font-bold">● subnet-07 (Target Deletion)</span>
              <span className="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded text-red-400 font-bold">
                ROOT FAULT
              </span>
            </div>

            {/* Downstream Impact Nodes */}
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/80 border border-orange-500/40 text-slate-100">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-orange-400" />
                  <span>Payment API</span>
                </span>
                <span className="text-[9px] text-red-400 font-bold">DIRECT (2.4M req/hr)</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/80 border border-amber-500/40 text-slate-100">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-amber-400" />
                  <span>Order Service</span>
                </span>
                <span className="text-[9px] text-amber-400">DIRECT (Tier 1)</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/80 border border-purple-500/40 text-slate-100">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-purple-400" />
                  <span>Auth & Session Broker</span>
                </span>
                <span className="text-[9px] text-purple-400">DIRECT (Tier 0)</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-1.5 rounded bg-slate-900/70 border border-red-500/30 text-red-300 flex items-center gap-1">
                  <Database className="w-3 h-3 text-red-400" />
                  <span className="truncate">Aurora DB Cluster</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900/70 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-cyan-400" />
                  <span className="truncate">Monitoring / Vault</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
