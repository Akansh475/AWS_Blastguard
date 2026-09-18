import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const Scene02Change: React.FC = () => {
  return (
    <CinematicText
      startRange={0.120}
      endRange={0.200}
      fadeInSpan={0.018}
      fadeOutSpan={0.020}
      align="center-right"
      overflowHidden={true}
      className="my-auto w-full max-w-6xl text-right"
    >
      <div className="space-y-3 sm:space-y-4 inline-block">
        {/* Micro-label */}
        <div className="flex items-center justify-end gap-2.5">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400">
            PRODUCTION ENVIRONMENT
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>

        {/* Hero Word: CHANGE. (Right-leaning, visual tension with BEFORE) */}
        <div className="-mr-2 sm:-mr-4 lg:-mr-6">
          <h2 className="text-[14vw] font-extralight tracking-tighter text-white leading-none text-editorial-gradient select-none">
            CHANGE.
          </h2>
        </div>
      </div>
    </CinematicText>
  );
};
