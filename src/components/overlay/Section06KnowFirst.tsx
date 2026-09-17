import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Section06KnowFirst: React.FC = () => {
  return (
    <CinematicText
      startRange={0.580}
      endRange={0.680}
      fadeInSpan={0.020}
      fadeOutSpan={0.020}
      align="center-left"
      className="my-auto w-full max-w-5xl"
    >
      <div className="space-y-4">
        {/* Micro-label */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400">
            INTELLIGENCE BEFORE ACTION
          </span>
        </div>

        {/* Editorial Headline */}
        <h2 className="text-[clamp(4.5rem,10vw,11rem)] font-light tracking-tight text-white leading-[0.92] select-none">
          KNOW<br />
          <span className="font-normal text-white">FIRST.</span>
        </h2>
      </div>
    </CinematicText>
  );
};
