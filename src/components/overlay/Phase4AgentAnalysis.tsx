import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { Cpu, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { AGENT_PIPELINE } from '../../data/mockData';

export const Phase4AgentAnalysis: React.FC = () => {
  const { smoothProgress, mouse } = useScrollProgress();

  const isVisible = smoothProgress >= 0.36 && smoothProgress <= 0.51;

  let opacity = 1;
  if (smoothProgress < 0.38) {
    opacity = (smoothProgress - 0.36) / 0.02;
  } else if (smoothProgress > 0.48) {
    opacity = 1 - (smoothProgress - 0.48) / 0.03;
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
          <div className="w-full max-w-md pointer-events-auto rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 p-4 md:p-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                  AGENT ANALYSIS PIPELINE
                </span>
              </div>
              <span className="text-[10px] font-mono text-indigo-300">
                7/7 Agents Active
              </span>
            </div>

            {/* Pipeline Steps */}
            <div className="space-y-1.5 font-mono text-xs">
              {AGENT_PIPELINE.map((agent, idx) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/70 border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-bold">0{idx + 1}</span>
                    <span className="font-bold text-slate-100">{agent.name}</span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">({agent.role})</span>
                  </div>

                  {agent.status === 'alert' ? (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      ALERT
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      DONE
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
