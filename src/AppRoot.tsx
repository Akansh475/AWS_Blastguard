import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MascotIllustration } from './components/MascotIllustration';
import { BlastGuardDashboardView } from './components/dashboard/BlastGuardDashboardView';

export const AppRoot: React.FC = () => {
  // Client-side route state: '/' or '/dashboard'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/dashboard' ? '/dashboard' : '/';
    }
    return '/';
  });

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname === '/dashboard' ? '/dashboard' : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Client-side navigation helper
  const navigateTo = (path: '/' | '/dashboard') => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  // If on /dashboard route, render the Apple-style glassmorphic Dashboard
  if (currentPath === '/dashboard') {
    return <BlastGuardDashboardView onNavigateHome={() => navigateTo('/')} />;
  }

  return (
    <div className="min-h-screen bg-[#FEF4CD] text-[#111111] flex flex-col justify-between selection:bg-[#F89C26]/40 selection:text-[#111111] overflow-x-hidden relative">
      {/* ========================================================================= */}
      {/* 0. BACKGROUND TEXTURE IMAGE & SOFT SUNNY ATMOSPHERE */}
      {/* ========================================================================= */}
      <div
        className="fixed inset-0 pointer-events-none bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url('/assets/dashboard-bg.png')` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[12%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#FFE799]/40 blur-3xl" />
        <div className="absolute top-[35%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#FEE08B]/30 blur-3xl" />
        <div className="absolute -bottom-[12%] left-[15%] w-[45vw] h-[45vw] rounded-full bg-[#FFDF78]/25 blur-3xl" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER (Brand Icon + BLASTGUARD | ENTER →) */}
      {/* ========================================================================= */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-8 sm:pt-10 flex items-center justify-between relative z-10">
        {/* Top-Left: Mascot Brand Icon + BLASTGUARD */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => navigateTo('/')}
        >
          <div className="w-9 h-10 flex items-center justify-center shrink-0">
            <img
              src="/mascot-icon.svg"
              alt="BlastGuard Mascot Icon"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-base sm:text-lg font-black tracking-[0.16em] uppercase text-[#111111]">
            BLASTGUARD
          </span>
        </motion.div>

        {/* Top-Right: Rounded Orange Pill Button (ENTER →) */}
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          onClick={() => navigateTo('/dashboard')}
          className="group px-6 sm:px-7 py-2.5 rounded-full bg-[#F89C26] hover:bg-[#E88B0E] text-[#111111] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-98"
        >
          <span>ENTER</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </motion.button>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN HERO SECTION (EXACT COMPOSITION MATCHING APPROVED HOME PAGE) */}
      {/* ========================================================================= */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative z-10">
        {/* Left Column: Bold Headline, Subtitle, Pill Button (Cols 1-6) */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 pr-0 lg:pr-4 z-10">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.4rem,7vw,6.2rem)] font-extrabold tracking-tight leading-[0.93] text-[#111111] select-none"
          >
            Before you<br />
            change<br />
            <span className="text-[#F89C26]">production.</span>
          </motion.h1>

          {/* Supporting Statement */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="text-2xl sm:text-3xl md:text-[2rem] font-medium text-[#444444] tracking-tight"
          >
            Know what will break.
          </motion.p>

          {/* Primary Action Button (ENTER BLASTGUARD →) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
            className="pt-2 sm:pt-4"
          >
            <button
              onClick={() => navigateTo('/dashboard')}
              className="group px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#F89C26] hover:bg-[#E88B0E] text-[#111111] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2.5 cursor-pointer active:scale-98"
            >
              <span>ENTER BLASTGUARD</span>
              <ArrowRight className="w-4 sm:w-4.5 h-4 sm:h-4.5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: Clean Mascot Illustration with Floating Cards (Cols 7-12) */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end items-center">
          <MascotIllustration />
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. SUBTLE BOTTOM PADDING */}
      {/* ========================================================================= */}
      <div className="h-4 sm:h-6 relative z-10" />
    </div>
  );
};

export default AppRoot;
