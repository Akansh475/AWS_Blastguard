import React from 'react';
import { Section01Hero } from '../overlay/Section01Hero';
import { Section02Connected } from '../overlay/Section02Connected';
import { Section03OneChange } from '../overlay/Section03OneChange';
import { Section04CanTravel } from '../overlay/Section04CanTravel';
import { Section05WhatBreaks } from '../overlay/Section05WhatBreaks';
import { Section06KnowFirst } from '../overlay/Section06KnowFirst';
import { Section07SafetyGate } from '../overlay/Section07SafetyGate';
import { Section08SeeImpact } from '../overlay/Section08SeeImpact';
import { Section09CommandCenterCTA } from '../overlay/Section09CommandCenterCTA';

export const StoryOverlays: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
      {/* SECTION 01: Hero (AWS Headquarters Lobby, BEFORE YOU CHANGE PRODUCTION, floating preview) */}
      <Section01Hero />

      {/* [Empty Visual Pause 1: 0.100 - 0.140] */}

      {/* SECTION 02: CLOUD INFRASTRUCTURE IS CONNECTED */}
      <Section02Connected />

      {/* [Empty Visual Pause 2: 0.220 - 0.260] */}

      {/* SECTION 03: ONE CHANGE */}
      <Section03OneChange />

      {/* SECTION 04: CAN TRAVEL FURTHER THAN EXPECTED */}
      <Section04CanTravel />

      {/* [Empty Visual Pause 3: 0.440 - 0.480] */}

      {/* SECTION 05: WHAT BREAKS? */}
      <Section05WhatBreaks />

      {/* SECTION 06: KNOW FIRST. */}
      <Section06KnowFirst />

      {/* [Empty Visual Pause 4: 0.680 - 0.720] */}

      {/* SECTION 07: BLASTGUARD AWS INFRASTRUCTURE SAFETY GATE */}
      <Section07SafetyGate />

      {/* SECTION 08: SEE THE IMPACT BEFORE EXECUTION */}
      <Section08SeeImpact />

      {/* SECTION 09: ENTER THE COMMAND CENTER → */}
      <Section09CommandCenterCTA />
    </div>
  );
};
