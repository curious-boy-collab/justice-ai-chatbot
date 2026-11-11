/**
 * Semantic Retriever for JusticeAI RAG Pipeline
 * Developer: Nitin (AI / RAG Developer)
 * 
 * Orchestrates semantic retrieval, deduplication of sources,
 * and formatting into standard citation payloads.
 */

const vectorStore = require('./vector_store');

/**
 * Retrieve verified knowledge documents for a citizen query
 * @param {string} query User query (English or Hindi)
 * @param {number} topK Max documents to retrieve
 * @returns {Promise<Array<Object>>} Retrieved chunks with normalized source citations
 */
async function retrieve(query, topK = 3) {
  if (!query || typeof query !== 'string') return [];

  try {
    const rawResults = await vectorStore.search(query, topK);
    return rawResults;
  } catch (err) {
    console.error('[Retriever Error]:', err.message);
    return [];
  }
}

/**
 * Formats retrieved chunks into standardized source citations
 * conforming to the AI/Backend integration contract.
 * @param {Array<Object>} retrievedChunks Chunks returned by retrieve()
 * @returns {Array<{title: string, url: string}>} Cleaned citations
 */
function extractSourceCitations(retrievedChunks) {
  if (!retrievedChunks || retrievedChunks.length === 0) {
    return [
      {
        title: 'Department of Justice – Government of India',
        url: 'https://doj.gov.in',
      },
    ];
  }

  const seenUrls = new Set();
  const citations = [];

  for (const chunk of retrievedChunks) {
    const url = chunk.metadata?.url || 'https://doj.gov.in';
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      citations.push({
        title: chunk.metadata?.title || 'Department of Justice Official Portal',
        url,
      });
    }
  }

  return citations;
}

module.exports = { retrieve, extractSourceCitations };
