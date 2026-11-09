import { Router } from 'express';
import { lookupCase } from '../controllers/caseController.js';

const router = Router();

router.get('/lookup', lookupCase);

export default router;
