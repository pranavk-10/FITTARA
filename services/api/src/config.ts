import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  sessionTtlSeconds: parseInt(process.env.SESSION_TTL_SECONDS || '900', 10), // 15 mins default
  cleanupIntervalSeconds: parseInt(process.env.CLEANUP_INTERVAL_SECONDS || '30', 10),
  maxBodyPayloadMb: parseInt(process.env.MAX_BODY_PAYLOAD_MB || '20', 10),
};
