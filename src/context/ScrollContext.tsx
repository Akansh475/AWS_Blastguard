import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ScenePhase } from '../types';
import { clamp, lerp } from '../utils/math';
import { FRAME_CONFIG } from '../utils/frameConfig';

interface ScrollContextType {
  progress: number;
  smoothProgress: number;
  currentFrame: number;
  mouse: { x: number; y: number };
  activePhase: ScenePhase;
  phaseProgress: number;
  scrollToProgress: (p: number) => void;
  scrollToPhase: (phase: ScenePhase) => void;
  totalFrames: number;
  reduceMotion: boolean;
  activeView: 'landing' | 'dashboard';
  setActiveView: (view: 'landing' | 'dashboard') => void;
  openDashboard: () => void;
  closeDashboard: () => void;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export const PHASE_RANGES: Record<string, [number, number]> = {
  // 9 Core Editorial Sections
  SECTION_01_HERO: [0.000, 0.100],
  // Empty Visual Moment 1: 0.100 - 0.140 (pure architecture)
  SECTION_02_CONNECTED: [0.140, 0.220],
  // Empty Visual Moment 2: 0.220 - 0.260 (pure architecture)
  SECTION_03_ONE_CHANGE: [0.260, 0.340],
  SECTION_04_CAN_TRAVEL: [0.340, 0.440],
  // Empty Visual Moment 3: 0.440 - 0.480 (pure architecture)
  SECTION_05_WHAT_BREAKS: [0.480, 0.580],
  SECTION_06_KNOW_FIRST: [0.580, 0.680],
  // Empty Visual Moment 4: 0.680 - 0.720 (pure architecture)
  SECTION_07_SAFETY_GATE: [0.720, 0.820],
  SECTION_08_SEE_IMPACT: [0.820, 0.910],
  SECTION_09_COMMAND_CENTER: [0.910, 1.000],

  // Aliases for navigation & backwards compatibility
  HERO: [0.000, 0.100],
  SCENE_BEFORE: [0.000, 0.100],
  SCENE_CHANGE: [0.260, 0.340],
  SCENE_WHAT_BREAKS: [0.480, 0.580],
  SCENE_CONNECTED: [0.140, 0.220],
  SCENE_KNOW_FIRST: [0.580, 0.680],
  SCENE_SAFETY_GATE: [0.720, 0.820],
  MEET_BLASTGUARD: [0.720, 0.820],
  CHANGE_REQUEST: [0.820, 0.910],
  FINAL_DECISION: [0.910, 1.000],
  FINAL_BRAND: [0.910, 1.000]
};

export const PRIMARY_EDITORIAL_PHASES: ScenePhase[] = [
  'SECTION_01_HERO',
  'SECTION_02_CONNECTED',
  'SECTION_03_ONE_CHANGE',
  'SECTION_04_CAN_TRAVEL',
  'SECTION_05_WHAT_BREAKS',
  'SECTION_06_KNOW_FIRST',
  'SECTION_07_SAFETY_GATE',
  'SECTION_08_SEE_IMPACT',
  'SECTION_09_COMMAND_CENTER'
];

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activePhase, setActivePhase] = useState<ScenePhase>('SECTION_01_HERO');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeView, setActiveView] = useState<'landing' | 'dashboard'>('landing');

  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const rawProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const p = scrollHeight > 0 ? clamp(currentScroll / scrollHeight, 0, 1) : 0;
      rawProgressRef.current = p;
      setProgress(p);
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    handleScroll();

    let rafId: number;
    const tick = () => {
      if (reduceMotion) {
        smoothProgressRef.current = rawProgressRef.current;
        currentMouseRef.current = { x: 0, y: 0 };
      } else {
        // High-end cinematic scrubbing lerp factor
        smoothProgressRef.current = lerp(smoothProgressRef.current, rawProgressRef.current, 0.08);
        currentMouseRef.current.x = lerp(currentMouseRef.current.x, targetMouseRef.current.x, 0.05);
        currentMouseRef.current.y = lerp(currentMouseRef.current.y, targetMouseRef.current.y, 0.05);
      }

      const sp = smoothProgressRef.current;
      setSmoothProgress(sp);
      setMouse({ ...currentMouseRef.current });

      const frameIdx = Math.max(
        1,
        Math.min(FRAME_CONFIG.totalFrames, Math.round(sp * (FRAME_CONFIG.totalFrames - 1)) + 1)
      );
      setCurrentFrame(frameIdx);

      // Determine active story phase
      for (const phase of PRIMARY_EDITORIAL_PHASES) {
        const range = PHASE_RANGES[phase];
        if (range && sp >= range[0] && sp <= range[1]) {
          setActivePhase(phase);
          const span = range[1] - range[0];
          setPhaseProgress(span > 0 ? clamp((sp - range[0]) / span, 0, 1) : 0);
          break;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  const scrollToProgress = (targetP: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetP * scrollHeight,
      behavior: 'smooth'
    });
  };

  const scrollToPhase = (phase: ScenePhase) => {
    const range = PHASE_RANGES[phase] || [0, 0];
    scrollToProgress(range[0] + 0.005);
  };

  const openDashboard = () => {
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const closeDashboard = () => {
    setActiveView('landing');
  };

  return (
    <ScrollContext.Provider
      value={{
        progress,
        smoothProgress,
        currentFrame,
        mouse,
        activePhase,
        phaseProgress,
        scrollToProgress,
        scrollToPhase,
        totalFrames: FRAME_CONFIG.totalFrames,
        reduceMotion,
        activeView,
        setActiveView,
        openDashboard,
        closeDashboard
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollProgress = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollProgress must be used within a ScrollProvider');
  }
  return context;
};
