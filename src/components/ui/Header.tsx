import React, { useState } from 'react';
import { useScrollProgress } from '../../context/ScrollContext';
import { ArrowRight, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { scrollToPhase, smoothProgress, openDashboard } = useScrollProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Slightly increase background translucency as user scrolls
  const isScrolled = smoothProgress > 0.04;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 md:px-14 py-5 pointer-events-auto select-none transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-950/45 backdrop-blur-md border-b border-white/[0.06] shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* LEFT: Brand + Divider + Tagline */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => {
            scrollToPhase('SECTION_01_HERO');
            setMobileMenuOpen(false);
          }}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
          <span className="text-xs sm:text-[13px] font-mono font-medium tracking-[0.28em] uppercase text-white group-hover:text-orange-400 transition-colors">
            BLASTGUARD
          </span>
        </button>

        {/* Small Elegant Divider */}
        <span className="hidden sm:inline-block w-px h-3.5 bg-white/20" aria-hidden="true" />

        {/* Subtitle */}
        <span className="hidden sm:inline-block text-[10px] md:text-[11px] font-mono tracking-[0.22em] uppercase text-slate-400/90 font-light">
          INFRASTRUCTURE SAFETY FOR AWS
        </span>
      </div>

      {/* RIGHT: Minimal Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[11px] font-mono tracking-[0.2em] uppercase">
        <button
          onClick={() => scrollToPhase('SECTION_07_SAFETY_GATE')}
          className="text-slate-300 hover:text-white transition-colors tracking-[0.2em]"
        >
          PRODUCT
        </button>
        <button
          onClick={() => scrollToPhase('SECTION_02_CONNECTED')}
          className="text-slate-300 hover:text-white transition-colors tracking-[0.2em]"
        >
          HOW IT WORKS
        </button>
        <button
          onClick={openDashboard}
          className="text-slate-200 hover:text-orange-400 transition-colors tracking-[0.2em] font-medium"
        >
          DASHBOARD
        </button>
        <button
          onClick={openDashboard}
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-orange-500 text-white hover:text-slate-950 transition-all duration-300 border border-white/15 hover:border-orange-400"
        >
          <span className="font-semibold tracking-[0.2em]">GET STARTED</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4 text-xs font-mono tracking-[0.2em] uppercase shadow-2xl">
          <button
            onClick={() => {
              scrollToPhase('SECTION_07_SAFETY_GATE');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-slate-300 hover:text-white"
          >
            PRODUCT
          </button>
          <button
            onClick={() => {
              scrollToPhase('SECTION_02_CONNECTED');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-slate-300 hover:text-white"
          >
            HOW IT WORKS
          </button>
          <button
            onClick={() => {
              openDashboard();
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-orange-400 font-semibold"
          >
            DASHBOARD
          </button>
          <button
            onClick={() => {
              openDashboard();
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-orange-500 text-slate-950 font-bold"
          >
            <span>GET STARTED</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
