import test from 'node:test'
import assert from 'node:assert/strict'

test('Official Government Links and Portals Verification', async (t) => {
  const verifiedPortals = [
    { name: 'Department of Justice', url: 'https://doj.gov.in' },
    { name: 'eCourts Services', url: 'https://ecourts.gov.in' },
    { name: 'eCourts Citizen Portal', url: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus' },
    { name: 'National Judicial Data Grid (NJDG)', url: 'https://njdg.ecourts.gov.in' },
    { name: 'eFiling Portal', url: 'https://filing.ecourts.gov.in' },
    { name: 'ePay Court Fees', url: 'https://pay.ecourts.gov.in' },
    { name: 'Tele-Law National Portal', url: 'https://tele-law.in' },
    { name: 'CSC Cloud Locator', url: 'https://locator.csccloud.in' },
    { name: 'Supreme Court of India', url: 'https://main.sci.gov.in' },
    { name: 'DoJ Fast Track Special Courts', url: 'https://doj.gov.in/fast-track-special-court-ftsc/' },
    { name: 'DoJ Judicial Appointments', url: 'https://doj.gov.in/appointments-of-judges/' },
    { name: 'Court Live Proceedings', url: 'https://liveproceedings.ecourts.gov.in' },
  ]

  await t.test('all official portal links use secure HTTPS protocol', () => {
    for (const portal of verifiedPortals) {
      assert.strictEqual(
        portal.url.startsWith('https://'),
        true,
        `${portal.name} URL must start with https://`
      )
    }
  })

  await t.test('all official portal domains end in authorized TLD (.gov.in or .in)', () => {
    for (const portal of verifiedPortals) {
      const hostname = new URL(portal.url).hostname
      const isGov = hostname.endsWith('.gov.in') || hostname.endsWith('.in') || hostname.endsWith('.nic.in')
      assert.strictEqual(
        isGov,
        true,
        `${portal.name} domain ${hostname} must belong to official .gov.in or .in registry`
      )
    }
  })

  await t.test('no placeholder hash links exist in portal directory', () => {
    for (const portal of verifiedPortals) {
      assert.strictEqual(portal.url.includes('#'), false, `Portal ${portal.name} must not be a hash link`)
    }
  })
})
