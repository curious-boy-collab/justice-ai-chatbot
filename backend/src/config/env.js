import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigins: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'],
  databaseUrl: process.env.DATABASE_URL || '',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  geminiApiKey: process.env.GEMINI_API_KEY || ''
};
