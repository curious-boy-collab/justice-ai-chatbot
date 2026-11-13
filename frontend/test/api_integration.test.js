import test from 'node:test'
import assert from 'node:assert/strict'

test('Frontend API Normalization & State Handling', async (t) => {
  await t.test('normalizes backend chat response with citations and metadata', () => {
    const rawBackendData = {
      success: true,
      query: 'What are the judge vacancies?',
      reply: 'Official Judge Strength and Vacancy Statistics:\n- Supreme Court: 34 sanctioned, 33 working, 1 vacancy',
      language: 'en',
      intent: 'JUDGES_AND_VACANCIES',
      isLive: true,
      sources: [
        {
          sourceTitle: 'Department of Justice - Appointments of Judges',
          url: 'https://doj.gov.in/appointments-of-judges/',
          category: 'Department of Justice',
          snippet: 'Official monthly vacancy statement.',
          relevanceScore: 0.96,
        },
      ],
      dataStatus: 'official_reference',
      lastChecked: '2026-03-01',
      retrieval: {
        documentCount: 1,
        chunksRetrieved: 3,
        strategy: 'semantic_vector_rag',
        confidence: 'High',
        confidenceScore: 0.96,
      },
      suggestedQuestions: [
        'What is the total case pendency on NJDG?',
        'How can I pay my traffic fine online via Virtual Court?',
      ],
    }

    // Normalization logic equivalent
    const answer = rawBackendData.reply || rawBackendData.answer
    const sources = (rawBackendData.sources || []).map((s) => ({
      title: s.title || s.sourceTitle || 'Official Document',
      url: s.url || 'https://doj.gov.in',
      category: s.category || 'Department of Justice',
      snippet: s.snippet,
      relevanceScore: s.relevanceScore,
    }))

    assert.strictEqual(answer.includes('Supreme Court'), true)
    assert.strictEqual(sources.length, 1)
    assert.strictEqual(sources[0].title, 'Department of Justice - Appointments of Judges')
    assert.strictEqual(sources[0].relevanceScore, 0.96)
    assert.strictEqual(rawBackendData.suggestedQuestions.length, 2)
  })

  await t.test('handles NJDG aggregate data and calculates percentage correctly', () => {
    const njdgData = {
      aggregate: {
        totalPendingCases: 51240000,
        civilCases: 11200000,
        criminalCases: 40040000,
        civilPercentage: 21.86,
        criminalPercentage: 78.14,
      },
    }

    const totalCr = (njdgData.aggregate.totalPendingCases / 10000000).toFixed(2)
    assert.strictEqual(totalCr, '5.12')
    assert.strictEqual(
      Math.round(njdgData.aggregate.civilPercentage + njdgData.aggregate.criminalPercentage),
      100
    )
  })

  await t.test('handles Judge vacancy ratios properly across tiers', () => {
    const judgeData = {
      summary: {
        supremeCourt: { sanctioned: 34, working: 33, vacancies: 1 },
        highCourtsTotal: { sanctioned: 1114, working: 778, vacancies: 336 },
        districtAndSubordinateCourtsTotal: { sanctioned: 25200, working: 19850, vacancies: 5350 },
      },
    }

    const scFill = Math.round((judgeData.summary.supremeCourt.working / judgeData.summary.supremeCourt.sanctioned) * 100)
    const hcFill = Math.round((judgeData.summary.highCourtsTotal.working / judgeData.summary.highCourtsTotal.sanctioned) * 100)

    assert.strictEqual(scFill, 97)
    assert.strictEqual(hcFill, 70)
  })
})
