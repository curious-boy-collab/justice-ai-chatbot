import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';

let server;
const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

before(() => {
  return new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      resolve();
    });
  });
});

after(() => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

describe('JusticeAI Backend API Tests (Day 3 — RAG Integration, Sources & Knowledge Base)', () => {
  it('GET /api/health - returns 200 and healthy status including documentService', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.status, 'healthy');
    assert.strictEqual(body.version, '1.0.0');
    assert.strictEqual(body.service, 'justiceai-backend');
    assert.strictEqual(body.modules.chat, 'active');
    assert.strictEqual(body.modules.documentService, 'active');
    assert.strictEqual(body.modules.ragRetriever, 'active');
  });

  it('POST /api/chat - rejects empty input with 400 INVALID_INPUT', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' })
    });
    assert.strictEqual(res.status, 400);

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'INVALID_INPUT');
  });

  it('POST /api/chat - rejects whitespace-only query with 400', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '    ' })
    });
    assert.strictEqual(res.status, 400);

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'INVALID_INPUT');
  });

  it('POST /api/chat - rejects oversized input (>2000 chars) with 400', async () => {
    const hugeMessage = 'a'.repeat(2001);
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: hugeMessage })
    });
    assert.strictEqual(res.status, 400);

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'MESSAGE_TOO_LONG');
  });

  it('POST /api/chat - returns RAG answer with source metadata & data freshness', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What is Tele-Law and how does it help citizens?', topK: 3 })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'TELE_LAW');
    assert.ok(body.answer && body.answer.length > 20);
    assert.strictEqual(body.answer, body.reply);

    // Verify Data Freshness metadata
    assert.ok(body.dataFreshness, 'Response must include dataFreshness object');
    assert.ok(body.dataFreshness.lastUpdated);
    assert.strictEqual(body.dataFreshness.sourceStatus, 'verified_official');
    assert.ok(body.dataFreshness.disclaimer);

    // Verify rich Sources metadata
    assert.ok(Array.isArray(body.sources), 'Sources must be an array');
    assert.ok(body.sources.length > 0);
    const src = body.sources[0];
    assert.ok(src.title);
    assert.ok(src.url);
    assert.ok(src.category, 'Source must include category metadata');
    assert.ok(src.snippet !== undefined, 'Source must include snippet');

    // Verify Citations
    assert.ok(Array.isArray(body.citations));
    assert.ok(body.citations.length > 0);
    assert.ok(body.citations[0].sourceTitle);
    assert.ok(body.citations[0].url);

    // Verify Retrieval metadata
    assert.ok(body.retrieval);
    assert.strictEqual(body.retrieval.isRetrievedFromKnowledgeBase, true);
    assert.strictEqual(body.retrieval.topK, 3);
  });

  it('POST /api/chat - handles Judge vacancy query in English (JUDGES_AND_VACANCIES)', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What are the current judge vacancies in High Courts?' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'JUDGES_AND_VACANCIES');
    assert.ok(body.dataCard);
    assert.strictEqual(body.dataCard.type, 'JUDGE_VACANCY');
    assert.ok(body.dataFreshness);
  });

  it('POST /api/chat - handles NJDG pendency query (NJDG_PENDENCY)', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Tell me about case pendency statistics on NJDG' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'NJDG_PENDENCY');
    assert.ok(body.dataCard);
    assert.strictEqual(body.dataCard.type, 'NJDG_STATS');
  });

  it('POST /api/chat - handles Virtual Courts traffic fine procedure in Hindi (TRAFFIC_FINES)', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'वर्चुअल कोर्ट से ट्रैफिक चालान कैसे भरें?', language: 'hi' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.language, 'hi');
    assert.strictEqual(body.intent, 'TRAFFIC_FINES');
    assert.ok(body.answer);
    assert.strictEqual(body.dataCard.type, 'PROCEDURAL_GUIDE');
  });

  it('POST /api/chat - handles Fast Track Special Courts (FAST_TRACK_COURTS)', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What are Fast Track Special Courts for POCSO cases?' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'FAST_TRACK_COURTS');
    assert.ok(body.dataCard);
  });

  it('POST /api/chat - handles non-judicial out-of-scope query gracefully (OUT_OF_SCOPE)', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What is the recipe for biryani?' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'OUT_OF_SCOPE');
    assert.ok(body.answer);
  });

  // --- Document Service Interface Tests ---
  it('GET /api/documents - lists indexed official knowledge documents', async () => {
    const res = await fetch(`${BASE_URL}/documents`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.count >= 10);
    assert.ok(Array.isArray(body.documents));
    const first = body.documents[0];
    assert.ok(first.id);
    assert.ok(first.title);
    assert.ok(first.category);
    assert.ok(first.url);
    assert.ok(first.status);
    assert.ok(first.fileSizeBytes > 0);
  });

  it('GET /api/documents/stats - returns knowledge base metrics', async () => {
    const res = await fetch(`${BASE_URL}/documents/stats`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.totalDocuments >= 10);
    assert.ok(body.totalChunks >= 60);
    assert.ok(body.categoriesCount > 0);
    assert.ok(body.dataFreshness);
  });

  it('GET /api/documents/search - semantic search via query param', async () => {
    const res = await fetch(`${BASE_URL}/documents/search?q=Tele-Law&topK=2`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.query, 'Tele-Law');
    assert.ok(body.results.length > 0);
    assert.ok(body.results[0].title);
    assert.ok(body.results[0].snippet);
    assert.ok(body.results[0].relevanceScore > 0);
  });

  it('POST /api/documents/search - semantic search via POST body', async () => {
    const res = await fetch(`${BASE_URL}/documents/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Virtual Courts eChallan', topK: 3 })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.results.length > 0);
  });

  it('GET /api/documents/search - rejects missing query with 400', async () => {
    const res = await fetch(`${BASE_URL}/documents/search`);
    assert.strictEqual(res.status, 400);

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'INVALID_SEARCH_QUERY');
  });

  it('GET /api/documents/:id - retrieves specific document content', async () => {
    const res = await fetch(`${BASE_URL}/documents/doj/tele_law_services`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.document.id, 'doj/tele_law_services');
    assert.ok(body.document.rawContent.includes('Tele-Law'));
    assert.ok(Array.isArray(body.document.chunks));
  });

  it('GET /api/documents/:id - returns 404 for non-existent document', async () => {
    const res = await fetch(`${BASE_URL}/documents/doj/unknown_document_xyz`);
    assert.strictEqual(res.status, 404);

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'DOCUMENT_NOT_FOUND');
  });

  // --- Statistics and Cases Endpoints ---
  it('GET /api/stats/judges - returns official judge strengths and vacancies', async () => {
    const res = await fetch(`${BASE_URL}/stats/judges`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.summary.supremeCourt.sanctioned, 34);
    assert.strictEqual(body.summary.supremeCourt.working, 33);
  });

  it('GET /api/stats/njdg - returns NJDG aggregate statistics', async () => {
    const res = await fetch(`${BASE_URL}/stats/njdg`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.aggregate.totalPendingCases > 0);
  });

  it('GET /api/cases/lookup - validates 16-character CNR number', async () => {
    const res = await fetch(`${BASE_URL}/cases/lookup?cnr=DLHC010012342023`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.isValidCnrFormat, true);
  });

  it('GET /api/cases/lookup - rejects invalid CNR with 400', async () => {
    const res = await fetch(`${BASE_URL}/cases/lookup?cnr=INVALID123`);
    assert.strictEqual(res.status, 400);

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'INVALID_CNR_FORMAT');
  });

  it('OPTIONS /api/chat - returns CORS preflight headers properly', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    assert.strictEqual(res.status, 204);
    assert.strictEqual(res.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  });

  // ==========================================
  // DAY 4 — GOVERNMENT SERVICES & JUDICIAL INFO
  // ==========================================

  it('GET /api/doj/overview - returns official Department of Justice overview', async () => {
    const res = await fetch(`${BASE_URL}/doj/overview`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.department, 'Department of Justice');
    assert.strictEqual(body.ministry, 'Ministry of Law and Justice');
    assert.ok(body.officialPortals.departmentPortal.includes('doj.gov.in'));
    assert.strictEqual(body.dataFreshness.sourceStatus, 'verified_official');
    assert.strictEqual(body.dataFreshness.isLive, false);
  });

  it('GET /api/doj/divisions - returns 7 administrative divisions with mandates', async () => {
    const res = await fetch(`${BASE_URL}/doj/divisions`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.count, 7);
    assert.ok(Array.isArray(body.divisions));

    const divisionIds = body.divisions.map((d) => d.id);
    assert.ok(divisionIds.includes('appointments-admin'));
    assert.ok(divisionIds.includes('access-to-justice'));
    assert.ok(divisionIds.includes('ecourts-project'));
    assert.ok(divisionIds.includes('judicial-infrastructure'));
    assert.ok(divisionIds.includes('fast-track-courts'));
    assert.ok(divisionIds.includes('judicial-reforms-nja'));
    assert.ok(divisionIds.includes('nalsa-coordination'));
  });

  it('GET /api/doj/schemes - returns centrally sponsored and key justice schemes', async () => {
    const res = await fetch(`${BASE_URL}/doj/schemes`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.count >= 6);

    const schemeIds = body.schemes.map((s) => s.id);
    assert.ok(schemeIds.includes('tele-law'));
    assert.ok(schemeIds.includes('ftsc'));
    assert.ok(schemeIds.includes('css-judicial-infra'));
    assert.ok(schemeIds.includes('nyaya-bandhu'));
    assert.ok(schemeIds.includes('ecourts-phase-3'));
  });

  it('GET /api/stats/judges/high-courts - returns directory of all 25 High Courts', async () => {
    const res = await fetch(`${BASE_URL}/stats/judges/high-courts`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.count, 25);
    assert.strictEqual(body.highCourts.length, 25);
    assert.ok(body.highCourts.find((h) => h.code === 'delhi'));
    assert.ok(body.highCourts.find((h) => h.code === 'bombay'));
    assert.ok(body.highCourts.find((h) => h.code === 'allahabad'));
  });

  it('GET /api/stats/judges/high-courts/:code - returns specific High Court details', async () => {
    const res = await fetch(`${BASE_URL}/stats/judges/high-courts/delhi`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.highCourt.code, 'delhi');
    assert.strictEqual(body.highCourt.sanctioned, 60);
    assert.strictEqual(body.highCourt.working, 44);
    assert.strictEqual(body.highCourt.vacancies, 16);
  });

  it('GET /api/stats/judges/high-courts/:code - returns 404 for unknown court code', async () => {
    const res = await fetch(`${BASE_URL}/stats/judges/high-courts/non-existent-court`);
    assert.strictEqual(res.status, 404);

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'HIGH_COURT_NOT_FOUND');
  });

  it('GET /api/stats/judges/appointment-procedure - returns collegium & constitutional basis', async () => {
    const res = await fetch(`${BASE_URL}/stats/judges/appointment-procedure`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.collegiumStructure.supremeCourtCollegium);
    assert.ok(body.workflowSteps.length >= 4);
  });

  it('GET /api/stats/njdg/court-breakdown - returns pendency across all judicial tiers', async () => {
    const res = await fetch(`${BASE_URL}/stats/njdg/court-breakdown`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.isLive, false);
    assert.strictEqual(body.dataStatus, 'official_snapshot');
    assert.ok(body.courtLevels.length >= 4);
    assert.ok(body.courtLevels.find((c) => c.courtType === 'SUPREME_COURT'));
    assert.ok(body.courtLevels.find((c) => c.courtType === 'HIGH_COURT'));
    assert.ok(body.courtLevels.find((c) => c.courtType === 'DISTRICT_COURT'));
  });

  it('GET /api/stats/njdg/age-wise - returns age bracket pendency distribution', async () => {
    const res = await fetch(`${BASE_URL}/stats/njdg/age-wise`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.brackets.length >= 5);
    assert.ok(body.totalPendingCases > 50000000);
  });

  it('GET /api/stats/njdg/state-wise - returns state-level caseload distributions', async () => {
    const res = await fetch(`${BASE_URL}/stats/njdg/state-wise`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.count >= 10);
    assert.ok(body.states.find((s) => s.state === 'Uttar Pradesh'));
    assert.ok(body.states.find((s) => s.state === 'Maharashtra'));
  });

  it('GET /api/services - lists citizen services with official portal URLs', async () => {
    const res = await fetch(`${BASE_URL}/services`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.count, 7);
    assert.ok(body.services.find((s) => s.id === 'virtual-courts'));
    assert.ok(body.services.find((s) => s.id === 'efiling'));
    assert.ok(body.services.find((s) => s.id === 'tele-law'));
  });

  it('GET /api/services/virtual-courts - returns active states & procedure', async () => {
    const res = await fetch(`${BASE_URL}/services/virtual-courts`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.directory.statesCount >= 8);
    assert.ok(body.guide.steps.length >= 4);
    assert.strictEqual(body.guide.officialPortalUrl, 'https://vcourts.gov.in');
  });

  it('GET /api/services/virtual-courts?lang=hi - returns Hindi guidance', async () => {
    const res = await fetch(`${BASE_URL}/services/virtual-courts?lang=hi`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.guide.title.includes('वर्चुअल कोर्ट'));
  });

  it('GET /api/services/efiling - returns eFiling 3.0 & ePay instructions', async () => {
    const res = await fetch(`${BASE_URL}/services/efiling`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.steps.length >= 5);
    assert.ok(body.requirements.length >= 2);
    assert.strictEqual(body.officialPortalUrl, 'https://efiling.ecourts.gov.in');
  });

  it('GET /api/services/tele-law - returns helpline & Section 12 criteria', async () => {
    const res = await fetch(`${BASE_URL}/services/tele-law`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.helpline, '14416 (Toll-free National Helpline)');
    assert.ok(body.officialUrl.includes('tele-law.in'));
  });

  it('GET /api/services/ftsc - returns Fast Track Special Courts data', async () => {
    const res = await fetch(`${BASE_URL}/services/ftsc`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.operationalCount.includes('750'));
    assert.ok(body.officialUrl.includes('doj.gov.in'));
  });

  it('GET /api/services/mobile-app - returns eCourts Services app download links', async () => {
    const res = await fetch(`${BASE_URL}/services/mobile-app`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.downloadLinks.android.includes('play.google.com'));
    assert.ok(body.downloadLinks.ios.includes('apps.apple.com'));
  });

  it('GET /api/services/live-streaming - returns streaming links and compliance notice', async () => {
    const res = await fetch(`${BASE_URL}/services/live-streaming`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.courtsWithStreaming.length >= 5);
    assert.ok(body.rulesNotice);
  });

  it('GET /api/cases/lookup - returns demo sandbox case with rich docket details', async () => {
    const res = await fetch(`${BASE_URL}/cases/lookup?cnr=DLHC010012342023`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.isValidCnrFormat, true);
    assert.strictEqual(body.dataStatus, 'demo_sandbox');
    assert.strictEqual(body.isLive, false);
    assert.strictEqual(body.cnr, 'DLHC010012342023');
    assert.strictEqual(body.caseTitle, 'Aarav Sharma vs. State of NCT of Delhi & Anr.');
    assert.ok(body.petitioner);
    assert.ok(body.respondent);
    assert.ok(body.nextHearingDate);
  });

  it('GET /api/cases/lookup - valid CNR outside demo returns live CAPTCHA redirection notice', async () => {
    const res = await fetch(`${BASE_URL}/cases/lookup?cnr=PBCH010099992024`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.isValidCnrFormat, true);
    assert.strictEqual(body.dataStatus, 'live_lookup_requires_captcha');
    assert.strictEqual(body.isLive, false);
    assert.strictEqual(body.cnr, 'PBCH010099992024');
    assert.strictEqual(body.parsed.stateCode, 'PB');
    assert.strictEqual(body.parsed.courtCode, 'CH01');
    assert.strictEqual(body.parsed.caseNumber, '009999');
    assert.strictEqual(body.parsed.filingYear, '2024');
    assert.ok(body.guidance.step1);
    assert.ok(body.smsService);
    assert.ok(body.officialPortalUrl.includes('services.ecourts.gov.in'));
  });

  it('GET /api/cases/guidance - returns procedural guidance on finding CNR numbers', async () => {
    const res = await fetch(`${BASE_URL}/cases/guidance`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.whereToFindCNR.length >= 3);
    assert.ok(body.alternativeSearchMethods.length >= 4);
  });

  it('GET /api/cases/demo-samples - returns curated sandbox cases list', async () => {
    const res = await fetch(`${BASE_URL}/cases/demo-samples`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.samples.length >= 3);
    assert.ok(body.samples.find((s) => s.cnr === 'DLHC010012342023'));
  });
});
