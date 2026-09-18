import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Section08SeeImpact: React.FC = () => {
  return (
    <CinematicText
      startRange={0.820}
      endRange={0.910}
      fadeInSpan={0.020}
      fadeOutSpan={0.020}
      align="center-left"
      className="my-auto w-full max-w-5xl"
    >
      <div className="space-y-4">
        {/* Micro-label */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400">
            AUTONOMOUS BLAST RADIUS PREDICTION
          </span>
        </div>

        {/* Editorial Headline */}
        <h2 className="text-[clamp(3.5rem,7.5vw,8rem)] font-light tracking-tight text-white leading-[0.94] select-none">
          SEE THE IMPACT<br />
          <span className="font-normal text-white">BEFORE EXECUTION.</span>
        </h2>
      </div>
    </CinematicText>
  );
};
