# JusticeAI — AI / Backend Integration Contract

> **Document Version:** 3.0.0 (Day 3 RAG & Knowledge Base Implementation)  
> **Authors:** Nitin (AI / RAG Developer) & Disha (Backend Developer)  
> **Status:** Active Production Contract  
> **Date:** 2026-11-10

---

## 1. Overview & Architectural Boundary

The **JusticeAI AI / RAG Module** (`ai/`) is integrated directly with Disha's **Express.js Backend Server** (`backend/`) via the dedicated bridge service [`backend/src/services/aiBridgeService.js`](../backend/src/services/aiBridgeService.js) and knowledge document service [`backend/src/services/documentService.js`](../backend/src/services/documentService.js).

### Integration Pattern:
```javascript
import { queryJusticeAI } from './services/aiBridgeService.js';
import { documentService } from './services/documentService.js';

// Inside Express controller:
const aiResponse = await queryJusticeAI(message, language, sessionId, { topK: 3 });
```

---

## 2. Request Contract (Backend ➔ AI Service)

### Function Signature:
```typescript
askJusticeAI(
  query: string,
  language?: "en" | "hi",
  options?: {
    apiKey?: string;
    sessionId?: string;
    topK?: number;
    timeoutMs?: number;
  }
): Promise<AIResponsePayload>
```

### Request JSON Payload:
```json
{
  "query": "High court me judges ki vacancy kitni hai?",
  "language": "hi",
  "sessionId": "a8f3b4c1-92d5-4e7a-b9c2-123456789abc",
  "topK": 3
}
```

---

## 3. Response Contract (AI Service ➔ Backend / Client)

```json
{
  "success": true,
  "sessionId": "a8f3b4c1-92d5-4e7a-b9c2-123456789abc",
  "reply": "भारत के 25 उच्च न्यायालयों में न्यायाधीशों के कुल स्वीकृत पद 1,114 हैं। रिक्तियों का विवरण न्याय विभाग द्वारा नियमित रूप से अधिसूचित किया जाता है। ताज़ा व आधिकारिक आंकड़ों के लिए https://doj.gov.in/list-of-high-court-judges/ पर देखें।",
  "answer": "भारत के 25 उच्च न्यायालयों में न्यायाधीशों के कुल स्वीकृत पद 1,114 हैं। रिक्तियों का विवरण न्याय विभाग द्वारा नियमित रूप से अधिसूचित किया जाता है। ताज़ा व आधिकारिक आंकड़ों के लिए https://doj.gov.in/list-of-high-court-judges/ पर देखें।",
  "language": "hi",
  "intent": "JUDGES_AND_VACANCIES",
  "detectedLang": "hi-Latn",
  "cnr": null,
  "isLive": true,
  "dataStatus": "official_reference",
  "dataFreshness": {
    "lastUpdated": "2026-11-10",
    "sourceStatus": "verified_official",
    "asOfDate": "2026-03-01",
    "cacheStatus": "live",
    "disclaimer": "Official information grounded in Ministry of Law & Justice, NJDG, and eCourts documentation. Not formal legal advice."
  },
  "sources": [
    {
      "title": "Judges Strength, Appointment Process, and Vacancy Data",
      "label": "Judges Strength, Appointment Process, and Vacancy Data",
      "url": "https://doj.gov.in/list-of-high-court-judges/",
      "category": "Judicial Appointments & Vacancies",
      "snippet": "India currently has 25 High Courts with sanctioned strength of 1,114 judges...",
      "relevanceScore": 0.892
    }
  ],
  "citations": [
    {
      "sourceTitle": "Judges Strength, Appointment Process, and Vacancy Data",
      "url": "https://doj.gov.in/list-of-high-court-judges/",
      "snippet": "India currently has 25 High Courts with sanctioned strength of 1,114 judges...",
      "category": "Judicial Appointments & Vacancies"
    }
  ],
  "dataCard": {
    "type": "JUDGE_VACANCY",
    "title": "न्यायाधीश रिक्ति एवं स्वीकृत पद विवरण",
    "data": { ... }
  },
  "suggestedQuestions": [
    "राष्ट्रीय न्यायिक डेटा ग्रिड (NJDG) में लंबित मामलों की स्थिति क्या है?",
    "ई-चालान का भुगतान वर्चुअल कोर्ट से कैसे करें?"
  ],
  "retrieval": {
    "chunksRetrieved": 3,
    "topK": 3,
    "isRetrievedFromKnowledgeBase": true
  },
  "metadata": {
    "modelUsed": "gemini-1.5-flash",
    "isLiveModel": true,
    "durationMs": 420
  },
  "responseTimeMs": 425,
  "timestamp": "2026-11-10T18:13:00.000Z"
}
```

---

## 4. Document Service Endpoints (Day 3 Addition)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/documents` | Lists all 10 indexed official knowledge documents with metadata, chunk count, file size, and last modified timestamps. |
| `GET` | `/api/documents/stats` | Returns aggregate knowledge base statistics (total documents, chunks, categories, freshness). |
| `GET` | `/api/documents/search?q={query}&topK={k}` | Direct semantic retrieval over the official vector store without full text generation. |
| `POST` | `/api/documents/search` | Semantic search via JSON body: `{ "query": "string", "topK": 3 }`. |
| `GET` | `/api/documents/:id(*)` | Retrieves complete content and chunk breakdown of a specific document (e.g. `doj/tele_law_services`). |

---

## 5. Recognized Intent Enum

| Intent Code | Description | Example Query |
|---|---|---|
| `CASE_STATUS` | Case tracking, CNR number, next hearing date, cause lists | "How to check case status with CNR?" |
| `JUDGES_AND_VACANCIES` | Supreme Court / High Court sanctioned strength and vacancies | "Total vacancy in High Courts?" |
| `NJDG_PENDENCY` | National Judicial Data Grid statistics, disposal rates | "How many cases pending on NJDG?" |
| `TRAFFIC_FINES` | Virtual Courts fine payment, Parivahan eChallan | "Traffic challan online kaise bharein?" |
| `LIVE_STREAMING` | Open court streaming, Supreme Court YouTube, sensitive case exemptions | "Can citizens watch court hearings live?" |
| `EFILING_EPAY` | eFiling 3.0, digital signatures, online court fees via ePay | "How to file case online in court?" |
| `FAST_TRACK_COURTS` | Fast Track Special Courts (FTSCs), POCSO cases, Nirbhaya fund | "What are Fast Track Special Courts?" |
| `ECOURTS_APP` | eCourts mobile application features and downloads | "Where to download eCourts mobile app?" |
| `TELE_LAW` | Free pre-litigation legal aid via CSC kiosks (Helpline 14416) | "Who gets free legal advice in Tele-Law?" |
| `DOJ_ADMIN` | Department of Justice structure, divisions, infrastructure | "What does Department of Justice do?" |
| `LEGAL_ADVICE_PROHIBITED` | Guardrail: refuse case outcome predictions and legal strategies | "Will I win my court case next month?" |
| `OUT_OF_SCOPE` | Guardrail: refuse non-judicial questions (weather, food, movies) | "What is the weather in Delhi?" |
| `GREETING` | Citizen pleasantries (Namaste, Hello, Hi) | "Namaste" |

---

## 6. Security & Data Integrity
- Gemini API Key (`GEMINI_API_KEY`) is stored strictly server-side in `backend/.env`.
- Data Freshness metadata (`dataFreshness`) is returned with every query to verify official Department of Justice sourcing.
- Fallback degradation guarantees 0% hallucination by serving grounded official document excerpts when offline or rate-limited.
