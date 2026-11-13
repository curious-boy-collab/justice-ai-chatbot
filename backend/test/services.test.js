import { describe, it } from 'node:test';
import assert from 'node:assert';
import { judgeService } from '../src/services/judgeService.js';
import { njdgService } from '../src/services/njdgService.js';
import { eCourtsService } from '../src/services/eCourtsService.js';
import { dojService } from '../src/services/dojService.js';
import { queryJusticeAI, OFFICIAL_DATA_FRESHNESS } from '../src/services/aiBridgeService.js';
import { documentService } from '../src/services/documentService.js';
import { createRateLimiter } from '../src/middleware/rateLimiter.js';

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

  it('aiBridgeService - queries AI module with grounded response, citations and data freshness', async () => {
    const response = await queryJusticeAI('What are Fast Track Special Courts?', 'en', 'test-session-id', { topK: 3 });
    assert.ok(response.answer.length > 30);
    assert.strictEqual(response.language, 'en');
    assert.strictEqual(response.intent, 'FAST_TRACK_COURTS');
    assert.ok(response.sources.length > 0);
    assert.ok(response.sources[0].category, 'Sources should contain category metadata');
    assert.ok(response.citations.length > 0);
    assert.strictEqual(response.dataFreshness.lastUpdated, OFFICIAL_DATA_FRESHNESS.lastUpdated);
    assert.strictEqual(response.dataFreshness.sourceStatus, 'verified_official');
  });

  it('documentService - getAllDocuments returns indexed official knowledge documents', () => {
    const docs = documentService.getAllDocuments();
    assert.ok(docs.length >= 10);
    const first = docs[0];
    assert.ok(first.id);
    assert.ok(first.title);
    assert.ok(first.category);
    assert.ok(first.url);
    assert.ok(first.status);
    assert.ok(first.fileSizeBytes > 0);
  });

  it('documentService - getDocumentById retrieves full document details', () => {
    const doc = documentService.getDocumentById('doj/tele_law_services');
    assert.strictEqual(doc.id, 'doj/tele_law_services');
    assert.ok(doc.title.includes('Tele-Law'));
    assert.ok(doc.rawContent.length > 100);
    assert.ok(Array.isArray(doc.chunks));
  });

  it('documentService - getDocumentById throws 404 for missing document', () => {
    assert.throws(
      () => documentService.getDocumentById('invalid_doc_id_999'),
      (err) => err.statusCode === 404 && err.code === 'DOCUMENT_NOT_FOUND'
    );
  });

  it('documentService - searchKnowledge performs semantic retrieval with score and snippets', async () => {
    const results = await documentService.searchKnowledge('Tele-Law legal aid', 3);
    assert.ok(results.length > 0);
    const top = results[0];
    assert.ok(top.chunkId);
    assert.ok(top.title);
    assert.ok(top.url);
    assert.ok(top.relevanceScore > 0);
    assert.ok(top.snippet.length > 20);
  });

  it('documentService - getKnowledgeStats returns accurate metrics', () => {
    const stats = documentService.getKnowledgeStats();
    assert.ok(stats.totalDocuments >= 10);
    assert.ok(stats.totalChunks >= 60);
    assert.ok(stats.categoriesCount > 0);
    assert.strictEqual(stats.status, 'active');
    assert.strictEqual(stats.dataFreshness.sourceStatus, 'verified_official');
  });

  // DAY 4 SERVICES UNIT TESTS
  it('dojService - returns overview, 7 divisions, and key schemes', () => {
    const overview = dojService.getOverview();
    assert.strictEqual(overview.department, 'Department of Justice');
    assert.strictEqual(overview.dataFreshness.sourceStatus, 'verified_official');

    const divisions = dojService.getDivisions();
    assert.strictEqual(divisions.count, 7);
    assert.ok(divisions.divisions.find((d) => d.id === 'appointments-admin'));
    assert.ok(divisions.divisions.find((d) => d.id === 'access-to-justice'));

    const schemes = dojService.getSchemes();
    assert.ok(schemes.count >= 6);
    assert.ok(schemes.schemes.find((s) => s.id === 'tele-law'));
  });

  it('judgeService - returns high courts directory and appointment procedure', () => {
    const allCourts = judgeService.getAllHighCourts();
    assert.strictEqual(allCourts.count, 25);
    assert.strictEqual(allCourts.highCourts.length, 25);

    const delhi = judgeService.getHighCourtByCode('delhi');
    assert.strictEqual(delhi.highCourt.sanctioned, 60);

    const procedure = judgeService.getAppointmentProcedure();
    assert.ok(procedure.collegiumStructure.supremeCourtCollegium);
    assert.ok(procedure.workflowSteps.length >= 4);

    assert.throws(
      () => judgeService.getHighCourtByCode('unknown_court'),
      (err) => err.statusCode === 404 && err.code === 'HIGH_COURT_NOT_FOUND'
    );
  });

  it('njdgService - returns court hierarchy breakdown and state statistics', async () => {
    const breakdown = await njdgService.getCourtBreakdown();
    assert.strictEqual(breakdown.isOfficialReport, true);
    assert.strictEqual(breakdown.courtLevels.length, 4);

    const ageWise = await njdgService.getAgeWisePendency();
    assert.strictEqual(ageWise.brackets.length, 5);

    const stateWise = await njdgService.getStateWisePendency();
    assert.ok(stateWise.count >= 10);
    assert.ok(stateWise.states.find((s) => s.state === 'Uttar Pradesh'));
  });

  it('eCourtsService - provides demo cases, live captcha notices, and guides', () => {
    const demo = eCourtsService.lookupCaseStatus('DLHC010012342023');
    assert.strictEqual(demo.isValid, true);
    assert.strictEqual(demo.dataStatus, 'demo_sandbox');
    assert.strictEqual(demo.caseTitle, 'Aarav Sharma vs. State of NCT of Delhi & Anr.');

    const liveNotice = eCourtsService.lookupCaseStatus('MHMB010099992024');
    assert.strictEqual(liveNotice.isValid, true);
    assert.strictEqual(liveNotice.dataStatus, 'live_lookup_requires_captcha');
    assert.ok(liveNotice.guidance.step1);

    const samples = eCourtsService.getDemoSamples();
    assert.ok(samples.samples.length >= 3);

    const guidance = eCourtsService.getCaseGuidance('en');
    assert.ok(guidance.whereToFindCNR.length >= 3);

    const vcDirectory = eCourtsService.getVirtualCourtsDirectory();
    assert.ok(vcDirectory.statesCount >= 8);
  });

  it('rateLimiter - enforces sliding window request limits and returns 429 upon breach', () => {
    const limiter = createRateLimiter({
      windowMs: 1000,
      maxRequests: 2,
      skipInTest: false
    });

    const headers = {};
    const mockRes = {
      setHeader(k, v) { headers[k] = v; },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    let nextCalls = 0;
    const mockNext = () => { nextCalls++; };
    const mockReq = { headers: {}, socket: { remoteAddress: '192.168.1.100' } };

    // Request 1: allowed
    limiter(mockReq, mockRes, mockNext);
    assert.strictEqual(nextCalls, 1);
    assert.strictEqual(headers['X-RateLimit-Limit'], 2);
    assert.strictEqual(headers['X-RateLimit-Remaining'], 1);

    // Request 2: allowed
    limiter(mockReq, mockRes, mockNext);
    assert.strictEqual(nextCalls, 2);
    assert.strictEqual(headers['X-RateLimit-Remaining'], 0);

    // Request 3: blocked with 429
    limiter(mockReq, mockRes, mockNext);
    assert.strictEqual(nextCalls, 2, 'Request 3 must be blocked');
    assert.strictEqual(mockRes.statusCode, 429);
    assert.strictEqual(mockRes.body.error.code, 'TOO_MANY_REQUESTS');
    assert.ok(headers['Retry-After']);
  });
});
