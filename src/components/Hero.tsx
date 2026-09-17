import React from 'react';
import { ArrowRight, ShieldAlert, Sparkles, Terminal, Activity, Layers } from 'lucide-react';
import { ProductPreviewCard } from './ProductPreviewCard';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center pt-28 pb-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* 1. Full-Resolution AWS Headquarters Hero Image (Exact user file) */}
      <img
        src="/hero-bg.png"
        alt="AWS Headquarters Architecture"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none select-none"
      />

      {/* 2. Tuned Lighting & Contrast Vignettes (Subtle left-side shading to keep text crisp while letting sunlight, wood slats, AWS logo, and mountains shine) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/25 z-10 pointer-events-none" />

      {/* Subtle fine AR matrix pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] z-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* 3. Hero Content Container */}
      <div className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center py-6 sm:py-12">
        {/* Left Column: Headline, Eyebrow, Supporting Text, Action CTAs (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-7 sm:space-y-8 pr-2 sm:pr-6">
          {/* Live Digital Twin Status Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/15 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#ff5c28] animate-pulse" />
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.22em] text-slate-200">
              AWS INFRASTRUCTURE SAFETY GATE
            </span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="text-[11px] font-mono text-cyan-300 hidden sm:inline font-semibold">
              Live Digital Twin
            </span>
          </div>

          {/* Large Clean Apple-Style Headline */}
          <h1 className="text-[clamp(3.2rem,6.4vw,6.8rem)] font-light tracking-tight leading-[0.94] text-white drop-shadow-md select-none">
            BEFORE YOU<br />
            <span className="font-normal text-white">CHANGE PRODUCTION.</span>
          </h1>

          {/* Supporting Statement with Rich Architecture Context */}
          <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-200/90 leading-relaxed max-w-xl drop-shadow-sm">
            Simulate blast radius, discover hidden cloud dependencies, and enforce Cedar policies before code executes.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4">
            <a
              href="#live-preview"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-2xl hover:shadow-orange-500/20 shadow-black/40 hover:-translate-y-0.5"
            >
              <span>EXPLORE BLASTGUARD</span>
              <ArrowRight className="w-4 h-4 text-[#ff5c28] group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            <a
              href="#problem"
              className="apple-glass-button inline-flex items-center gap-2 px-7 py-4 rounded-full text-white font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg shadow-black/30 hover:-translate-y-0.5"
            >
              <span>HOW IT WORKS</span>
            </a>
          </div>

          {/* Micro Trust & Telemetry Strip */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Downtime Pre-Flight</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-AZ Dependency Discovery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Single Floating Glass Product Preview Card (Cols 8-12) */}
        <div className="lg:col-span-5 flex justify-start lg:justify-end items-center pt-2 lg:pt-0">
          <ProductPreviewCard />
        </div>
      </div>
    </section>
  );
};
