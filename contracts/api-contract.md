# JusticeAI — Shared API Contract Specification (v1.0)

> **Status**: Frozen for Day 1 Implementation  
> **Stakeholders**:  
> - **Frontend (Shravani)** — Consumes endpoints in React application  
> - **Backend (Disha)** — Implements and serves Express API routes  
> - **AI / RAG (Nitin)** — Provides RAG responses, citations & intent metadata  

---

## 1. General Standards

- **Base URL**: `http://localhost:5000/api`
- **Content Type**: `application/json` (UTF-8)
- **Time Format**: ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- **Standard Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Human-readable explanation of error",
    "details": {}
  },
  "timestamp": "2026-11-09T07:35:00.000Z"
}
```

---

## 2. Endpoints

### 2.1 System Health
- **Endpoint**: `GET /api/health`
- **Description**: Verifies API availability and dependent service health status.
- **Success Response (200 OK)**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "justiceai-backend",
  "timestamp": "2026-11-09T07:35:00.000Z",
  "uptimeSeconds": 145.2,
  "modules": {
    "chat": "active",
    "njdgService": "active",
    "judgeService": "active",
    "eCourtsService": "active"
  }
}
```

---

### 2.2 Conversational Chat
- **Endpoint**: `POST /api/chat`
- **Description**: Primary conversational interface supporting bilingual citizen queries.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "sessionId": "optional-uuid-string",
  "message": "How do I pay a traffic fine on the virtual court portal?",
  "language": "en" // Supported: "en" | "hi"
}
```

- **Validation Rules**:
  - `message`: Required, string, length between 1 and 2000 characters.
  - `language`: Optional, defaults to `"en"`. Must be `"en"` or `"hi"`.
  - `sessionId`: Optional. If omitted, backend generates a new UUIDv4 session.

- **Success Response (200 OK)**:
```json
{
  "success": true,
  "sessionId": "4f18b3e8-5b1b-4d43-8559-8d76d4949ad4",
  "reply": "To pay a traffic violation fine via Virtual Courts:\n1. Visit the official portal at vcourts.gov.in.\n2. Select your State and Court department (e.g., Delhi Traffic Police).\n3. Search using your Mobile Number, Vehicle Number, or Challan Number.\n4. View the fine amount and case details.\n5. Click 'Propose to Plead Guilty' and pay the compounding fine online via the ePay gateway.",
  "language": "en",
  "intent": "VIRTUAL_COURTS_PROCEDURE",
  "isLive": true,
  "dataCard": {
    "type": "PROCEDURAL_GUIDE",
    "title": "Virtual Court Traffic Challan Payment",
    "data": {
      "steps": [
        "Visit vcourts.gov.in and select your State / Department",
        "Search your case via Mobile, Vehicle Number, or Challan Number",
        "Review violation particulars and compounded fine",
        "Plead guilty online or contest to refer to regular magistrate",
        "Complete payment through ePay gateway and download receipt"
      ],
      "officialPortalUrl": "https://vcourts.gov.in"
    }
  },
  "citations": [
    {
      "sourceTitle": "Virtual Courts Portal - Official Guide",
      "url": "https://vcourts.gov.in",
      "snippet": "Virtual Court is an initiative aimed at eliminating presence of litigant or lawyer in court for petty offences."
    }
  ],
  "suggestedQuestions": [
    "How to contest a challan in a regular court?",
    "What states have operational Virtual Courts?",
    "How can I check case status using CNR number?"
  ],
  "responseTimeMs": 420,
  "timestamp": "2026-11-09T07:35:00.000Z"
}
```

- **Supported DataCard Types**:
  - `NJDG_STATS`: High-level pendency statistics.
  - `JUDGE_VACANCY`: Breakdown of sanctioned vs. working judge strength.
  - `CASE_STATUS`: Parsed case info with official eCourts verification link.
  - `PROCEDURAL_GUIDE`: Stepper for eFiling 3.0, ePay, Virtual Courts, etc.
  - `TELE_LAW_INFO`: Contact points, CSC finder, toll-free `14416`.

---

### 2.3 Judicial Statistics Endpoints

#### `GET /api/stats/judges`
- **Description**: Returns sanctioned strength, working strength, and vacancies for Supreme Court and High Courts.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "asOfDate": "2026-03-01",
  "source": "Department of Justice Monthly Statement",
  "summary": {
    "supremeCourt": {
      "sanctioned": 34,
      "working": 33,
      "vacancies": 1
    },
    "highCourtsTotal": {
      "sanctioned": 1114,
      "working": 778,
      "vacancies": 336
    },
    "districtCourtsTotal": {
      "sanctioned": 25200,
      "working": 19850,
      "vacancies": 5350
    }
  }
}
```

#### `GET /api/stats/njdg`
- **Description**: Returns National Judicial Data Grid aggregate case pendency figures.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "asOfDate": "2026-03-01",
  "source": "National Judicial Data Grid (NJDG)",
  "isOfficialReport": true,
  "totalPendingCases": 51240000,
  "civilCases": 11200000,
  "criminalCases": 40040000,
  "over10YearsPending": 4820000,
  "disposedLastMonth": 1250000
}
```

---

### 2.4 Case Status Lookup
- **Endpoint**: `GET /api/cases/lookup?cnr={cnrNumber}`
- **Query Parameter**: `cnr` (16 alphanumeric characters, e.g., `DLHC010012342023`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "cnr": "DLHC010012342023",
  "isValidCnrFormat": true,
  "parsed": {
    "stateCode": "DL",
    "courtCode": "HC01",
    "caseNumber": "001234",
    "filingYear": "2023"
  },
  "isLive": false,
  "disclaimer": "Live CNR status requires CAPTCHA verification on the official eCourts Services portal. Use the direct link below to verify official real-time orders.",
  "officialPortalUrl": "https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus"
}
```
