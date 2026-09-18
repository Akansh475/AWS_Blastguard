import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { Share2, Activity, Database, Server } from 'lucide-react';
import { STATS } from '../../data/mockData';

export const Phase3DependencyDiscovery: React.FC = () => {
  const { smoothProgress, mouse } = useScrollProgress();

  const isVisible = smoothProgress >= 0.24 && smoothProgress <= 0.37;

  let opacity = 1;
  if (smoothProgress < 0.26) {
    opacity = (smoothProgress - 0.24) / 0.02;
  } else if (smoothProgress > 0.34) {
    opacity = 1 - (smoothProgress - 0.34) / 0.03;
  }
  opacity = Math.max(0, Math.min(1, opacity));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -15, y: 10 }}
          animate={{
            opacity: opacity,
            x: mouse.x * 4,
            y: mouse.y * 4,
            transition: { duration: 0.35, ease: 'easeOut' }
          }}
          exit={{ opacity: 0, x: -15, transition: { duration: 0.25 } }}
          className="absolute inset-0 pointer-events-none z-20 flex items-end justify-start p-6 md:p-12"
        >
          <div className="w-full max-w-sm pointer-events-auto rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 p-4 md:p-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  DEPENDENCY DISCOVERY
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>Scanning...</span>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-200 mb-3">
              Scanning infrastructure...
            </p>

            {/* 4 Revealed Metrics */}
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-center">
                <span className="text-2xl font-extrabold text-cyan-400">
                  {STATS.dependencyDiscovery.direct}
                </span>
                <p className="text-[9px] text-slate-300 uppercase mt-0.5">Direct Dependencies</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 text-center">
                <span className="text-2xl font-extrabold text-purple-400">
                  {STATS.dependencyDiscovery.indirect}
                </span>
                <p className="text-[9px] text-slate-300 uppercase mt-0.5">Indirect Dependencies</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-lg">
                  <Database className="w-3.5 h-3.5" />
                  <span>{STATS.dependencyDiscovery.productionDatabases}</span>
                </div>
                <p className="text-[9px] text-slate-300 uppercase mt-0.5">Production DBs</p>
              </div>

              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-center">
                <div className="flex items-center justify-center gap-1 text-red-400 font-bold text-lg">
                  <Server className="w-3.5 h-3.5" />
                  <span>{STATS.dependencyDiscovery.criticalPaymentAPI}</span>
                </div>
                <p className="text-[9px] text-red-300 uppercase mt-0.5">Payment API (Crit)</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
