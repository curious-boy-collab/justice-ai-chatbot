import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from '../src/app.js';

let server;
const TEST_PORT = 5056;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sampleQuestionsPath = path.resolve(__dirname, '../../ai/tests/sample_questions.json');
const sampleData = JSON.parse(fs.readFileSync(sampleQuestionsPath, 'utf-8'));
const questions = sampleData.questions || [];

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

describe('JusticeAI End-to-End Chat API Validation with Official Questions', () => {
  for (const item of questions) {
    it(`[${item.id}] [${(item.language || 'en').toUpperCase()}] ${item.category} - "${(item.query || '').substring(0, 40)}..."`, async () => {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query: item.query,
          language: item.language
        })
      });

      assert.strictEqual(res.status, 200);

      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.ok(body.answer && body.answer.length > 20, 'Answer must not be empty');
      assert.strictEqual(body.answer, body.reply, 'answer and reply should match');
      if (item.expectedIntent) {
        assert.strictEqual(body.intent, item.expectedIntent);
      }
      assert.ok(Array.isArray(body.sources), 'Sources must be an array');
      assert.ok(Array.isArray(body.suggestedQuestions), 'Suggested questions must be an array');
    });
  }
});
