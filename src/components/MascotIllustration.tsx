import React from 'react';
import { motion } from 'framer-motion';

export const MascotIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[620px] aspect-[1.3/1] mx-auto select-none flex items-center justify-center">
      {/* 1. Background Soft Sunny Yellow Glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[85%] h-[85%] rounded-full bg-[#FFE79A]/40 blur-2xl" />
      </div>

      {/* 2. Floating Surrounding Cards Layer */}
      {/* Top-Left Floating Card: Shield */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="absolute top-[2%] left-[16%] sm:left-[18%] z-20 pointer-events-none"
      >
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-[#F6E2B3] shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-2 -rotate-3">
          <div className="w-7 h-7 rounded-lg bg-[#F89C26] flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#F89C26" />
              <polyline points="9 12 11 14 15 10" stroke="white" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="w-9 h-1.5 bg-[#E2E8F0] rounded-full" />
            <div className="w-6 h-1.5 bg-[#E2E8F0] rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Top-Right Floating Card: Cloud */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5, delay: 0.5, ease: 'easeInOut' }}
        className="absolute top-[6%] right-[2%] sm:right-[4%] z-20 pointer-events-none"
      >
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-[#F6E2B3] shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-2 rotate-6">
          <div className="w-7 h-7 rounded-lg bg-[#FFF7E6] border border-[#F89C26]/30 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#F89C26]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="w-10 h-1.5 bg-[#E2E8F0] rounded-full" />
            <div className="w-7 h-1.5 bg-[#E2E8F0] rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Bottom-Left Floating Card: Bar Chart (Shifted so it does not overlap the water bottle) */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4.2, delay: 1, ease: 'easeInOut' }}
        className="absolute -bottom-[6%] left-[4%] sm:left-[8%] z-20 pointer-events-none"
      >
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-[#F6E2B3] shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-2 -rotate-3">
          <div className="flex items-end gap-1 h-5 shrink-0 px-0.5">
            <div className="w-1.5 h-2.5 bg-[#F89C26] rounded-sm" />
            <div className="w-1.5 h-4 bg-[#F89C26] rounded-sm" />
            <div className="w-1.5 h-5 bg-[#F89C26] rounded-sm" />
          </div>
          <div className="space-y-1">
            <div className="w-8 h-1.5 bg-[#E2E8F0] rounded-full" />
            <div className="w-5 h-1.5 bg-[#E2E8F0] rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* 3. MAIN HERO MASCOT ILLUSTRATION */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="relative z-10 w-full flex items-center justify-center"
      >
        <img
          src="/assets/stretch-hero.png"
          alt="Stretch Plan Deploy Safely Mascot"
          className="w-full h-auto object-contain filter drop-shadow-[0_16px_32px_rgba(248,156,38,0.22)]"
        />
      </motion.div>
    </div>
  );
};
