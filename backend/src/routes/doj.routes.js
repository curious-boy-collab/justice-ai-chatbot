/**
 * Department of Justice (DoJ) Routes
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 */

import { Router } from 'express';
import { getOverview, getDivisions, getSchemes } from '../controllers/dojController.js';

const router = Router();

router.get('/', getOverview);
router.get('/overview', getOverview);
router.get('/divisions', getDivisions);
router.get('/schemes', getSchemes);

export default router;
