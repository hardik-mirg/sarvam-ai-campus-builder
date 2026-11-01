Side Question: create a readme file describing the project beautifully in short

# 🛡️ Sarvam Audit — Bharat Payout & Leakage Intelligence

> **Zero-Leakage Beneficiary Verification Engine powered by Sarvam AI Infrastructure**  
> *Transforming physical welfare vouchers into tamper-proof cryptographic audit trails through Indic Vision, Speech, and Language AI.*

---

## 📌 Executive Summary

In India's Direct Benefit Transfer (DBT) ecosystem, last-mile cash disbursements often rely on paper receipts, thermal slips, and manual registers. This leaves welfare schemes vulnerable to middleman extortion, ghost beneficiaries, and skimming.

**Sarvam Audit** closes the loop with an automated, end-to-end audit pipeline. Beneficiaries need no smartphone or English literacy: **just a photo of a receipt, an automated native-language phone call, and an immutable cryptographic audit report that pinpoints exactly where funds leaked.**

---

## 🔄 The 7-Step Pipeline Loop

```
[ Photo Capture ] ➔ [ Multilingual OCR ] ➔ [ DBT Reconciliation ] ➔ [ Indic Voice IVR ]
                                                                             │
[ Executive Report ] ⮜── [ Merkle Anchoring ] ⮜── [ Anomaly Aggregation ] ⮜──┘
```

1. **Capture**: Field workers or beneficiaries photograph the paper receipt (crumpled slips, thermal fades, thumbprints).
2. **OCR & Structuring (Mayura + Sarvam-105B)**: Multilingual optical character recognition parses mixed Indic scripts (Hindi, Marathi, Awadhi, English) with bounding boxes and normalizes data into structured JSON.
3. **Reconciliation**: Automated cross-referencing against official government DBT rosters to flag payout shortfalls, ghost accounts, and duplicate biometrics.
4. **Voice Verification (Bulbul TTS + Saaras ASR)**: Automated outbound vernacular telephone calls prompt beneficiaries (`"Did you receive ₹4,000?"`), transcribe spoken Indic responses, and calculate contradiction scores.
5. **Anomaly Aggregation**: Real-time financial loss triage categorized by severity (*Critical*, *High*, *Low*) with automated vigilance escalations.
6. **Merkle Anchoring**: Every receipt scan, OCR output, reconciliation delta, and call recording is hashed into a 2-level cryptographic Merkle tree with instant QR-code public verification and 1-byte tamper detection.
7. **Executive Intelligence**: Granular district-level heatmaps, recovery probabilities, leakage trendlines, and one-click RTI/donor audit reports.

---

## 🇮🇳 Powered by Sarvam AI Stack

| Model | Capability | Role in Pipeline |
|---|---|---|
| **Mayura** | Document Intelligence & OCR | Multilingual extraction on degraded paper and handwriting |
| **Sarvam-105B** | Foundation LLM | Normalizes unstructured OCR into schema and detects contradictions |
| **Bulbul** | Indic Text-to-Speech (TTS) | Synthesizes outbound IVR phone calls in regional vernacular dialects |
| **Saaras** | Indic Speech-to-Text (ASR) | Transcribes spoken beneficiary responses in real time |

---

## ⚡ Tech Stack & Architecture

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Pure CSS Design Tokens (Inter / JetBrains Mono, Stripe-grade polish, Dark & Light mode)
- **Cryptography**: Native SHA-256 Merkle Tree Engine & Verification Protocol
- **Audio Simulation**: Web Audio API (telephony DTMF tones, ringback cadence, interactive waveforms)
- **Icons & QR**: Lucide React, `qrcode.react`

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Production build
npm run build
```

Open **`http://localhost:5173`** (or `5174`) to test realistic Bharat case studies (*PM-KISAN Skimming*, *Ladli Behna Ghost Accounts*, and *MGNREGA Duplicate Thumbprints*).
