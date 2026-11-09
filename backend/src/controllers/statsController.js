import { judgeService } from '../services/judgeService.js';
import { njdgService } from '../services/njdgService.js';

export async function getJudgeStats(req, res, next) {
  try {
    const data = await judgeService.getSummary();
    res.status(200).json({
      success: true,
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export async function getNjdgStats(req, res, next) {
  try {
    const data = await njdgService.getOverview();
    res.status(200).json({
      success: true,
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
