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

describe('JusticeAI Backend API Tests (Day 1)', () => {
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

  it('POST /api/chat - rejects empty input with 400', async () => {
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

  it('POST /api/chat - handles Judge vacancy query in English', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What are the current judge vacancies in High Courts?' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'JUDGE_VACANCIES');
    assert.ok(body.sessionId);
    assert.ok(body.reply.includes('Supreme Court'));
    assert.ok(body.dataCard);
    assert.strictEqual(body.dataCard.type, 'JUDGE_VACANCY');
    assert.ok(Array.isArray(body.citations));
    assert.ok(body.citations.length > 0);
  });

  it('POST /api/chat - handles NJDG pendency query', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Tell me about case pendency statistics on NJDG' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.intent, 'NJDG_STATISTICS');
    assert.ok(body.reply.includes('National Judicial Data Grid'));
    assert.strictEqual(body.dataCard.type, 'NJDG_STATS');
  });

  it('POST /api/chat - handles Virtual Courts traffic fine procedure in Hindi', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'वर्चुअल कोर्ट से ट्रैफिक चालान कैसे भरें?', language: 'hi' })
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.language, 'hi');
    assert.strictEqual(body.intent, 'VIRTUAL_COURTS_PROCEDURE');
    assert.ok(body.reply.includes('चालान'));
    assert.strictEqual(body.dataCard.type, 'PROCEDURAL_GUIDE');
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
});
