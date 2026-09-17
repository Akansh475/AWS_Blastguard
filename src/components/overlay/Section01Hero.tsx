import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Trash2, AlertTriangle } from 'lucide-react';
import { STATS } from '../../data/mockData';

export const Section01Hero: React.FC = () => {
  const { smoothProgress, scrollToPhase, openDashboard } = useScrollProgress();
  const showScrollCue = smoothProgress < 0.035;

  return (
    <>
      <CinematicText
        startRange={0.000}
        endRange={0.100}
        fadeInSpan={0.015}
        fadeOutSpan={0.025}
        align="left"
        className="my-auto w-full max-w-7xl pt-16 md:pt-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
          {/* LEFT: Large Editorial Typography integrated with Architecture (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8 pr-4">
            {/* Small Label */}
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.3em] text-slate-300/90 font-medium">
                AWS / INFRASTRUCTURE SAFETY
              </span>
            </div>

            {/* Main Headline: Thin/Light Editorial Stack */}
            <h1 className="text-[clamp(3.5rem,7.5vw,9.5rem)] font-light tracking-tight leading-[0.92] text-white select-none">
              BEFORE YOU<br />
              CHANGE<br />
              <span className="font-extralight text-slate-300/80">PRODUCTION.</span>
            </h1>

            {/* Supporting Line */}
            <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-200/90 tracking-wide max-w-xl">
              Know what will break.
            </p>

            {/* CTA */}
            <div className="pt-2 sm:pt-4 flex items-center gap-4">
              <button
                onClick={() => scrollToPhase('SECTION_02_CONNECTED')}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 font-mono text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 border border-white/20 hover:border-white shadow-2xl backdrop-blur-md"
              >
                <span>EXPLORE BLASTGUARD</span>
                <ArrowRight className="w-4 h-4 text-orange-400 group-hover:text-slate-950 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* LOWER-RIGHT / CENTER-RIGHT: Single Translucent Floating Glass Panel Preview (Cols 9-12) */}
          <div className="lg:col-span-4 flex justify-end items-end pt-6 lg:pt-0">
            <div className="w-full max-w-sm rounded-2xl bg-slate-950/45 backdrop-blur-xl border border-white/15 p-5 sm:p-6 text-slate-200 shadow-2xl space-y-4 hover:border-white/30 transition-all duration-300 group">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-400 font-semibold">
                    CHANGE REQUEST
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-[9px] font-mono text-red-300 font-bold tracking-wider uppercase flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  HIGH RISK
                </span>
              </div>

              {/* Target */}
              <div className="space-y-1">
                <p className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  Action
                </p>
                <p className="text-xl sm:text-2xl font-mono font-light text-white">
                  <span className="text-red-400 font-normal">Delete </span>
                  {STATS.changeRequest.target}
                </p>
              </div>

              {/* AWS Meta line */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono text-slate-300">
                <span>AWS</span>
                <span className="text-slate-600">·</span>
                <span className="text-orange-300">{STATS.changeRequest.region}</span>
                <span className="text-slate-600">·</span>
                <span className="text-red-300 font-medium">{STATS.changeRequest.environment}</span>
              </div>

              {/* Action */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={openDashboard}
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider uppercase text-orange-400 group-hover:text-orange-300 transition-colors"
                >
                  <span>ANALYZE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <span className="text-[10px] font-mono text-slate-500">
                  Pre-flight check
                </span>
              </div>
            </div>
          </div>
        </div>
      </CinematicText>

      {/* Discreet disappearing scroll cue (Secondary subtle control) */}
      <AnimatePresence>
        {showScrollCue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2 text-slate-400 select-none"
          >
            <span className="text-[10px] font-mono tracking-[0.28em] uppercase text-slate-400">
              SCROLL TO EXPLORE
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-4 h-4 text-orange-400/90" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
