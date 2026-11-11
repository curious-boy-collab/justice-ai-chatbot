import express from 'express';
import { config } from './config/env.js';
import { corsMiddleware } from './middleware/corsConfig.js';
import { requestLogger } from './middleware/requestLogger.js';
import { createTimeoutMiddleware } from './middleware/timeoutHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/health.routes.js';
import chatRoutes from './routes/chat.routes.js';
import statsRoutes from './routes/stats.routes.js';
import caseRoutes from './routes/case.routes.js';
import documentRoutes from './routes/document.routes.js';

const app = express();

// Security, Parsing & Timeout Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(createTimeoutMiddleware(config.requestTimeoutMs));

// Mount API Routes
const apiPrefix = config.apiPrefix;
app.use(`${apiPrefix}/health`, healthRoutes);
app.use(`${apiPrefix}/chat`, chatRoutes);
app.use(`${apiPrefix}/stats`, statsRoutes);
app.use(`${apiPrefix}/cases`, caseRoutes);
app.use(`${apiPrefix}/documents`, documentRoutes);

// Root Index Route
app.get('/', (req, res) => {
  res.json({
    service: 'JusticeAI Backend API',
    description: 'Official AI-Powered Digital Assistant for Department of Justice, GoI',
    documentation: 'Refer to /contracts/api-contract.md',
    healthCheck: `${apiPrefix}/health`,
    endpoints: {
      health: `${apiPrefix}/health`,
      chat: `${apiPrefix}/chat`,
      stats: `${apiPrefix}/stats`,
      cases: `${apiPrefix}/cases`,
      documents: `${apiPrefix}/documents`
    }
  });
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`
    },
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
