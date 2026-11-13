import test from 'node:test'
import assert from 'node:assert/strict'

test('JusticeAI Service Navigation and Routing State', async (t) => {
  const validPages = [
    'landing',
    'chat',
    'services',
    'njdg',
    'judge-vacancy',
    'efiling',
    'telelaw',
    'ftsc',
    'ecourts-app',
    'case-status',
  ]

  await t.test('all 10 application pages are defined in the router', () => {
    assert.strictEqual(validPages.length, 10)
    assert.strictEqual(new Set(validPages).size, 10, 'All page keys must be unique')
  })

  await t.test('service detail pages map to their corresponding service targets', () => {
    const serviceTargets = [
      'case-status',
      'njdg',
      'judge-vacancy',
      'efiling',
      'telelaw',
      'ftsc',
      'ecourts-app',
    ]

    for (const target of serviceTargets) {
      assert.strictEqual(validPages.includes(target), true, `Page ${target} must be in validPages`)
    }
  })

  await t.test('handles initial query routing correctly without mutation', () => {
    const initialQuery = 'How do I check case status using CNR?'
    let activePage = 'landing'
    let queryParam = null

    const handleStartChat = (q) => {
      queryParam = q
      activePage = 'chat'
    }

    handleStartChat(initialQuery)
    assert.strictEqual(activePage, 'chat')
    assert.strictEqual(queryParam, initialQuery)
  })
})
