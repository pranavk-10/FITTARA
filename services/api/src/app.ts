import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config.js';
import { privacySafeLogger } from './middleware/logging.js';
import { errorHandler } from './middleware/error-handler.js';
import { sessionRouter } from './routes/session-routes.js';
import { healthRouter } from './routes/health-routes.js';

export function createApp(): Express {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: [config.corsOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // Parse JSON payloads up to configured limit for base64 image data URLs
  app.use(express.json({ limit: `${config.maxBodyPayloadMb}mb` }));

  // Strict privacy-safe request logging
  app.use(privacySafeLogger);

  // Mount API endpoints
  app.use('/v1/health', healthRouter);
  app.use('/v1/sessions', sessionRouter);

  // Centralized error handling
  app.use(errorHandler);

  return app;
}
