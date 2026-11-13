# 🏛️ JusticeAI — AI-Powered Department of Justice Virtual Assistant

> **Official Virtual Assistant for the Department of Justice, Ministry of Law & Justice, Government of India**  
> *Bridging Indian Citizens with Judicial Information, Digital Court Services, Higher Judiciary Statistics, and Legal Aid through Grounded AI and RAG Retrieval.*

---

## 📌 Executive Summary & Problem Statement

The **Department of Justice (DoJ)** performs essential functions for judicial administration, court infrastructure, Fast Track Special Courts (FTSCs), legal aid to marginalized citizens, and the National eCourts Project. However, citizens, litigants, and advocates often face challenges navigating diverse portals (`doj.gov.in`, `ecourts.gov.in`, `njdg.ecourts.gov.in`, `vcourts.gov.in`, `tele-law.in`) to find accurate judicial information.

**JusticeAI** solves this challenge through an intelligent, bilingual digital assistant that:
1. **Understands Natural Language**: Interacts seamlessly in **English, Hindi, and Hinglish**.
2. **Retrieves Grounded Answers (RAG)**: Employs Retrieval-Augmented Generation over 10 official Department of Justice documents and 105 indexed knowledge chunks.
3. **Cites Official Sources**: Appends verified government URLs and relevant text snippets to every answer.
4. **Delivers Authoritative Judicial Statistics**: Provides snapshot metrics for Judge vacancies (Supreme Court, 25 High Courts, Subordinate Courts) and National Judicial Data Grid (NJDG) pendency (5.12+ Crore cases).
5. **Guides Citizen Judicial Services**: Offers step-by-step procedural workflows for Virtual Courts (traffic challan online payment), eFiling 3.0, ePay, Tele-Law (14416 helpline), and the eCourts mobile application.
6. **Enforces Strict Legal Guardrails**: Never fabricates statistics, case numbers, or judicial outcomes; explicitly distinguishes live data from official snapshots; and prevents unauthorized legal advice.

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────────────┐
                                  │   Citizen / Litigant Browser   │
                                  └───────────────┬────────────────┘
                                                  │ HTTPS / JSON
                                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND (React + Vite + TS)                                   │
│  • Conversational Chat UI (Bilingual toggle, suggested prompts, message history)                 │
│  • Expandable Source Citation Cards & Data Freshness Badges                                      │
│  • NJDG Caseload Dashboard & High Court Aging Charts                                             │
│  • Judge Strength & 25 High Courts Directory                                                     │
│  • Citizen Services Hub (Virtual Courts, eFiling 3.0, Tele-Law, FTSC, Mobile App)                │
└───────────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                                │ REST API / CORS
                                                ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     BACKEND (Node.js + Express)                                  │
│  • Security Headers (nosniff, DENY, HSTS, XSS) & Strip Fingerprints                             │
│  • In-Memory Sliding-Window Rate Limiting (120 req/min general, 45 req/min chat)                 │
│  • Standardized Error Handling (JSON parse error interception, 404 handler)                       │
│  • Domain Controllers & Routes:                                                                  │
│      ├── /api/health     (Diagnostics & component health)                                        │
│      ├── /api/chat       (Bilingual RAG query pipeline)                                          │
│      ├── /api/doj        (Divisions, schemes & mandate)                                          │
│      ├── /api/stats      (Judges directory & NJDG pendency)                                      │
│      ├── /api/services   (Virtual courts, eFiling, Tele-Law, FTSC, etc.)                         │
│      ├── /api/cases      (CNR validation, sandbox lookup, guidance)                              │
│      └── /api/documents  (Knowledge base discovery & semantic search)                            │
└───────────────────────┬───────────────────────────────────────────────┬──────────────────────────┘
                        │ In-Process Bridge                             │ Direct Ingestion
                        ▼                                               ▼
┌────────────────────────────────────────────────┐     ┌───────────────────────────────────────────┐
│              AI & RAG RETRIEVAL ENGINE         │     │         OFFICIAL KNOWLEDGE BASE           │
│  • Document Loader & Text Extraction           │     │  • 10 Official DoJ Markdown & PDF Chunks  │
│  • Chunking Pipeline (Recursive, Overlap)      │◄────┤  • Higher Judiciary Appointments Statement│
│  • Hybrid TF-IDF / Cosine Vector Store         │     │  • NJDG National Caseload Monthly Report  │
│  • Semantic Retriever with Top-K Filtering     │     │  • eCourts Mission Mode Phase III Guides  │
│  • Gemini API / Grounded Context Prompting     │     │  • Tele-Law, Nyaya Bandhu & FTSC Mandates │
└────────────────────────────────────────────────┘     └───────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Responsive Grid |
| **Backend** | Node.js (ESM), Express.js 4, CORS, Dotenv, In-Memory Rate Limiter, Security Headers |
| **AI / RAG** | Google Gemini API (`@google/genai`), Hybrid In-Memory Vector Store, Document Ingestion |
| **Testing** | Node.js Native Test Runner (`node:test`, `node:assert`), 106 automated tests |
| **Data Sources** | Department of Justice (`doj.gov.in`), NJDG (`njdg.ecourts.gov.in`), eCourts (`services.ecourts.gov.in`), Virtual Courts (`vcourts.gov.in`), Tele-Law (`tele-law.in`) |

---

## 📁 Repository Structure

```
adcms-justiceai/
├── ai/                                  # AI & RAG Retrieval Module (Nitin)
│   ├── ingestion/                       # Document loader and chunking pipeline
│   ├── knowledge_base/                  # 10 official DoJ policy and service documents
│   ├── retrieval/                       # Vector store and semantic retriever
│   ├── gemini_service.js                # Google Gemini API integration
│   └── index.js                         # Public AI service interface (`askJusticeAI`)
├── backend/                             # Express REST API Server (Disha)
│   ├── src/
│   │   ├── config/                      # Environment variables and configuration
│   │   ├── controllers/                 # Chat, DoJ, Stats, Services, Case & Document controllers
│   │   ├── middleware/                  # Security headers, rate limiting, CORS, timeout, errors
│   │   ├── routes/                      # Route definitions for all endpoints
│   │   ├── services/                    # Business logic (dojService, judgeService, njdgService, eCourtsService)
│   │   ├── app.js                       # Express application assembly
│   │   └── server.js                    # Server startup and graceful shutdown
│   ├── test/                            # 106 automated unit, integration, and E2E tests
│   │   ├── api.test.js                  # Integration tests for all REST endpoints
│   │   ├── sample_questions_e2e.test.js # 40 bilingual official question validations
│   │   └── services.test.js             # Unit tests for services and rate limiter
│   ├── .env.example                     # Environment configuration template
│   └── package.json                     # Backend dependencies and test scripts
├── frontend/                            # React + Vite + Tailwind Client (Shravani)
│   ├── src/
│   │   ├── components/                  # ChatBox, ChatMessage, StatCard, Layout, History
│   │   ├── pages/                       # NJDGDashboard, JudgeVacancyPage, ServicesPage, CaseStatusPage, etc.
│   │   ├── services/                    # Chat API bridge & fallback groundings
│   │   └── types/                       # TypeScript definitions for Chat & Retrieval
│   └── package.json                     # Frontend dependencies and Vite configuration
├── docs/                                # Developer Progress Logs & Architecture Contracts
│   ├── AI_BACKEND_CONTRACT.md           # API and payload agreement between AI and Backend
│   ├── nitin-progress.md                # Nitin's sprint logs (AI / RAG)
│   ├── shravani-progress.md             # Shravani's sprint logs (Frontend)
│   └── disha-progress.md                # Disha's sprint logs (Backend)
└── README.md                            # Complete Project Documentation
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **Google Gemini API Key** *(optional for development; offline hybrid RAG runs automatically)*

### 1. Clone the Repository
```bash
git clone https://github.com/curious-boy-collab/justice-ai-chatbot.git
cd justice-ai-chatbot
```

### 2. Configure Backend Environment
```bash
cd backend
cp .env.example .env
```
Edit `.env` as needed:
```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install Dependencies & Start Backend
```bash
# In backend/ directory:
npm install
npm start
```
*The backend server will run at `http://localhost:5000`.*

### 4. Install Dependencies & Start Frontend
```bash
# In a new terminal, from project root:
cd frontend
npm install
npm run dev
```
*The frontend application will run at `http://localhost:5173`.*

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | Service index and registered endpoints dictionary |
| `/api/health` | `GET` | System health check, uptime, and active module status |
| `/api/chat` | `POST` | Bilingual conversational query answering with RAG |
| `/api/doj/overview` | `GET` | Official Department of Justice mandate and portals |
| `/api/doj/divisions` | `GET` | Breakdown of 7 administrative DoJ divisions |
| `/api/doj/schemes` | `GET` | Centrally Sponsored Schemes (Tele-Law, FTSC, etc.) |
| `/api/stats/judges` | `GET` | Judge vacancies (Supreme Court, High Courts, Subordinate) |
| `/api/stats/judges/high-courts` | `GET` | Full directory of all 25 High Courts |
| `/api/stats/judges/high-courts/:code` | `GET` | Specific High Court details (e.g. `delhi`, `bombay`) |
| `/api/stats/judges/appointment-procedure` | `GET` | Supreme Court Collegium system and MoP steps |
| `/api/stats/njdg` | `GET` | NJDG aggregate pendency figures and age-wise brackets |
| `/api/stats/njdg/court-breakdown` | `GET` | Hierarchy pendency across all judicial tiers |
| `/api/stats/njdg/state-wise` | `GET` | Caseload distribution across 12 high-volume states |
| `/api/services` | `GET` | Master directory of 7 official citizen judicial services |
| `/api/services/virtual-courts` | `GET` | Virtual Courts directory and traffic fine settlement guide |
| `/api/services/efiling` | `GET` | Step-by-step instructions for eFiling 3.0 & ePay |
| `/api/services/tele-law` | `GET` | Pre-litigation legal advice criteria & 14416 helpline |
| `/api/services/ftsc` | `GET` | Fast Track Special Courts mandate & POCSO adjudication |
| `/api/services/mobile-app` | `GET` | eCourts Services app features and store links |
| `/api/services/live-streaming` | `GET` | Live court proceeding channels & compliance rules |
| `/api/cases/lookup?cnr={cnr}` | `GET` | 16-character CNR validation, sandbox test dockets, and live guidance |
| `/api/cases/guidance` | `GET` | Bilingual instructions on locating CNR numbers |
| `/api/cases/demo-samples` | `GET` | Curated sandbox demo cases for UI testing |
| `/api/documents` | `GET` | Directory of indexed official knowledge documents |
| `/api/documents/stats` | `GET` | Knowledge base vector and chunk statistics |

---

## 🧪 Automated Testing Suite

JusticeAI includes **106 automated tests** using Node.js's built-in test runner (`node:test`):

```bash
# Run complete test suite:
npm --prefix backend test
```

### Test Suite Execution Output
```
ℹ tests 106
ℹ suites 3
ℹ pass 106
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 195.874333
```

1. **HTTP Integration Tests (`backend/test/api.test.js`)**: 50 tests verifying all REST endpoints, CORS headers, security headers, rate limiting, request validation, malformed JSON interception, and secret isolation.
2. **E2E Chat Evaluation (`backend/test/sample_questions_e2e.test.js`)**: 40 bilingual tests verifying RAG retrieval accuracy across all DoJ domains, intent classification, and non-legal advice guardrails.
3. **Services Unit Tests (`backend/test/services.test.js`)**: 16 unit tests for `judgeService`, `njdgService`, `eCourtsService`, `dojService`, `documentService`, and `rateLimiter`.

---

## 🌟 10 Impressive Demonstration Questions

Try asking the assistant these questions in English or Hindi:

1. **Traffic Violations**: *"How do I pay a traffic fine online using the Virtual Court portal?"*
2. **Judge Vacancies**: *"What is the current working strength and vacancy count of High Court judges?"*
3. **Case Pendency**: *"How many cases are currently pending in Indian courts according to the National Judicial Data Grid (NJDG)?"*
4. **Legal Aid (Tele-Law)**: *"Who is eligible for free legal advice under the Tele-Law scheme, and what is the toll-free number?"*
5. **Specialized Courts**: *"What is the purpose of Fast Track Special Courts (FTSC), and what cases do they handle?"*
6. **Digital Filing**: *"What are the mandatory requirements for eFiling 3.0 and online court fee payment?"*
7. **Court Streaming**: *"Which High Courts live stream their proceedings, and where can I watch them?"*
8. **Case Status Lookup**: *"Where can I find the 16-digit CNR number on my court summons?"*
9. **Hindi Query**: *"वर्चुअल कोर्ट में चालान का ऑनलाइन भुगतान करने की प्रक्रिया क्या है?"*
10. **Legal Guardrails**: *"Can you predict if I will win my property dispute in court?"* *(Verified guardrail response: Declines prediction and refers litigant to Tele-Law / legal counsel).*

---

## 🔒 Security, Guardrails & Anti-Hallucination

- **Strict Server-Side Secrets**: `GEMINI_API_KEY` is never transmitted to the browser or echoed in responses.
- **In-Memory Rate Limiting**: Sliding window algorithm protects endpoints from denial-of-service and automated abuse.
- **HTTP Security Headers**: Enforces `nosniff`, `DENY` framing, strict referrer, and HSTS headers.
- **CAPTCHA & Scraping Compliance**: To prevent violating government terms of service, real-time case orders requiring CAPTCHA on `services.ecourts.gov.in` provide deep-links, guidance, and SMS instructions rather than brittle, unauthorized scrapers.
- **Data Freshness Timestamp**: Every response explicitly provides `dataFreshness`, `isLive: false`, and `dataStatus: "official_snapshot"`.

---

## 👥 Team & Remote Collaborative Workflow

Developed in remote collaboration on GitHub:
- **Nitin** — *AI / RAG Developer* (`feature/ai`)
  - Gemini API integration, document ingestion, vector embeddings, bilingual prompt engineering, and semantic retriever.
- **Shravani** — *Frontend Developer* (`feature/frontend`)
  - React + Tailwind UI, conversational chat components, expandable citation cards, NJDG dashboards, and responsive layout.
- **Disha** — *Backend Developer* (`feature/backend`)
  - Express API architecture, service integration layer, rate limiting, security headers, comprehensive testing, and API documentation.

---

## 📄 License & Attribution

Developed for the **Department of Justice, Ministry of Law and Justice, Government of India**.  
Source data derived from public official portals: [doj.gov.in](https://doj.gov.in), [ecourts.gov.in](https://ecourts.gov.in), [njdg.ecourts.gov.in](https://njdg.ecourts.gov.in), [vcourts.gov.in](https://vcourts.gov.in), and [tele-law.in](https://www.tele-law.in).
