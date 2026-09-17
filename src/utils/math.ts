export const clamp = (v: number, min: number = 0, max: number = 1): number => {
  return Math.min(max, Math.max(min, v));
};

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

export const smoothstep = (min: number, max: number, value: number): number => {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
};

export const smootherstep = (min: number, max: number, value: number): number => {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

export interface SegmentState {
  enter: number;
  exit: number;
  active: number;
}

export const segmentInOut = (
  progress: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number
): SegmentState => {
  const enter = smoothstep(enterStart, enterEnd, progress);
  const exit = smoothstep(exitStart, exitEnd, progress);
  const active = enter * (1 - exit);
  return { enter, exit, active };
};
