import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';
import { clamp } from '../../utils/math';

export const BlastRadiusEditorial: React.FC = () => {
  const { smoothProgress } = useScrollProgress();

  const subProg = clamp((smoothProgress - 0.850) / (0.915 - 0.850), 0, 1);

  // 4 progressive statements
  const showPart2 = subProg >= 0.28;
  const showPart3 = subProg >= 0.55;
  const showPart4 = subProg >= 0.80;

  return (
    <CinematicText
      startRange={0.850}
      endRange={0.915}
      fadeInSpan={0.015}
      fadeOutSpan={0.018}
      align="center-left"
      className="my-auto max-w-3xl"
    >

      <div className="space-y-4">
        {/* Small label */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
            BLAST RADIUS
          </span>
        </div>

        {/* Dynamic Progressive Headline */}
        {!showPart2 && (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            ONE<br />
            <span className="font-normal text-white">CHANGE.</span>
          </h2>
        )}

        {showPart2 && !showPart3 && (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            ELEVEN<br />
            <span className="font-normal text-amber-400">DEPENDENCIES.</span>
          </h2>
        )}

        {showPart3 && !showPart4 && (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            THREE<br />
            <span className="font-normal text-red-400">CRITICAL SERVICES.</span>
          </h2>
        )}

        {showPart4 && (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            ONE<br />
            <span className="font-normal text-orange-400">DECISION.</span>
          </h2>
        )}
      </div>
    </CinematicText>
  );
};
