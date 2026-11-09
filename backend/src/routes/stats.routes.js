import { Router } from 'express';
import { getJudgeStats, getNjdgStats } from '../controllers/statsController.js';

const router = Router();

router.get('/judges', getJudgeStats);
router.get('/njdg', getNjdgStats);

export default router;
