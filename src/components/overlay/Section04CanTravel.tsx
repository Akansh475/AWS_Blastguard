import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Section04CanTravel: React.FC = () => {
  return (
    <CinematicText
      startRange={0.340}
      endRange={0.440}
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
            CASCADE PROPAGATION
          </span>
        </div>

        {/* Editorial Headline */}
        <h2 className="text-[clamp(3.5rem,7.5vw,8rem)] font-light tracking-tight text-white leading-[0.94] select-none">
          CAN TRAVEL<br />
          <span className="text-orange-400 font-normal">FURTHER</span><br />
          THAN EXPECTED.
        </h2>
      </div>
    </CinematicText>
  );
};
