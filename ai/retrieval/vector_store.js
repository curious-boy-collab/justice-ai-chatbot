/**
 * JusticeAI Vector Store
 * Developer: Nitin (AI / RAG Developer)
 * Sprint: Day 3 — RAG Implementation & Vector Database Integration
 * 
 * Manages document embeddings, indexing, persistence, and hybrid semantic search.
 * Adheres to ChromaDB collection interface patterns:
 * - add(chunks)
 * - query(queryText, nResults)
 * - get(id)
 * - count()
 * - persist()
 */

const fs = require('fs');
const path = require('path');
const { loadAllDocuments } = require('../ingestion/document_loader');
const { createDocumentChunks } = require('../ingestion/chunking');
const embeddings = require('./embeddings');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PERSIST_FILE = path.join(DATA_DIR, 'vector_store.json');

class VectorStore {
  constructor() {
    this.chunks = [];
    this.initialized = false;
  }

  /**
   * Initialize and index all documents across Markdown, Text, and PDF formats
   * Automatically re-uses persisted index if fresh
   */
  async initialize() {
    if (this.initialized) return;

    // Check if persisted vector store file exists
    if (fs.existsSync(PERSIST_FILE)) {
      try {
        const raw = fs.readFileSync(PERSIST_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.chunks = parsed;
          this.initialized = true;
          console.log(`[VectorStore] Loaded ${this.chunks.length} cached vectors from ${path.basename(PERSIST_FILE)}.`);
          return;
        }
      } catch (err) {
        console.warn('[VectorStore] Cache read warning, rebuilding index:', err.message);
      }
    }

    // Load all documents from disk
    const rawDocs = loadAllDocuments();
    let allChunks = [];

    for (const doc of rawDocs) {
      const docChunks = createDocumentChunks(doc);
      allChunks = allChunks.concat(docChunks);
    }

    // Generate embeddings for all semantic chunks
    for (const chunk of allChunks) {
      chunk.vector = await embeddings.getEmbedding(chunk.content);
    }

    this.chunks = allChunks;
    this.initialized = true;
    console.log(`[VectorStore] Indexed ${this.chunks.length} chunks from ${rawDocs.length} documents.`);

    // Persist to disk
    this.persist();
  }

  /**
   * Persists vector store to disk
   */
  persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(PERSIST_FILE, JSON.stringify(this.chunks, null, 2), 'utf8');
      console.log(`[VectorStore] Persisted ${this.chunks.length} chunks to disk.`);
    } catch (err) {
      console.warn('[VectorStore] Persist failed:', err.message);
    }
  }

  /**
   * ChromaDB-compatible query method
   * @param {string} queryText Search query
   * @param {number} nResults Number of results (top-K)
   * @param {number} minScore Minimum score threshold
   * @returns {Promise<Array<Object>>} Matching chunks with scores
   */
  async query(queryText, nResults = 3, minScore = 0.15) {
    if (!this.initialized) {
      await this.initialize();
    }

    const queryVector = await embeddings.getEmbedding(queryText);
    const queryTokens = queryText
      .toLowerCase()
      .replace(/[^\w\s\u0900-\u097F]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);

    const scored = this.chunks.map(chunk => {
      // 1. Cosine similarity
      const vectorScore = embeddings.cosineSimilarity(queryVector, chunk.vector);

      // 2. Keyword relevance boost (BM25 term match simulation)
      const contentLower = chunk.content.toLowerCase();
      let keywordHits = 0;
      for (const token of queryTokens) {
        if (contentLower.includes(token)) keywordHits++;
      }
      const keywordScore = queryTokens.length > 0 ? (keywordHits / queryTokens.length) : 0;

      // Combined hybrid score (65% vector similarity + 35% term presence)
      const combinedScore = (vectorScore * 0.65) + (keywordScore * 0.35);

      return {
        ...chunk,
        score: Number(combinedScore.toFixed(4)),
        relevancePercent: Math.min(100, Math.round(combinedScore * 100)),
      };
    });

    return scored
      .filter(item => item.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, nResults);
  }

  /**
   * Alias for backward compatibility
   */
  async search(queryText, topK = 3, minScore = 0.15) {
    return this.query(queryText, topK, minScore);
  }

  /**
   * Returns total count of indexed vectors
   * @returns {number}
   */
  count() {
    return this.chunks.length;
  }

  /**
   * Retrieve chunk by ID
   * @param {string} id
   * @returns {Object|null}
   */
  get(id) {
    return this.chunks.find(c => c.id === id) || null;
  }

  /**
   * Resets vector store
   */
  reset() {
    this.chunks = [];
    this.initialized = false;
    if (fs.existsSync(PERSIST_FILE)) {
      fs.unlinkSync(PERSIST_FILE);
    }
  }
}

module.exports = new VectorStore();
