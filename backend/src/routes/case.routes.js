/**
 * eCourts Case Lookup & Guidance Routes
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 */

import { Router } from 'express';
import { lookupCase, getCaseGuidance, getDemoSamples } from '../controllers/caseController.js';

const router = Router();

router.get('/lookup', lookupCase);
router.get('/guidance', getCaseGuidance);
router.get('/demo-samples', getDemoSamples);

export default router;
