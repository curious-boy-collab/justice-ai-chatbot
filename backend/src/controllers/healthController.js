/**
 * System Health & Diagnostics Controller
 * Developer: Disha (Backend Developer)
 * Sprint: Day 5 & 6 — Integration, Security & Production Hardening
 */

import { config } from '../config/env.js';

export function getHealth(req, res) {
  const uptime = process.uptime();

  res.status(200).json({
    status: 'healthy',
    version: '1.0.0',
    service: 'justiceai-backend',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime * 100) / 100,
    environment: config.nodeEnv,
    geminiConfigured: Boolean(config.geminiApiKey),
    modules: {
      chat: 'active',
      njdgService: 'active',
      judgeService: 'active',
      eCourtsService: 'active',
      dojService: 'active',
      documentService: 'active',
      ragRetriever: 'active',
      rateLimiter: 'active',
      securityHeaders: 'active'
    }
  });
}
