import { documentService } from '../services/documentService.js';

export function getDocuments(req, res, next) {
  try {
    const documents = documentService.getAllDocuments();
    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getDocumentById(req, res, next) {
  try {
    const docId = req.params.id || req.params[0];
    const doc = documentService.getDocumentById(docId);
    return res.status(200).json({
      success: true,
      document: doc,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export async function searchDocuments(req, res, next) {
  try {
    const query = req.method === 'POST'
      ? (req.body?.query || req.body?.q)
      : (req.query?.q || req.query?.query);

    const topK = req.method === 'POST'
      ? (req.body?.topK || 3)
      : (req.query?.topK || 3);

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SEARCH_QUERY',
          message: 'The query parameter "q" or body field "query" is required.'
        },
        timestamp: new Date().toISOString()
      });
    }

    const results = await documentService.searchKnowledge(query, topK);

    return res.status(200).json({
      success: true,
      query: query.trim(),
      resultsCount: results.length,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getKnowledgeStats(req, res, next) {
  try {
    const stats = documentService.getKnowledgeStats();
    return res.status(200).json({
      success: true,
      ...stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getDocuments,
  getDocumentById,
  searchDocuments,
  getKnowledgeStats
};
