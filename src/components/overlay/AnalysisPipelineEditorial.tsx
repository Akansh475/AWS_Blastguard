import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';
import { clamp } from '../../utils/math';

const ANALYSIS_PHRASES = [
  'MAPPING DEPENDENCIES',
  'TRACING IMPACT',
  'CHECKING SECURITY',
  'VALIDATING POLICY',
  'CALCULATING RISK'
];

const AGENT_SPECIALISTS = [
  'DEPENDENCY',
  'TOPOLOGY',
  'SECURITY',
  'IMPACT',
  'POLICY',
  'DECISION'
];

export const AnalysisPipelineEditorial: React.FC = () => {
  const { smoothProgress } = useScrollProgress();

  // Progress within range [0.770, 0.850]
  const subProg = clamp((smoothProgress - 0.770) / (0.850 - 0.770), 0, 1);
  const phraseIndex = Math.min(
    ANALYSIS_PHRASES.length - 1,
    Math.floor(subProg * ANALYSIS_PHRASES.length)
  );
  const currentPhrase = ANALYSIS_PHRASES[phraseIndex];

  return (
    <CinematicText
      startRange={0.770}
      endRange={0.850}
      fadeInSpan={0.018}
      fadeOutSpan={0.020}
      align="center-left"
      className="my-auto max-w-3xl"
    >

      <div className="space-y-6">
        {/* Small label */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
            AGENT SYSTEM
          </span>
        </div>

        {/* Large Statement */}
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            SEVEN<br />
            <span className="font-normal text-indigo-300">SPECIALISTS.</span>
          </h2>

          {/* Sequential Live Action Phrase (Appears one at a time) */}
          <div className="pt-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              <span className="text-xs md:text-sm font-mono tracking-[0.15em] text-orange-300 uppercase">
                {currentPhrase}...
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Specialist Pills */}
        <div className="flex flex-wrap gap-2 pt-2 max-w-lg">
          {AGENT_SPECIALISTS.map((spec, idx) => {
            const isHighlighted = idx <= phraseIndex;
            return (
              <span
                key={spec}
                className={`text-[10px] font-mono tracking-[0.15em] px-2.5 py-1 rounded-md transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-black/30 text-slate-500 border border-white/5'
                }`}
              >
                {spec}
              </span>
            );
          })}
        </div>
      </div>
    </CinematicText>
  );
};
