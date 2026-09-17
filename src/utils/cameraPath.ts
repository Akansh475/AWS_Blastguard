import * as THREE from 'three';
import { clamp, lerp } from './math';

export interface CameraWaypoint {
  progress: number;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export const CAMERA_WAYPOINTS: CameraWaypoint[] = [
  // 1. Exterior (0% - 10%)
  { progress: 0.00, position: [0.0, 5.5, 52.0], target: [0.0, 4.0, 30.0], fov: 48 },
  { progress: 0.06, position: [0.0, 3.8, 44.0], target: [0.0, 3.0, 28.0], fov: 46 },
  { progress: 0.10, position: [0.0, 2.8, 36.0], target: [0.0, 2.2, 26.0], fov: 45 },

  // 2. Entrance & Grand Lobby (10% - 18%)
  { progress: 0.13, position: [0.0, 2.2, 29.0], target: [0.0, 2.0, 18.0], fov: 46 },
  { progress: 0.18, position: [0.0, 2.0, 21.0], target: [0.0, 1.9, 10.0], fov: 47 },

  // 3. Infrastructure Lab (18% - 30%)
  { progress: 0.22, position: [-1.2, 2.5, 14.0], target: [0.0, 1.8, 2.0], fov: 48 },
  { progress: 0.26, position: [-1.8, 2.8, 8.0],  target: [0.0, 1.7, 0.0], fov: 48 },
  { progress: 0.30, position: [-2.4, 2.4, 3.0],  target: [-0.5, 1.6, -1.0], fov: 47 },

  // 4. Dependency Lab (30% - 42%)
  { progress: 0.34, position: [-3.2, 2.1, -0.5], target: [-3.5, 1.4, -3.0], fov: 46 },
  { progress: 0.38, position: [-2.8, 2.0, -3.5], target: [-2.0, 1.5, -4.5], fov: 46 },
  { progress: 0.42, position: [-1.5, 2.0, -7.0], target: [0.0, 1.6, -12.0], fov: 47 },

  // 5. Security Operations (42% - 54%)
  { progress: 0.46, position: [-0.8, 2.2, -12.0], target: [0.0, 1.8, -18.0], fov: 48 },
  { progress: 0.50, position: [0.0, 2.1, -16.5],  target: [0.0, 1.7, -22.0], fov: 47 },
  { progress: 0.54, position: [0.8, 2.2, -20.5],  target: [0.0, 1.8, -27.0], fov: 48 },

  // 6. Operations & Observability (54% - 66%)
  { progress: 0.58, position: [1.2, 2.3, -25.0], target: [0.0, 1.9, -32.0], fov: 48 },
  { progress: 0.62, position: [0.5, 2.2, -29.5], target: [0.0, 1.8, -36.0], fov: 47 },
  { progress: 0.66, position: [0.0, 2.4, -35.0], target: [0.0, 2.0, -45.0], fov: 48 },

  // 7. Blast-Radius Simulation Chamber (66% - 82%)
  { progress: 0.70, position: [2.0, 3.2, -42.0],  target: [0.0, 1.8, -50.0], fov: 50 },
  { progress: 0.74, position: [2.8, 2.8, -48.0],  target: [0.0, 1.8, -50.0], fov: 50 },
  { progress: 0.78, position: [1.0, 2.6, -53.5],  target: [0.0, 1.8, -50.0], fov: 49 },
  { progress: 0.82, position: [-0.8, 2.3, -58.0], target: [0.0, 1.8, -66.0], fov: 48 },

  // 8. Governance (82% - 92%)
  { progress: 0.85, position: [-1.2, 2.2, -63.0], target: [0.0, 1.8, -72.0], fov: 47 },
  { progress: 0.88, position: [0.0, 2.1, -68.5],  target: [0.0, 1.7, -76.0], fov: 47 },
  { progress: 0.92, position: [0.0, 2.3, -74.0],  target: [0.0, 1.9, -82.0], fov: 48 },

  // 9. Central Command Center (92% - 100%)
  { progress: 0.95, position: [0.0, 2.5, -80.0],  target: [0.0, 2.0, -90.0], fov: 48 },
  { progress: 0.98, position: [0.0, 2.3, -86.0],  target: [0.0, 2.0, -94.0], fov: 48 },
  { progress: 1.00, position: [0.0, 2.2, -90.0],  target: [0.0, 2.0, -96.0], fov: 48 }
];

export function getCameraStateAtProgress(progress: number): {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
} {
  const p = clamp(progress, 0, 1);

  // Find surrounding waypoints
  let idx = 0;
  for (let i = 0; i < CAMERA_WAYPOINTS.length - 1; i++) {
    if (p >= CAMERA_WAYPOINTS[i].progress && p <= CAMERA_WAYPOINTS[i + 1].progress) {
      idx = i;
      break;
    }
  }

  const wpA = CAMERA_WAYPOINTS[idx];
  const wpB = CAMERA_WAYPOINTS[Math.min(idx + 1, CAMERA_WAYPOINTS.length - 1)];

  const range = wpB.progress - wpA.progress;
  const localT = range > 0 ? (p - wpA.progress) / range : 0;
  // Smooth easing for camera segments
  const easeT = localT * localT * (3 - 2 * localT);

  const posX = lerp(wpA.position[0], wpB.position[0], easeT);
  const posY = lerp(wpA.position[1], wpB.position[1], easeT);
  const posZ = lerp(wpA.position[2], wpB.position[2], easeT);

  const targetX = lerp(wpA.target[0], wpB.target[0], easeT);
  const targetY = lerp(wpA.target[1], wpB.target[1], easeT);
  const targetZ = lerp(wpA.target[2], wpB.target[2], easeT);

  const fovA = wpA.fov || 48;
  const fovB = wpB.fov || 48;
  const fov = lerp(fovA, fovB, easeT);

  return {
    position: new THREE.Vector3(posX, posY, posZ),
    target: new THREE.Vector3(targetX, targetY, targetZ),
    fov
  };
}
