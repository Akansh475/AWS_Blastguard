import React from 'react';
import { CinematicText } from '../story/CinematicText';
import { useScrollProgress } from '../../context/ScrollContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const HeroEditorial: React.FC = () => {
  const { smoothProgress } = useScrollProgress();

  // Scroll indicator only visible before user starts moving
  const showScrollCue = smoothProgress < 0.04;

  return (
    <>
      <CinematicText
        startRange={0.0}
        endRange={0.12}
        fadeInSpan={0.02}
        fadeOutSpan={0.03}
        align="left"
        className="my-auto max-w-4xl"
      >
        <div className="space-y-4">
          {/* Small refined label */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
              AWS INFRASTRUCTURE SAFETY
            </span>
          </div>

          {/* Elegant Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-light tracking-tight text-white leading-[0.92] text-editorial-gradient">
            BEFORE YOU<br />
            CHANGE PRODUCTION,<br />
            <span className="text-white/90 font-normal">KNOW WHAT<br />WILL BREAK.</span>
          </h1>

          {/* Restrained Brand Signature */}
          <div className="pt-2">
            <span className="text-sm md:text-base font-light tracking-[0.2em] uppercase text-orange-400/90 font-mono">
              BLASTGUARD
            </span>
          </div>
        </div>
      </CinematicText>

      {/* Disappearing minimal scroll cue */}
      <AnimatePresence>
        {showScrollCue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2 text-slate-400"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400">
              SCROLL
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-4 h-4 text-orange-400/80" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
