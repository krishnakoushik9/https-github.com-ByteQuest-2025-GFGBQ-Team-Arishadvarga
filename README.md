# CDSS - Clinical Decision Support System
### Team Arishadvarga | GFG ByteQuest 2025

<br/>

<div align="center">

## 🚀 [**Try the Live Demo →**](https://cdss-bzgwrkva3-krishnakoushik9s-projects.vercel.app/)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Click_Here-10b981?style=for-the-badge&logoColor=white)](https://cdss-bzgwrkva3-krishnakoushik9s-projects.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

<br/>

---

> ⚠️ **Quick Note**: We apologize for the delayed submission in rounds 2 and 3. We spent extra time building a production-ready system with full Firebase integration and AI analysis capabilities rather than rushing a skeleton app. Quality over speed this time!

---

## What We Built

A **real-time AI-powered clinical decision support system** that helps healthcare professionals with:

- **Differential Diagnosis Generation** — AI analyzes patient symptoms, vitals, and history to suggest ranked diagnoses with confidence scores
- **Red Flag Detection** — Automatic identification of urgent clinical concerns
- **Test Recommendations** — Prioritized lab/imaging suggestions based on clinical picture
- **Treatment Pathways** — Evidence-based treatment options with guideline references
- **Case Persistence** — All cases saved to Firebase Firestore for review and audit

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS + Custom Design System |
| AI Engine | Google Gemini 2.0 Flash |
| Database | Firebase Firestore |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/krishnakoushik9/https-github.com-ByteQuest-2025-GFGBQ-Team-Arishadvarga.git
cd cdss

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY and Firebase config

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Features Breakdown

### 1. Patient Assessment Workflow
Multi-step form with:
- Demographics intake (GDPR-compliant pseudonymized IDs)
- Symptom entry (manual + AI NLP extraction)
- Vital signs recording
- Medical history
- Lab results

### 2. AI Analysis Engine
- Powered by Gemini 2.0 Flash
- Returns structured JSON with:
  - 3-7 differential diagnoses with confidence %
  - Supporting/contradicting evidence
  - Red flags with urgency levels
  - Recommended tests
  - Treatment pathways

### 3. Firebase Integration
- Real-time case saving
- Dashboard shows live data from Firestore
- Search and filter saved cases
- Full audit trail

### 4. UI/UX
- Premium design with rounded components
- Responsive layout
- Smooth animations
- Dark mode ready (system preference)

---

## Project Structure

```
cdss/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── page.tsx         # Dashboard
│   │   ├── assessment/      # Assessment workflow
│   │   ├── cases/           # Saved cases
│   │   └── api/             # API routes
│   ├── components/          # UI components
│   │   ├── ui/              # Base components
│   │   ├── forms/           # Form components
│   │   ├── medical/         # Medical-specific
│   │   └── analysis/        # AI results display
│   ├── lib/                 # Utilities
│   │   ├── gemini.ts        # AI service
│   │   ├── firebase.ts      # Firebase config
│   │   └── db.ts            # Firestore operations
│   └── types/               # TypeScript types
└── public/
```

---

## Screenshots

*(run the app locally to see the full experience)*

- **Dashboard** — Real-time stats from Firebase
- **Assessment Flow** — 6-step patient intake
- **AI Analysis** — Tabbed results with reasoning
- **Cases Page** — Searchable saved cases

---

## Compliance

- GDPR compliant (pseudonymized patient IDs)
- HIPAA ready architecture
- Full audit trail for all AI interactions
- Medical disclaimer on all outputs

---

## Team

**Team Arishadvarga**
- Built with 💚 for GFG ByteQuest 2025

---

## License

MIT

---

*Again, sorry for not being the fastest in rounds 1 and 2 — we were heads-down building something we're actually proud of. Hope you like it!* 🙏
