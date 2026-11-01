# Architecture & UI/UX Specification: Sarvam Audit — Payout & Leakage Intelligence

**Author**: Explorer 3 (Pipeline & UI Architecture Surveyor)  
**Date**: 2026-11-01  
**Project**: Sarvam Audit (Payout & Leakage Intelligence)  
**Target Environment**: React 18+ (Vite), Pure Modular CSS, Lucide React, Sarvam AI SDK / Web Audio API  

---

## 1. Executive Summary & Product Vision

"Sarvam Audit: Payout & Leakage Intelligence" is an investor-grade, high-assurance web application designed to demonstrate a zero-leakage beneficiary payout audit pipeline. In developing nations and rural welfare ecosystems (e.g., Bharat's Direct Benefit Transfer / DBT, PM-KISAN, Ladli Behna, MGNREGA), billions of dollars are disbursed annually through fragmented physical-to-digital touchpoints: handwritten vouchers, thermal POS receipts, smudged biometric cash slips, and local distribution centers.

This application provides a **7-stage end-to-end verification pipeline** that combines:
1. **Multilingual Physical Capture**: Mobile/web physical voucher capture.
2. **Mayura Vision & Sarvam-105B OCR Structuring**: Bounding-box entity extraction across Indic scripts.
3. **Official DBT Registry Cross-Reconciliation**: Real-time delta mathematics and anomaly detection.
4. **Bulbul TTS + Saaras ASR Conversational Voice Verification**: Outbound AI telephony verification in local dialects with real-time waveform and contradiction scoring.
5. **Leakage Quantification & Triage Matrix**: Aggregation of financial loss in ₹ INR and district risk clustering.
6. **Cryptographic Merkle Anchoring**: SHA-256 state hashing across stages with a verifiable public proof modal and dynamic QR code.
7. **Executive Intelligence Dashboard**: C-level KPI cards, regional leakage heatmaps, and one-click RTI/donor audit dossier export.

The UI is built with a **Stripe / Vercel-grade enterprise aesthetic**: crisp typography, deep Indigo primary accents (`#4F46E5`), subtle hairline borders, responsive desktop command center / mobile field view, and an instantaneous Dark/Light theme switch driven entirely by zero-overhead native CSS variables.

---

## 2. End-to-End Pipeline State Architecture & Data Flow

### 2.1 State Machine Architecture

The application is driven by a centralized `PipelineContext` state machine that guarantees deterministic state transitions, step re-visitation, and immediate replayability.

```
       [Preset / Custom Upload]
                  │
                  ▼
         ┌──────────────────┐
         │ Stage 1: Capture │ ──(Receipt Loaded)
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Stage 2: OCR     │ ──(Bounding Boxes & Structured JSON)
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Stage 3: Reconcile│ ──(Delta Math & Anomaly Flags)
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Stage 4: Voice   │ ──(Dialer, Waveform, Transcript, Contradiction Score)
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Stage 5: Leakage │ ──(Severity Triage & INR Quantification)
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Stage 6: Anchor  │ ──(SHA-256 Merkle Tree & Public QR Proof)
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Stage 7: Exec Dash│ ──(KPIs, Heatmaps, Exportable Dossier)
         └──────────────────┘
```

#### State Definitions & Types

```typescript
export type PipelineStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type StepStatus = 'unvisited' | 'active' | 'processing' | 'completed' | 'flagged';

export interface AuditCaseStudy {
  id: string;
  title: string;
  scheme: 'PM-KISAN' | 'Ladli Behna Yojana' | 'MGNREGA' | 'PDS Food Subsidy';
  slipType: 'Thermal Slip' | 'Handwritten Voucher' | 'Carbon Copy' | 'Clean Receipt';
  language: 'Hindi' | 'Awadhi' | 'Marathi' | 'English';
  district: string;
  state: string;
  date: string;
  imageUrl: string;
  thumbnailSvg: string; // inline SVG placeholder for immediate offline rendering
  primaryAnomaly: 'AMOUNT_MISMATCH' | 'GHOST_BENEFICIARY' | 'DUPLICATE_THUMBPRINT' | 'NONE';
  description: string;
  
  // Pre-seeded stage payloads for deterministic simulation mode:
  ocrData: OCRStructuredPayload;
  reconciliationData: ReconciliationPayload;
  voiceVerificationData: VoiceVerificationPayload;
  leakageData: LeakagePayload;
  auditTrailData: AuditTrailPayload;
}

export interface PipelineState {
  currentStep: PipelineStepId;
  stepStatus: Record<PipelineStepId, StepStatus>;
  selectedCaseId: string;
  activeCase: AuditCaseStudy;
  isCustomUpload: boolean;
  customImageData: string | null;
  mode: 'SIMULATION' | 'LIVE_SARVAM_API';
  apiKey: string;
  theme: 'dark' | 'light';
  isTampered: boolean; // Interactive Merkle tamper simulation flag
  executiveStats: ExecutiveDashboardStats;
}
```

### 2.2 Dual-Mode Engine (Live Sarvam AI vs High-Fidelity Simulation)

The application provides dual-mode parity:
1. **Live Sarvam AI Mode**:
   - Calls Sarvam API endpoint for Sarvam-105B conversational structuring, Bulbul TTS audio synthesis (`POST /text-to-speech`), and Saaras ASR speech-to-text.
   - If `SARVAM_API_KEY` is present in `.env` (configured via local dev server proxy or client header), requests are sent directly to Sarvam endpoints with graceful fallback on rate-limits.
2. **Deterministic High-Fidelity Simulation Mode**:
   - 4 pre-seeded, authentic Bharat welfare case studies:
     - **Case 1: PM-KISAN Over-Disbursement Mismatch** (Gorakhpur, UP): Thermal receipt claims ₹6,000 disbursement; DBT Sanctioned roster states ₹2,000. Beneficiary voice call confirms receiving only ₹2,000 in cash. Contradiction score: 94%. Confirmed leakage: ₹4,000.
     - **Case 2: Ladli Behna Ghost Beneficiary** (Indore, MP): Handwritten voucher claims ₹1,500 to "Sunita Devi" with forged signature; official DBT roster indicates beneficiary ID belongs to "Anita Sharma". Outbound call reveals phone number is registered to a local middleman.
     - **Case 3: MGNREGA Biometric Duplicate** (Baramati, Maharashtra): Daily wage payment sheet of ₹3,850. Biometric thumbprint hash is an exact pixel-hash collision with another record in Solapur district (Biometric Farming Syndicate).
     - **Case 4: Clean Verified Baseline** (Mysuru, Karnataka): Fully matched ₹3,000 sanction, verified biometric, citizen voice confirmation matched with zero contradiction.

---

## 3. Detailed Stage-by-Stage UI/UX Specifications

### 3.1 Stage 1: Capture & Slip Ingestion
- **Objective**: Ingest payout proof documents across varied Indian field conditions.
- **UI Components & Features**:
  1. **Case Study Preset Carousel**:
     - 4 interactive selector cards showing receipt thumbnail, scheme badge, slip type badge (Thermal, Handwritten, Carbon Copy), and brief anomaly preview.
     - Clicking a card instantly loads the sample with smooth card selection border glow.
  2. **Interactive Drag-and-Drop Dropzone**:
     - Dashed hairline border (`var(--border-interactive)`), subtle hover elevation.
     - Accepts `.png`, `.jpg`, `.jpeg`, `.webp`.
     - Displays file size, dimensions, and image preview upon drop.
  3. **Camera Snap Simulation Modal**:
     - Simulated mobile viewfinder overlay with animated scan line, corner targeting brackets, and dark semi-transparent scrim.
     - Controls: "Snap Photo" shutter button (with click ripple), "Toggle Flashlight" icon, "Flip Lens" icon.
     - Snapping triggers a camera flash animation and automatically loads the captured frame into the pipeline.
  4. **Slip Metadata Header**:
     - Displays slip type tag, detected language chip, date of capture, and GPS/Taluk geo-tag.
  5. **Stage Progression Action**:
     - Prominent "Initiate Multilingual OCR Extraction" button with right arrow icon (`Lucide.ArrowRight`), advancing to Step 2.

### 3.2 Stage 2: OCR + Structuring (Mayura & Sarvam-105B)
- **Objective**: Extract Indic and English text, generate spatial bounding boxes, and produce structured entity JSON.
- **UI Components & Features**:
  1. **Interactive Bounding Box Overlay Canvas**:
     - The receipt image is rendered inside a zoomable, panable viewport container.
     - SVG / Absolute CSS bounding boxes are positioned over key fields:
       - `BENEFICIARY_NAME` (Cyan box)
       - `DISBURSED_AMOUNT` (Rose / Amber box)
       - `SCHEME_NAME` (Indigo box)
       - `SANCTION_DATE` (Emerald box)
       - `VOUCHER_SERIAL` (Purple box)
       - `OFFICE_TALUK_ID` (Slate box)
       - `BIOMETRIC_THUMBPRINT` (Yellow dotted box)
     - Each bounding box has a confidence tag (e.g. `98.4%`) on hover.
  2. **Bi-directional Focus Synchronization**:
     - **Hovering a bounding box** on the image automatically highlights the corresponding field row in the structured JSON pane with a gentle pulse.
     - **Hovering or clicking a key in the JSON tree** highlights and pulses the bounding box on the image canvas.
  3. **Side-by-Side Structured JSON Viewer**:
     - Syntax-highlighted code block formatted with clean indentation.
     - "Copy JSON" one-click button with feedback checkmark.
     - "OCR Confidence Breakdown" bar displaying aggregate confidence (e.g. `96.8% Model Confidence - Mayura Vision v2`).
  4. **Entity Validation Badges**:
     - Quick chips indicating: `Aadhaar Masked: Yes`, `Thumbprint Detected: Valid Ridge Count`, `Amount Parsed: ₹6,000`.

### 3.3 Stage 3: Official DBT Registry Cross-Reconciliation
- **Objective**: Match voucher claims against the authoritative DBT welfare roster (NIC / PFMS) and compute deltas.
- **UI Components & Features**:
  1. **Split-Screen Comparison Table**:
     - Left Column: **Voucher Extracted Data** (Extracted Amount, Beneficiary, Serial, Date).
     - Right Column: **Sanctioned DBT Registry** (Approved Amount, Roster Name, Bank Account Last 4, Status).
  2. **Automated Delta Calculation Display**:
     - High-visibility delta card:
       - Sanctioned: `₹2,000.00`
       - Disbursed on Slip: `₹6,000.00`
       - **Variance / Delta: `+₹4,000.00` (+200% Over-Disbursement)**
       - Color-coded: Rose text for over-disbursement leakage, Emerald for exact match.
  3. **Automated Anomaly Tag Engine**:
     - Displays glowing alert chips for triggered discrepancies:
       - `⚠️ AMOUNT_MISMATCH`: Slip amount exceeds sanctioned quota by ₹4,000.
       - `🚫 GHOST_BENEFICIARY`: Registered beneficiary name does not match KYC hash.
       - `🔍 DUPLICATE_THUMBPRINT`: Biometric ridge hash matches voucher #8921 in adjacent block.
       - `⚡ OUT_OF_SEQUENCE_SERIAL`: Voucher booklet series skipped 240 numbers.
  4. **Registry Verification Status Banner**:
     - Amber/Red alert banner: `"DISCREPANCY DETECTED: Automatic Voice Verification Triggered"`.

### 3.4 Stage 4: Voice Verification (Bulbul TTS + Saaras ASR)
- **Objective**: Simulate an automated outbound AI call to the rural beneficiary in their local tongue to verify payout reality.
- **UI Components & Features**:
  1. **Interactive Telephony Dialer Interface**:
     - Mobile call interface header: `Target Beneficiary: Rameshwar Yadav (+91 98721-XXXXX)`.
     - Carrier & Protocol status indicator: `VoLTE Active • Sarvam Bulbul Telephony Gateway • Gorakhpur Node`.
     - Call progress states: `Idle` ➔ `Dialing...` ➔ `Ringing (2 rings)` ➔ `Connected (00:18)` ➔ `Completed`.
  2. **Real-time Web Audio Oscillating Waveform**:
     - HTML5 Canvas dynamic audio wave visualizer.
     - Oscillates organically with pitch and amplitude during agent speech (Bulbul TTS) and beneficiary response (Saaras ASR).
     - Interactive Play/Pause/Restart audio button.
  3. **Live Bilingual Transcript Stream**:
     - Dialogue bubble container showing step-by-step conversation turns:
       - **Turn 1 (AI Agent - Bulbul TTS / Hindi)**:
         > *"नमस्ते रामेश्वर जी, क्या आपको 15 अक्टूबर को किसान सम्मान निधि के ₹2,000 प्राप्त हुए थे?"*  
         > *(Translation: Hello Rameshwar ji, did you receive ₹2,000 for Kisan Samman Nidhi on Oct 15?)*
       - **Turn 2 (Beneficiary - Saaras ASR / Awadhi-Hindi dialect)**:
         > *"हाँ बाबूजी, हमको सिर्फ ₹2,000 ही मिला था बैंक खाते में। पर्ची पर ₹6,000 कैसे लिख दिया?"*  
         > *(Translation: Yes sir, I received only ₹2,000 in my account. Why does the slip show ₹6,000?)*
  4. **Real-time Contradiction Score Meter**:
     - Circular radial gauge or gradient progress bar showing:
       - `Contradiction Score: 94% [CRITICAL CONTRADICTION]`
       - AI Intent Analysis: `Confirmed lesser payout received; denies signing for ₹6,000; evidence of intermediary skimming.`

### 3.5 Stage 5: Anomaly Aggregation & Leakage Matrix
- **Objective**: Triage findings by risk severity, quantify financial loss in ₹ INR, and correlate regional fraud patterns.
- **UI Components & Features**:
  1. **Severity Triage Matrix**:
     - 3-tier severity classification:
       - `CRITICAL` (Immediate DBT Account Freeze, Vigilance Referral)
       - `HIGH` (Field Officer Physical Audit Assigned)
       - `LOW / MONITOR` (Registry Data Hygiene Sync)
  2. **Financial Loss Quantification Cards**:
     - Card A: **Direct Voucher Leakage**: `₹4,000.00`
     - Card B: **Projected Taluk Leakage (Current Cycle)**: `₹4,80,000.00` (120 similar flagged vouchers in block)
     - Card C: **Estimated Annualized Regional Exposure**: `₹57,60,000.00`
  3. **District-Wise Risk Table**:
     - Interactive table showing Gorakhpur, Indore, Baramati, Mysuru with columns:
       - District / Block | Audited Slips | Discrepancy % | Total ₹ At Risk | Dominant Pattern | Action Status
  4. **Fraud Pattern Classification Badges**:
     - Badges for detected syndicates: `Intermediary Skimming`, `Biometric Replay Attack`, `Deceased Beneficiary Routing`.

### 3.6 Stage 6: Anchoring & Tamper-Evident Audit Trail
- **Objective**: Cryptographically link all stage states into an immutable Merkle tree with SHA-256 state hashing and public verification.
- **UI Components & Features**:
  1. **Interactive Merkle Tree DAG Visualization**:
     - Visual tree graph showing:
       - Leaf 1: `H(Voucher_Image)` -> `a3f8...9b21`
       - Leaf 2: `H(OCR_Structured_JSON)` -> `7c14...e05d`
       - Leaf 3: `H(DBT_Registry_Delta)` -> `d91e...34fa`
       - Leaf 4: `H(Voice_Call_Transcript)` -> `502b...a91c`
       - Node 12: `H(Leaf1 + Leaf2)` -> `b482...8831`
       - Node 34: `H(Leaf3 + Leaf4)` -> `2e09...c19f`
       - **Merkle Root**: `H(Node12 + Node34)` -> `0x89f41b2c4e...d81a`
  2. **Interactive "Simulate Data Tampering" Toggle**:
     - A button that allows the user or auditor to alter 1 byte of the voucher amount (e.g., editing ₹6,000 to ₹2,000 to cover up the fraud).
     - **Visual Effect**: When tampered, the affected leaf turns flashing Red, the intermediate nodes recalculate in real-time, the Merkle Root hash mismatches, and a prominent badge appears: `"TAMPERING DETECTED: CRYPTOGRAPHIC PROOF BROKEN"`.
     - Reset button restores cryptographic integrity.
  3. **Scan-Ready QR Code Generation**:
     - Dynamic vector QR code encoding the immutable verification URI:
       `https://audit.sarvam.ai/verify?root=0x89f41b2c4e...d81a&id=CASE-PMK-2026-0419`
  4. **Dedicated Public Auditor Verification Modal**:
     - Accessible via "View Public Audit Certificate" button.
     - Mimics an official Comptroller and Auditor General (CAG) / World Bank compliance verification certificate:
       - Seal of Authenticity, Timestamp (ISO UTC), Block Height, SHA-256 Ledger Digest, IPFS CID, and digital signature status (`VERIFIED IMMUTABLE`).

### 3.7 Stage 7: Executive Intelligence Dashboard
- **Objective**: High-level governance intelligence, leakage trendlines, and exportable audit dossiers.
- **UI Components & Features**:
  1. **C-Suite KPI Cards**:
     - **Total Payouts Audited**: `14,820` vouchers
     - **Discrepancy Rate**: `18.6%` (flagged for review)
     - **Confirmed Financial Leakage Prevented**: `₹1,42,80,000`
     - **Recovery Probability Score**: `84.2%`
  2. **Responsive SVG Data Visualizations**:
     - **Chart 1: Weekly Leakage Trendline** (Interactive SVG spline/area chart showing detected leakage over the last 8 audit cycles).
     - **Chart 2: Scheme-Wise Discrepancy Breakdown** (Stacked bar / donut chart comparing PM-KISAN, Ladli Behna, MGNREGA, and PDS).
     - **Chart 3: Regional Risk Heatmap Grid** (Color-graded geographic cards showing top high-risk districts).
  3. **Export Engine**:
     - **Export RTI Compliance Dossier**: Generates formatted markdown / downloadable JSON with all timestamps, transcripts, and cryptographic hashes ready for legal submission.
     - **Export Donor / World Bank Audit Summary**: Formatted executive PDF/print preview layout.
     - One-click copy or download actions.

---

## 4. Design System & CSS Architecture

### 4.1 Enterprise Aesthetic & Design Principles
- **Inspiration**: Stripe Dashboard + Vercel Platform.
- **Key Characteristics**:
  - Uncluttered, high-density informational hierarchy.
  - Generous padding (`16px`, `24px`, `32px`), rounded corners (`8px`, `12px`, `16px`).
  - Subtle 1px borders (`rgba(255, 255, 255, 0.08)` dark / `rgba(0, 0, 0, 0.08)` light).
  - Tabular monospace numbers (`font-variant-numeric: tabular-nums`) for currency amounts, timestamps, and hashes.
  - Zero external CSS runtime overhead (pure native CSS variables, CSS modules, and standard Flexbox/Grid).

### 4.2 CSS Design Tokens & Variable Architecture

A centralized token file (`src/styles/tokens.css` & `src/styles/theme.css`):

```css
:root {
  /* Brand Accents */
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-primary-light: #eef2ff;
  --color-primary-glow: rgba(79, 70, 229, 0.15);

  /* Status Colors */
  --color-success: #10b981;
  --color-success-bg: rgba(16, 185, 129, 0.1);
  --color-warning: #f59e0b;
  --color-warning-bg: rgba(245, 158, 11, 0.1);
  --color-danger: #ef4444;
  --color-danger-bg: rgba(239, 68, 68, 0.1);
  --color-info: #06b6d4;
  --color-info-bg: rgba(6, 182, 212, 0.1);

  /* Typography Stack */
  --font-sans: 'Geist Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace;

  /* Elevation & Transitions */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Light Theme Variables */
:root[data-theme="light"] {
  --color-scheme: light;
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-elevated: #f1f5f9;
  --bg-surface-subtle: #f8fafc;
  
  --border-subtle: #e2e8f0;
  --border-strong: #cbd5e1;
  --border-interactive: #4f46e5;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --text-on-primary: #ffffff;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
}

/* Dark Theme Variables (Default) */
:root[data-theme="dark"] {
  --color-scheme: dark;
  --bg-app: #080c14;
  --bg-surface: #0f1623;
  --bg-surface-elevated: #162032;
  --bg-surface-subtle: #121a2a;
  
  --border-subtle: #1e293b;
  --border-strong: #334155;
  --border-interactive: #6366f1;

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-on-primary: #ffffff;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
}
```

### 4.3 Responsive Layout Architecture
1. **Desktop Command Center View (>= 1024px)**:
   - Sticky top bar with Brand Logo, Mode Toggle (Live vs Sim), Theme Toggle, and Global Audit Metrics.
   - Stage Navigation Bar: Stepper showing 7 numbered pipeline nodes with status icons (`Check`, `Clock`, `AlertTriangle`), allowing direct step jump or sequential next/prev navigation.
   - Main Stage Workspace: Two-column / balanced card layout (e.g. Voucher Canvas on left, Intelligence/Extraction Pane on right).
2. **Tablet & Mobile Field View (< 1024px)**:
   - Sticky top app bar with hamburger/step selector.
   - Stepper transforms into a horizontal scrollable chip track.
   - Workspaces stack cleanly with full-width cards and tap-friendly touch targets (min 44px height).

---

## 5. React Component Hierarchy & Directory Architecture

```
src/
├── assets/                  # SVG icons, sample voucher illustrations
├── components/
│   ├── common/              # Reusable design system primitives
│   │   ├── Badge.jsx        # Status and severity pills
│   │   ├── Button.jsx       # Primary, secondary, outline, icon buttons
│   │   ├── Card.jsx         # Elevated card with border glow
│   │   ├── Modal.jsx        # Dialog with backdrop blur & keyboard ESC trap
│   │   ├── Tooltip.jsx      # Hover tooltip for data points
│   │   └── ThemeToggle.jsx  # Dark/Light mode switch
│   ├── layout/
│   │   ├── Header.jsx       # App navigation, stats bar, mode switcher
│   │   ├── StepNavigator.jsx# 7-step visual stepper with progress lines
│   │   └── Footer.jsx       # Legal & Sarvam AI attribution
│   ├── pipeline/            # Stage-specific controllers & views
│   │   ├── Stage1Capture.jsx           # Presets, upload, camera simulation
│   │   ├── Stage2OCRStructuring.jsx    # Bounding box viewer & JSON explorer
│   │   ├── Stage3Reconciliation.jsx    # Split-view matcher & delta flags
│   │   ├── Stage4VoiceVerification.jsx # Outbound dialer, waveform, transcript
│   │   ├── Stage5LeakageMatrix.jsx     # Severity triage & financial INR loss
│   │   ├── Stage6AuditTrail.jsx        # Merkle tree, SHA-256 tamper test, QR
│   │   └── Stage7ExecutiveDashboard.jsx# KPI metrics, SVG charts, RTI export
│   └── modals/
│       ├── CameraSnapModal.jsx         # Viewfinder camera simulator
│       └── PublicAuditModal.jsx        # Verifiable certificate & QR inspect
├── context/
│   ├── PipelineContext.jsx  # Central reducer & state machine
│   └── ThemeContext.jsx     # Theme persistence (localStorage)
├── data/
│   ├── caseStudies.js       # 4 realistic Bharat DBT welfare audit scenarios
│   └── executiveMockData.js # Aggregated statistics for executive dashboard
├── services/
│   ├── sarvamApiClient.js   # Live Sarvam AI API client (TTS, OCR, Chat)
│   └── cryptoEngine.js      # Native Web Crypto SHA-256 & Merkle tree generator
├── styles/
│   ├── tokens.css           # Design tokens (colors, typography, spacing)
│   ├── theme.css            # Dark/light theme color variable mappings
│   ├── global.css           # Reset, body styles, scrollbars
│   ├── layout.css           # Header, stepper, container grid
│   └── components.css       # Modular scoped component styles
├── App.jsx                  # Main application orchestrator
└── main.jsx                 # Entry point
```

---

## 6. Detailed Component Contracts & Interaction Specifications

### 6.1 `Stage1Capture`
- **Props**: `none` (reads from `usePipeline()`)
- **State**:
  - `dragActive`: boolean
  - `isCameraModalOpen`: boolean
  - `selectedFilter`: `'all' | 'thermal' | 'handwritten' | 'biometric'`
- **Interactions**:
  - Card click triggers `dispatch({ type: 'SELECT_CASE', payload: caseId })`.
  - Custom file drop reads file via `FileReader.readAsDataURL()`, dispatches `SET_CUSTOM_IMAGE`.
  - Camera modal snap produces canvas screenshot, dispatches `SET_CUSTOM_IMAGE`.

### 6.2 `Stage2OCRStructuring`
- **Props**: `none`
- **State**:
  - `hoveredBoxId`: string | null
  - `selectedBoxId`: string | null
  - `jsonExpanded`: boolean
  - `isProcessing`: boolean (shows animated scanning beam over image)
- **Interactions**:
  - Hovering SVG rect sets `hoveredBoxId`, triggering CSS highlight on JSON field.
  - Clicking JSON key centers and pulses corresponding bounding box.

### 6.3 `Stage3Reconciliation`
- **Props**: `none`
- **State**:
  - `comparisonMode`: `'diff' | 'raw'`
- **Key Display Elements**:
  - Voucher vs Sanctioned table with colored diff rows.
  - Variance pill: `Delta = Extracted - Sanctioned`.
  - Action button: "Proceed to Outbound Voice Verification" (pulsing when discrepancy detected).

### 6.4 `Stage4VoiceVerification`
- **Props**: `none`
- **State**:
  - `callStatus`: `'idle' | 'calling' | 'ringing' | 'connected' | 'ended'`
  - `isPlayingAudio`: boolean
  - `activeTranscriptIndex`: number
- **Web Audio Implementation**:
  - Uses `window.AudioContext` with an `AnalyserNode` connected to an oscillating oscillator/audio buffer or synthetic frequency generator.
  - Canvas renders 32-bar visualizer reflecting amplitude in real time.
  - Live transcript lines highlight progressively as the call timer advances.

### 6.5 `Stage5LeakageMatrix`
- **Props**: `none`
- **Key Computations**:
  - `directLeakage = Math.max(0, voucherAmount - sanctionedAmount)`
  - `projectedBlockLeakage = directLeakage * estimatedBlockVolume`
  - Severity level automatically evaluated:
    - `CRITICAL`: Amount delta > ₹1,000 OR Ghost Beneficiary OR Duplicate Biometric
    - `HIGH`: Amount delta > 0 OR Name phonetic mismatch
    - `LOW`: Exact match with minor metadata anomaly

### 6.6 `Stage6AuditTrail`
- **Props**: `none`
- **State**:
  - `isTampered`: boolean (controlled by user toggle)
  - `isAuditModalOpen`: boolean
- **Merkle Calculation Logic**:
  - Utilizes native `window.crypto.subtle.digest('SHA-256', textEncoder.encode(data))`.
  - Leaf hashes:
    - $H_1 = \text{SHA256}(\text{ReceiptImageHash})$
    - $H_2 = \text{SHA256}(\text{OCRStructuredJSON})$
    - $H_3 = \text{SHA256}(\text{ReconciliationDelta})$
    - $H_4 = \text{SHA256}(\text{CallTranscriptText})$
  - Node hashes:
    - $H_{12} = \text{SHA256}(H_1 + H_2)$
    - $H_{34} = \text{SHA256}(H_3 + H_4)$
    - $Root = \text{SHA256}(H_{12} + H_{34})$
  - When "Simulate Tampering" is toggled:
    - $H_2'$ is recomputed with altered voucher amount `₹2,000`.
    - Merkle DAG renders recalculation in real-time with red alert state.

### 6.7 `Stage7ExecutiveDashboard`
- **Props**: `none`
- **Visuals**:
  - 4 KPI Stat widgets with trend percentages.
  - SVG Area Chart for Weekly Leakage Trends with tooltip interaction.
  - Scheme-wise breakdown horizontal progress bars.
  - "Export RTI Dossier" triggers dynamic `.json` or `.md` file download.

---

## 7. Implementation Roadmap & Recommendation for Builders

| Milestone | Recommended Scope | Key Deliverables |
|---|---|---|
| **M1: Foundation** | Project setup & State Machine | Vite React setup, CSS variable design tokens, `PipelineContext`, case study mock engine, theme toggle. |
| **M2: Capture & OCR** | Stages 1 & 2 | Preset selector, dropzone, camera snap modal, interactive bounding box canvas, JSON viewer. |
| **M3: Reconciliation & Voice** | Stages 3 & 4 | DBT roster matcher, delta calculation, telephony dialer, Web Audio wave visualizer, bilingual transcript streamer. |
| **M4: Leakage & Anchoring** | Stages 5 & 6 | Triage matrix, financial loss quantification, SHA-256 Merkle tree DAG, tamper simulation, QR code modal. |
| **M5: Executive Dashboard & Polish** | Stage 7 & Final Polish | KPI cards, SVG trendlines, RTI dossier export, mobile responsiveness hardening, accessibility checks. |

---

## 8. Verification & Test Plan

1. **Build & Syntax Verification**:
   - `npm run build` must compile clean with 0 warnings or errors.
2. **Visual & Responsive Verification**:
   - Check all 7 stages across 1440px desktop, 768px tablet, and 375px mobile viewport.
   - Verify dark and light themes provide high contrast (WCAG AAA for text, AA for UI borders).
3. **Interactive Functional Verification**:
   - Step navigator allows clicking any completed or active stage.
   - Hovering bounding boxes triggers highlighting in JSON explorer.
   - Voice verification dialer transitions smoothly through call states with dynamic waveform oscillation.
   - Merkle tamper button immediately invalidates the root hash and flags red alert state.
   - Executive dashboard RTI export triggers valid dossier file download.
