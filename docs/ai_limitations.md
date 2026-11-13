# JusticeAI — AI Limitations & Known Issues

> **Author:** Nitin (AI / RAG Developer)  
> **Sprint:** Day 5 & Day 6 Final Delivery  
> **Target Audience:** Hackathon Evaluators, Integration Leads, Security & Ethics Auditors  
> **Version:** 2.5 (Production Ready)  

---

## 1. System Scope & Operational Boundaries

JusticeAI is strictly an **information and procedural assistance chatbot** created for the Department of Justice, Ministry of Law & Justice, Government of India. It does **not** provide legal advice, legal counsel, or subjective case predictions.

Below is an exhaustive inventory of system limitations, deliberate guardrails, and mitigations implemented across the AI pipeline.

---

## 2. Technical Limitations & Mitigations

### 2.1 No Real-Time Court Database Access (Live Data Boundary)
- **Limitation**: JusticeAI cannot establish direct SQL/TCP sockets to live court registries or read unreleased court orders due to firewall and security isolation policies on government intranet networks.
- **Impact**: It cannot look up live minute-by-minute order sheet entries or active hearings taking place today in a specific courtroom.
- **Mitigation Implemented**: 
  - Detects live case queries and extracts the 16-character CNR number if present.
  - Returns procedural instructions guiding litigants to enter their CNR on the live portal (`https://services.ecourts.gov.in`) or use the eCourts mobile app.
  - Informs users of the official eCourts SMS query pull service (`SMS ECOURTS <CNR> to 9766899899`).

### 2.2 Dynamic Statistics & Anti-Hallucination Guardrail
- **Limitation**: Judicial vacancy counts and case pendency totals change daily as judges retire, take oath, or dispose of cases.
- **Risk**: An LLM might fabricate exact vacancy counts (e.g. "There are exactly 312 vacancies today in High Courts").
- **Mitigation Implemented**:
  - The system prompt explicitly enforces the **Anti-Hallucination Mandate**.
  - All judge strength responses report verified baseline constitutional counts (Supreme Court: 34 approved; High Courts: 1,114 approved) accompanied by a mandatory disclaimer:
    > *"Figures are baseline approximations. For real-time vacancy and pendency data, please refer directly to the National Judicial Data Grid at https://njdg.ecourts.gov.in."*

### 2.3 Strict Prohibition on Legal Advice & Outcome Predictions
- **Limitation**: AI cannot act as an advocate or guarantee case verdicts.
- **Risk**: Citizens asking *"Will I win my divorce/property case?"* or *"What is the secret verdict tomorrow?"* could receive harmful or misleading advice.
- **Mitigation Implemented**:
  - `intent_classifier.js` contains a high-priority `LEGAL_ADVICE_PROHIBITED` regex and token filter.
  - When triggered, the query bypasses the generative model completely and routes to the **Guardrail Policy Engine**, returning a legally sound bilingual disclaimer directing citizens to advocate consultations or free legal aid under Tele-Law (`https://www.tele-law.in`) and NALSA (`helpline 15100`).

### 2.4 Language & Script Nuances
- **Limitation**: Indian legal discourse frequently mixes colloquial regional vernacular with formal English statutory terminology (e.g. *peshi*, *vakalatnama*, *tarikh*, *challan*).
- **Mitigation Implemented**:
  - `intent_classifier.js` includes a Devanagari character-range detector and a dedicated Hinglish marker tokenizer (`hi-Latn`).
  - Common legal Hindi/Hinglish terms (*tariq*, *peshi*, *faisla*, *vakeel*, *muft kanuni salah*) are mapped directly to corresponding canonical service intents.
  - 10 out of 50 test cases explicitly validate Devanagari Hindi and Hinglish queries.

### 2.5 Out-of-Scope Boundary Enforcement
- **Limitation**: Users may attempt to use JusticeAI as a general-purpose chat assistant for weather, food recipes, sports, or entertainment.
- **Mitigation Implemented**:
  - A word-boundary filtered `OUT_OF_SCOPE_PATTERNS` regex catches non-judicial topics.
  - Returns a polite `guardrail-scope-filter` response explaining the Department of Justice's mandate and listing supported services.

### 2.6 CAPTCHA & Security Isolation on Live eCourts Portals
- **Limitation**: The official eCourts Services portal (`services.ecourts.gov.in`) employs visual CAPTCHAs to prevent automated scraping of sensitive personal litigant records.
- **Mitigation Implemented**:
  - JusticeAI provides validated sandbox demo case numbers (e.g., `DLHC010012342023`, `MHPU010056782022`) for user testing and guides real litigants on how to solve the CAPTCHA on the official portal.

---

## 3. Summary of Guardrail Engine Triggers

| Trigger Pattern | Target Intent | Model Pipeline | Output Type |
|---|---|---|---|
| "Will I win my case?", "गुप्त फैसला" | `LEGAL_ADVICE_PROHIBITED` | `guardrail-policy-engine` | Ethical refusal + Tele-Law referral |
| "Weather in Delhi", "बिरयानी रेसिपी" | `OUT_OF_SCOPE` | `guardrail-scope-filter` | Scope boundary message + DoJ link |
| "Namaste", "Hello" | `GREETING` | `greeting-handler` | Welcome message + service directory |
| Unknown query with 0 relevant chunks | `DOJ_ADMIN` | `no-relevant-document-fallback` | Citizen helpline 14416 + portal link |
| Specific service query with relevant docs | Service Intent | `gemini-1.5-flash` / Grounded Fallback | Verified answer + citations + links |

---

## 4. Recommendations for Next-Generation Deployment

1. **State-Level Knowledge Expansion**: Ingest High Court-specific local rules (e.g., Bombay High Court Appellate Side Rules).
2. **Scheduled NJDG Data Pulls**: Implement a daily batch pipeline to sync NJDG open data CSV releases into the vector store.
3. **Voice Interface (Bhashini Integration)**: Incorporate Government of India's Bhashini speech-to-text API for rural voice-based accessibility.
