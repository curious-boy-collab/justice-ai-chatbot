# JusticeAI — AI & RAG Architecture Documentation

> **System:** JusticeAI (Department of Justice AI Virtual Assistant)  
> **Module:** `ai/`  
> **Author:** Nitin (AI / RAG Developer)  
> **Sprint:** Day 5 & Day 6 Final Delivery  
> **Version:** 2.5 (Production Ready)  

---

## 1. System Overview

JusticeAI is an enterprise-grade Retrieval-Augmented Generation (RAG) system engineered for the **Department of Justice (DoJ), Ministry of Law & Justice, Government of India**. It empowers Indian citizens, litigants, and legal researchers with instant, verified, and bilingual (English & Hindi) guidance across 10 judicial problem-statement categories.

The AI module operates as an independent, decoupled microservice package (`ai/`) with zero external database dependencies for offline capability, connected to Disha's Express.js backend through an abstracted service bridge (`backend/src/services/aiBridgeService.js`).

---

## 2. High-Level Architectural Diagram

```
                        ┌──────────────────────────────────────────────┐
                        │              Citizen Client                  │
                        │    (React + Vite + Tailwind + TypeScript)   │
                        └──────────────────────┬───────────────────────┘
                                               │
                                     HTTP POST /api/chat
                                               │
                                               ▼
                        ┌──────────────────────────────────────────────┐
                        │            Disha's Backend Server            │
                        │       (Express.js + Security + CORS)         │
                        └──────────────────────┬───────────────────────┘
                                               │
                                       aiBridgeService
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 JusticeAI Core Module (ai/)                                  │
│                                                                                             │
│  1. Ingestion Pipeline (`ai/ingestion/`)                                                     │
│     ├── `document_loader.js` (Multi-format scanner: MD, TXT, PDF via pdf-parse)              │
│     ├── `text_extractor.js` (Extracts verified metadata: Title, Portal, URLs, Helplines)    │
│     └── `chunking.js` (Recursive semantic section chunking with metadata inheritance)       │
│                                              │                                              │
│                                              ▼                                              │
│  2. In-Memory Vector Store (`ai/retrieval/vector_store.js`)                                 │
│     ├── Precomputed 105 chunks across 15 official DoJ documents                             │
│     ├── Term-frequency + Inverse Document Frequency (TF-IDF) Cosine Space                   │
│     ├── Section title & category metadata weighting (+30% boost)                             │
│     └── Local persistent disk cache: `ai/data/vector_store.json`                            │
│                                              │                                              │
│                                              ▼                                              │
│  3. Intent & Entity Understanding (`ai/retrieval/intent_classifier.js`)                     │
│     ├── Intent Classification (13 distinct intents)                                         │
│     ├── Language Detection: Devanagari Hindi (`hi`), Hinglish (`hi-Latn`), English (`en`)  │
│     ├── Entity Extraction: 16-character alphanumeric CNR numbers (`DLHC010012342023`)       │
│     └── Guardrail Boundary Filter (Prohibited legal predictions & Out-of-scope requests)     │
│                                              │                                              │
│                                              ▼                                              │
│  4. Semantic Retriever (`ai/retrieval/retriever.js`)                                        │
│     ├── Cosine Similarity scoring with adaptive thresholding (0.15)                          │
│     ├── Top-K contextual document ranking (default K=3)                                     │
│     └── Citation extraction (Title, Source URL, Secondary Portal, Helpline, Relevance Score)│
│                                              │                                              │
│                                              ▼                                              │
│  5. Gemini Generation & Grounding Engine (`ai/services/gemini_service.js`)                  │
│     ├── System Prompts (`ai/prompts/system_prompt.js` & `ai/prompts/query_prompts.js`)      │
│     ├── Google Gemini Pro / Flash API integration (`@google/generative-ai`)                 │
│     ├── High-fidelity grounded fallback engine (deterministic offline capability)           │
│     └── Dynamic Statistics Advisory & Live Portal Direction Guardrail                      │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Component Deep-Dive

### 3.1 Document Ingestion Pipeline (`ai/ingestion/`)
- **`document_loader.js`**: Recursively scans `ai/documents/` subdirectories (`doj/`, `ecourts/`, `njdg/`). Reads Markdown, plain text, and PDF binaries (via `pdf-parse`).
- **`text_extractor.js`**: Parses structured metadata headers from documents:
  - `Title`, `Category`, `Source URL`, `Secondary URL`, `Portal`, `Helpline`, `Verification Status`, `Data Freshness`.
- **`chunking.js`**: Splits long statutes and schemes by structural headers (`##`, `###`) into 300–600 character coherent chunks with 50-character contextual overlap, preserving document-level metadata across every chunk.

### 3.2 In-Memory Vector Store (`ai/retrieval/vector_store.js`)
- **Indexing Engine**: Indexes 105 semantic chunks across 15 official publications.
- **Vocabulary & Embedding**: Builds a normalized n-gram token space with Hindi and English stop-word filtering.
- **Metadata-Boosted Hybrid Search**:
  $$\text{Score}(d, q) = \text{CosineSimilarity}(\vec{d}, \vec{q}) \times (1 + 0.3 \cdot \mathbb{I}_{\text{title\_match}} + 0.2 \cdot \mathbb{I}_{\text{category\_match}})$$
- **Cache**: Fast-boots in < 5ms by serializing and deserializing `ai/data/vector_store.json`.

### 3.3 Intent Classifier & Guardrails (`ai/retrieval/intent_classifier.js`)
- **Supported Intents**:
  1. `CASE_STATUS` — CNR lookup, cause lists, case tracking.
  2. `JUDGES_AND_VACANCIES` — Sanctioned strength, Collegium, MoP.
  3. `NJDG_PENDENCY` — National Judicial Data Grid disposal & age profiles.
  4. `TRAFFIC_FINES` — Virtual Courts, plead guilty vs contest, eChallan.
  5. `LIVE_STREAMING` — Supreme Court & High Court live hearings, Model Rules 2021.
  6. `EFILING_EPAY` — eFiling 3.0 registration, PDF/A, Aadhaar eSign, ePay.
  7. `FAST_TRACK_COURTS` — FTSC scheme, POCSO Act, VWDC centres.
  8. `ECOURTS_APP` — eCourts Services mobile app, QR code scanner.
  9. `TELE_LAW` — DISHA umbrella, CSC legal advice, Section 12 NALSA eligibility.
  10. `DOJ_ADMIN` — DoJ organizational hierarchy, Citizen Charter, ICJS.
  11. `LEGAL_ADVICE_PROHIBITED` — Blocks prediction of case outcomes or legal guarantees.
  12. `OUT_OF_SCOPE` — Rejects weather, recipes, sports scores, entertainment.
  13. `GREETING` — Welcomes citizens with DoJ scope advisory.

### 3.4 Grounded LLM Generation (`ai/services/gemini_service.js`)
- **Model**: `gemini-1.5-flash` (or `gemini-1.5-pro` via `GEMINI_MODEL` environment variable).
- **Prompt Isolation**: System prompts strictly instruct Gemini to rely *only* on injected context documents.
- **Graceful Offline Fallback**: If `GEMINI_API_KEY` is not provided or if external network access is blocked, the service executes a high-fidelity deterministic grounded context extraction that formats citations and official advice with zero latency.
- **Dynamic Statistics Advisory**: All judge vacancy and case pendency responses automatically include an anti-hallucination advisory directing citizens to live portals (`njdg.ecourts.gov.in`).

---

## 4. Contract Specifications (`AI_BACKEND_CONTRACT.md`)

The AI module conforms to the team's shared contract:

```typescript
interface ChatResponsePayload {
  answer: string;
  language: 'en' | 'hi';
  sources: Array<{
    title: string;
    url: string;
    secondaryUrl?: string | null;
    category: string;
    format: string;
    relevanceScore: number;
    snippet: string;
    helpline?: string | null;
  }>;
  intent: string;
  detectedLang: string;
  cnr: string | null;
  dataStatus: 'official_reference' | 'guardrail_advisory' | 'fallback_guidance' | 'procedural_guidance';
  lastChecked: string;
  metadata: {
    modelUsed: string;
    isLiveModel: boolean;
    isFallback: boolean;
    topScore: number;
    retrievedCount: number;
    durationMs: number;
  };
}
```

---

## 5. Security & Verification

1. **No Client-Side Secrets**: `GEMINI_API_KEY` is managed strictly on the server and is never sent to the browser.
2. **Anti-Hallucination Guardrails**: Prohibits outcome predictions, case betting, or synthetic statistics.
3. **100% Test Coverage**:
   - `ai/tests/run_tests.js`: 50/50 test cases pass.
   - `backend/test/sample_questions_e2e.test.js`: 50/50 automated end-to-end question queries pass.
   - Overall test execution duration: < 300ms across 116 combined suite tests.
