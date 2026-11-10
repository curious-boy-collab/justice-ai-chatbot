/**
 * JusticeAI – Backend-to-AI Service Bridge
 * Developer: Disha (Backend Developer) in coordination with Nitin (AI / RAG Developer)
 * Sprint: Day 3 — RAG Implementation, Source Metadata & Data Freshness
 * 
 * Securely bridges Disha's Express controllers with Nitin's AI / RAG module.
 * Passes server-side GEMINI_API_KEY from backend config into the AI service.
 * Enforces timeout protection, rich source metadata extraction, and data freshness metrics.
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from '../config/env.js';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const aiModulePath = path.resolve(__dirname, '../../../ai/index.js');
const retrieverPath = path.resolve(__dirname, '../../../ai/retrieval/retriever.js');

let aiModule = null;
let retriever = null;

try {
  aiModule = require(aiModulePath);
  retriever = require(retrieverPath);
} catch (err) {
  console.warn('[aiBridgeService] Warning: Could not load local AI module directly:', err.message);
}

/**
 * Standard Data Freshness Metadata definition for DoJ records
 */
export const OFFICIAL_DATA_FRESHNESS = {
  lastUpdated: '2026-11-10',
  sourceStatus: 'verified_official',
  asOfDate: '2026-03-01',
  cacheStatus: 'live',
  disclaimer: 'Official information grounded in Ministry of Law & Justice, NJDG, and eCourts documentation. Not formal legal advice.'
};

/**
 * Executes a question through the AI / RAG pipeline with backend-configured API key and timeout protection
 * @param {string} message Citizen question
 * @param {string} [language] 'en' or 'hi'
 * @param {string} [sessionId] Session UUID
 * @param {Object} [options] Additional query options { topK, timeoutMs }
 * @returns {Promise<{
 *   answer: string,
 *   language: string,
 *   sources: Array<{title: string, label: string, url: string, category?: string, snippet?: string, relevanceScore?: number}>,
 *   citations: Array<{sourceTitle: string, url: string, snippet?: string, category?: string}>,
 *   dataStatus: string,
 *   dataFreshness: Object,
 *   lastChecked: string,
 *   intent: string,
 *   cnr: string | null,
 *   metadata?: {
 *     modelUsed?: string,
 *     isLiveModel?: boolean,
 *     durationMs?: number,
 *     chunksRetrieved?: number
 *   }
 * }>}
 */
export async function queryJusticeAI(
  message,
  language = 'en',
  sessionId = null,
  options = {}
) {
  if (!aiModule) {
    throw new Error('AI Module is not available.');
  }

  const normalizedLang = language === 'hi' ? 'hi' : 'en';
  const timeoutMs = options.timeoutMs || config.aiTimeoutMs || 15000;
  const topK = Math.max(1, Math.min(parseInt(options.topK, 10) || 3, 10));

  const startTime = Date.now();

  const queryPromise = (async () => {
    // 1. Ask Nitin's AI pipeline
    const rawResult = await aiModule.askJusticeAI(message, normalizedLang, {
      apiKey: config.geminiApiKey || process.env.GEMINI_API_KEY,
      sessionId,
      topK,
    });

    // 2. Fetch enriched retrieved chunks if retriever is available
    let retrievedChunks = [];
    if (retriever) {
      try {
        retrievedChunks = await retriever.retrieve(message, topK);
      } catch {
        // use fallback chunks from rawResult
      }
    }

    // 3. Build rich source metadata with category, snippet, and relevance scores
    const enrichedSources = [];
    const seenUrls = new Set();

    if (retrievedChunks && retrievedChunks.length > 0) {
      for (const chunk of retrievedChunks) {
        const url = chunk.metadata?.url || 'https://doj.gov.in';
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          const snippetText = chunk.content
            ? chunk.content
                .replace(/#{1,6}\s+/g, '')
                .replace(/>\s*\*\*/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 220) + '...'
            : '';

          enrichedSources.push({
            title: chunk.metadata?.title || 'Department of Justice',
            label: chunk.metadata?.title || 'Department of Justice',
            url,
            category: chunk.metadata?.category || 'General Judicial Information',
            snippet: snippetText,
            relevanceScore: Math.round((chunk.score || 0) * 1000) / 1000,
          });
        }
      }
    }

    // Fallback to sources reported by rawResult if none enriched
    if (enrichedSources.length === 0) {
      const basicSources = rawResult.sources || [
        { title: 'Department of Justice – Government of India', url: 'https://doj.gov.in' }
      ];
      for (const s of basicSources) {
        const title = s.title || s.label || 'Department of Justice';
        const url = s.url || 'https://doj.gov.in';
        enrichedSources.push({
          title,
          label: title,
          url,
          category: 'Official Government Portal',
          snippet: title,
          relevanceScore: 1.0,
        });
      }
    }

    // 4. Build standard citations list matching contracts
    const citations = enrichedSources.map((s) => ({
      sourceTitle: s.title,
      url: s.url,
      snippet: s.snippet || s.title,
      category: s.category || 'General',
    }));

    const durationMs = Date.now() - startTime;

    return {
      answer: rawResult.answer,
      language: rawResult.language || normalizedLang,
      sources: enrichedSources,
      citations: citations,
      intent: rawResult.intent || 'GENERAL_DOJ_QUERY',
      detectedLang: rawResult.detectedLang,
      cnr: rawResult.cnr,
      dataStatus: rawResult.dataStatus || 'official_reference',
      dataFreshness: OFFICIAL_DATA_FRESHNESS,
      lastChecked: rawResult.lastChecked || OFFICIAL_DATA_FRESHNESS.lastUpdated,
      metadata: {
        modelUsed: rawResult.metadata?.modelUsed || 'rag-direct-reference',
        isLiveModel: Boolean(rawResult.metadata?.isLiveModel),
        durationMs: rawResult.metadata?.durationMs || durationMs,
        chunksRetrieved: retrievedChunks.length,
      },
    };
  })();

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
  OFFICIAL_DATA_FRESHNESS,
};
