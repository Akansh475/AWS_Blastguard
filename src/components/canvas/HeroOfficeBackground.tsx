import React from 'react';
import { useScrollProgress } from '../../context/ScrollContext';

export const HeroOfficeBackground: React.FC = () => {
  const { smoothProgress, mouse, reduceMotion } = useScrollProgress();

  // Slow scale: 1.00 -> 1.04 across the scroll journey
  const scale = reduceMotion ? 1 : 1 + smoothProgress * 0.04;
  
  // Subtle parallax drift
  const translateY = reduceMotion ? 0 : -smoothProgress * 18 + mouse.y * 6;
  const translateX = reduceMotion ? 0 : mouse.x * 6;

  // Very subtle darkening only when transitioning deep into late story phases
  const backdropDim = Math.min(0.35, smoothProgress * 0.4);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#07090e] select-none pointer-events-none">
      {/* High-Resolution AWS Headquarters Lobby Hero Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 ease-out will-change-transform"
        style={{
          backgroundImage: `url('/assets/lobby.jpg')`,
          transform: `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0px)`,
        }}
      />

      {/* Subtle Neutral Gradient Overlay — Carefully tuned to preserve sunlight, glass, AWS branding & mountain view */}
      {/* Left-side subtle shadow for editorial text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent z-10" />

      {/* Very delicate top & bottom vignettes */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-10" />

      {/* Dynamic phase dimming for late-stage focus */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-500 z-10"
        style={{ opacity: backdropDim }}
      />

      {/* Fine architectural scanline & grid texture (subtle AR layer) */}
      <div
        className="absolute inset-0 opacity-[0.025] z-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};
