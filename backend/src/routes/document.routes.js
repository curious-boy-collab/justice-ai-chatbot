import { Router } from 'express';
import {
  getDocuments,
  getDocumentById,
  searchDocuments,
  getKnowledgeStats
} from '../controllers/documentController.js';

const router = Router();

// Knowledge statistics
router.get('/stats', getKnowledgeStats);

// Semantic search endpoint (supports both GET /search?q=... and POST /search)
router.get('/search', searchDocuments);
router.post('/search', searchDocuments);

// All indexed documents
router.get('/', getDocuments);

// Specific document by relative path ID (e.g. /api/documents/doj/tele_law_services)
router.get('/:id(*)', getDocumentById);

export default router;
