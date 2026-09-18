import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Section05WhatBreaks: React.FC = () => {
  return (
    <CinematicText
      startRange={0.480}
      endRange={0.580}
      fadeInSpan={0.020}
      fadeOutSpan={0.020}
      align="center-left"
      className="my-auto w-full max-w-5xl"
    >
      <div className="space-y-4">
        {/* Micro-label */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-red-400 font-semibold">
            DEPENDENCY RISK
          </span>
        </div>

        {/* Editorial Headline */}
        <h2 className="text-[clamp(4.5rem,9.5vw,10.5rem)] font-light tracking-tight text-white leading-[0.92] select-none">
          WHAT<br />
          <span className="font-normal text-red-400">BREAKS?</span>
        </h2>
      </div>
    </CinematicText>
  );
};
