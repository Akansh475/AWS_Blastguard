import React from 'react';
import { ArrowRight, ShieldCheck, Terminal, Sparkles } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-28 sm:py-36 px-6 sm:px-10 lg:px-16 bg-[#07090e] border-t border-white/5 relative overflow-hidden">
      {/* Dynamic ambient backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto rounded-3xl apple-glass-card p-8 sm:p-14 md:p-16 text-center space-y-8 relative z-10 border border-white/15 shadow-2xl">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono tracking-[0.25em] uppercase text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-[#ff5c28]" />
          <span>AUTONOMOUS SAFETY GATE</span>
        </div>

        {/* Climax Headline */}
        <h2 className="text-[clamp(2.6rem,5.2vw,4.8rem)] font-light tracking-tight text-white leading-[0.98] select-none">
          SEE THE IMPACT.<br />
          <span className="font-normal text-white">BEFORE EXECUTION.</span>
        </h2>

        {/* Copy */}
        <p className="text-base sm:text-lg md:text-xl font-light text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join leading platform engineering teams preventing multi-million dollar AWS outages before code touches production.
        </p>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#live-preview"
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white hover:bg-[#ff5c28] text-slate-950 hover:text-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-2xl hover:shadow-orange-950/50 hover:-translate-y-0.5"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4 text-[#ff5c28] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
          </a>

          <button
            onClick={() => alert('Enterprise Technical Demo request registered. Our SRE team will reach out.')}
            className="w-full sm:w-auto apple-glass-button inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-white font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg shadow-black/20 hover:-translate-y-0.5"
          >
            <span>REQUEST DEMO</span>
          </button>
        </div>
      </div>
    </section>
  );
};
