/**
 * JusticeAI – Backend-to-AI Service Bridge
 * Developer: Nitin (AI / RAG Developer) in coordination with Disha (Backend Developer)
 * Sprint: Day 2 — Core Chatbot Integration
 * 
 * Securely bridges Disha's Express controllers with Nitin's AI / RAG module.
 * Passes server-side GEMINI_API_KEY from backend config into the AI service.
 * Enforces timeout protection and graceful fallback.
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from '../config/env.js';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const aiModulePath = path.resolve(__dirname, '../../../ai/index.js');

let aiModule = null;

try {
  aiModule = require(aiModulePath);
} catch (err) {
  console.warn('[aiBridgeService] Warning: Could not load local AI module directly:', err.message);
}

/**
 * Executes a question through the AI / RAG pipeline with backend-configured API key and timeout protection
 * @param {string} message Citizen question
 * @param {string} [language] 'en' or 'hi'
 * @param {string} [sessionId] Session UUID
 * @param {number} [timeoutMs] Timeout in milliseconds (default: 15000ms)
 * @returns {Promise<{
 *   answer: string,
 *   language: string,
 *   sources: Array<{title: string, url: string}>,
 *   dataStatus: string,
 *   lastChecked: string,
 *   intent: string,
 *   cnr: string | null,
 *   metadata?: {
 *     modelUsed?: string,
 *     isLiveModel?: boolean,
 *     durationMs?: number
 *   }
 * }>}
 */
export async function queryJusticeAI(
  message,
  language = 'en',
  sessionId = null,
  timeoutMs = config.aiTimeoutMs || 15000
) {
  if (!aiModule) {
    throw new Error('AI Module is not available.');
  }

  const normalizedLang = language === 'hi' ? 'hi' : 'en';

  const queryPromise = aiModule.askJusticeAI(message, normalizedLang, {
    apiKey: config.geminiApiKey || process.env.GEMINI_API_KEY,
    sessionId,
  });

  if (!timeoutMs || timeoutMs <= 0) {
    return queryPromise;
  }

  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const timeoutError = new Error(`AI service request timed out after ${timeoutMs}ms`);
      timeoutError.code = 'AI_TIMEOUT';
      reject(timeoutError);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([queryPromise, timeoutPromise]);
    clearTimeout(timer);
    return result;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

export default {
  queryJusticeAI,
};
