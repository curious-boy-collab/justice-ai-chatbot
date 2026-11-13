/**
 * Citizen & Judicial Services Controller
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 */

import { eCourtsService } from '../services/eCourtsService.js';

export function getServicesOverview(req, res, next) {
  try {
    const services = [
      {
        id: 'virtual-courts',
        title: 'Virtual Courts (vcourts.gov.in)',
        description: 'Online adjudication and fine payment for petty traffic offenses without physical court appearance.',
        officialUrl: 'https://vcourts.gov.in',
        endpoint: '/api/services/virtual-courts'
      },
      {
        id: 'efiling',
        title: 'eFiling 3.0 & ePay',
        description: 'Electronic filing of cases and online payment of court fees and judicial deposits.',
        officialUrl: 'https://efiling.ecourts.gov.in',
        endpoint: '/api/services/efiling'
      },
      {
        id: 'tele-law',
        title: 'Tele-Law Services',
        description: 'Pre-litigation legal advice from panel lawyers via video conference at CSCs and mobile app.',
        officialUrl: 'https://www.tele-law.in',
        endpoint: '/api/services/tele-law'
      },
      {
        id: 'ftsc',
        title: 'Fast Track Special Courts (FTSC)',
        description: 'Expeditious trial for cases under POCSO Act and rape provisions under Criminal Law Amendment.',
        officialUrl: 'https://doj.gov.in/fast-track-special-court-ftsc/',
        endpoint: '/api/services/ftsc'
      },
      {
        id: 'ecourts-mobile-app',
        title: 'eCourts Services Mobile App',
        description: 'Real-time case tracking, cause lists, QR scanning, and personalized portfolio tracking.',
        officialUrl: 'https://ecourts.gov.in/ecourts_home/',
        endpoint: '/api/services/mobile-app'
      },
      {
        id: 'live-streaming',
        title: 'Live Streaming of Court Proceedings',
        description: 'Real-time broadcasting of Supreme Court and High Court proceedings for judicial transparency.',
        officialUrl: 'https://webcast.gov.in/scindia',
        endpoint: '/api/services/live-streaming'
      },
      {
        id: 'case-status',
        title: 'Case Status Lookup by CNR',
        description: 'Unique 16-character CNR number lookup and procedural search guidance across District and High Courts.',
        officialUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus',
        endpoint: '/api/cases/lookup'
      }
    ];

    res.status(200).json({
      success: true,
      title: 'Department of Justice & eCourts Citizen Services Directory',
      count: services.length,
      services,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getVirtualCourts(req, res, next) {
  try {
    const language = req.query.language || req.query.lang || 'en';
    const directory = eCourtsService.getVirtualCourtsDirectory();
    const guide = eCourtsService.getVirtualCourtGuide(language);

    res.status(200).json({
      success: true,
      directory,
      guide,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getEFiling(req, res, next) {
  try {
    const language = req.query.language || req.query.lang || 'en';
    const guide = eCourtsService.getEFilingGuide(language);

    res.status(200).json({
      success: true,
      ...guide,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getTeleLaw(req, res, next) {
  try {
    const language = req.query.language || req.query.lang || 'en';
    const info = eCourtsService.getTeleLawInfo(language);

    res.status(200).json({
      success: true,
      ...info,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getFastTrackCourts(req, res, next) {
  try {
    const language = req.query.language || req.query.lang || 'en';
    const info = eCourtsService.getFTSCInfo(language);

    res.status(200).json({
      success: true,
      ...info,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getMobileApp(req, res, next) {
  try {
    const language = req.query.language || req.query.lang || 'en';
    const info = eCourtsService.getMobileAppInfo(language);

    res.status(200).json({
      success: true,
      ...info,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export function getLiveStreaming(req, res, next) {
  try {
    const language = req.query.language || req.query.lang || 'en';
    const info = eCourtsService.getLiveStreamingInfo(language);

    res.status(200).json({
      success: true,
      ...info,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
