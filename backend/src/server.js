import app from './app.js';
import { config } from './config/env.js';

const server = app.listen(config.port, () => {
  console.log('========================================================');
  console.log(`🏛️  JusticeAI Backend Server running on port ${config.port}`);
  console.log(`🌐 Environment: ${config.nodeEnv}`);
  console.log(`🩺 Health check: http://localhost:${config.port}${config.apiPrefix}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${config.port}${config.apiPrefix}/chat`);
  console.log('========================================================');
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('JusticeAI server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default server;
