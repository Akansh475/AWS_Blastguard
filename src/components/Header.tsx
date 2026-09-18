import React, { useState } from 'react';
import { ArrowRight, Menu, X, Shield, Terminal } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-12 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-2.5 rounded-full bg-slate-950/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40">
        {/* Left: Brand + Subtitle */}
        <div className="flex items-center gap-3.5">
          <a href="#" className="flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-[#ff5c28] group-hover:scale-125 transition-transform" />
            <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.25em] uppercase text-white group-hover:text-orange-400 transition-colors">
              BLASTGUARD
            </span>
          </a>

          <span className="hidden md:inline-block w-px h-3.5 bg-white/20" aria-hidden="true" />

          <span className="hidden md:inline-block text-[11px] font-mono tracking-wider uppercase text-slate-400">
            AWS Infrastructure Safety
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slate-300">
          <a
            href="#problem"
            className="hover:text-white transition-colors duration-200"
          >
            The Risk
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors duration-200"
          >
            Capabilities
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors duration-200"
          >
            How it Works
          </a>
          <a
            href="#live-preview"
            className="hover:text-white transition-colors duration-200"
          >
            Live Simulation
          </a>
        </nav>

        {/* Right Action CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#live-preview"
            className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#ff5c28] text-white hover:text-slate-950 text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-300 border border-white/15 hover:border-orange-400"
          >
            <span>Command Center</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:text-slate-950 group-hover:translate-x-1 transition-all duration-300" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 p-5 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/10 flex flex-col gap-3.5 text-xs font-mono tracking-wider uppercase text-slate-300 shadow-2xl">
          <a
            href="#problem"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-white py-1.5"
          >
            The Risk
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-white py-1.5"
          >
            Capabilities
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-white py-1.5"
          >
            How it Works
          </a>
          <a
            href="#live-preview"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-white py-1.5"
          >
            Live Simulation
          </a>
          <a
            href="#live-preview"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 py-3 mt-1 rounded-xl bg-[#ff5c28] text-slate-950 font-bold"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
};
