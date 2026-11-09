# JusticeAI — AI-Powered Department of Justice Chatbot

**Ministry of Law & Justice, Government of India**

JusticeAI is an AI-powered conversational platform and citizen service portal built to provide easy, accessible, and authoritative guidance on Indian judicial services, court proceedings, case pendency statistics, judge vacancies, eCourts digital services, and legal aid.

---

## 👥 Remote Team Roles & Git Branches

This project is built by a distributed team of three engineers working across dedicated branches:

| Engineer | Role | Assigned Branch | Primary Directory |
|---|---|---|---|
| **Nitin** | AI / RAG Developer | `feature/ai` | `ai/`, `docs/nitin-progress.md` |
| **Shravani** | Frontend Developer | `feature/frontend` | `frontend/`, `docs/shravani-progress.md` |
| **Disha** | Backend Developer | `feature/backend` | `backend/`, `contracts/`, `docs/disha-progress.md` |

---

## 🏛️ Key Capabilities

- **Institutional Knowledge**: DoJ divisions, judicial infrastructure, fast-track special courts (FTSCs), legal aid.
- **Judge Statistics**: Sanctioned vs. working strength and current vacancies across Supreme Court, High Courts, and Subordinate Courts.
- **Case Pendency Analytics**: Aggregated National Judicial Data Grid (NJDG) statistics.
- **Procedural Guidance**: Interactive step-by-step assistance for Virtual Courts traffic challan payment, eFiling 3.0, ePay court fees, and Tele-Law.
- **Bilingual Interface**: Native Hindi and English support with official legal terminology.
- **Zero Hallucination Grounding**: Deterministic data lookups combined with document citations from official government portals.

---

## 🚀 Backend Quickstart (Disha's Module)

### Prerequisites
- Node.js >= 18 (Tested on v24)
- npm >= 9

### Installation & Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Verification
Visit `http://localhost:5000/api/health` in your browser or run:
```bash
curl http://localhost:5000/api/health
```

---

## 📑 Documentation
- **API Contract**: [`contracts/api-contract.md`](contracts/api-contract.md)
- **Backend Progress (Disha)**: [`docs/disha-progress.md`](docs/disha-progress.md)
