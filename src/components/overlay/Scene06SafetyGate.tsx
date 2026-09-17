import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Scene06SafetyGate: React.FC = () => {
  return (
    <CinematicText
      startRange={0.590}
      endRange={0.680}
      fadeInSpan={0.018}
      fadeOutSpan={0.020}
      align="center-left"
      className="my-auto max-w-3xl"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Brand signature (Small but highly refined) */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-orange-400 font-semibold">
            BLASTGUARD
          </span>
        </div>

        {/* Title */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-[0.98] text-editorial-gradient">
          AWS INFRASTRUCTURE<br />
          <span className="font-normal text-white">SAFETY GATE</span>
        </h2>

        {/* Very short supporting sentence */}
        <p className="text-base sm:text-lg md:text-xl font-light text-slate-300/85 leading-relaxed max-w-lg">
          Understand the impact<br />
          before the change.
        </p>
      </div>
    </CinematicText>
  );
};
