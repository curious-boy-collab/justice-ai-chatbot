/**
 * Judicial & NJDG Statistics Routes
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 */

import { Router } from 'express';
import {
  getJudgeStats,
  getHighCourts,
  getHighCourtByCode,
  getAppointmentProcedure,
  getNjdgStats,
  getCourtBreakdown,
  getAgeWisePendency,
  getStateWisePendency
} from '../controllers/statsController.js';

const router = Router();

// Judge strength and vacancies
router.get('/judges', getJudgeStats);
router.get('/judges/high-courts', getHighCourts);
router.get('/judges/high-courts/:code', getHighCourtByCode);
router.get('/judges/appointment-procedure', getAppointmentProcedure);
router.get('/judges/appointments-procedure', getAppointmentProcedure);

// National Judicial Data Grid (NJDG) pendency analytics
router.get('/njdg', getNjdgStats);
router.get('/njdg/court-breakdown', getCourtBreakdown);
router.get('/njdg/age-wise', getAgeWisePendency);
router.get('/njdg/state-wise', getStateWisePendency);

export default router;
