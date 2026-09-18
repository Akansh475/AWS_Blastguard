export const FRAME_CONFIG = {
  frameDirectory: '/frames/',
  prefix: 'frame_',
  extension: 'jpg',
  totalFrames: 150,
  padLength: 4,
  width: 3840,
  height: 2164
};

/**
 * Returns the exact public asset URL for a frame index (1-indexed).
 * Example: index 7 -> '/frames/frame_0007.jpg'
 */
export function getFramePath(index: number): string {
  const clampedIndex = Math.max(1, Math.min(FRAME_CONFIG.totalFrames, Math.round(index)));
  const paddedIndex = String(clampedIndex).padStart(FRAME_CONFIG.padLength, '0');
  return `${FRAME_CONFIG.frameDirectory}${FRAME_CONFIG.prefix}${paddedIndex}.${FRAME_CONFIG.extension}`;
}
