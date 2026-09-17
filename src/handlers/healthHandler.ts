import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { sendSuccess } from '../utils/response';

export function getHealthHandler(_req: Request, res: Response, next: NextFunction): void {
  try {
    sendSuccess(res, {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'blastguard-core-api',
      version: '1.0.0',
      mode: config.mode,
      region: config.awsRegion,
      uptimeSeconds: Math.floor(process.uptime()),
    });
  } catch (err) {
    next(err);
  }
}
