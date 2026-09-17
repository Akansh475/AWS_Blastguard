import React from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '../../context/ScrollContext';
import { clamp } from '../../utils/math';

interface CinematicTextProps {
  startRange: number;
  endRange: number;
  fadeInSpan?: number;
  fadeOutSpan?: number;
  className?: string;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'lower-left' | 'lower-right' | 'upper-right' | 'center-right' | 'center-left';
  parallaxFactor?: number;
  overflowHidden?: boolean;
}

export const CinematicText: React.FC<CinematicTextProps> = ({
  startRange,
  endRange,
  fadeInSpan = 0.020,
  fadeOutSpan = 0.020,
  className = '',
  children,
  align = 'left',
  parallaxFactor = 2.5,
  overflowHidden = false
}) => {
  const { smoothProgress, mouse } = useScrollProgress();

  if (smoothProgress < startRange - 0.005 || smoothProgress > endRange + 0.005) {
    return null;
  }

  // Calculate entry and exit progress
  let opacity = 1;
  let translateY = 0;
  let blurAmount = 0;

  const entryProgress = clamp((smoothProgress - startRange) / fadeInSpan, 0, 1);
  const exitProgress = clamp((endRange - smoothProgress) / fadeOutSpan, 0, 1);

  if (entryProgress < 1) {
    // ENTER: opacity 0 -> 1, translateY 30px -> 0, blur 8px -> 0
    opacity = entryProgress;
    translateY = (1 - entryProgress) * 30;
    blurAmount = (1 - entryProgress) * 8;
  } else if (exitProgress < 1) {
    // EXIT: opacity 1 -> 0, translateY 0 -> -20px, blur 0 -> 5px
    opacity = exitProgress;
    translateY = -(1 - exitProgress) * 20;
    blurAmount = (1 - exitProgress) * 5;
  }

  let alignClass = 'items-start text-left justify-center';
  switch (align) {
    case 'center':
      alignClass = 'items-center text-center justify-center';
      break;
    case 'right':
      alignClass = 'items-end text-right justify-center';
      break;
    case 'center-right':
      alignClass = 'items-end text-right justify-center md:pr-24 lg:pr-36';
      break;
    case 'center-left':
      alignClass = 'items-start text-left justify-center md:pl-20 lg:pl-32';
      break;
    case 'lower-left':
      alignClass = 'items-start text-left justify-end pb-16 md:pb-24 lg:pb-28';
      break;
    case 'lower-right':
      alignClass = 'items-end text-right justify-end pb-16 md:pb-24 lg:pb-28';
      break;
    case 'upper-right':
      alignClass = 'items-end text-right justify-start pt-20 md:pt-28';
      break;
    default:
      alignClass = 'items-start text-left justify-center';
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-20 flex flex-col p-6 sm:p-10 md:p-14 lg:p-20 ${
        overflowHidden ? 'overflow-hidden' : ''
      } ${alignClass}`}
      style={{
        transform: `translate3d(${mouse.x * parallaxFactor}px, ${mouse.y * parallaxFactor}px, 0)`
      }}
    >
      <div
        className={`pointer-events-auto select-none transition-all duration-75 ease-out ${className}`}
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          filter: `blur(${blurAmount}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};

