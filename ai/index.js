/**
 * JusticeAI – AI / RAG Module Core Entry Point
 * Developer: Nitin (AI / RAG Developer)
 * Sprint: Day 2 — Core Chatbot Intelligence & Backend Coordination
 * 
 * Provides unified interface consumed by Disha's backend server.
 * Implements the AI_BACKEND_CONTRACT standard.
 */

require('dotenv').config();
const geminiService = require('./services/gemini_service');
const { retrieve, extractSourceCitations } = require('./retrieval/retriever');
const { analyzeQuery, INTENTS } = require('./retrieval/intent_classifier');

/**
 * Process a citizen query through the RAG pipeline
 * @param {string} query Citizen's natural language question
 * @param {string} [language] Preferred language ('en' or 'hi' or auto-detect)
 * @param {Object} [options] Optional parameters (apiKey, sessionId, topK)
 * @returns {Promise<{
 *   answer: string,
 *   language: string,
 *   sources: Array<{title: string, url: string}>,
 *   intent: string,
 *   detectedLang: string,
 *   cnr: string | null,
 *   dataStatus: string,
 *   lastChecked: string,
 *   metadata: {
 *     modelUsed: string,
 *     isLiveModel: boolean,
 *     durationMs: number
 *   }
 * }>} Standardized response payload
 */
async function askJusticeAI(query, language = null, options = {}) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    throw new Error('Query string cannot be empty.');
  }

  // 1. Configure API key dynamically if supplied by Disha's backend
  if (options.apiKey) {
    geminiService.setApiKey(options.apiKey);
  }

  // 2. Question understanding & intent classification
  const analysis = analyzeQuery(query);
  const resolvedLang = (language === 'hi' || language === 'en')
    ? language
    : (analysis.detectedLang === 'hi' || analysis.detectedLang === 'hi-Latn' ? 'hi' : 'en');

  // 3. Semantic retrieval of official knowledge records (if DoJ-relevant)
  let contextDocs = [];
  if (analysis.isDoJRelevant && analysis.intent !== INTENTS.GREETING && analysis.intent !== INTENTS.LEGAL_ADVICE_PROHIBITED) {
    const topK = options.topK || 3;
    contextDocs = await retrieve(query, topK);
  }

  // 4. Generate grounded response via Gemini service
  const aiResult = await geminiService.generateAnswer(query, contextDocs, resolvedLang, analysis);

  // 5. Extract verified source citations
  const sources = extractSourceCitations(contextDocs);

  // Determine data status
  let dataStatus = 'official_reference';
  if (analysis.intent === INTENTS.LEGAL_ADVICE_PROHIBITED || analysis.intent === INTENTS.OUT_OF_SCOPE) {
    dataStatus = 'guardrail_advisory';
  } else if (analysis.intent === INTENTS.CASE_STATUS && analysis.cnr) {
    dataStatus = 'procedural_guidance';
  }

  // 6. Return standardized contract payload
  return {
    answer: aiResult.answer,
    language: resolvedLang,
    sources,
    intent: analysis.intent,
    detectedLang: analysis.detectedLang,
    cnr: analysis.cnr,
    dataStatus,
    lastChecked: new Date().toISOString().split('T')[0],
    metadata: {
      modelUsed: aiResult.modelUsed,
      isLiveModel: aiResult.isLiveModel,
      durationMs: aiResult.durationMs,
    },
  };
}

module.exports = {
  askJusticeAI,
  geminiService,
  analyzeQuery,
  INTENTS,
};
