import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 FIT3D Engine API listening on http://localhost:${config.port}`);
  console.log(`🔒 Privacy Policy: Strict Ephemeral Sessions with TTL`);
  console.log(`⏱️ Session TTL: ${config.sessionTtlSeconds}s | GC Interval: ${config.cleanupIntervalSeconds}s`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
