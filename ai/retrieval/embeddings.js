/**
 * Embeddings Service
 * Developer: Nitin (AI / RAG Developer)
 * Sprint: Day 3 — RAG Implementation & Embedding Generation
 * 
 * Provides vector embedding generation interface:
 * 1. Google Gemini 'text-embedding-004' (when GEMINI_API_KEY is configured).
 * 2. Deterministic high-dimensional n-gram semantic vector model for offline execution.
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const DEFAULT_EMBEDDING_MODEL = process.env.RAG_EMBEDDING_MODEL || 'text-embedding-004';
const VECTOR_DIMENSIONS = 128;

class EmbeddingsService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.modelName = DEFAULT_EMBEDDING_MODEL;
    this.client = (this.apiKey && this.apiKey !== 'your_gemini_api_key_here')
      ? new GoogleGenerativeAI(this.apiKey)
      : null;
  }

  /**
   * Set API key dynamically from server-side config
   * @param {string} key
   */
  setApiKey(key) {
    if (key && typeof key === 'string' && key.trim() && key !== 'your_gemini_api_key_here') {
      this.apiKey = key.trim();
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Generates embedding vector for a given text string
   * @param {string} text Input text string
   * @returns {Promise<Array<number>>} Float vector array
   */
  async getEmbedding(text) {
    if (this.client) {
      try {
        const model = this.client.getGenerativeModel({ model: this.modelName });
        const result = await model.embedContent(text);
        if (result && result.embedding && Array.isArray(result.embedding.values)) {
          return result.embedding.values;
        }
      } catch (err) {
        console.warn(`[Embeddings] Gemini API failed (${err.message}), using normalized semantic vector.`);
      }
    }

    // High-dimensional semantic feature vector fallback
    return this._computeSemanticVector(text, VECTOR_DIMENSIONS);
  }

  /**
   * Computes batch embeddings efficiently
   * @param {Array<string>} texts Array of strings
   * @returns {Promise<Array<Array<number>>>}
   */
  async getBatchEmbeddings(texts) {
    const embeddings = [];
    for (const text of texts) {
      const vec = await this.getEmbedding(text);
      embeddings.push(vec);
    }
    return embeddings;
  }

  /**
   * Multi-scale n-gram and token frequency feature vector
   * Supports English, Hindi (Devanagari Unicode), and Hinglish
   * @private
   */
  _computeSemanticVector(text, dimensions = VECTOR_DIMENSIONS) {
    const vector = new Array(dimensions).fill(0);
    const cleaned = text.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, ' ');
    const tokens = cleaned.split(/\s+/).filter(Boolean);

    // 1. Unigram feature hashing
    for (const token of tokens) {
      let hash = 5381;
      for (let i = 0; i < token.length; i++) {
        hash = ((hash << 5) + hash) + token.charCodeAt(i);
        hash |= 0;
      }
      const idx = Math.abs(hash) % dimensions;
      vector[idx] += 1.0;

      // 2. Bigram sub-word hashing for Devanagari ligatures and prefixes
      if (token.length >= 3) {
        for (let i = 0; i < token.length - 2; i++) {
          const sub = token.substring(i, i + 3);
          let subHash = 0;
          for (let j = 0; j < sub.length; j++) {
            subHash = ((subHash << 5) - subHash) + sub.charCodeAt(j);
            subHash |= 0;
          }
          const subIdx = Math.abs(subHash) % dimensions;
          vector[subIdx] += 0.5;
        }
      }
    }

    // L2 Normalization
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1.0;
    return vector.map(v => Number((v / magnitude).toFixed(6)));
  }

  /**
   * Compute cosine similarity between two vectors
   * @param {Array<number>} vecA Vector A
   * @param {Array<number>} vecB Vector B
   * @returns {number} Similarity score in range [0, 1]
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dotProduct));
  }
}

module.exports = new EmbeddingsService();
