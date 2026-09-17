import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { ShieldAlert, ChevronDown } from 'lucide-react';
import { STATS } from '../../data/mockData';

export const Phase1Intro: React.FC = () => {
  const { smoothProgress, mouse } = useScrollProgress();

  const isVisible = smoothProgress >= 0.0 && smoothProgress <= 0.13;
  const opacity = smoothProgress < 0.09 ? 1 : Math.max(0, 1 - (smoothProgress - 0.09) / 0.04);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: opacity,
            y: 0,
            x: mouse.x * 3,
            transition: { duration: 0.4, ease: 'easeOut' }
          }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
          className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end items-center pb-10 px-6"
        >
          <div className="flex flex-col items-center gap-3 max-w-xl text-center">
            <div className="px-6 py-4 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
                  {STATS.brand.name}
                </h1>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">
                  {STATS.brand.subtitle}
                </span>
              </div>

              <p className="text-xs md:text-sm font-light text-slate-300">
                Before you change production,{' '}
                <span className="text-orange-400 font-semibold underline decoration-orange-500/40 underline-offset-4">
                  know what will break.
                </span>
              </p>
            </div>

            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-sm border border-white/10 text-[11px] font-mono text-slate-400"
            >
              <span>Scroll to control camera</span>
              <ChevronDown className="w-3.5 h-3.5 text-orange-400" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
