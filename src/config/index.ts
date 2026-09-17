import dotenv from 'dotenv';

dotenv.config();

export type BlastGuardMode = 'mock' | 'aws';

export interface AppConfig {
  port: number;
  awsRegion: string;
  mode: BlastGuardMode;
  frontendUrl: string;
  nodeEnv: string;
}

export function loadConfig(): AppConfig {
  const modeRaw = (process.env.BLASTGUARD_MODE || 'mock').toLowerCase();
  const mode: BlastGuardMode = modeRaw === 'aws' ? 'aws' : 'mock';

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    awsRegion: process.env.AWS_REGION || 'ap-south-1',
    mode,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

export const config: AppConfig = loadConfig();
