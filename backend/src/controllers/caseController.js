/**
 * eCourts Case Lookup & Guidance Controller
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 */

import { eCourtsService } from '../services/eCourtsService.js';

export function lookupCase(req, res, next) {
  try {
    const { cnr } = req.query;

    if (!cnr) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CNR',
          message: 'The "cnr" query parameter is required (e.g., /api/cases/lookup?cnr=DLHC010012342023).'
        },
        timestamp: new Date().toISOString()
      });
    }

    const result = eCourtsService.lookupCaseStatus(cnr);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_CNR_FORMAT',
          message: result.reason
        },
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getCaseGuidance(req, res, next) {
  try {
    const language = req.query.language || req.query.lang || 'en';
    const guidance = eCourtsService.getCaseGuidance(language);

    return res.status(200).json({
      success: true,
      ...guidance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getDemoSamples(req, res, next) {
  try {
    const samples = eCourtsService.getDemoSamples();
    return res.status(200).json({
      ...samples,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
