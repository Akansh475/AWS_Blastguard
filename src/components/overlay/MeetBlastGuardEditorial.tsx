import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';

export const MeetBlastGuardEditorial: React.FC = () => {
  const { smoothProgress } = useScrollProgress();

  const isPartTwo = smoothProgress >= 0.38;

  return (
    <CinematicText
      startRange={0.32}
      endRange={0.44}
      fadeInSpan={0.02}
      fadeOutSpan={0.025}
      align="left"
      className="my-auto max-w-3xl"
    >
      <div className="space-y-4">
        {/* Small label */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
            MEET BLASTGUARD
          </span>
        </div>

        {/* Large Statement */}
        {!isPartTwo ? (
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            A SAFETY GATE<br />
            <span className="font-normal text-white">FOR PRODUCTION.</span>
          </h2>
        ) : (
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
              BEFORE<br />
              <span className="font-normal text-orange-400">THE CHANGE.</span>
            </h2>

            {/* Small supporting line */}
            <p className="text-sm md:text-base font-light text-slate-300/85 max-w-lg leading-relaxed pt-1">
              BlastGuard maps dependencies, evaluates impact, and stops unsafe infrastructure changes.
            </p>
          </div>
        )}
      </div>
    </CinematicText>
  );
};
