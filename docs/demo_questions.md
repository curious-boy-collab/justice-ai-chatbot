# JusticeAI — 10 Impressive Demo Questions & Expected Responses

> **Author:** Nitin (AI / RAG Developer)  
> **Sprint:** Day 5 & Day 6 Final Delivery  
> **Target Audience:** Hackathon Judges, DoJ Evaluators, Technical Demo Leads  
> **Platform Tested:** JusticeAI RAG Chat Engine v2.5  

These 10 curated questions showcase JusticeAI's bilingual fluency, anti-hallucination guardrails, CNR entity extraction, and multi-service knowledge grounding.

---

### Demo Question 1: Case Status & CNR Entity Extraction (English)
- **Question:** `"How can I check the status of my High Court case using my CNR number DLHC010012342023?"`
- **Key Capabilities Highlighted:**
  - Extracts 16-character CNR number (`DLHC010012342023`).
  - Explains the CNR structure (State: DL, Court: HC, Code: 01, Case: 001234, Year: 2023).
  - Outlines the verification workflow on `services.ecourts.gov.in`.
  - Cites the official eCourts Services portal.
- **Official Citation:** `https://services.ecourts.gov.in`

---

### Demo Question 2: Tele-Law & Free Legal Aid Eligibility (Devanagari Hindi)
- **Question:** `"टेली-लॉ योजना क्या है और क्या ग्रामीण क्षेत्रों में महिलाओं को मुफ्त कानूनी सलाह मिल सकती है?"`
- **Key Capabilities Highlighted:**
  - Full Devanagari Hindi natural language grounding.
  - Explains the DISHA scheme under the Ministry of Law & Justice.
  - Details Section 12 of the Legal Services Authorities Act (free aid for women, SC/ST, disabled persons).
  - Provides the toll-free citizen helpline (`14416`) and CSC portal link.
- **Official Citation:** `https://www.tele-law.in` | Helpline: `14416`

---

### Demo Question 3: Virtual Courts Traffic Fine Workflow (English)
- **Question:** `"What is the difference between pleading guilty and contesting a traffic challan on Virtual Courts?"`
- **Key Capabilities Highlighted:**
  - Step-by-step procedural breakdown for `vcourts.gov.in`.
  - Explains digital fine payment via electronic judicial gateways.
  - Explains the transfer of contested challans to regular magistrate courts.
  - Distinguishes Virtual Courts from the Parivahan eChallan portal.
- **Official Citation:** `https://vcourts.gov.in` | Related: `https://echallan.parivahan.gov.in`

---

### Demo Question 4: Higher Judiciary Appointments & Sanctioned Strengths (English)
- **Question:** `"What is the sanctioned strength of Supreme Court and High Court judges, and how does the Collegium appoint them?"`
- **Key Capabilities Highlighted:**
  - Accurately cites 34 approved SC judges (including CJI) and 1,114 approved High Court judges across 25 High Courts.
  - Explains Article 124(2) and Article 217 constitutional appointment framework.
  - Outlines the Memorandum of Procedure (MoP).
  - **Anti-Hallucination Guardrail**: Includes the live vacancy advisory redirecting to `njdg.ecourts.gov.in`.
- **Official Citation:** `https://doj.gov.in/list-of-high-court-judges/`

---

### Demo Question 5: Court Live Streaming & Privacy Exceptions (Hindi)
- **Question:** `"क्या आम नागरिक सुप्रीम कोर्ट और हाई कोर्ट की सुनवाई लाइव देख सकते हैं? क्या सभी मामलों का प्रसारण होता है?"`
- **Key Capabilities Highlighted:**
  - Explains Supreme Court live streaming (`streaming.sci.gov.in`) and official YouTube channel under the Swapnil Tripathi (2018) judgment.
  - Details the Model Rules for Live Streaming 2021.
  - Accurately cites strict statutory privacy exemptions (POCSO, matrimonial disputes, sexual assault, and in-camera proceedings).
- **Official Citation:** `https://streaming.sci.gov.in`

---

### Demo Question 6: eFiling 3.0 & ePay Judicial Fees (English)
- **Question:** `"What are the technical requirements for filing a petition on eFiling 3.0 and paying court fees online?"`
- **Key Capabilities Highlighted:**
  - Explains the unified eFiling 3.0 portal (`efiling.ecourts.gov.in`).
  - Highlights PDF/A format requirements and optical character recognition (OCR).
  - Outlines digital signing options (Class III DSC vs Aadhaar-based eSign).
  - Explains ePay integration with State Treasuries, GRAS, and Bharatkosh.
- **Official Citation:** `https://efiling.ecourts.gov.in`

---

### Demo Question 7: Fast Track Special Courts & POCSO Timeline (English)
- **Question:** `"What are Fast Track Special Courts (FTSCs) and what is the statutory disposal timeline for POCSO cases?"`
- **Key Capabilities Highlighted:**
  - Explains the Centrally Sponsored Scheme funded under the Nirbhaya Fund.
  - Notes the 1-year statutory completion mandate for POCSO investigations and trials.
  - Describes child-friendly courtrooms and Vulnerable Witness Deposition Centres (VWDC).
- **Official Citation:** `https://doj.gov.in/fast-track-special-courts/`

---

### Demo Question 8: Anti-Hallucination Guardrail — Case Outcome Prediction (English)
- **Question:** `"Can you guarantee that the judge will rule in my favour in my ongoing property dispute WP 456/2024?"`
- **Key Capabilities Highlighted:**
  - Ethical AI Guardrail actively triggered (`LEGAL_ADVICE_PROHIBITED`).
  - Refuses to speculate or predict outcomes on active or sub-judice litigation.
  - Informs the citizen that AI provides procedural guidance only, not legal counsel.
  - Provides a direct link to free legal advice via Tele-Law (`https://www.tele-law.in`) and NALSA Helpline (`15100`).
- **Safety Policy:** Non-negotiable ethical safeguard.

---

### Demo Question 9: Hinglish Colloquial Query Handling (Hinglish)
- **Question:** `"Mera traffic challan kaat gaya hai, online verify karke pay kaise kare?"`
- **Key Capabilities Highlighted:**
  - Multi-script semantic understanding of Romanized Hindi (Hinglish).
  - Correctly classifies intent as `TRAFFIC_FINES`.
  - Details the step-by-step search by Challan Number, Vehicle Number, or Driving Licence.
  - Provides official URLs for both Parivahan eChallan and Virtual Courts.
- **Official Citation:** `https://vcourts.gov.in`

---

### Demo Question 10: Scope Boundary Enforcement (Out-of-Scope Fallback)
- **Question:** `"What is the weather forecast for New Delhi tomorrow and who will win the cricket match?"`
- **Key Capabilities Highlighted:**
  - `OUT_OF_SCOPE` guardrail cleanly intercepts the request.
  - Politely explains JusticeAI's dedicated mission for the Department of Justice.
  - Lists the 10 judicial services available for citizen assistance.
  - Directs users to the central DoJ website (`https://doj.gov.in`).
- **Official Citation:** `https://doj.gov.in`
