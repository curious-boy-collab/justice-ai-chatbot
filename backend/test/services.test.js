import { describe, it } from 'node:test';
import assert from 'node:assert';
import { judgeService } from '../src/services/judgeService.js';
import { njdgService } from '../src/services/njdgService.js';
import { eCourtsService } from '../src/services/eCourtsService.js';
import { queryJusticeAI, OFFICIAL_DATA_FRESHNESS } from '../src/services/aiBridgeService.js';
import { documentService } from '../src/services/documentService.js';

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
});
