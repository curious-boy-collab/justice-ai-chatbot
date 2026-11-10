# Disha — Backend Progress Log

**Role**: Backend Developer  
**Branch**: `feature/backend`  
**Current Sprint**: Day 2 — Core Chatbot Development  
**Status**: Completed & Verified  

---

## 🎯 Day 2 Objectives & Achievements

- [x] **Implement the `POST /api/chat` Endpoint**:
  - Re-architected `chatController.js` to serve as the unified conversational entry point for citizen queries.
  - Supports both `{ query }` (Shravani's frontend payload) and `{ message }` (contract specification) payloads interchangeably.
  - Added session tracking with UUID generation and language auto-detection for Devanagari script.

- [x] **Connect to Nitin's AI Service Interface**:
  - Integrated with Nitin's AI / RAG module via [`src/services/aiBridgeService.js`](../backend/src/services/aiBridgeService.js).
  - Calls `queryJusticeAI(query, language, sessionId, timeoutMs)`.
  - Securely passes `GEMINI_API_KEY` from backend environment to the generative AI client on the server side.

- [x] **Validate User Messages**:
  - Validates JSON body existence and structure.
  - Rejects empty, whitespace-only, null, or non-string queries with HTTP `400 BAD_REQUEST` and code `INVALID_INPUT`.
  - Enforces 2000-character input ceiling with code `MESSAGE_TOO_LONG`.
  - Strips non-printable ASCII/control characters to safeguard against injection and corrupt payloads.

- [x] **Implement Consistent JSON Response Formats**:
  - Unified response payload adhering strictly to `contracts/api-contract.md` and `docs/AI_BACKEND_CONTRACT.md`.
  - Provides both `reply` and `answer` fields for maximum frontend interoperability.
  - Enriches responses with structured `dataCard` objects from `judgeService`, `njdgService`, and `eCourtsService`.
  - Provides dual-format citations: `sources: [{ title, label, url }]` and `citations: [{ sourceTitle, url, snippet }]`.
  - Generates context-aware `suggestedQuestions` tailored to the query intent and language.

- [x] **Add Error Handling & Request Validation**:
  - Centralized error formatting ensures all errors return `{ success: false, error: { code, message, details }, timestamp }`.
  - Handles unexpected AI service failures with structured, graceful fallback to official DoJ web references.

- [x] **Add Appropriate Request Timeout Handling**:
  - Created [`src/middleware/timeoutHandler.js`](../backend/src/middleware/timeoutHandler.js) enforcing a 20,000ms ceiling on all HTTP requests (responds with HTTP 504 Gateway Timeout).
  - In [`src/services/aiBridgeService.js`](../backend/src/services/aiBridgeService.js), added a 15,000ms `Promise.race` timeout protection around `askJusticeAI`.

- [x] **Configure CORS for Frontend Integration**:
  - Updated [`src/middleware/corsConfig.js`](../backend/src/middleware/corsConfig.js) to dynamically whitelist Vite frontend dev servers (`http://localhost:5173`, `http://localhost:3000`, `http://127.0.0.1:*`) and handle preflight `OPTIONS` requests seamlessly.

- [x] **Test Chat API Using Sample Requests**:
  - Implemented 17 HTTP integration tests in [`backend/test/api.test.js`](../backend/test/api.test.js).
  - Implemented 28 end-to-end question tests in [`backend/test/sample_questions_e2e.test.js`](../backend/test/sample_questions_e2e.test.js) validating all official sample questions across 10 DoJ categories in English, Hindi, and Hinglish.
  - Implemented 6 service unit tests in [`backend/test/services.test.js`](../backend/test/services.test.js).
  - **Result: 51 tests passing with 0 failures.**

---

## 📡 API Request & Response Documentation

### 1. English Procedural Query (Virtual Courts / Traffic Fine)

**Request**:
```http
POST /api/chat HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "query": "How do I pay a traffic police e-challan through Virtual Courts?",
  "language": "en"
}
```

**Response (HTTP 200 OK)**:
```json
{
  "success": true,
  "sessionId": "4b2cf03b-c2e3-4d40-9e8a-e4277b58832a",
  "reply": "Traffic challans can be paid online via the Virtual Courts portal (vcourts.gov.in) or the Parivahan eChallan portal...",
  "answer": "Traffic challans can be paid online via the Virtual Courts portal (vcourts.gov.in) or the Parivahan eChallan portal...",
  "language": "en",
  "intent": "TRAFFIC_FINES",
  "isLive": true,
  "dataStatus": "official_reference",
  "lastChecked": "2026-11-10",
  "dataCard": {
    "type": "PROCEDURAL_GUIDE",
    "title": "Virtual Court Traffic Violation Fine Payment Procedure",
    "data": {
      "steps": [
        "Visit the official Virtual Courts portal at vcourts.gov.in.",
        "Select your State and Judicial Department (e.g., Delhi Traffic Court).",
        "Search your case using Mobile Number, Vehicle Number, or Challan Number.",
        "Review the alleged offense, compounding amount, and summons notice.",
        "Choose 'Propose to Plead Guilty' to settle online or 'Contest' to transfer the case to a regular magistrate.",
        "Make payment via the integrated ePay gateway and download the court receipt."
      ],
      "officialPortalUrl": "https://vcourts.gov.in",
      "helpline": "1800-11-0031"
    }
  },
  "sources": [
    {
      "title": "Virtual Courts — Online Disposal of Petty Offences",
      "label": "Virtual Courts — Online Disposal of Petty Offences",
      "url": "https://vcourts.gov.in"
    }
  ],
  "citations": [
    {
      "sourceTitle": "Virtual Courts — Online Disposal of Petty Offences",
      "url": "https://vcourts.gov.in",
      "snippet": "Virtual Courts — Online Disposal of Petty Offences"
    }
  ],
  "suggestedQuestions": [
    "Can I contest a traffic challan in a regular court?",
    "How do I check case status using a CNR number?",
    "What are the judicial statistics on the NJDG portal?"
  ],
  "metadata": {
    "modelUsed": "gemini-1.5-flash",
    "isLiveModel": true,
    "durationMs": 340
  },
  "responseTimeMs": 345,
  "timestamp": "2026-11-10T10:15:51.457Z"
}
```

---

### 2. Hindi Query (Judge Appointments & Vacancies)

**Request**:
```http
POST /api/chat HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "query": "भारत के उच्च न्यायालयों में न्यायाधीशों की रिक्तियां कितनी हैं?",
  "language": "hi"
}
```

**Response (HTTP 200 OK)**:
```json
{
  "success": true,
  "sessionId": "8d3e2f1a-b6c5-4a39-9d8e-123456789abc",
  "reply": "भारत के 25 उच्च न्यायालयों में न्यायाधीशों के कुल स्वीकृत पद 1,114 हैं। रिक्तियों का विवरण न्याय विभाग द्वारा नियमित रूप से अधिसूचित किया जाता है...",
  "answer": "भारत के 25 उच्च न्यायालयों में न्यायाधीशों के कुल स्वीकृत पद 1,114 हैं। रिक्तियों का विवरण न्याय विभाग द्वारा नियमित रूप से अधिसूचित किया जाता है...",
  "language": "hi",
  "intent": "JUDGES_AND_VACANCIES",
  "isLive": true,
  "dataStatus": "official_reference",
  "lastChecked": "2026-11-10",
  "dataCard": {
    "type": "JUDGE_VACANCY",
    "title": "न्यायाधीश रिक्ति एवं स्वीकृत पद विवरण",
    "data": {
      "summary": {
        "supremeCourt": { "sanctioned": 34, "working": 33, "vacancies": 1 },
        "highCourtsTotal": { "courtCount": 25, "sanctioned": 1114, "working": 778, "vacancies": 336 }
      }
    }
  },
  "sources": [
    {
      "title": "Department of Justice — High Court Judges Strength",
      "label": "Department of Justice — High Court Judges Strength",
      "url": "https://doj.gov.in/list-of-high-court-judges/"
    }
  ],
  "suggestedQuestions": [
    "राष्ट्रीय न्यायिक डेटा ग्रिड (NJDG) में लंबित मामलों की स्थिति क्या है?",
    "ई-चालान का भुगतान वर्चुअल कोर्ट से कैसे करें?",
    "टेली-लॉ के तहत मुफ्त कानूनी सलाह कैसे पाएं?"
  ],
  "responseTimeMs": 280,
  "timestamp": "2026-11-10T10:15:51.452Z"
}
```

---

### 3. Input Validation Error (Empty Query)

**Request**:
```http
POST /api/chat HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "query": ""
}
```

**Response (HTTP 400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "The query must be a non-empty string."
  },
  "timestamp": "2026-11-10T10:15:51.441Z"
}
```

---

## 🧪 Automated Testing Verification

Executed using Node.js built-in test runner (`node --test test/**/*.test.js`):
- **Suite 1: Integration Tests (`test/api.test.js`)**: 17 tests passed.
- **Suite 2: E2E Official Questions (`test/sample_questions_e2e.test.js`)**: 28 tests passed.
- **Suite 3: Services Unit Tests (`test/services.test.js`)**: 6 tests passed.
- **Total: 51 passed, 0 failed (100% pass rate in ~144ms)**.

---

## 🤝 Team Coordination Summary

1. **Nitin (AI / RAG Developer)**:
   - Synchronized with Nitin's intent definitions and document retrieval models.
   - Verified that all 28 test questions correctly trigger expected intents and grounded answers.
2. **Shravani (Frontend Developer)**:
   - Backend directly supports Shravani's `POST /api/chat` payload (`{ query, language, sessionId }`).
   - Response includes `reply`, `answer`, `sources`, `dataCard`, `citations`, and `suggestedQuestions`.
   - CORS is configured to accept connections from Vite dev server (`http://localhost:5173`).
