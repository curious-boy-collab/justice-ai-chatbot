/**
 * JusticeAI – Document & Knowledge Base Service
 * Developer: Disha (Backend Developer)
 * Sprint: Day 3 — RAG Implementation & Knowledge Base Service Interfaces
 * 
 * Provides backend interfaces for official Department of Justice knowledge documents,
 * chunk-level inspection, semantic retrieval search, and knowledge base statistics.
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const docLoaderPath = path.resolve(__dirname, '../../../ai/ingestion/document_loader.js');
const retrieverPath = path.resolve(__dirname, '../../../ai/retrieval/retriever.js');
const vectorStorePath = path.resolve(__dirname, '../../../ai/retrieval/vector_store.js');

let docLoader = null;
let retriever = null;
let vectorStore = null;

try {
  docLoader = require(docLoaderPath);
  retriever = require(retrieverPath);
  vectorStore = require(vectorStorePath);
} catch (err) {
  console.warn('[documentService] Warning: Could not load AI retrieval modules:', err.message);
}

export const documentService = {
  /**
   * Retrieves summary list of all indexed official knowledge documents
   * @returns {Array<Object>} List of documents with metadata and chunk counts
   */
  getAllDocuments() {
    if (!docLoader) {
      throw new Error('Document Loader module is not initialized.');
    }

    const rawDocs = docLoader.loadAllDocuments();

    return rawDocs.map((doc) => {
      let stats = null;
      try {
        stats = fs.statSync(doc.filePath);
      } catch {
        // file stat fallback
      }

      // Estimate chunk count for this document
      const matchingChunks = vectorStore?.chunks
        ? vectorStore.chunks.filter((c) => c.docId === doc.id).length
        : 0;

      return {
        id: doc.id,
        title: doc.metadata.title,
        category: doc.metadata.category,
        url: doc.metadata.url,
        status: doc.metadata.status,
        lastChecked: doc.metadata.lastChecked,
        chunkCount: matchingChunks,
        fileSizeBytes: stats?.size || doc.content.length,
        lastModified: stats?.mtime?.toISOString() || new Date().toISOString()
      };
    });
  },

  /**
   * Retrieves full content and metadata for a specific document by its ID
   * @param {string} docId e.g. "doj/tele_law_services" or "ecourts/efiling_and_epay"
   * @returns {Object} Full document object
   */
  getDocumentById(docId) {
    if (!docLoader) {
      throw new Error('Document Loader module is not initialized.');
    }

    if (!docId || typeof docId !== 'string') {
      const err = new Error('Document ID must be a non-empty string.');
      err.statusCode = 400;
      err.code = 'INVALID_DOCUMENT_ID';
      throw err;
    }

    const normalizedId = docId.trim().replace(/^\/+|\/+$/g, '').replace(/\.md$/, '');
    const allDocs = docLoader.loadAllDocuments();
    const found = allDocs.find((d) => d.id === normalizedId);

    if (!found) {
      const notFoundErr = new Error(`Document with ID "${normalizedId}" was not found.`);
      notFoundErr.statusCode = 404;
      notFoundErr.code = 'DOCUMENT_NOT_FOUND';
      throw notFoundErr;
    }

    const matchingChunks = vectorStore?.chunks
      ? vectorStore.chunks
          .filter((c) => c.docId === found.id)
          .map((c) => ({
            id: c.id,
            sectionTitle: c.sectionTitle,
            wordCount: c.content.split(/\s+/).length
          }))
      : [];

    return {
      id: found.id,
      title: found.metadata.title,
      category: found.metadata.category,
      url: found.metadata.url,
      status: found.metadata.status,
      lastChecked: found.metadata.lastChecked,
      chunks: matchingChunks,
      rawContent: found.content
    };
  },

  /**
   * Direct semantic search over the official knowledge base vector store
   * @param {string} query Search query
   * @param {number} topK Maximum results to return
   * @returns {Promise<Array<Object>>} Matching chunks with similarity scores
   */
  async searchKnowledge(query, topK = 3) {
    if (!retriever) {
      throw new Error('Retriever module is not initialized.');
    }

    if (!query || typeof query !== 'string' || !query.trim()) {
      const err = new Error('Query string is required for semantic search.');
      err.statusCode = 400;
      err.code = 'INVALID_SEARCH_QUERY';
      throw err;
    }

    const limit = Math.max(1, Math.min(parseInt(topK, 10) || 3, 10));
    const rawChunks = await retriever.retrieve(query.trim(), limit);

    return rawChunks.map((chunk) => {
      // Create concise snippet from chunk content (first 260 characters)
      const cleanSnippet = chunk.content
        ? chunk.content
            .replace(/#{1,6}\s+/g, '')
            .replace(/>\s*\*\*/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 260) + '...'
        : '';

      return {
        chunkId: chunk.id,
        docId: chunk.docId,
        sectionTitle: chunk.sectionTitle,
        title: chunk.metadata?.title || 'Department of Justice',
        category: chunk.metadata?.category || 'General',
        url: chunk.metadata?.url || 'https://doj.gov.in',
        status: chunk.metadata?.status || 'Verified Official Government Data',
        relevanceScore: Math.round((chunk.score || 0) * 1000) / 1000,
        snippet: cleanSnippet
      };
    });
  },

  /**
   * Retrieves high-level statistics about the indexed knowledge base
   * @returns {Object} Knowledge base metrics
   */
  getKnowledgeStats() {
    if (!docLoader || !vectorStore) {
      throw new Error('Knowledge base modules are not initialized.');
    }

    const allDocs = docLoader.loadAllDocuments();
    const categories = new Set();
    allDocs.forEach((d) => {
      if (d.metadata.category) categories.add(d.metadata.category);
    });

    const totalChunks = vectorStore.chunks ? vectorStore.chunks.length : 0;

    return {
      totalDocuments: allDocs.length,
      totalChunks: totalChunks,
      categoriesCount: categories.size,
      categories: Array.from(categories),
      vectorStoreType: 'In-Memory / Hybrid Cosine + Keyword Embedding',
      status: 'active',
      dataFreshness: {
        lastUpdated: '2026-11-10',
        sourceStatus: 'verified_official',
        asOfDate: '2026-03-01',
        disclaimer: 'Official information sourced from Ministry of Law & Justice and eCourts Project.'
      }
    };
  }
};

export default documentService;
