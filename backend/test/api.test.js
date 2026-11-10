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

describe('JusticeAI Backend API Tests (Day 2 — Core Chatbot & RAG Integration)', () => {
  it('GET /api/health - returns 200 and healthy status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.status, 'healthy');
    assert.strictEqual(body.version, '1.0.0');
    assert.strictEqual(body.service, 'justiceai-backend');
    assert.strictEqual(body.modules.chat, 'active');
    assert.strictEqual(body.modules.njdgService, 'active');
    assert.strictEqual(body.modules.judgeService, 'active');
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

  it('POST /api/chat - accepts { query } payload format from Frontend', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What is Tele-Law?' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'TELE_LAW');
    assert.ok(body.answer);
    assert.ok(body.reply);
    assert.strictEqual(body.answer, body.reply);
    assert.ok(Array.isArray(body.sources));
    assert.ok(body.sources.length > 0);
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
    assert.ok(body.sessionId);
    assert.ok(body.answer.length > 20);
    assert.ok(body.dataCard);
    assert.strictEqual(body.dataCard.type, 'JUDGE_VACANCY');
    assert.ok(Array.isArray(body.citations));
    assert.ok(body.citations.length > 0);
    assert.ok(Array.isArray(body.sources));
    assert.ok(Array.isArray(body.suggestedQuestions));
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

  it('POST /api/chat - handles eCourts Mobile App query (ECOURTS_APP)', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'How to download eCourts Services mobile application?' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'ECOURTS_APP');
  });

  it('POST /api/chat - handles Live Streaming of Court Proceedings (LIVE_STREAMING)', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Can citizens watch live streaming of court proceedings?' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'LIVE_STREAMING');
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

  it('GET /api/stats/judges - returns official judge strengths and vacancies', async () => {
    const res = await fetch(`${BASE_URL}/stats/judges`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.summary.supremeCourt.sanctioned, 34);
    assert.strictEqual(body.summary.supremeCourt.working, 33);
    assert.strictEqual(body.summary.highCourtsTotal.courtCount, 25);
  });

  it('GET /api/stats/njdg - returns NJDG aggregate statistics', async () => {
    const res = await fetch(`${BASE_URL}/stats/njdg`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.aggregate.totalPendingCases > 0);
    assert.ok(body.aggregate.civilPercentage > 0);
    assert.ok(body.aggregate.criminalPercentage > 0);
  });

  it('GET /api/cases/lookup - validates 16-character CNR number', async () => {
    const res = await fetch(`${BASE_URL}/cases/lookup?cnr=DLHC010012342023`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.isValidCnrFormat, true);
    assert.strictEqual(body.parsed.stateCode, 'DL');
    assert.strictEqual(body.parsed.filingYear, '2023');
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
});
