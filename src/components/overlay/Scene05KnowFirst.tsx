import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Scene05KnowFirst: React.FC = () => {
  return (
    <CinematicText
      startRange={0.470}
      endRange={0.560}
      fadeInSpan={0.018}
      fadeOutSpan={0.020}
      align="center-left"
      overflowHidden={true}
      className="my-auto max-w-5xl"
    >
      <div className="space-y-4">
        {/* Micro-label */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400">
            INFRASTRUCTURE SAFETY
          </span>
        </div>

        {/* Conceptual Hook: KNOW / FIRST. */}
        <h2 className="text-[11vw] font-light tracking-tight text-white leading-[0.92] text-editorial-gradient select-none">
          KNOW<br />
          <span className="font-normal text-white">FIRST.</span>
        </h2>
      </div>
    </CinematicText>
  );
};
