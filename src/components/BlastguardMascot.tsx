import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, ShieldCheck, Activity, Sparkles } from 'lucide-react';

export const BlastguardMascot: React.FC = () => {
  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[480px] aspect-[4/5] mx-auto flex items-center justify-center select-none">
      {/* 1. Subtle Pale Peach Background Organic Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] bg-[#FDE8D4]/70 rounded-full blur-2xl pointer-events-none -z-10"
      />
      <div className="absolute top-10 right-4 w-36 h-36 bg-[#FFE3CD]/80 rounded-full blur-xl pointer-events-none -z-10" />

      {/* 2. Floating Mascot Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: [0, -10, 0],
          scale: 1
        }}
        transition={{
          opacity: { duration: 0.8, ease: 'easeOut' },
          scale: { duration: 0.8, ease: 'easeOut' },
          y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }
        }}
        className="relative w-[280px] sm:w-[340px] md:w-[380px] flex flex-col items-center z-10"
      >
        {/* Crisp Vector Mascot SVG */}
        <img
          src="/mascot.svg"
          alt="BlastGuard AWS Mascot"
          className="w-full h-auto drop-shadow-sm select-none pointer-events-none"
        />

        {/* Soft Warm Cream/Orange Contact Shadow */}
        <div className="w-[200px] sm:w-[240px] h-6 bg-gradient-to-r from-transparent via-[#E88214]/20 to-transparent rounded-full blur-md mt-1" />
      </motion.div>

      {/* 3. Subtle Supporting Visual Elements around Mascot (Minimal, playful, mostly visual) */}
      {/* Top-Left: Small Minimal Cloud Outline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{ duration: 0.7, delay: 0.3, y: { repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 } }}
        className="absolute top-8 left-4 sm:left-6 p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#F99E1C]/30 shadow-sm text-[#111111]"
      >
        <Cloud className="w-5 h-5 text-[#F99E1C]" />
      </motion.div>

      {/* Top-Right: Simple Shield Check Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, y: [0, 6, 0] }}
        transition={{ duration: 0.7, delay: 0.4, y: { repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 1 } }}
        className="absolute top-12 right-2 sm:right-6 p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#F99E1C]/30 shadow-sm text-[#111111]"
      >
        <ShieldCheck className="w-5 h-5 text-[#F99E1C]" />
      </motion.div>

      {/* Bottom-Left: Simple Analytics / Pulse Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
        transition={{ duration: 0.7, delay: 0.5, y: { repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 1.5 } }}
        className="absolute bottom-16 left-2 sm:left-8 p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#F99E1C]/30 shadow-sm text-[#111111]"
      >
        <Activity className="w-4 h-4 text-[#F99E1C]" />
      </motion.div>

      {/* Sparkles / Tiny Accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute top-24 right-20 text-[#F99E1C]"
      >
        <Sparkles className="w-4 h-4 fill-current" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-28 right-10 text-[#F99E1C]"
      >
        <Sparkles className="w-3.5 h-3.5 fill-current" />
      </motion.div>

      {/* Subtle Dotted Connector Line SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none -z-5 stroke-[#F99E1C]/35">
        <path
          d="M 60 70 Q 110 40 180 60"
          fill="none"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
        <path
          d="M 320 85 Q 360 140 340 220"
          fill="none"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
      </svg>
    </div>
  );
};
