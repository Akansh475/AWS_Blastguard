import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { ShieldX, AlertOctagon, FileText, ArrowDown } from 'lucide-react';
import { STATS } from '../../data/mockData';
import { AuditReportModal } from '../ui/AuditReportModal';

export const Phase8FinalDecision: React.FC = () => {
  const { smoothProgress, mouse, scrollToPhase } = useScrollProgress();
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Active range: 0.88 to 0.96
  const isVisible = smoothProgress >= 0.88 && smoothProgress <= 0.965;

  let opacity = 1;
  if (smoothProgress < 0.90) {
    opacity = (smoothProgress - 0.88) / 0.02;
  } else if (smoothProgress > 0.95) {
    opacity = 1 - (smoothProgress - 0.95) / 0.015;
  }
  opacity = Math.max(0, Math.min(1, opacity));

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{
              opacity: opacity,
              scale: 1,
              y: 0,
              x: mouse.x * 4,
              transition: { duration: 0.35, ease: 'easeOut' }
            }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
            className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end items-center pb-8 px-6"
          >
            <div className="w-full max-w-lg pointer-events-auto rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-red-500/40 p-5 shadow-2xl text-center space-y-3">
              {/* Decision Header Pill & Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase">
                  <AlertOctagon className="w-3 h-3 text-red-400" />
                  <span>BLASTGUARD DECISION</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-red-500/20 border border-red-500 text-red-400">
                    <ShieldX className="w-4 h-4" />
                  </div>
                  <span className="text-xl md:text-2xl font-black font-mono tracking-tight text-red-500">
                    {STATS.decision.action}
                  </span>
                </div>
              </div>

              {/* Status Chips */}
              <div className="flex items-center justify-center gap-4 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-bold">
                  Risk: {STATS.decision.risk}
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold">
                  Blast Radius: {STATS.decision.blastRadius}
                </span>
              </div>

              {/* Reason Statement */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-left font-mono text-xs text-slate-200">
                <span className="text-slate-400 uppercase text-[10px] block mb-1">Reason:</span>
                <p>{STATS.decision.reason}</p>
              </div>

              {/* Action Button & Down Prompt */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowAuditModal(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-md"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{STATS.decision.buttonText} (Audit Log)</span>
                </button>

                <button
                  onClick={() => scrollToPhase('FINAL_PRODUCT')}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                >
                  <span>Product Summary</span>
                  <ArrowDown className="w-3.5 h-3.5 text-orange-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuditReportModal isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} />
    </>
  );
};
