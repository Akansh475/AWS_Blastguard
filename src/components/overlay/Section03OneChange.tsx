import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Section03OneChange: React.FC = () => {
  return (
    <CinematicText
      startRange={0.260}
      endRange={0.340}
      fadeInSpan={0.020}
      fadeOutSpan={0.020}
      align="center-left"
      className="my-auto w-full max-w-6xl"
    >
      <div className="space-y-4">
        {/* Micro-label */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400">
            SYSTEM TRIGGER
          </span>
        </div>

        {/* Editorial Headline */}
        <h2 className="text-[clamp(4.5rem,10vw,11rem)] font-extralight tracking-tighter text-white leading-none select-none">
          ONE <span className="font-light text-amber-300/90">CHANGE.</span>
        </h2>
      </div>
    </CinematicText>
  );
};
