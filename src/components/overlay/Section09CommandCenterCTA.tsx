import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';
import { ArrowRight, RefreshCw, LayoutDashboard } from 'lucide-react';

export const Section09CommandCenterCTA: React.FC = () => {
  const { openDashboard, scrollToPhase } = useScrollProgress();

  return (
    <CinematicText
      startRange={0.910}
      endRange={1.000}
      fadeInSpan={0.020}
      fadeOutSpan={0.005}
      align="center-left"
      className="my-auto w-full max-w-5xl"
    >
      <div className="space-y-8">
        {/* Micro-label */}
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-orange-400 font-semibold">
            BLASTGUARD COMMAND CENTER
          </span>
        </div>

        {/* Large Editorial Action Headline */}
        <h2 className="text-[clamp(3.5rem,7.5vw,7.5rem)] font-light tracking-tight text-white leading-[0.95] select-none">
          ENTER THE<br />
          <span className="font-normal text-white">COMMAND CENTER.</span>
        </h2>

        <p className="text-base sm:text-lg md:text-xl font-light text-slate-300/90 max-w-xl">
          Live digital twin, multi-agent dependency discovery, and real-time Cedar governance.
        </p>

        {/* Interactive CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
          <button
            onClick={openDashboard}
            className="group px-8 py-4 rounded-full bg-white hover:bg-orange-500 text-slate-950 hover:text-slate-950 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-300 shadow-2xl"
          >
            <LayoutDashboard className="w-4 h-4 text-orange-600 group-hover:text-slate-950 transition-colors" />
            <span>ENTER THE COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={() => scrollToPhase('SECTION_01_HERO')}
            className="flex items-center gap-2 px-5 py-4 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors ml-0 sm:ml-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Replay Story</span>
          </button>
        </div>
      </div>
    </CinematicText>
  );
};
