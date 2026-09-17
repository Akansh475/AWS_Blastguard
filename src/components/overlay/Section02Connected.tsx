import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Section02Connected: React.FC = () => {
  return (
    <CinematicText
      startRange={0.140}
      endRange={0.220}
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
            AWS INFRASTRUCTURE TOPOLOGY
          </span>
        </div>

        {/* Editorial Headline */}
        <h2 className="text-[clamp(3.5rem,7vw,7.5rem)] font-light tracking-tight text-white leading-[0.95] select-none">
          CLOUD<br />
          INFRASTRUCTURE<br />
          <span className="font-normal text-white">IS CONNECTED.</span>
        </h2>
      </div>
    </CinematicText>
  );
};
