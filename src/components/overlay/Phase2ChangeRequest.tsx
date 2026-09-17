import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { Trash2, AlertCircle } from 'lucide-react';
import { STATS } from '../../data/mockData';

export const Phase2ChangeRequest: React.FC = () => {
  const { smoothProgress, mouse } = useScrollProgress();

  const isVisible = smoothProgress >= 0.12 && smoothProgress <= 0.25;

  let opacity = 1;
  if (smoothProgress < 0.14) {
    opacity = (smoothProgress - 0.12) / 0.02;
  } else if (smoothProgress > 0.22) {
    opacity = 1 - (smoothProgress - 0.22) / 0.03;
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
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-red-500/15 border border-red-500/30 text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400">
                  CHANGE REQUEST
                </span>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>{STATS.changeRequest.status}</span>
              </div>
            </div>

            {/* Target & Action */}
            <div className="flex items-baseline gap-2 mb-2.5">
              <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-xs font-mono font-bold text-red-400">
                {STATS.changeRequest.action}
              </span>
              <span className="text-base font-bold font-mono text-slate-100">
                {STATS.changeRequest.target}
              </span>
            </div>

            {/* Metadata Rows */}
            <div className="space-y-1 text-xs font-mono text-slate-300">
              <div className="flex items-center justify-between py-0.5 border-t border-white/5">
                <span className="text-slate-400">Environment:</span>
                <span className="text-red-300 font-bold">{STATS.changeRequest.environment}</span>
              </div>
              <div className="flex items-center justify-between py-0.5 border-t border-white/5">
                <span className="text-slate-400">Requested by:</span>
                <span className="text-slate-200">{STATS.changeRequest.requestedBy}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
