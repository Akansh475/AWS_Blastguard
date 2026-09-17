import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';
import { ArrowRight, RefreshCw, Play, Network } from 'lucide-react';
import { STATS } from '../../data/mockData';

export const FinalBrandEditorial: React.FC = () => {
  const { scrollToPhase } = useScrollProgress();

  return (
    <CinematicText
      startRange={0.965}
      endRange={1.0}
      fadeInSpan={0.015}
      fadeOutSpan={0.005}
      align="center-left"
      className="my-auto max-w-4xl"
    >
      <div className="space-y-6">
        {/* Refined Brand Signature */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-orange-400 font-semibold">
              {STATS.brand.name}
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-[0.95] text-editorial-gradient">
            AWS INFRASTRUCTURE<br />
            <span className="font-normal text-white">SAFETY GATE</span>
          </h2>

          <p className="text-base sm:text-lg font-light text-slate-300/90 pt-1">
            Understand the impact before the change.
          </p>
        </div>


        {/* Minimal Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
          <button
            onClick={() => {
              alert('Starting change simulation sweep...');
              scrollToPhase('CHANGE_REQUEST');
            }}
            className="px-6 py-3 rounded-full bg-white text-slate-950 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 transition-colors shadow-2xl"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>ANALYZE A CHANGE</span>
          </button>

          <button
            onClick={() => scrollToPhase('BLAST_RADIUS')}
            className="px-6 py-3 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/15 text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-900 transition-colors"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>VIEW INFRASTRUCTURE</span>
          </button>

          <button
            onClick={() => scrollToPhase('HERO')}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors ml-0 sm:ml-4 py-2"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Replay Film</span>
          </button>
        </div>
      </div>
    </CinematicText>
  );
};
