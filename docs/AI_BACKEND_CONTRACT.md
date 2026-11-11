# JusticeAI — AI / Backend Integration Contract

> **Document Version:** 2.0.0 (Day 2 Active Implementation)  
> **Authors:** Nitin (AI / RAG Developer) & Disha (Backend Developer)  
> **Status:** Active Production Contract  
> **Date:** 2026-11-10

---

## 1. Overview & Architectural Boundary

The **JusticeAI AI / RAG Module** (`ai/`) is integrated directly with Disha's **Express.js Backend Server** (`backend/`) via the dedicated bridge service [`backend/src/services/aiBridgeService.js`](file:///Users/nitinjaiswal/Desktop/justice-ai-chatbot/backend/src/services/aiBridgeService.js).

### Integration Pattern:
```javascript
import { queryJusticeAI } from './services/aiBridgeService.js';

// Inside Express controller:
const aiResponse = await queryJusticeAI(message, language, sessionId);
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
  }
): Promise<AIResponsePayload>
```

### Request JSON Payload:
```json
{
  "query": "High court me judges ki vacancy kitni hai?",
  "language": "hi",
  "sessionId": "a8f3b4c1-92d5-4e7a-b9c2-123456789abc"
}
```

---

## 3. Response Contract (AI Service ➔ Backend)

```json
{
  "answer": "भारत के 25 उच्च न्यायालयों में न्यायाधीशों के कुल स्वीकृत पद 1,114 हैं। रिक्तियों का विवरण न्याय विभाग द्वारा नियमित रूप से अधिसूचित किया जाता है। ताज़ा व आधिकारिक आंकड़ों के लिए https://doj.gov.in/list-of-high-court-judges/ पर देखें।",
  "language": "hi",
  "intent": "JUDGES_AND_VACANCIES",
  "detectedLang": "hi-Latn",
  "cnr": null,
  "sources": [
    {
      "title": "Judges Strength, Appointment Process, and Vacancy Data",
      "url": "https://doj.gov.in/list-of-high-court-judges/"
    }
  ],
  "dataStatus": "official_reference",
  "lastChecked": "2026-11-10",
  "metadata": {
    "modelUsed": "gemini-1.5-flash",
    "isLiveModel": true,
    "durationMs": 420
  }
}
```

---

## 4. Recognized Intent Enum

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

## 5. Security & API Key Management
- The Gemini API Key (`GEMINI_API_KEY`) is stored **strictly server-side** in `backend/.env`.
- It is never transmitted across client boundaries or stored in frontend bundles.
- If the API key is not present or rate limits are reached, the service gracefully degrades to **deterministic grounded context fallback** using verified Department of Justice documentation.
