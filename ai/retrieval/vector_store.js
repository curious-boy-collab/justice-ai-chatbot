/**
 * In-Memory Vector Store for JusticeAI
 * Developer: Nitin (AI / RAG Developer)
 * 
 * Manages document ingestion, chunk indexing, and similarity search.
 * Designed to seamlessly transition to ChromaDB in Day 4.
 */

const { loadAllDocuments } = require('../ingestion/document_loader');
const { createDocumentChunks } = require('../ingestion/chunking');
const embeddings = require('./embeddings');

class VectorStore {
  constructor() {
    this.chunks = [];
    this.initialized = false;
  }

  /**
   * Initialize and index all documents from ai/documents/
   */
  async initialize() {
    if (this.initialized) return;

    const rawDocs = loadAllDocuments();
    let allChunks = [];

    for (const doc of rawDocs) {
      const docChunks = createDocumentChunks(doc);
      allChunks = allChunks.concat(docChunks);
    }

    // Pre-calculate embeddings for all chunks
    for (const chunk of allChunks) {
      chunk.vector = await embeddings.getEmbedding(chunk.content);
    }

    this.chunks = allChunks;
    this.initialized = true;
    console.log(`[VectorStore] Indexed ${this.chunks.length} chunks from ${rawDocs.length} documents.`);
  }

  /**
   * Search for top-K matching chunks
   * @param {string} query Search query
   * @param {number} topK Number of results to return
   * @param {number} minScore Minimum similarity score threshold
   * @returns {Promise<Array<Object>>} Matching chunks with similarity scores
   */
  async search(query, topK = 3, minScore = 0.1) {
    if (!this.initialized) {
      await this.initialize();
    }

    const queryVector = await embeddings.getEmbedding(query);
    const queryTokens = query.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, ' ').split(/\s+/).filter(w => w.length > 2);

    const scored = this.chunks.map(chunk => {
      // 1. Vector cosine similarity
      const vectorScore = embeddings.cosineSimilarity(queryVector, chunk.vector);

      // 2. Keyword relevance boost
      const contentLower = chunk.content.toLowerCase();
      let keywordHits = 0;
      for (const token of queryTokens) {
        if (contentLower.includes(token)) keywordHits++;
      }
      const keywordScore = queryTokens.length > 0 ? (keywordHits / queryTokens.length) : 0;

      // Combined hybrid score (70% vector, 30% exact keyword presence)
      const combinedScore = (vectorScore * 0.7) + (keywordScore * 0.3);

      return {
        ...chunk,
        score: combinedScore,
      };
    });

    return scored
      .filter(item => item.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

module.exports = new VectorStore();
