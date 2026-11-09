/**
 * Embeddings Service
 * Developer: Nitin (AI / RAG Developer)
 * 
 * Provides vector embedding generation interface.
 * Day 1: Modular fallback using normalized lexical frequency vectors.
 * Day 4 Upgrade: Drop-in integration with Google Gemini 'text-embedding-004' or ChromaDB.
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

class EmbeddingsService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.modelName = process.env.RAG_EMBEDDING_MODEL || 'text-embedding-004';
    this.client = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
  }

  /**
   * Generates embedding vector for a given text
   * @param {string} text Input text string
   * @returns {Promise<Array<number>>} Float vector array
   */
  async getEmbedding(text) {
    if (this.client && this.apiKey !== 'your_gemini_api_key_here') {
      try {
        const model = this.client.getGenerativeModel({ model: this.modelName });
        const result = await model.embedContent(text);
        return result.embedding.values;
      } catch (err) {
        console.warn(`[Embeddings] Gemini API failed (${err.message}), using lexical vector.`);
      }
    }

    // Day 1 deterministic lexical vector fallback
    return this._computeLexicalVector(text);
  }

  /**
   * Simple hash-based feature representation for offline testing
   * @private
   */
  _computeLexicalVector(text, dimensions = 64) {
    const vector = new Array(dimensions).fill(0);
    const words = text.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, ' ').split(/\s+/).filter(Boolean);

    for (const word of words) {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = (hash << 5) - hash + word.charCodeAt(i);
        hash |= 0;
      }
      const idx = Math.abs(hash) % dimensions;
      vector[idx] += 1;
    }

    // L2 Normalization
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vector.map(v => v / magnitude);
  }

  /**
   * Compute cosine similarity between two vectors
   * @param {Array<number>} vecA Vector A
   * @param {Array<number>} vecB Vector B
   * @returns {number} Cosine similarity score (0 to 1)
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    return Math.max(0, dotProduct);
  }
}

module.exports = new EmbeddingsService();
