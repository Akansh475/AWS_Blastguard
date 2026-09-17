import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Scene03WhatBreaks: React.FC = () => {
  return (
    <CinematicText
      startRange={0.230}
      endRange={0.320}
      fadeInSpan={0.018}
      fadeOutSpan={0.020}
      align="lower-left"
      overflowHidden={true}
      className="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Micro-label */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400">
            DEPENDENCY IMPACT
          </span>
        </div>

        {/* Two-Line Architectural Headline: WHAT / BREAKS? */}
        <h2 className="text-[10vw] font-light tracking-tight text-white leading-[0.92] text-editorial-gradient select-none">
          WHAT<br />
          <span className="font-normal text-white/95">BREAKS?</span>
        </h2>
      </div>
    </CinematicText>
  );
};
