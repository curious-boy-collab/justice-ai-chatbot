/**
 * Department of Justice (DoJ) Information Controller
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 */

import { dojService } from '../services/dojService.js';

export function getOverview(req, res, next) {
  try {
    const data = dojService.getOverview();
    return res.status(200).json({
      success: true,
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getDivisions(req, res, next) {
  try {
    const data = dojService.getDivisions();
    return res.status(200).json({
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getSchemes(req, res, next) {
  try {
    const data = dojService.getSchemes();
    return res.status(200).json({
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
