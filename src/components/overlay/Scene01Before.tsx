import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const Scene01Before: React.FC = () => {
  const { smoothProgress } = useScrollProgress();
  const showScrollCue = smoothProgress < 0.03;

  return (
    <>
      <CinematicText
        startRange={0.000}
        endRange={0.090}
        fadeInSpan={0.015}
        fadeOutSpan={0.020}
        align="center-left"
        overflowHidden={true}
        className="my-auto w-full max-w-6xl"
      >
        <div className="space-y-3 sm:space-y-4">
          {/* Micro-label */}
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400">
              AWS / INFRASTRUCTURE SAFETY
            </span>
          </div>

          {/* Enormous Hero Word: BEFORE (Interacting with architecture, partially cropped) */}
          <div className="-ml-2 sm:-ml-4 lg:-ml-6">
            <h1 className="text-[14vw] font-extralight tracking-tighter text-white leading-none text-editorial-gradient select-none">
              BEFORE
            </h1>
          </div>
        </div>
      </CinematicText>

      {/* Discreet disappearing scroll cue */}
      <AnimatePresence>
        {showScrollCue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2 text-slate-400"
          >
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-slate-400">
              SCROLL
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-orange-400/80" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
