import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Scene04Connected: React.FC = () => {
  return (
    <CinematicText
      startRange={0.350}
      endRange={0.440}
      fadeInSpan={0.018}
      fadeOutSpan={0.020}
      align="lower-left"
      className="max-w-2xl pb-6 md:pb-12"
    >
      <div className="space-y-2">
        {/* Micro-label */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">
            AWS / AP-SOUTH-1
          </span>
        </div>

        {/* Quiet, delicate statement letting the environment breathe */}
        <p className="text-base sm:text-lg md:text-xl font-light tracking-[0.18em] uppercase text-slate-300/90 font-mono">
          PRODUCTION IS CONNECTED.
        </p>
      </div>
    </CinematicText>
  );
};
