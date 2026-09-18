import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';

export const AWSContextEditorial: React.FC = () => {
  const { smoothProgress } = useScrollProgress();

  const isPartTwo = smoothProgress >= 0.255 && smoothProgress < 0.285;
  const isPartThree = smoothProgress >= 0.285;

  return (
    <CinematicText
      startRange={0.22}
      endRange={0.32}
      fadeInSpan={0.02}
      fadeOutSpan={0.025}
      align="right"
      className="my-auto max-w-3xl"
    >
      <div className="space-y-4 text-right">
        {/* Small label */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
            AWS CLOUD
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        </div>

        {/* Dynamic Short Statements */}
        {!isPartTwo && !isPartThree && (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            THOUSANDS<br />
            <span className="font-normal text-white">OF RESOURCES.</span>
          </h2>
        )}

        {isPartTwo && (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            ONE<br />
            DEPENDENCY<br />
            <span className="font-normal text-amber-400">MISSED.</span>
          </h2>
        )}

        {isPartThree && (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            A CASCADE<br />
            <span className="font-normal text-red-400">BEGINS.</span>
          </h2>
        )}
      </div>
    </CinematicText>
  );
};
