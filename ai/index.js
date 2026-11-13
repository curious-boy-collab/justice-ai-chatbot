/**
 * JusticeAI – AI / RAG Module Core Entry Point
 * Developer: Nitin (AI / RAG Developer)
 * Sprint: Day 3 — RAG Implementation & Knowledge Base Integration
 * 
 * Provides unified interface consumed by Disha's backend server.
 * Implements the AI_BACKEND_CONTRACT standard:
 * - PDF and Text document ingestion
 * - Vector store management
 * - Semantic retrieval with thresholding
 * - Grounded contextual generation with official government citations
 * - Graceful fallback when no relevant document is found
 */

require('dotenv').config();
const geminiService = require('./services/gemini_service');
const { retrieve, extractSourceCitations, DEFAULT_SIMILARITY_THRESHOLD } = require('./retrieval/retriever');
const { analyzeQuery, INTENTS } = require('./retrieval/intent_classifier');
const vectorStore = require('./retrieval/vector_store');
const { loadAllDocuments, loadAllDocumentsAsync } = require('./ingestion/document_loader');

/**
 * Process a citizen query through the RAG pipeline
 * @param {string} query Citizen's natural language question
 * @param {string} [language] Preferred language ('en' or 'hi' or auto-detect)
 * @param {Object} [options] Optional parameters (apiKey, sessionId, topK, threshold)
 * @returns {Promise<{
 *   answer: string,
 *   language: string,
 *   sources: Array<{title: string, url: string, category: string, format: string, relevanceScore: number, snippet: string}>,
 *   intent: string,
 *   detectedLang: string,
 *   cnr: string | null,
 *   dataStatus: string,
 *   lastChecked: string,
 *   metadata: {
 *     modelUsed: string,
 *     isLiveModel: boolean,
 *     isFallback: boolean,
 *     topScore: number,
 *     retrievedCount: number,
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

  // 3. Semantic retrieval of official knowledge records
  let contextDocs = [];
  let hasMatches = false;
  let topScore = 0;

  if (analysis.isDoJRelevant && analysis.intent !== INTENTS.GREETING && analysis.intent !== INTENTS.LEGAL_ADVICE_PROHIBITED && analysis.intent !== INTENTS.OUT_OF_SCOPE) {
    const topK = options.topK || 3;
    const threshold = options.threshold || DEFAULT_SIMILARITY_THRESHOLD;
    const retrievalResult = await retrieve(query, topK, threshold);
    contextDocs = retrievalResult.documents;
    hasMatches = retrievalResult.hasMatches;
    topScore = retrievalResult.topScore;
  }

  // 4. Generate grounded response via Gemini service
  const aiResult = await geminiService.generateAnswer(query, contextDocs, resolvedLang, analysis, hasMatches);

  // 5. Extract verified source citations (with titles and official URLs)
  const sources = extractSourceCitations(contextDocs);

  // Determine data status
  let dataStatus = 'official_reference';
  if (analysis.intent === INTENTS.LEGAL_ADVICE_PROHIBITED || analysis.intent === INTENTS.OUT_OF_SCOPE) {
    dataStatus = 'guardrail_advisory';
  } else if (!hasMatches && contextDocs.length === 0) {
    dataStatus = 'fallback_guidance';
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
      isFallback: aiResult.isFallback || false,
      topScore,
      retrievedCount: contextDocs.length,
      durationMs: aiResult.durationMs,
    },
  };
}

module.exports = {
  askJusticeAI,
  geminiService,
  vectorStore,
  retrieve,
  analyzeQuery,
  loadAllDocuments,
  loadAllDocumentsAsync,
  INTENTS,
};
