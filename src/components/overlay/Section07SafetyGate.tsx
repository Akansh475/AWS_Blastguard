import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Section07SafetyGate: React.FC = () => {
  return (
    <CinematicText
      startRange={0.720}
      endRange={0.820}
      fadeInSpan={0.020}
      fadeOutSpan={0.020}
      align="center-left"
      className="my-auto w-full max-w-4xl"
    >
      <div className="space-y-6">
        {/* Brand signature */}
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-orange-400 font-semibold">
            BLASTGUARD
          </span>
        </div>

        {/* Title */}
        <h2 className="text-[clamp(2.8rem,5.5vw,5.5rem)] font-light tracking-tight text-white leading-[0.96] select-none">
          AWS INFRASTRUCTURE<br />
          <span className="font-normal text-white">SAFETY GATE</span>
        </h2>

        {/* Supporting sentence */}
        <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-300/90 leading-relaxed max-w-lg">
          Understand the impact<br />
          before execution.
        </p>
      </div>
    </CinematicText>
  );
};
