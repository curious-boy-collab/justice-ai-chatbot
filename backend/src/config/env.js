import dotenv from 'dotenv';
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigins: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'],
  aiTimeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '15000', 10),
  requestTimeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS || '20000', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '120', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  geminiApiKey: process.env.GEMINI_API_KEY || ''
};
