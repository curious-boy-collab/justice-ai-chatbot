/**
 * Semantic Retriever for JusticeAI RAG Pipeline
 * Developer: Nitin (AI / RAG Developer)
 * Sprint: Day 3 — Semantic Retrieval & Source Attribution
 * 
 * Orchestrates semantic retrieval, threshold validation,
 * deduplication of sources, and citation enrichment.
 */

const vectorStore = require('./vector_store');

const DEFAULT_SIMILARITY_THRESHOLD = 0.20;

/**
 * Retrieve verified knowledge documents for a citizen query
 * @param {string} query User query (English, Hindi, or Hinglish)
 * @param {number} topK Max documents to retrieve
 * @param {number} threshold Minimum similarity threshold
 * @returns {Promise<{
 *   documents: Array<Object>,
 *   hasMatches: boolean,
 *   topScore: number
 * }>}
 */
async function retrieve(query, topK = 3, threshold = DEFAULT_SIMILARITY_THRESHOLD) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    const emptyResult = [];
    emptyResult.documents = [];
    emptyResult.hasMatches = false;
    emptyResult.topScore = 0;
    return emptyResult;
  }

  try {
    const rawResults = await vectorStore.query(query, topK, threshold);
    const topScore = rawResults.length > 0 ? rawResults[0].score : 0;
    const hasMatches = rawResults.length > 0 && topScore >= threshold;

    // Return as array with attached metadata properties for dual compatibility
    const result = [...rawResults];
    result.documents = rawResults;
    result.hasMatches = hasMatches;
    result.topScore = topScore;

    return result;
  } catch (err) {
    console.error('[Retriever Error]:', err.message);
    const emptyResult = [];
    emptyResult.documents = [];
    emptyResult.hasMatches = false;
    emptyResult.topScore = 0;
    return emptyResult;
  }
}

/**
 * Formats retrieved chunks into standardized source citations
 * Conforms to frontend expectations (title, url, category, relevancePercent, snippet)
 * @param {Array<Object>} retrievedChunks Chunks returned by retrieve()
 * @returns {Array<{
 *   title: string,
 *   url: string,
 *   category: string,
 *   format: string,
 *   relevanceScore: number,
 *   snippet: string
 * }>}
 */
function extractSourceCitations(retrievedChunks) {
  if (!retrievedChunks || retrievedChunks.length === 0) {
    return [
      {
        title: 'Department of Justice – Government of India',
        url: 'https://doj.gov.in',
        category: 'Official Portal',
        format: 'WEB',
        relevanceScore: 100,
        snippet: 'Official portal of Department of Justice, Ministry of Law and Justice, Government of India.',
      },
    ];
  }

  const seenUrls = new Set();
  const citations = [];

  for (const chunk of retrievedChunks) {
    const url = chunk.metadata?.url || 'https://doj.gov.in';
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      const rawSnippet = chunk.content ? chunk.content.replace(/^###.*\n+/, '').substring(0, 160) : '';
      citations.push({
        title: chunk.metadata?.title || 'Department of Justice Official Portal',
        url,
        category: chunk.metadata?.category || 'General',
        format: chunk.format || chunk.metadata?.format || 'MD',
        relevanceScore: chunk.relevancePercent || Math.round((chunk.score || 0.8) * 100),
        snippet: `${rawSnippet}...`,
      });
    }
  }

  return citations;
}

module.exports = {
  retrieve,
  extractSourceCitations,
  DEFAULT_SIMILARITY_THRESHOLD,
};
