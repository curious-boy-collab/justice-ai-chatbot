/**
 * JusticeAI Test Runner for AI/RAG Module
 * Developer: Nitin (AI / RAG Developer)
 * 
 * Validates Day 1 AI architecture and retrieval pipeline across
 * all 22 sample citizen questions in English and Hindi.
 */

const { askJusticeAI } = require('../index');
const testSuite = require('./sample_questions.json');

async function runTestSuite() {
  console.log('===============================================================');
  console.log('       JusticeAI – AI/RAG Architecture Test Suite (Day 1)      ');
  console.log(`       Target: ${testSuite.totalQuestions} Questions across 10 Categories + Guardrails   `);
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;
  const startTime = Date.now();

  for (const item of testSuite.questions) {
    process.stdout.write(`[${item.id}] [${item.language.toUpperCase()}] ${item.category} ... `);

    try {
      const response = await askJusticeAI(item.query, item.language);

      // Validation assertions
      const hasAnswer = response && typeof response.answer === 'string' && response.answer.length > 30;
      const hasLanguage = response.language === item.language;
      const hasSources = Array.isArray(response.sources) && response.sources.length > 0 && response.sources[0].url;
      const hasContractFields = response.dataStatus === 'official_reference' && Boolean(response.lastChecked);

      if (hasAnswer && hasLanguage && hasSources && hasContractFields) {
        console.log('PASSED ✅');
        passed++;
      } else {
        console.log('FAILED ❌');
        console.error('   Assertion failure:', {
          hasAnswer,
          hasLanguage,
          hasSources,
          hasContractFields,
        });
        failed++;
      }
    } catch (err) {
      console.log(`ERROR ⚠️ (${err.message})`);
      failed++;
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n===============================================================');
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed out of ${testSuite.questions.length} tests`);
  console.log(`Duration: ${duration}s`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exitCode = 1;
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
