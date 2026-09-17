import React from 'react';
import { CinematicText } from '../story/CinematicText';

export const SignatureQuestionEditorial: React.FC = () => {
  return (
    <CinematicText
      startRange={0.44}
      endRange={0.54}
      fadeInSpan={0.025}
      fadeOutSpan={0.025}
      align="center"
      className="my-auto max-w-4xl px-4"
    >
      <div className="space-y-6">
        {/* Massive Centered Editorial Question */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-light tracking-tight text-white leading-[1.02] text-editorial-gradient">
          WHAT IF<br />
          YOU COULD KNOW<br />
          <span className="font-normal text-white">BEFORE YOU CHANGE IT?</span>
        </h2>
      </div>
    </CinematicText>
  );
};
