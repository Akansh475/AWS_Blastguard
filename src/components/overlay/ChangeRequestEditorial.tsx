import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';
import { ArrowRight, Trash2 } from 'lucide-react';
import { STATS } from '../../data/mockData';

export const ChangeRequestEditorial: React.FC = () => {
  const { smoothProgress, scrollToPhase } = useScrollProgress();

  const showTicket = smoothProgress >= 0.715;

  return (
    <CinematicText
      startRange={0.680}
      endRange={0.770}
      fadeInSpan={0.018}
      fadeOutSpan={0.020}
      align="center-left"
      className="my-auto max-w-3xl"
    >

      <div className="space-y-6">
        {/* Intro Statement before ticket */}
        {!showTicket ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
                BLASTGUARD ANALYSIS
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
              SEE THE<br />
              <span className="font-normal text-orange-400">BLAST RADIUS.</span>
            </h2>
          </div>
        ) : (
          /* Minimal Floating Change Request Card */
          <div className="p-6 md:p-8 rounded-3xl glass-editorial max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-red-500/15 border border-red-500/30 text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-red-400 font-semibold">
                  CHANGE REQUEST
                </span>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                {STATS.changeRequest.status}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Target:</span>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight text-white font-mono">
                <span className="text-red-400 font-semibold">DELETE </span>
                {STATS.changeRequest.target}
              </h3>
            </div>

            {/* Small metadata */}
            <div className="flex items-center gap-3 pt-2 text-[11px] font-mono text-slate-400 border-t border-white/10">
              <span>AWS</span>
              <span>•</span>
              <span>ap-south-1</span>
              <span>•</span>
              <span className="text-red-300 font-semibold">PRODUCTION</span>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={() => scrollToPhase('ANALYSIS_PIPELINE')}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 hover:text-orange-300 transition-colors group"
              >
                <span>ANALYZE CHANGE</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </CinematicText>
  );
};
