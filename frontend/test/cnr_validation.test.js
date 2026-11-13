import test from 'node:test'
import assert from 'node:assert/strict'

test('CNR Number Validation and Parsing Logic', async (t) => {
  const cnrPattern = /^[A-Z]{4}\d{2}\d{6}\d{4}$/

  await t.test('accepts valid 16-character alphanumeric CNR format', () => {
    const validCnrs = [
      'DLHC010012342023',
      'MHBB010056782024',
      'KABC010098762022',
      'UPAL010043212021',
    ]

    for (const cnr of validCnrs) {
      assert.strictEqual(cnrPattern.test(cnr), true, `Should accept valid CNR: ${cnr}`)
    }
  })

  await t.test('rejects CNRs with invalid length or characters', () => {
    const invalidCnrs = [
      '',
      'DLHC',
      'DLHC01001234',
      'DLHC01001234202399',
      'dlhc010012342023', // lowercase
      'DLHC-01-001234-2023', // punctuation
      'DL12010012342023', // digits where letters expected
    ]

    for (const cnr of invalidCnrs) {
      assert.strictEqual(cnrPattern.test(cnr), false, `Should reject invalid CNR: ${cnr}`)
    }
  })

  await t.test('parses components of a valid CNR correctly', () => {
    const cnr = 'DLHC010012342023'
    const stateCode = cnr.substring(0, 2)
    const courtCode = cnr.substring(2, 6)
    const caseNumber = cnr.substring(6, 12)
    const filingYear = cnr.substring(12, 16)

    assert.strictEqual(stateCode, 'DL')
    assert.strictEqual(courtCode, 'HC01')
    assert.strictEqual(caseNumber, '001234')
    assert.strictEqual(filingYear, '2023')
  })
})
