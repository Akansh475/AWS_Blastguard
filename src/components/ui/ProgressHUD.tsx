import React from 'react';
import { useScrollProgress } from '../../context/ScrollContext';
import { ScenePhase } from '../../types';

interface ChapterConfig {
  id: ScenePhase;
  num: string;
  label: string;
}

const CHAPTERS: ChapterConfig[] = [
  { id: 'SECTION_01_HERO', num: '01', label: 'Opening' },
  { id: 'SECTION_02_CONNECTED', num: '02', label: 'Connected' },
  { id: 'SECTION_03_ONE_CHANGE', num: '03', label: 'One Change' },
  { id: 'SECTION_04_CAN_TRAVEL', num: '04', label: 'Propagation' },
  { id: 'SECTION_05_WHAT_BREAKS', num: '05', label: 'What Breaks?' },
  { id: 'SECTION_06_KNOW_FIRST', num: '06', label: 'Know First' },
  { id: 'SECTION_07_SAFETY_GATE', num: '07', label: 'Safety Gate' },
  { id: 'SECTION_08_SEE_IMPACT', num: '08', label: 'Impact' },
  { id: 'SECTION_09_COMMAND_CENTER', num: '09', label: 'Command Center' }
];

export const ProgressHUD: React.FC = () => {
  const { smoothProgress, activePhase, scrollToPhase } = useScrollProgress();

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex items-center gap-4 pointer-events-auto select-none font-mono opacity-25 hover:opacity-90 transition-opacity duration-300">
      {/* Chapter text items */}
      <div className="flex flex-col items-end space-y-1.5 py-2">
        <div className="text-[9px] tracking-[0.25em] text-slate-500 uppercase pb-1 flex items-center gap-2">
          <span>CHAPTERS</span>
          <span className="text-orange-400 font-medium">{Math.round(smoothProgress * 100)}%</span>
        </div>

        {CHAPTERS.map((c) => {
          const isActive = activePhase === c.id;
          return (
            <button
              key={c.id}
              onClick={() => scrollToPhase(c.id)}
              className={`group flex items-center justify-end gap-2 text-right transition-colors ${
                isActive
                  ? 'text-white font-medium'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-[9px] tracking-wider text-slate-600 group-hover:text-slate-400">
                {c.num}
              </span>
              <span className={`text-[10px] tracking-wide ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {c.label}
              </span>
              <span
                className={`w-1 h-1 rounded-full transition-all ${
                  isActive ? 'bg-orange-400 ring-2 ring-orange-400/50 scale-125' : 'bg-slate-700 group-hover:bg-slate-500'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Thin vertical track line */}
      <div className="relative w-[1px] h-48 bg-white/10 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 bg-orange-400/80 transition-all duration-75 ease-out"
          style={{ height: `${smoothProgress * 100}%` }}
        />
      </div>
    </div>
  );
};
