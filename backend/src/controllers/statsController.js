/**
 * Judicial & NJDG Statistics Controller
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 */

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

export async function getHighCourts(req, res, next) {
  try {
    const data = judgeService.getAllHighCourts();
    res.status(200).json({
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export async function getHighCourtByCode(req, res, next) {
  try {
    const { code } = req.params;
    const data = judgeService.getHighCourtByCode(code);
    res.status(200).json({
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export async function getAppointmentProcedure(req, res, next) {
  try {
    const data = judgeService.getAppointmentProcedure();
    res.status(200).json({
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

export async function getCourtBreakdown(req, res, next) {
  try {
    const data = await njdgService.getCourtBreakdown();
    res.status(200).json({
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export async function getAgeWisePendency(req, res, next) {
  try {
    const data = await njdgService.getAgeWisePendency();
    res.status(200).json({
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export async function getStateWisePendency(req, res, next) {
  try {
    const data = await njdgService.getStateWisePendency();
    res.status(200).json({
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
