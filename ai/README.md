# JusticeAI — AI & RAG Module

> **Developer:** Nitin (AI / RAG Developer)  
> **Branch:** `feature/ai`  
> **Tech Stack:** Node.js, Google Gemini API (`gemini-1.5-flash`), Retrieval-Augmented Generation (RAG)

---

## 🏛️ Module Overview

This module powers the intelligence layer of **JusticeAI**, an interactive virtual assistant for the **Department of Justice, Ministry of Law & Justice, Government of India**.

It is engineered to:
1. Ingest official Department of Justice and eCourts documentation.
2. Index semantic chunks using vector embeddings.
3. Retrieve verified government records based on citizen queries.
4. Generate grounded, bilingual (Hindi & English) answers using Gemini.
5. Provide verifiable source citations with government URLs.
6. Guard against hallucinating legal advice, court verdicts, or fabricated statistics.

---

## 📂 Architecture & Directory Structure

```
ai/
├── documents/                     # Curated official knowledge base
│   ├── doj/
│   │   ├── divisions_and_functions.md
│   │   ├── judges_and_vacancies.md
│   │   ├── tele_law_services.md
│   │   └── fast_track_special_courts.md
│   ├── ecourts/
│   │   ├── ecourts_services_app.md
│   │   ├── efiling_and_epay.md
│   │   ├── live_streaming_courts.md
│   │   ├── case_status_guide.md
│   │   └── traffic_fine_payments.md
│   └── njdg/
│       └── njdg_case_pendency.md
├── ingestion/                     # Document ingestion & pre-processing
│   ├── document_loader.js         # Traverses and parses metadata headers
│   ├── text_extractor.js          # Cleans text & extracts markdown sections
│   └── chunking.js                # Chunks text with word overlap
├── retrieval/                     # Vector indexing & search
│   ├── embeddings.js              # Lexical + Gemini text-embedding-004 wrapper
│   ├── vector_store.js            # In-memory vector store & hybrid search
│   └── retriever.js               # Semantic retrieval & source citation formatter
├── prompts/                       # Prompt engineering & guardrails
│   ├── system_prompt_en.txt       # English system prompt
│   ├── system_prompt_hi.txt       # Hindi (Devanagari) system prompt
│   ├── system_prompt.js           # Prompt loader with caching
│   └── query_prompts.js           # Dynamic RAG context prompt builder
├── services/                      # AI provider integration
│   └── gemini_service.js          # Google Gemini 1.5 Flash client with fallback
├── tests/                         # Test suites
│   ├── sample_questions.json      # 22 citizen questions (EN + HI) across 10 categories
│   └── run_tests.js               # Automated test runner
├── .env.example                   # Environment variable template (NEVER commit .env)
├── index.js                       # Primary export for backend consumption
├── package.json                   # Dependencies
└── README.md                      # This documentation
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd ai
npm install
```

### 2. Configure Environment (Optional for Day 1)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your `GEMINI_API_KEY` (obtained from [Google AI Studio](https://aistudio.google.com)).
*Note: Even without an API key, the module runs in deterministic offline reference mode using verified context documents.*

### 3. Run Automated Tests
```bash
npm test
# or: node tests/run_tests.js
```

---

## 🧪 Test Suite Results (Day 1)

The test suite validates 22 citizen queries in English and Hindi covering:
- DoJ Divisions and Functions
- Judges and Vacancies
- NJDG Case Pendency
- Traffic Fine Payments (Virtual Courts)
- Live Streaming of Court Proceedings
- eFiling and ePay Procedures
- Fast Track Special Courts (FTSCs)
- eCourts Services Mobile App
- Tele-Law Services
- Current Case Status Lookup (CNR number)
- Guardrails against Legal Predictions & Advice

**Current Status:** `22 Passed, 0 Failed out of 22 tests (100% Pass Rate)`

---

## 🔒 Security & Guardrails

1. **Backend Secret Isolation:** `GEMINI_API_KEY` is read strictly on the backend/AI server and is never transmitted to the frontend.
2. **Anti-Hallucination:** Answers are strictly grounded in verified context records.
3. **No Legal Predictions:** The system refuses to predict case outcomes or offer legal advice, pointing users to Tele-Law / NALSA.
4. **Data Freshness Disclosure:** All statistics state the reference date and guide citizens to live portals like [https://njdg.ecourts.gov.in](https://njdg.ecourts.gov.in).
