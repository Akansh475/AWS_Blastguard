import React, { useState } from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';
import { ArrowRight, ShieldX } from 'lucide-react';
import { AuditReportModal } from '../ui/AuditReportModal';

export const FinalDecisionEditorial: React.FC = () => {
  const { smoothProgress } = useScrollProgress();
  const [showModal, setShowModal] = useState(false);

  // Transition from Risk Number to CHANGE BLOCKED statement
  const isDecisionClimax = smoothProgress >= 0.938;

  return (
    <>
      <CinematicText
        startRange={0.915}
        endRange={0.965}
        fadeInSpan={0.012}
        fadeOutSpan={0.015}
        align="center-left"
        className="my-auto max-w-3xl"
      >

        {!isDecisionClimax ? (
          /* Risk Analysis Minimal Number Display */
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
                RISK ANALYSIS
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-7xl sm:text-8xl md:text-9xl font-extralight tracking-tighter text-red-500 leading-none">
                87
              </span>
              <div className="space-y-1">
                <span className="text-xl md:text-2xl font-light text-slate-400 font-mono block">
                  / 100
                </span>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-red-400 font-bold block">
                  CRITICAL
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Emotional Payoff: CHANGE BLOCKED */
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <ShieldX className="w-4 h-4 text-red-400" />
              <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-red-400 font-bold">
                DECISION
              </span>
            </div>

            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-light tracking-tight text-red-500 leading-[0.92]">
              CHANGE<br />
              <span className="font-normal text-red-400">BLOCKED.</span>
            </h2>

            <div className="space-y-1 font-light text-sm md:text-base text-slate-300 max-w-lg pt-1">
              <p>Critical production dependencies detected.</p>
              <p className="text-slate-400 text-xs md:text-sm">Senior approval required.</p>
            </div>

            {/* Subtle Action Link */}
            <div className="pt-2">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 hover:text-orange-300 transition-colors group"
              >
                <span>VIEW IMPACT</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </CinematicText>

      <AuditReportModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
