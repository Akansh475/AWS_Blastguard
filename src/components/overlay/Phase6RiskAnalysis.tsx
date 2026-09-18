import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { Flame, Radio, Check } from 'lucide-react';
import { clamp } from '../../utils/math';
import { STATS } from '../../data/mockData';

export const Phase6RiskAnalysis: React.FC = () => {
  const { smoothProgress, mouse } = useScrollProgress();

  const isVisible = smoothProgress >= 0.65 && smoothProgress <= 0.79;

  let opacity = 1;
  if (smoothProgress < 0.67) {
    opacity = (smoothProgress - 0.65) / 0.02;
  } else if (smoothProgress > 0.76) {
    opacity = 1 - (smoothProgress - 0.76) / 0.03;
  }
  opacity = Math.max(0, Math.min(1, opacity));

  // Dynamic synchronized score progression
  const progressRatio = clamp((smoothProgress - 0.65) / (0.77 - 0.65), 0, 1);
  let displayScore = '—';
  let scoreColor = 'text-slate-400';

  if (progressRatio < 0.25) {
    displayScore = '32';
    scoreColor = 'text-amber-400';
  } else if (progressRatio < 0.60) {
    displayScore = '61';
    scoreColor = 'text-orange-400';
  } else {
    displayScore = '87';
    scoreColor = 'text-red-500';
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{
            opacity: opacity,
            scale: 1,
            y: 0,
            x: mouse.x * 4,
            transition: { duration: 0.35, ease: 'easeOut' }
          }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
          className="absolute inset-0 pointer-events-none z-20 flex items-end justify-start p-6 md:p-12"
        >
          <div className="w-full max-w-md pointer-events-auto rounded-2xl bg-slate-950/75 backdrop-blur-md border border-red-500/40 p-4 md:p-5 shadow-2xl space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-red-500/15 border border-red-500/30 text-red-400">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400">
                  RISK ANALYSIS
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold">
                CRITICAL
              </span>
            </div>

            {/* Score Showcase */}
            <div className="flex items-baseline justify-between font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Risk Score</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-4xl font-black transition-colors duration-300 ${scoreColor}`}>
                    {displayScore}
                  </span>
                  <span className="text-sm text-slate-500">/ 100</span>
                </div>
              </div>

              <span className="text-xs font-bold text-red-400 uppercase bg-red-950/50 px-2 py-1 rounded border border-red-500/30">
                CRITICAL RISK
              </span>
            </div>

            {/* 5 Risk Factors */}
            <div className="space-y-1 font-mono text-[10px]">
              <span className="text-slate-400 uppercase block mb-1">Evaluated Factors:</span>
              <div className="grid grid-cols-2 gap-1 text-slate-300">
                {STATS.riskFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-white/5">
                    <span className="text-red-400 font-bold">•</span>
                    <span className="truncate">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
