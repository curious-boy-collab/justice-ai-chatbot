import http from 'http'
import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const DIST_DIR = path.resolve('frontend/dist')
const SCREENSHOTS_DIR = path.resolve('docs/screenshots')
const PORT = 5174
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

const SEED_SCRIPT = `
<script>
try {
  const demoSession = {
    id: 'demo-session-citations',
    title: 'Tele-Law Scheme and Legal Aid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: 'en',
    messages: [
      {
        id: 'msg-u1',
        role: 'user',
        content: 'How can rural citizens access free legal advice under the Tele-Law program?',
        timestamp: new Date().toISOString()
      },
      {
        id: 'msg-a1',
        role: 'assistant',
        content: 'Citizens can access legal aid and pre-litigation advice through the **Tele-Law program** established by the Department of Justice in partnership with NALSA.\\n\\n### Key Steps to Access:\\n1. **Visit Nearest CSC**: Approach the nearest Common Services Centre (CSC) in your gram panchayat.\\n2. **VLE Assistance**: The Village Level Entrepreneur (VLE) registers the consultation.\\n3. **Video/Audio Consultation**: Connect directly with an empanelled advocate via video conference or telephone.\\n4. **Tele-Law Mobile App**: Citizens can also register directly on the Tele-Law Mobile App for Android/iOS.\\n\\nLegal advice is provided **completely free of cost** to all persons eligible under Section 12 of the Legal Services Authorities Act, 1987.',
        timestamp: new Date().toISOString(),
        dataStatus: 'official_reference',
        retrieval: {
          documentCount: 4,
          chunksRetrieved: 8,
          confidence: 'high',
          confidenceScore: 0.95
        },
        sources: [
          {
            title: 'Tele-Law Official Portal — Department of Justice',
            url: 'https://www.tele-law.in',
            label: 'Official Government Portal',
            category: 'Legal Aid & Advice',
            snippet: 'Tele-Law connects marginalized citizens with panel lawyers at Common Services Centres.'
          },
          {
            title: 'National Legal Services Authority (NALSA)',
            url: 'https://nalsa.gov.in',
            label: 'Statutory Body',
            category: 'Legal Services Authorities Act',
            snippet: 'Section 12 free legal aid eligibility criteria and nationwide legal assistance.'
          },
          {
            title: 'Department of Justice Access to Justice Division',
            url: 'https://doj.gov.in/tele-law-scheme/',
            label: 'Central Ministry',
            category: 'e-Governance Initiative',
            snippet: 'Digital delivery of legal assistance across 2.5 lakh gram panchayats.'
          }
        ],
        suggestedQuestions: [
          'Who is eligible for free legal services under Section 12 of LSA Act?',
          'What documents are needed to schedule a Tele-Law consultation?',
          'How do I find the nearest Common Services Centre (CSC)?'
        ]
      }
    ]
  };
  localStorage.setItem('justice_ai_chat_sessions_v3', JSON.stringify([demoSession]));
  localStorage.setItem('justice_ai_active_session_v3', 'demo-session-citations');
} catch (e) {
  console.error('Seed failed', e);
}
</script>
`

// Static server with API 503 responder and seed script injection
const server = http.createServer((req, res) => {
  const [pathname, queryString] = req.url.split('?')
  const cleanPath = pathname.split('#')[0]

  // If request is to /api, return a proper JSON 503 so frontend gracefully falls back to verified baselines
  if (cleanPath.startsWith('/api')) {
    res.writeHead(503, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: false, error: 'Live API not running during static capture' }))
    return
  }

  let filePath = path.join(DIST_DIR, cleanPath === '/' ? 'index.html' : cleanPath)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html')
  }

  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end('Error loading file')
      return
    }

    if (filePath.endsWith('index.html') && queryString && queryString.includes('seed=citations')) {
      const htmlStr = content.toString('utf-8').replace('</head>', `${SEED_SCRIPT}</head>`)
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(htmlStr)
    } else {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content)
    }
  })
})

async function capture(url, outputFile, width, height) {
  console.log(`Capturing ${path.basename(outputFile)} (${width}x${height}) from ${url}...`)
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-sandbox',
    '--user-data-dir=/tmp/chrome-headless-user-data',
    `--window-size=${width},${height}`,
    '--virtual-time-budget=3000',
    `--screenshot=${outputFile}`,
    url,
  ]
  await execFileAsync(CHROME_PATH, args)
  const stats = fs.statSync(outputFile)
  console.log(`Saved: ${path.basename(outputFile)} (${Math.round(stats.size / 1024)} KB)`)
}

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
  }

  server.listen(PORT, async () => {
    console.log(`Static server running at http://localhost:${PORT}`)
    try {
      // 1. Landing Desktop (1440x900)
      await capture(`http://localhost:${PORT}/`, path.join(SCREENSHOTS_DIR, 'landing-desktop.png'), 1440, 900)

      // 2. Landing Mobile (390x844)
      await capture(`http://localhost:${PORT}/`, path.join(SCREENSHOTS_DIR, 'landing-mobile.png'), 390, 844)

      // 3. Chat Interface Empty State (1440x900)
      await capture(`http://localhost:${PORT}/#/chat`, path.join(SCREENSHOTS_DIR, 'chat-interface.png'), 1440, 900)

      // 4. Chat Citations View with Active Response & Citations (1440x900)
      await capture(`http://localhost:${PORT}/?seed=citations#/chat`, path.join(SCREENSHOTS_DIR, 'chat-citations.png'), 1440, 900)

      // 5. NJDG Dashboard (1440x900)
      await capture(`http://localhost:${PORT}/#/njdg`, path.join(SCREENSHOTS_DIR, 'njdg-dashboard.png'), 1440, 900)

      // 6. Case Status Interface (1440x900)
      await capture(`http://localhost:${PORT}/#/case-status`, path.join(SCREENSHOTS_DIR, 'case-status.png'), 1440, 900)

      // 7. Government Services Directory (1440x900)
      await capture(`http://localhost:${PORT}/#/services`, path.join(SCREENSHOTS_DIR, 'services-desktop.png'), 1440, 900)

      // 8. Judge Vacancies & Strength Cards (1440x900)
      await capture(`http://localhost:${PORT}/#/judge-vacancy`, path.join(SCREENSHOTS_DIR, 'judge-vacancies.png'), 1440, 900)

      console.log('\nAll 8 screenshots successfully captured and verified!')
    } catch (err) {
      console.error('Screenshot capture failed:', err)
    } finally {
      server.close()
      process.exit(0)
    }
  })
}

main()
