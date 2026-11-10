/**
 * JusticeAI – Backend-to-AI Service Bridge
 * Developer: Nitin (AI / RAG Developer) in coordination with Disha (Backend Developer)
 * Sprint: Day 2 — Core Chatbot Integration
 * 
 * Securely bridges Disha's Express controllers with Nitin's AI / RAG module.
 * Passes server-side GEMINI_API_KEY from backend config into the AI service.
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
 * Executes a question through the AI / RAG pipeline with backend-configured API key
 * @param {string} message Citizen question
 * @param {string} [language] 'en' or 'hi'
 * @param {string} [sessionId] Session UUID
 * @returns {Promise<{
 *   answer: string,
 *   language: string,
 *   sources: Array<{title: string, url: string}>,
 *   dataStatus: string,
 *   lastChecked: string,
 *   intent: string,
 *   cnr: string | null
 * }>}
 */
export async function queryJusticeAI(message, language = 'en', sessionId = null) {
  if (!aiModule) {
    throw new Error('AI Module is not available.');
  }

  // Pass server-side Gemini API key securely
  return aiModule.askJusticeAI(message, language, {
    apiKey: config.geminiApiKey || process.env.GEMINI_API_KEY,
    sessionId,
  });
}

export default {
  queryJusticeAI,
};
