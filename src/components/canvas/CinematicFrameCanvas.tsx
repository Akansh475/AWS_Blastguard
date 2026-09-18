import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FRAME_CONFIG, getFramePath } from '../../utils/frameConfig';
import { useScrollProgress } from '../../context/ScrollContext';
import { HeroOfficeBackground } from './HeroOfficeBackground';

export const CinematicFrameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentFrame, smoothProgress } = useScrollProgress();

  // Cache of loaded image elements
  const imageCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingSet = useRef<Set<number>>(new Set());
  const lastDrawnFrameRef = useRef<number>(1);

  // Helper to load a single frame
  const loadFrame = useCallback((frameIdx: number): Promise<HTMLImageElement> => {
    if (imageCache.current.has(frameIdx)) {
      return Promise.resolve(imageCache.current.get(frameIdx)!);
    }

    if (loadingSet.current.has(frameIdx)) {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (imageCache.current.has(frameIdx)) {
            clearInterval(check);
            resolve(imageCache.current.get(frameIdx)!);
          }
        }, 30);
      });
    }

    loadingSet.current.add(frameIdx);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = getFramePath(frameIdx);
      img.onload = () => {
        imageCache.current.set(frameIdx, img);
        loadingSet.current.delete(frameIdx);
        resolve(img);
      };
      img.onerror = () => {
        loadingSet.current.delete(frameIdx);
        reject(new Error(`Failed to load frame ${frameIdx}`));
      };
    });
  }, []);

  // Sliding window progressive loader
  useEffect(() => {
    const targetIdx = currentFrame;
    const windowSize = 12;
    const minFrame = Math.max(1, targetIdx - windowSize);
    const maxFrame = Math.min(FRAME_CONFIG.totalFrames, targetIdx + windowSize);

    const framesToLoad: number[] = [];
    for (let i = minFrame; i <= maxFrame; i++) {
      if (!imageCache.current.has(i) && !loadingSet.current.has(i)) {
        framesToLoad.push(i);
      }
    }

    framesToLoad.sort((a, b) => Math.abs(a - targetIdx) - Math.abs(b - targetIdx));

    framesToLoad.forEach((idx) => {
      loadFrame(idx).catch(() => {});
    });
  }, [currentFrame, loadFrame]);

  // Canvas Render Function with 4K Cover Scaling
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const targetFrame = currentFrame;
    let imgToDraw: HTMLImageElement | undefined = imageCache.current.get(targetFrame);

    if (!imgToDraw) {
      imgToDraw = imageCache.current.get(lastDrawnFrameRef.current);
    }

    if (!imgToDraw) return;

    lastDrawnFrameRef.current = targetFrame;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = imgToDraw.naturalWidth || FRAME_CONFIG.width;
    const ih = imgToDraw.naturalHeight || FRAME_CONFIG.height;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.drawImage(imgToDraw, nx, ny, nw, nh);
  }, [currentFrame]);

  // Resize canvas handling
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      renderCanvas();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [currentFrame, renderCanvas]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#07090e] select-none">
      {/* 1. Primary AWS Headquarters Lobby Hero Background */}
      <HeroOfficeBackground />

      {/* 2. Optional smooth canvas overlay that engages during deep camera flythrough */}
      {smoothProgress > 0.25 && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full object-cover pointer-events-none transition-opacity duration-700"
          style={{
            opacity: Math.min(0.85, (smoothProgress - 0.25) * 2),
            willChange: 'transform, opacity'
          }}
        />
      )}
    </div>
  );
};
