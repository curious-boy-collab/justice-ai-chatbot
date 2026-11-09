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

    const result = eCourtsService.validateAndParseCNR(cnr);

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
      cnr: result.cnr,
      isValidCnrFormat: true,
      parsed: result.parsed,
      isLive: false,
      disclaimer: 'Live CNR status requires CAPTCHA verification on the official eCourts Services portal. Use the direct link below to verify official real-time orders.',
      officialPortalUrl: result.officialPortalUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
