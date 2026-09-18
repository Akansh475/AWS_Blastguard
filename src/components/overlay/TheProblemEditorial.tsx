import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';

export const TheProblemEditorial: React.FC = () => {
  const { smoothProgress } = useScrollProgress();

  // Sub-progression for the two short statements
  const isPartTwo = smoothProgress >= 0.17;

  return (
    <CinematicText
      startRange={0.12}
      endRange={0.22}
      fadeInSpan={0.02}
      fadeOutSpan={0.025}
      align="left"
      className="my-auto max-w-3xl"
    >
      <div className="space-y-4">
        {/* Small label */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
            THE PROBLEM
          </span>
        </div>

        {/* Large Statement with subtle progression */}
        {!isPartTwo ? (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            CLOUD<br />
            INFRASTRUCTURE<br />
            <span className="font-normal text-white/95">IS CONNECTED.</span>
          </h2>
        ) : (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            ONE CHANGE<br />
            CAN TRAVEL<br />
            <span className="font-normal text-orange-400/95">MUCH FURTHER</span><br />
            THAN EXPECTED.
          </h2>
        )}
      </div>
    </CinematicText>
  );
};
