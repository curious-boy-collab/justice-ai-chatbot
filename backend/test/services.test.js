import { describe, it } from 'node:test';
import assert from 'node:assert';
import { judgeService } from '../src/services/judgeService.js';
import { njdgService } from '../src/services/njdgService.js';
import { eCourtsService } from '../src/services/eCourtsService.js';

describe('JusticeAI Service Modules Unit Tests', () => {
  it('judgeService - returns official Supreme Court and High Court counts', async () => {
    const summary = await judgeService.getSummary();
    assert.strictEqual(summary.summary.supremeCourt.sanctioned, 34);
    assert.strictEqual(summary.summary.supremeCourt.working, 33);
    assert.strictEqual(summary.summary.supremeCourt.vacancies, 1);
    assert.strictEqual(summary.summary.highCourtsTotal.courtCount, 25);
    assert.strictEqual(summary.summary.highCourtsTotal.sanctioned, 1114);
    assert.strictEqual(summary.summary.highCourtsTotal.working, 778);
    assert.strictEqual(summary.summary.highCourtsTotal.vacancies, 336);
  });

  it('judgeService - formats bilingual responses with citations', async () => {
    const enResponse = await judgeService.getFormattedResponse('en');
    assert.ok(enResponse.reply.includes('Supreme Court of India'));
    assert.strictEqual(enResponse.dataCard.type, 'JUDGE_VACANCY');
    assert.ok(enResponse.citations[0].url.includes('doj.gov.in'));

    const hiResponse = await judgeService.getFormattedResponse('hi');
    assert.ok(hiResponse.reply.includes('सर्वोच्च न्यायालय'));
    assert.strictEqual(hiResponse.dataCard.type, 'JUDGE_VACANCY');
  });

  it('njdgService - returns official pendency statistics', async () => {
    const overview = await njdgService.getOverview();
    assert.strictEqual(overview.isOfficialReport, true);
    assert.ok(overview.aggregate.totalPendingCases > 50000000);
    assert.strictEqual(overview.ageWisePendency.length, 5);
  });

  it('eCourtsService - validates 16-character CNR properly', () => {
    const valid = eCourtsService.validateAndParseCNR('DLHC010012342023');
    assert.strictEqual(valid.isValid, true);
    assert.strictEqual(valid.parsed.stateCode, 'DL');
    assert.strictEqual(valid.parsed.courtCode, 'HC01');
    assert.strictEqual(valid.parsed.caseNumber, '001234');
    assert.strictEqual(valid.parsed.filingYear, '2023');

    const invalid = eCourtsService.validateAndParseCNR('SHORT');
    assert.strictEqual(invalid.isValid, false);
  });

  it('eCourtsService - provides Virtual Courts, eFiling, and Tele-Law guides', () => {
    const vcGuideEn = eCourtsService.getVirtualCourtGuide('en');
    assert.ok(vcGuideEn.steps.length >= 5);
    assert.strictEqual(vcGuideEn.officialPortalUrl, 'https://vcourts.gov.in');

    const eFilingGuideHi = eCourtsService.getEFilingGuide('hi');
    assert.ok(eFilingGuideHi.steps.length >= 4);

    const teleLawInfo = eCourtsService.getTeleLawInfo('en');
    assert.strictEqual(teleLawInfo.helpline, '14416 (Toll-free National Helpline)');
  });
});
