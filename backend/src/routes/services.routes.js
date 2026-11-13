/**
 * Citizen & Judicial Services Routes
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 */

import { Router } from 'express';
import {
  getServicesOverview,
  getVirtualCourts,
  getEFiling,
  getTeleLaw,
  getFastTrackCourts,
  getMobileApp,
  getLiveStreaming
} from '../controllers/servicesController.js';

const router = Router();

router.get('/', getServicesOverview);
router.get('/virtual-courts', getVirtualCourts);
router.get('/efiling', getEFiling);
router.get('/tele-law', getTeleLaw);
router.get('/ftsc', getFastTrackCourts);
router.get('/mobile-app', getMobileApp);
router.get('/live-streaming', getLiveStreaming);

export default router;
