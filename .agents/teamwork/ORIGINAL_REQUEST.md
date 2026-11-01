# Original User Request

## 2026-11-01T10:47:09Z

Build an end-to-end, investor-grade interactive audit & verification web application ("Sarvam Audit: Payout & Leakage Intelligence") in React.js (Vite) that models and executes a 7-step zero-leakage beneficiary payout pipeline powered by Sarvam AI's speech, vision, and language infrastructure.

Working directory: /Users/hardik/Code/sarvam_campus_event
Integrity mode: demo

## Requirements

### R1. Complete 7-Step Interactive Pipeline & Workflow
Implement an interactive, visual stage-by-stage pipeline runner covering:
1. **Capture**: Upload or camera-snap sample physical payout receipts (supporting thermal slips, handwritten vouchers, crumpled cash slips in English, Hindi, Awadhi, Marathi, etc.). Provide preset realistic receipts and custom image drop.
2. **OCR + Structuring (Mayura & Sarvam-105B)**: Multilingual optical character recognition extraction, bounding box overlay, confidence scores, and structured JSON extraction (Beneficiary Name, Scheme, Sanctioned vs Paid Amount, Date, Office/Taluk ID, Thumbprint/Signature detection).
3. **Reconciliation**: Cross-reference extracted data against an official sanctioned government registry dataset (uploaded CSV/JSON or pre-loaded DBT welfare roster). Automatically calculate delta, mark duplicate thumbprints, out-of-sequence serial numbers, and mismatch tags.
4. **Voice Verification (Bulbul TTS + Saaras ASR)**: Interactive automated outbound verification call simulator. Features bilingual audio playback (interactive browser Web Audio / Sarvam TTS integration), wave visualizer, real-time transcript streaming in Indic scripts + English translation, and live conversational intent/contradiction scoring.
5. **Anomaly Aggregation & Leakage Matrix**: Ranked severity triage (Critical, High, Low) with automated financial leakage loss quantification (₹ saved / at risk), district-wise breakdown, and fraud pattern detection.
6. **Anchoring & Tamper-Evident Audit Trail**: Merkle tree root calculation, cryptographic SHA-256 state hashing for every receipt + OCR + call transcript, generation of scan-ready QR codes, and a dedicated public auditor verification page showing immutable proof of record.
7. **Executive Intelligence Dashboard**: High-level KPI metrics (Total Payouts Audited, Discrepancy Rate, Confirmed Leakage in ₹, Recovery Probability), regional heatmaps/charts, leakage trendlines, and exportable one-click RTI/Donor audit summaries.

### R2. Design & User Experience Standards
- **Aesthetic**: Stripe / Vercel-grade enterprise UI with clean typography (Inter / Geist Sans), deep Indigo/Violet primary accent (`#4F46E5`), balanced dark/light mode toggle, generous card padding, and subtle borders.
- **Components**: Polished data tables, interactive receipt inspection viewer with field-level OCR highlights, status badges, audio player controls, and Lucide React iconography.
- **Responsiveness**: Mobile-first responsive layout that gracefully adapts from desktop audit command center to field-agent mobile inspection.

### R3. Architecture & Functional Integration
- Modern React 18+ bootstrapped with Vite, pure modular CSS / CSS variables (no bloated external styling dependencies), and Lucide React.
- Seamless dual-mode operation:
  - **Live Sarvam AI Connection**: Connects with Sarvam API endpoints using `SARVAM_API_KEY` (configured in local proxy/backend or client-side demo key handler) for Sarvam-105B, Bulbul TTS, and Saaras ASR where applicable.
  - **Deterministic High-Fidelity Simulation Mode**: Fully pre-seeded with rich, realistic Bharat DBT welfare payout case studies (e.g., PM-KISAN, Ladli Behna, MGNREGA vouchers) ensuring seamless demonstration even offline or when hitting API rate limits.

## Acceptance Criteria

### Build & Code Quality
- [ ] Vite project builds cleanly (`npm run build`) without TypeScript or compilation errors.
- [ ] Project starts cleanly (`npm run dev`) and serves on localhost.
- [ ] Clean modular architecture with dedicated components for each pipeline stage, state management, and mock data engine.

### Feature Completeness
- [ ] Users can execute all 7 pipeline steps sequentially or jump directly to any step via step navigator.
- [ ] Receipt viewer displays image with interactive OCR bounding boxes and extracted structured JSON side-by-side.
- [ ] Reconciliation flags at least 3 distinct anomaly types (amount mismatch, ghost beneficiary / name mismatch, duplicate signature).
- [ ] Voice verification simulator plays audio or synthesized speech, shows live waveform/status, and transcribes spoken response.
- [ ] Merkle root computation produces valid cryptographic hashes and renders a verifiable public audit modal with QR code.
- [ ] Executive dashboard displays live metrics reflecting inspected receipts and calculated leakage amounts in INR.
- [ ] Dark/Light mode theme switch works seamlessly across all views.


## Follow-up — 2026-11-01T11:01:00Z

i dont have much time, wrap it up and prioritize finishing the MVP quickly, as fast as possible. the basic functionality is needed right now VERY QUICKLY!


## Follow-up — 2026-11-01T11:03:22Z

stop everything right now and just build the final fully functional project right now in 5 minutes quick! dont have time
