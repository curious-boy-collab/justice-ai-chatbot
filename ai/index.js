/**
 * JusticeAI – AI / RAG Module Core Entry Point
 * Developer: Nitin (AI / RAG Developer)
 * 
 * Provides unified interface consumed by Disha's backend server.
 * Implements the AI_BACKEND_CONTRACT standard.
 */

require('dotenv').config();
const geminiService = require('./services/gemini_service');
const { retrieve, extractSourceCitations } = require('./retrieval/retriever');

/**
 * Process a citizen query through the RAG pipeline
 * @param {string} query Citizen's natural language question
 * @param {string} language Preferred language ('en' or 'hi')
 * @returns {Promise<{
 *   answer: string,
 *   language: string,
 *   sources: Array<{title: string, url: string}>,
 *   dataStatus: string,
 *   lastChecked: string
 * }>} Standardized response payload
 */
async function askJusticeAI(query, language = 'en') {
  if (!query || typeof query !== 'string' || !query.trim()) {
    throw new Error('Query string cannot be empty.');
  }

  const normalizedLang = language === 'hi' ? 'hi' : 'en';

  // 1. Semantic retrieval of official knowledge records
  const contextDocs = await retrieve(query, 3);

  // 2. Generate grounded response via Gemini service
  const aiResult = await geminiService.generateAnswer(query, contextDocs, normalizedLang);

  // 3. Extract verified source citations
  const sources = extractSourceCitations(contextDocs);

  // 4. Return standard contract payload
  return {
    answer: aiResult.answer,
    language: normalizedLang,
    sources,
    dataStatus: 'official_reference',
    lastChecked: new Date().toISOString().split('T')[0],
  };
}

module.exports = {
  askJusticeAI,
  geminiService,
};
