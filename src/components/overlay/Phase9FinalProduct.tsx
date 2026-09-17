import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { ShieldAlert, Play, Network, RefreshCw } from 'lucide-react';
import { STATS } from '../../data/mockData';

export const Phase9FinalProduct: React.FC = () => {
  const { smoothProgress, mouse, scrollToPhase } = useScrollProgress();

  // Active range: 0.96 to 1.00
  const isVisible = smoothProgress >= 0.96;

  let opacity = 1;
  if (smoothProgress < 0.975) {
    opacity = (smoothProgress - 0.96) / 0.015;
  }
  opacity = Math.max(0, Math.min(1, opacity));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{
            opacity: opacity,
            scale: 1,
            y: 0,
            x: mouse.x * 3,
            transition: { duration: 0.4, ease: 'easeOut' }
          }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
          className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end items-center pb-8 px-6"
        >
          <div className="w-full max-w-lg pointer-events-auto rounded-3xl bg-slate-950/85 backdrop-blur-xl border border-white/15 p-6 shadow-2xl text-center space-y-4 ring-1 ring-white/10">
            {/* Logo & Headline */}
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-white">
                {STATS.brand.name}
              </h2>
            </div>

            <p className="text-sm md:text-base font-light text-slate-200">
              Before you change production,{' '}
              <span className="text-orange-400 font-semibold underline decoration-orange-500/40 underline-offset-4">
                know what will break.
              </span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  alert('Initiating new AWS Change Simulation Sweep...');
                  scrollToPhase('CHANGE_REQUEST');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-orange-950/50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>ANALYZE A CHANGE</span>
              </button>

              <button
                onClick={() => {
                  scrollToPhase('BLAST_RADIUS_TOPOLOGY');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>VIEW INFRASTRUCTURE</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-center">
              <button
                onClick={() => scrollToPhase('INTRO')}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replay Camera Experience</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
