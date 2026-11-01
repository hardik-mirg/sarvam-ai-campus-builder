# Project: Sarvam Audit: Payout & Leakage Intelligence

## Architecture

Sarvam Audit is an investor-grade, zero-leakage beneficiary payout audit & intelligence web application built with React 18, Vite, TypeScript, and pure CSS variables. It models and executes an interactive 7-stage pipeline powered by Sarvam AI's multimodal vision, speech, and language infrastructure.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SARVAM AUDIT DUAL-MODE ROUTER                         │
│                                                                             │
│               [User / API Key Config: Live vs Simulation]                    │
│                                     │                                       │
│          ┌──────────────────────────┴──────────────────────────┐            │
│          ▼                                                     ▼            │
│  LIVE SARVAM AI API                                 DETERMINISTIC SIMULATION│
│  Base URL: https://api.sarvam.ai                    High-Fidelity Engine   │
│  Auth: api-subscription-key                         4 Bharat DBT Case Studies
│  - /chat/completions (Sarvam-105B)                  - PM-KISAN (Skimming)  │
│  - /text-to-speech (Bulbul v3)                      - Ladli Behna (Ghost)  │
│  - /speech-to-text (Saaras v3)                      - MGNREGA (Duplicate)  │
│  - /translate (Mayura v1)                           - PDS (Clean Baseline) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    7-STAGE PIPELINE STATE ORCHESTRATOR                      │
│ 1. Capture ─► 2. OCR ─► 3. Reconcile ─► 4. Voice ─► 5. Matrix ─► 6. Anchor  │
│                                  │                                     │    │
│                                  ▼                                     ▼    │
│                        7. Executive Dashboard & Public Auditor Proof        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Technical Pillars
1. **7-Stage Workflow**: Step-by-step interactive runner + global step jump navigation.
2. **Dual-Mode Adapter**: Direct Live Sarvam AI API client with CORS support + 100% deterministic high-fidelity simulation engine with zero external network dependency.
3. **Stripe/Vercel Enterprise UI**: Modern dark/light mode toggle via CSS variables (`[data-theme="dark"]` / `[data-theme="light"]`), `#4F46E5` primary accent, clean Inter typography, responsive command center / mobile field inspection.
4. **Interactive OCR & Bounding Boxes**: Normalized geometry `[ymin, xmin, ymax, xmax]` overlaid on receipt images with bi-directional field highlighting and raw JSON inspection.
5. **Speech & Audio Verification**: Outbound IVR call simulator with Web Audio API canvas waveform visualizer, Bulbul TTS playback, Saaras ASR streaming transcripts (Indic scripts + English translations), and contradiction scoring.
6. **Cryptographic Anchoring**: Native SHA-256 state hashing across all pipeline artifacts, visual Merkle tree DAG, interactive 1-byte tamper simulation, scan-ready QR code generation, and public verification modal.
7. **Executive Intelligence**: Live KPI metrics (Total Payouts Audited, Discrepancy Rate, Confirmed Leakage ₹, Recovery Probability), regional risk heatmaps, SVG leakage trendlines, and exportable one-click RTI/Donor audit dossier.

---

## Feature Inventory

Every feature from user requirements and survey reports is enumerated and assigned to a milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Vite + React 18+ TS Scaffolding | Clean modular frontend build with strict TypeScript, Vite config, and scripts | M1 | Survey / R3 |
| 2 | Pure CSS Token Design System | Enterprise theme system (Dark/Light toggle, `#4F46E5` accent, CSS variables, zero bloated CSS deps) | M1 | R2 |
| 3 | Dual-Mode Service Architecture | `SarvamServiceAdapter` interface with Live API client and Deterministic Simulation | M1 | R3 |
| 4 | Bharat DBT Welfare Case Studies | Full fixtures for PM-KISAN, Ladli Behna, MGNREGA, and PDS Clean Baseline | M1 | Survey / R3 |
| 5 | Global Pipeline State Machine | `PipelineContext` managing current step, active receipt, stage outputs, and execution state | M1 | R1 |
| 6 | Stage 1: Capture Engine | Preset receipt selection (thermal, carbon, handwritten, digital), custom image drop, camera snap simulator | M2 | R1.1 |
| 7 | Stage 2: Mayura OCR Overlay | High-resolution voucher viewer with normalized bounding boxes `[ymin, xmin, ymax, xmax]` | M2 | R1.2 |
| 8 | Stage 2: Sarvam-105B Structuring | Extraction of Beneficiary, Scheme, Sanctioned vs Paid, Date, Taluk ID, and Biometrics side-by-side JSON | M2 | R1.2 |
| 9 | Stage 2: Biometric Inspection | Thumbprint vs signature detection, ridge pattern quality score, duplicate detection | M2 | R1.2 |
| 10 | Stage 3: Official Registry Dataset | Preloaded DBT welfare roster cross-referencing + custom CSV/JSON registry upload | M2 | R1.3 |
| 11 | Stage 3: Automated Reconciliation | Delta calculation (₹), 4 distinct anomaly flags (amount skimming, ghost beneficiary, duplicate thumbprint, clean) | M2 | R1.3 / AC |
| 12 | Stage 4: Outbound IVR Simulator | Telephony dialer, ringback tone, connected status, and call state machine | M3 | R1.4 |
| 13 | Stage 4: Bulbul TTS Playback | Audio playback of synthesized Indic speech (Hindi, Marathi, Awadhi) with speaker personas | M3 | R1.4 |
| 14 | Stage 4: Web Audio Waveform | Real-time Canvas audio wave visualizer (AudioContext in live mode, harmonic synthesizer in simulation) | M3 | R1.4 |
| 15 | Stage 4: Saaras ASR Stream | Real-time streaming transcription in native Indic scripts + synchronized English translations | M3 | R1.4 |
| 16 | Stage 4: Contradiction Scoring | Semantic contradiction detection, grievance sentiment categorization, confirmed leakage flag | M3 | R1.4 |
| 17 | Stage 5: Anomaly Severity Triage | Ranked severity classification (Critical, High, Low) based on financial and identity risk | M3 | R1.5 |
| 18 | Stage 5: Leakage Loss Quantification | Automated loss calculation (₹ saved / at risk), district-wise breakdown, and fraud pattern detection | M3 | R1.5 |
| 19 | Stage 6: SHA-256 State Hashing | Cryptographic hashing of receipt, OCR data, reconciliation delta, and audio transcript | M4 | R1.6 |
| 20 | Stage 6: Merkle Tree Calculation | Merkle tree DAG computation, root calculation, and visual leaf verification nodes | M4 | R1.6 |
| 21 | Stage 6: Interactive Tamper Simulator | 1-byte modification toggle demonstrating real-time Merkle root mismatch and fraud alert | M4 | R1.6 |
| 22 | Stage 6: QR Code & Public Audit Modal | Scan-ready QR code generation and dedicated public auditor verification page showing immutable proof | M4 | R1.6 / AC |
| 23 | Stage 7: Executive KPI Metrics | Total Payouts Audited, Discrepancy Rate, Confirmed Leakage ₹, Recovery Probability cards | M4 | R1.7 / AC |
| 24 | Stage 7: Regional Risk Visuals | Interactive district risk breakdown, leak category distribution, and SVG trendlines | M4 | R1.7 |
| 25 | Stage 7: RTI / Donor Dossier Export | One-click exportable RTI/Donor audit summary (JSON download and formatted print/dossier modal) | M4 | R1.7 |
| 26 | Step Navigator & Global Controls | Sticky top navigation bar with step pills, progress bar, theme toggle, and live/sim mode switch | M4 | R1 / R2 |
| 27 | E2E Opaque-Box Test Suite | 4-tier requirement-driven E2E test suite (Feature Coverage, Boundary, Pairwise, Real-World Scenarios) | E2E Track | Dual Track |
| 28 | Final Integration & Verification | Clean build (`npm run build`), zero runtime errors, 100% E2E test pass, Tier 5 adversarial hardening | M5 | AC / Final |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Project Setup & Core State Machine | React 18 + Vite + TS scaffolding, pure CSS theme tokens (dark/light), `PipelineContext`, dual-mode engine, 4 Bharat case study fixtures | none | IN_PROGRESS |
| M2 | Stages 1-3 (Capture, OCR, Reconciliation) | Stage 1 Capture, Stage 2 Mayura OCR bounding boxes & Sarvam-105B structuring, Stage 3 DBT reconciliation & 4 anomaly flags | M1 | PLANNED |
| M3 | Stages 4-5 (Voice Verification, Leakage Matrix) | Stage 4 IVR simulator, Bulbul TTS, Web Audio canvas wave, Saaras ASR bilingual stream, contradiction scoring, Stage 5 Leakage Matrix | M2 | PLANNED |
| M4 | Stages 6-7 (Merkle Tree Audit Trail, Dashboard) | Stage 6 SHA-256 Merkle tree, tamper simulator, QR code, public verification modal, Stage 7 Executive KPI dashboard, RTI dossier export | M3 | PLANNED |
| M5 | Final E2E Test Pass & Tier 5 Hardening | Pass 100% E2E test suite published by E2E Testing Track, Tier 5 adversarial coverage hardening, production build verification | M4, E2E Track | PLANNED |
| E2E | E2E Testing Track (Parallel) | Requirement-driven opaque-box test suite across Tiers 1-4, test runner, publish TEST_READY.md | none | IN_PROGRESS |

---

## Interface Contracts

### 1. `SarvamServiceAdapter` (Dual-Mode Interface)
```typescript
export interface SarvamServiceAdapter {
  isLive: boolean;
  extractReceipt(imageBlob: Blob | string, presetId?: string): Promise<ExtractedReceiptData>;
  synthesizeSpeech(text: string, languageCode: string, speaker?: string): Promise<{ audioUrl: string; durationMs: number; base64Wav?: string }>;
  transcribeAudio(audioBlob: Blob | string, languageCode?: string): Promise<{ transcript: string; englishTranslation: string; confidence: number }>;
  analyzeContradiction(sanctioned: number, stated: number, transcriptText: string): Promise<ContradictionAssessment>;
}
```

### 2. `PipelineContextState` (Global State Machine)
```typescript
export interface PipelineState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  mode: 'SIMULATION' | 'LIVE_SARVAM_API';
  selectedCaseId: string;
  theme: 'dark' | 'light';
  capturedReceipt: CapturedReceipt | null;
  ocrExtraction: ExtractedReceiptData | null;
  reconciliationResult: ReconciliationResult | null;
  voiceVerificationResult: VoiceVerificationResult | null;
  leakageAnalysis: LeakageQuantification | null;
  merkleAuditTrail: MerkleAuditTrail | null;
  tamperSimulated: boolean;
  executionStatus: Record<number, 'idle' | 'running' | 'completed' | 'error'>;
}
```

### 3. `ExtractedReceiptData` (OCR & Structuring Contract)
```typescript
export interface ExtractedReceiptData {
  receiptId: string;
  scheme: string;
  beneficiaryName: { raw: string; standardized: string; confidence: number; boxId: string };
  amounts: { sanctionedInSlip: number | null; paidInSlip: number; currency: 'INR'; confidence: number; boxId: string };
  payoutDate: { raw: string; isoDate: string; confidence: number; boxId: string };
  officeMetadata: { talukId: string; gramPanchayat: string; district: string; state: string; operatorId: string };
  biometrics: {
    type: 'THUMBPRINT' | 'SIGNATURE' | 'BOTH' | 'MISSING';
    detected: boolean;
    box: [number, number, number, number];
    qualityScore: number;
    duplicateDetected: boolean;
    conflictingSlipId?: string;
  };
  boundingBoxes: Array<{
    id: string;
    field: string;
    label: string;
    box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in %
    rawText: string;
    confidence: number;
    script: string;
  }>;
  overallExtractionConfidence: number;
}
```

### 4. `MerkleAuditTrail` (Cryptographic State Contract)
```typescript
export interface MerkleAuditTrail {
  receiptHash: string;
  ocrHash: string;
  reconciliationHash: string;
  voiceVerificationHash: string;
  leafHashes: [string, string, string, string];
  intermediateHashes: [string, string];
  merkleRoot: string;
  timestamp: string;
  tamperedLeafIndex?: number;
  tamperedRoot?: string;
  isTampered: boolean;
  verificationUrl: string;
  qrPayload: string;
}
```

---

## Code Layout

```
/Users/hardik/Code/sarvam_campus_event/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles/
│   │   ├── variables.css      # Semantic tokens, dark/light themes, #4F46E5 accent
│   │   ├── global.css         # Typography, reset, layout
│   │   └── components/        # Modular CSS per stage
│   ├── types/
│   │   ├── pipeline.ts        # Stage states, case studies, interfaces
│   │   ├── sarvam.ts          # Sarvam AI API schemas
│   │   └── audit.ts           # Merkle tree, reconciliation, KPIs
│   ├── context/
│   │   └── PipelineContext.tsx # Central state machine & stage dispatch
│   ├── services/
│   │   ├── sarvamAdapter.ts   # Dual-mode router
│   │   ├── liveSarvamApi.ts   # Direct API calls to api.sarvam.ai
│   │   ├── simulationEngine.ts# Deterministic offline high-fidelity engine
│   │   └── merkleTree.ts      # Native Web Crypto SHA-256 Merkle calculations
│   ├── data/
│   │   ├── caseStudies.ts     # PM-KISAN, Ladli Behna, MGNREGA, PDS fixtures
│   │   └── officialRegistry.ts# Official sanctioned DBT welfare rosters
│   ├── components/
│   │   ├── common/            # Header, Navigation, Badges, Modals, AudioWaveform
│   │   ├── stage1_capture/    # Receipt uploader, presets, camera snap
│   │   ├── stage2_ocr/        # Bounding box image overlay, JSON explorer
│   │   ├── stage3_reconcile/  # DBT roster cross-checker, delta math, anomaly badges
│   │   ├── stage4_voice/      # IVR dialer, Bulbul TTS player, Saaras bilingual transcript
│   │   ├── stage5_leakage/    # Severity triage, loss quantification, taluk breakdown
│   │   ├── stage6_anchoring/  # Merkle tree DAG, tamper toggle, QR modal
│   │   └── stage7_dashboard/  # KPI cards, SVG trendlines, RTI dossier export
└── tests/
    ├── e2e/                   # Opaque-box requirement-driven E2E tests
    └── runner/                # Lightweight Node/Vite test runner
```
