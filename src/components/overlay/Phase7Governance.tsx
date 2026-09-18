import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { Scale, XCircle, UserCheck } from 'lucide-react';
import { STATS } from '../../data/mockData';

export const Phase7Governance: React.FC = () => {
  const { smoothProgress, mouse } = useScrollProgress();

  const isVisible = smoothProgress >= 0.78 && smoothProgress <= 0.89;

  let opacity = 1;
  if (smoothProgress < 0.80) {
    opacity = (smoothProgress - 0.78) / 0.02;
  } else if (smoothProgress > 0.86) {
    opacity = 1 - (smoothProgress - 0.86) / 0.03;
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
          <div className="w-full max-w-sm pointer-events-auto rounded-2xl bg-slate-950/75 backdrop-blur-md border border-red-500/30 p-4 md:p-5 shadow-2xl space-y-2.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                  {STATS.governance.title}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {STATS.governance.result}
              </span>
            </div>

            <p className="text-xs font-mono text-red-300 font-medium">
              {STATS.governance.changeDetection}
            </p>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Required approval:</span>
                <span className="text-amber-300 font-bold flex items-center gap-1 text-[11px]">
                  <UserCheck className="w-3.5 h-3.5" />
                  {STATS.governance.requiredApproval}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-black/50 border border-red-500/20 text-[10px] text-slate-300">
                <span className="text-slate-500 uppercase block">Enforced Policy:</span>
                <span className="text-red-400 font-bold">{STATS.governance.policyName}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
