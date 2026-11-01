# Workspace & Environment Survey Report: Sarvam Audit Intelligence

**Document Version**: 1.0.0  
**Survey Date**: 2026-11-01  
**Investigator**: Explorer 1 (`teamwork_preview_explorer_survey_1`)  
**Project**: *Sarvam Audit: Payout & Leakage Intelligence*  
**Workspace**: `/Users/hardik/Code/sarvam_campus_event`

---

## Executive Summary

A comprehensive, read-only survey of `/Users/hardik/Code/sarvam_campus_event` was conducted. The repository is currently in a pre-scaffold state: it contains an initial `package.json` with `sarvamai: ^1.1.14`, an `index.js` test harness, and an active `.env` with a verified `SARVAM_API_KEY`. No Vite or React project exists yet, no TypeScript config exists, and no sample receipts or mock DBT datasets currently exist.

Direct empirical testing confirmed that:
1. **Node.js (v24.17.0)** and **npm (11.13.0)** are installed on the host at `/opt/homebrew/bin/`. Subshell executions must explicitly prepend `/opt/homebrew/bin` to `PATH`.
2. The provided `SARVAM_API_KEY` is **valid and active**. Live API calls to `sarvam-105b-conversations` and `client.textToSpeech.convert` (Bulbul TTS) were executed successfully.
3. Sarvam AI's API endpoints at `https://api.sarvam.ai` natively provide `access-control-allow-origin: *`, enabling seamless client-side or Vite dev server proxy access.
4. `npm install --dry-run` confirmed zero dependency conflicts for React 18.3, Vite 8/6, TypeScript 7, Lucide React, and QRCode.

---

## 1. Workspace Inventory & File Inspection

| File / Path | Type | Size | Status & Content Analysis |
|---|---|---|---|
| `package.json` | File | 54 B | Minimal manifest containing solely `"dependencies": { "sarvamai": "^1.1.14" }`. No scripts, no devDependencies, no React/Vite. |
| `package-lock.json` | File | 1.1 KB | Locks `sarvamai@1.1.14` and its internal Fern SDK dependencies. |
| `index.js` | File | 752 B | Test script that initializes `SarvamAIClient` and calls `client.chat.completions` with model `sarvam-105b-conversations`. |
| `.env` | File | 53 B | Contains `SARVAM_API_KEY=sk_jyll360v_gudZZDMejpwkSApzW7L4I7ru`. Verified working. |
| `.gitignore` | File | 20 B | Ignores `.env` and `node_modules/`. |
| `node_modules/` | Directory | — | Contains `sarvamai@1.1.14` and its type definitions/reference documentation. |
| `.agents/teamwork/` | Directory | — | Agent metadata, `ORIGINAL_REQUEST.md`, and agent workspace folders. |
| `.git` | None | — | Workspace is not currently a git repository (`fatal: not a git repository`). |
| Sample receipts / assets | None | 0 B | No image assets, sample physical vouchers, or mock rosters exist yet. Must be generated/created. |

---

## 2. Runtime & Toolchain Diagnostics

### 2.1 Node & NPM Environment
- **Node.js Version**: `v24.17.0` (Location: `/opt/homebrew/bin/node`)
- **NPM Version**: `11.13.0` (Location: `/opt/homebrew/bin/npm`)
- **Shell PATH Caveat**: The subshell spawned by the task runner does not include `/opt/homebrew/bin` in default `PATH`.
  - **Required Command Prefix**: Every build, test, and npm command must execute with:
    ```bash
    export PATH="/opt/homebrew/bin:$PATH" && <command>
    ```
- **Network Sandbox Caveat**: Outbound internet traffic (npm downloads, Sarvam API calls) is blocked by the tool sandbox unless `BypassSandbox: true` is set on commands.

### 2.2 Sarvam AI SDK & API Live Verification
Direct live testing was performed on the Sarvam AI endpoints using the key from `.env`:
1. **Chat Completions (`sarvam-105b-conversations`)**:
   - Call: `client.chat.completions({ model: "sarvam-105b-conversations", messages: [...] })`
   - Result: Successful response (`"I am an AI assistant created by Sarvam, here to help you with information, reasoning, and tasks."`).
2. **Bulbul TTS (`bulbul:v3` / `bulbul:v4-flash`)**:
   - Call: `client.textToSpeech.convert({ text: "नमस्ते, क्या आपको पीएम किसान की राशि प्राप्त हुई?", language_code: "hi-IN" })`
   - Result: Generated 170,656 bytes of base64 audio data cleanly in ~1.5s.
3. **CORS Headers**:
   - Preflight check on `https://api.sarvam.ai/chat/completions`:
     `access-control-allow-origin: *`
     `access-control-allow-methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT`
     `access-control-allow-headers: api-subscription-key,content-type`

---

## 3. Architecture & Scaffolding Strategy

### 3.1 Scaffolding Recommendation
Rather than wiping the root directory or creating nested subfolders, scaffold Vite directly into `/Users/hardik/Code/sarvam_campus_event`:
1. Update `package.json` with scripts:
   - `"dev": "vite"`
   - `"build": "tsc && vite build"`
   - `"preview": "vite preview"`
2. Add Vite configuration (`vite.config.ts`) with React plugin and dev proxy to `https://api.sarvam.ai`:
   ```ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5173,
       proxy: {
         '/api/sarvam': {
           target: 'https://api.sarvam.ai',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api\/sarvam/, ''),
         },
       },
     },
   });
   ```
3. Configure `tsconfig.json` and `tsconfig.node.json` with strict type checking.

### 3.2 Recommended Package Selection

| Package | Version | Justification |
|---|---|---|
| `react` & `react-dom` | `^18.3.1` | Modern React 18+ requirement; stable hooks, concurrent features, zero breaking changes. |
| `lucide-react` | `^1.66.0` | Comprehensive enterprise iconography matching Stripe/Vercel aesthetics. Clean SVG components. |
| `qrcode.react` | `^4.2.0` | High-fidelity vector SVG QR code generation for Stage 6 immutable audit trail. |
| `canvas-confetti` | `^1.9.4` | Visual celebration when an audit trail is sealed and cryptographic verification passes. |
| `@types/canvas-confetti` | `^1.9.0` | TypeScript definitions for canvas-confetti. |
| `vite` | `^6.x` / `^8.x` | Ultra-fast HMR and production bundling. |
| `@vitejs/plugin-react` | `^4.x` / `^6.x` | Official React JSX/Fast Refresh plugin. |
| `typescript` | `^5.x` / `^7.x` | Strict type safety for the pipeline models. |
| `@types/react`, `@types/react-dom` | `^18.3.x` | React types. |

**Zero External CSS Framework**: As explicitly required in R2/R3, avoid Tailwind, Bootstrap, or bloated CSS libs. Use pure modular CSS with modern CSS variables, `light-dark()`, and `:root` theme definitions.

### 3.3 Cryptographic Hashing for Stage 6 (Merkle Tree)
- **Engine**: Standard **Web Crypto API** (`globalThis.crypto.subtle.digest("SHA-256", ...)`).
- **Justification**:
  - Zero external dependency bloat.
  - 100% native in all modern browsers and Node 20+.
  - Highly performant hardware-accelerated SHA-256 computation.
  - Paired with an elegant recursive binary Merkle tree implementation that computes leaf hashes for `ReceiptState + OCRResult + CallTranscript` and produces the root anchor hash.

### 3.4 Web Audio & Voice Verification Engine (Stage 4)
- **Engine**: Browser standard **Web Audio API** (`AudioContext`, `AnalyserNode`, `AudioBufferSourceNode`).
- **Capabilities**:
  - Live base64 decoding of Sarvam Bulbul TTS audio chunks.
  - Real-time frequency and time-domain analysis for animated Canvas audio waveforms.
  - Multi-track voice simulation (Field Auditor Agent vs Beneficiary) with simulated telephone bandpass filter (`BiquadFilterNode` at 300Hz-3400Hz) and acoustic ambient noise for hyper-realistic outbound call simulation.

---

## 4. UI Design System Specification (Stripe / Vercel Aesthetic)

### 4.1 Color Palette & Token Definitions
```css
:root {
  color-scheme: light dark;

  /* Brand Accents */
  --color-primary: #4F46E5;        /* Deep Indigo */
  --color-primary-hover: #4338CA;
  --color-primary-light: #EEF2FF;
  --color-accent: #7C3AED;         /* Electric Violet */

  /* Semantic Alerts */
  --color-danger: #DC2626;         /* Critical Leakage / Red Flag */
  --color-danger-bg: #FEF2F2;
  --color-warning: #D97706;        /* Discrepancy / Yellow Flag */
  --color-warning-bg: #FFFBEB;
  --color-success: #059669;        /* Verified Clean / Green Pass */
  --color-success-bg: #ECFDF5;

  /* Surfaces & Typography (Light Default) */
  --bg-app: #F8FAFC;
  --bg-card: #FFFFFF;
  --border-card: #E2E8F0;
  --text-main: #0F172A;
  --text-muted: #64748B;
  --shadow-subtle: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
}

:root[data-theme="dark"] {
  --bg-app: #0B0F19;
  --bg-card: #111827;
  --border-card: #1E293B;
  --text-main: #F8FAFC;
  --text-muted: #94A3B8;
  --color-primary-light: #1E1B4B;
  --color-danger-bg: #450A0A;
  --color-warning-bg: #451A03;
  --color-success-bg: #064E3B;
  --shadow-subtle: 0 1px 3px 0 rgb(0 0 0 / 0.4);
  --shadow-card: 0 4px 12px 0 rgb(0 0 0 / 0.5);
}
```

### 4.2 Dark Mode Compliance
Following Modern Web Guidance (`dark-mode-toggle`):
1. Support system preference fallback using `@media (prefers-color-scheme: dark)`.
2. Support user manual override via toggle in header, persisted in `localStorage` under key `sarvam-audit-theme`.
3. Set `<meta name="color-scheme" content="light dark">` in `index.html` with inline anti-FOUC initialization script.

---

## 5. Sample Dataset & Simulation Architecture

To satisfy R3 (Deterministic High-Fidelity Simulation Mode) and R1 (Pipeline Steps), rich pre-seeded Bharat DBT welfare datasets must be created:
1. **Case Study 1: PM-KISAN Installment Fraud (Critical Anomaly)**
   - Physical Slip: Crumpled rural cooperative cash receipt in Hindi (Devanagari).
   - Extracted OCR: Beneficiary "रामेश्वर यादव" (Rameshwar Yadav), Sanctioned: ₹2,000, Paid on Slip: ₹1,400.
   - Official DBT Registry: Sanctioned ₹2,000 to Account XXXX4912.
   - Discrepancy: ₹600 middleman siphon + forged signature stamp.
   - Call Simulation: Hindi outbound call; beneficiary confirms receiving only ₹1,400. Intent score: 98% Confirmed Fraud.
2. **Case Study 2: Ladli Behna Yojana Ghost Payout (High Anomaly)**
   - Physical Slip: Thermal receipt from Taluk Panchayat office in Marathi.
   - Extracted OCR: Beneficiary "सुनीता कांबळे", Aadhaar ending 8124, Thumbprint blurry.
   - Official DBT Registry: Aadhaar 8124 corresponds to deceased beneficiary; thumbprint hash matches previously flagged duplicate.
   - Discrepancy: Ghost beneficiary payout.
   - Call Simulation: Marathi outbound call; number disconnected / unreachable.
3. **Case Study 3: MGNREGA Wage Slip (Verified Clean Pass)**
   - Physical Slip: Handwritten muster roll slip in English & Awadhi.
   - Extracted OCR: Beneficiary "Shanti Devi", 14 days labor, Sanctioned: ₹3,416, Paid: ₹3,416.
   - Official DBT Registry: Exact 1:1 match on muster roll #MG-2026-0819.
   - Discrepancy: None.
   - Call Simulation: Beneficiary confirms full payment received. Intent score: 100% Clean.

---

## 6. Project Directory Layout Proposal

```
/Users/hardik/Code/sarvam_campus_event/
├── .env                              # SARVAM_API_KEY (live mode)
├── package.json                      # React 18, Vite, Lucide React, TypeScript
├── vite.config.ts                    # Vite config + proxy for Sarvam AI
├── tsconfig.json                     # Strict TypeScript config
├── index.html                        # App entry + font imports (Inter) + theme script
├── public/
│   └── favicon.svg                   # Sarvam Audit shield emblem
└── src/
    ├── main.tsx                      # App bootstrap
    ├── App.tsx                       # Global layout, header, pipeline orchestrator
    ├── types/
    │   ├── pipeline.ts               # Pipeline stage definitions (1 to 7)
    │   ├── receipt.ts                # Physical receipt, OCR bounding boxes, structured JSON
    │   ├── roster.ts                 # Sanctioned DBT welfare registry schema
    │   ├── audit.ts                  # Merkle node, SHA-256 proof, QR payload
    │   └── metrics.ts                # KPI metrics, leakage summary, district breakdown
    ├── data/
    │   ├── presetReceipts.ts         # High-fidelity SVG receipt generators + OCR coordinates
    │   ├── officialRoster.ts         # Preloaded DBT welfare registry dataset
    │   └── callSimulations.ts        # Bilingual call scripts, audio presets, intent scores
    ├── services/
    │   ├── sarvamApi.ts              # Live Sarvam AI API client (TTS, ASR, 105B)
    │   ├── merkleService.ts          # Web Crypto SHA-256 Merkle tree calculation & verify
    │   ├── audioService.ts           # Web Audio API waveform visualizer & synthesizer
    │   └── storageService.ts         # Local session persistence
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx            # Title, Mode toggle (Live vs Sim), Theme toggle, Reset
    │   │   ├── StepNavigator.tsx     # 7-step interactive progress bar with status chips
    │   │   └── Footer.tsx            # Auditor signature, Sarvam AI infra credits
    │   ├── common/
    │   │   ├── Badge.tsx             # Severity & Status badges (Critical, Pass, Anomaly)
    │   │   ├── Modal.tsx             # Accessible dialog for public verification & QR
    │   │   └── Card.tsx              # Clean card surface with subtle borders
    │   └── stages/
    │       ├── 01_CaptureStage.tsx           # Receipt upload, camera snap emu, preset selector
    │       ├── 02_OCRStructuringStage.tsx    # Bounding box visualizer, field extraction JSON
    │       ├── 03_ReconciliationStage.tsx    # Registry matching, delta calculations, red flags
    │       ├── 04_VoiceVerificationStage.tsx # Outbound dialer, waveform canvas, bilingual chat
    │       ├── 05_AnomalyMatrixStage.tsx     # Severity triage, INR leakage quantify, district map
    │       ├── 06_AuditAnchorStage.tsx       # Merkle tree root, SHA-256 proof, scan-ready QR
    │       └── 07_DashboardStage.tsx         # Executive KPI summary, charts, RTI export
    └── styles/
        ├── tokens.css                # CSS variables, color palettes, dark/light definitions
        ├── index.css                 # Base resets, typography, layout containers
        └── components.css            # Component-specific styles
```

---

## 7. Actionable Next Steps for Milestones

1. **Scaffold Core Vite + React 18 + TS setup**:
   - Install `react`, `react-dom`, `lucide-react`, `qrcode.react`, `canvas-confetti`.
   - Install devDependencies: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/...`.
   - Set up `vite.config.ts`, `tsconfig.json`, `index.html`.
2. **Implement Core State Machine & Dual Mode Client**:
   - Build `PipelineContext` managing current step (1 to 7), inspected receipt, OCR data, reconciliation results, voice call state, and Merkle tree root.
   - Build `sarvamApi.ts` with toggle for Live Sarvam AI vs High-Fidelity Simulation.
3. **Execute Milestones 2 to 5** as planned in `PROJECT.md`.
