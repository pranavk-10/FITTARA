import { Router, Request, Response } from 'express';
import { sessionStore } from '../store/session-store.js';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    product: 'FIT3D Engine',
    uptimeSeconds: Math.floor(process.uptime()),
    activeEphemeralSessions: sessionStore.getActiveCount(),
    privacyAudit: 'STRICT_NO_PERSISTENT_DATA',
    timestamp: new Date().toISOString(),
  });
});
