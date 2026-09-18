# ClinOSCE iQ 🏥📱

> **On-Device AI Virtual Patient & Medical Diagnostic Simulator**  
> Built for the **iQOO Hackathon 2026 — Hyderabad City Battle (HealthTech Track)**  
> Engineered for Snapdragon NPU On-Device Edge Intelligence & iQOO Office Kit Cross-Device Ecosystem.

---

## 🌟 Executive Summary
Over **48% of diagnostic errors** made by interns and junior doctors stem from incomplete clinical history taking, unelicited physical signs, and premature closure. In India, **84% of Tier-2 and Tier-3 medical colleges** lack access to expensive simulation laboratories or standardized patient actors.

**ClinOSCE iQ** turns an iQOO flagship smartphone into a handheld clinical training station:
1. **🎙️ Voice-First History Taking:** Medical students question an AI-simulated patient using the phone's microphone. The patient responds audibly through the speaker in real-time.
2. **📸 Physical Examination Module:** Trainees use the camera and torch to inspect visual signs (e.g. testing pupillary light reflex or dermatological rashes) and elicit palpation tenderness with haptic feedback.
3. **🧠 Zero-Hallucination Case-RAG:** 10 verified clinical cases (5 Cardiology + 5 ENT) grounded directly in peer-reviewed **NCBI StatPearls & NIH PubMed** clinical guidelines.
4. **⚡ NVIDIA Nemotron Ultra 550B:** High-parameter live clinical roleplay via an authenticated serverless proxy (`/api/chat`), with instant offline on-device fallback.
5. **🎯 In-Chat Diagnosis & Surrender Auto-Termination:** Declaring a diagnosis (e.g., *"you are having a heart attack"*) or saying *"I don't know / give up"* stops the simulation, provides realistic emotional closure, and immediately unlocks the **OSCE Clinical Teaching Debrief** with pathophysiology, emergency protocols, and clickable NCBI paper links.
6. **💻 iQOO Office Kit Dual-Screen Bridge:** Live-streams the consultation transcript, patient vitals, and instant clinical reasoning scorecard onto a supervising professor's laptop screen.

---

## 🗂️ 10 Verified Clinical Cases (Zero Hallucination)

### ❤️ Cardiology Bay (5 Cases)
1. **Acute ST-Elevation Myocardial Infarction (STEMI)** — Ramesh Varma (56y/M) | [NCBI NBK532281](https://www.ncbi.nlm.nih.gov/books/NBK532281/)
2. **Acute Decompensated Heart Failure (ADHF)** — Savitri Devi (68y/F) | [NCBI NBK448195](https://www.ncbi.nlm.nih.gov/books/NBK448195/)
3. **Acute Pericarditis** — Arjun Mehta (29y/M) | [NCBI NBK431080](https://www.ncbi.nlm.nih.gov/books/NBK431080/)
4. **Paroxysmal Supraventricular Tachycardia (PSVT)** — Ananya Sen (24y/F) | [NCBI NBK482348](https://www.ncbi.nlm.nih.gov/books/NBK482348/)
5. **Acute Infective Endocarditis** — Vikram Roy (44y/M) | [NCBI NBK537130](https://www.ncbi.nlm.nih.gov/books/NBK537130/)

### 👂 ENT Bay (5 Cases)
6. **Acute Peritonsillar Abscess (Quinsy)** — Karan Malhotra (21y/M) | [NCBI NBK519520](https://www.ncbi.nlm.nih.gov/books/NBK519520/)
7. **Benign Paroxysmal Positional Vertigo (BPPV)** — Meenakshi Sundaram (58y/F) | [NCBI NBK470308](https://www.ncbi.nlm.nih.gov/books/NBK470308/)
8. **Acute Mastoiditis** — Rohan Das (19y/M) | [NCBI NBK544332](https://www.ncbi.nlm.nih.gov/books/NBK544332/)
9. **Acute Adult Epiglottitis (Airway Emergency)** — Suresh Pillai (48y/M) | [NCBI NBK430960](https://www.ncbi.nlm.nih.gov/books/NBK430960/)
10. **Sudden Sensorineural Hearing Loss (SSNHL)** — Deepa Joshi (36y/F) | [NCBI NBK448109](https://www.ncbi.nlm.nih.gov/books/NBK448109/)

---

## 📊 100% Alignment with Official iQOO Rubric

| Rubric Criterion | Weight | How ClinOSCE iQ Dominates |
| :--- | :---: | :--- |
| **End Product Quality** | **30%** | Polished, completed clinical simulation workflow with voice I/O, camera examination, and instant scorecard. |
| **Novelty and Impact** | **20%** | Replaces ₹50 Lakh hospital simulation mannequins with an accessible smartphone app for 100k+ medical students. |
| **HackTracker: Creative Phone Use** | **15%** | **Automated Device Data:** Invokes Microphone API (voice inquiry), Camera & Torch API (physical exam), and on-device inference. |
| **Technical Depth** | **15%** | Deterministic JSON state machine, low-latency client-side speech processing, and offline-first PWA architecture. |
| **HackTracker: Office Kit Usage** | **10%** | **Automated Device Data:** Continuous screen mirroring and session handover to the laptop EHR console. |
| **Demo and Presentation** | **10%** | Dramatic 3-minute stage pitch: presenter interviews the patient in **Airplane Mode**, tests pupil reflex, and mirrors results to PC. |

---

## 🚀 Live Demo & Repository Assets
* **Live Production Deployment:** [https://clinosce-iq.vercel.app](https://clinosce-iq.vercel.app)
* **GitHub Repository:** [https://github.com/mohammedsuhail0/IQOO-hackaton](https://github.com/mohammedsuhail0/IQOO-hackaton)
* **Presentation Deck (40% Text / 60% Graphs):** `ClinOSCE_iQ_Pitch.pptx` (available in repository root)

---

## 🛠️ Tech Stack
* **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
* **Audio & Speech:** Web Speech Recognition API + Web SpeechSynthesis API
* **Sensors:** MediaDevices Camera API, Flashlight/Torch API, Navigator Vibration API
* **AI Engine:** Dual-mode architecture:
  * *Default:* Local Deterministic Finite-State Machine (FSM) for 100% offline edge execution
  * *Optional:* NVIDIA Nemotron Ultra / Custom OpenAI-compatible LLM endpoint
* **Cross-Device Bridge:** iQOO / Vivo Office Kit Screen Mirror & Unified Clipboard

---

## 🏃 Quickstart (Local Development)

```bash
# Clone the repository
git clone https://github.com/mohammedsuhail0/IQOO-hackaton.git
cd IQOO-hackaton

# Install dependencies
npm install

# Run locally
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploy to Vercel

```bash
# Using Vercel CLI
npm i -g vercel
vercel
```
Or import `https://github.com/mohammedsuhail0/IQOO-hackaton` directly in the [Vercel Dashboard](https://vercel.com/new).

---

## 👥 Team
* **Mohammed Suhail** — Team Lead & Full-Stack / AI Engineer  
* **Event:** iQOO Hackathon 2026, Hyderabad City Battle
