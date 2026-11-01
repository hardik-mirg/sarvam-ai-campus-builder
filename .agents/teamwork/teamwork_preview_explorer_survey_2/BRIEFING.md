# BRIEFING — 2026-11-01T10:52:00Z

## Mission
Investigate and specify the end-to-end integration architecture for Sarvam AI models (Mayura OCR, Sarvam-105B document structuring, Bulbul TTS, Saaras ASR), live proxy/client integration, deterministic simulation schemas, and comprehensive welfare scheme fixtures (PM-KISAN, Ladli Behna, MGNREGA) for 'Sarvam Audit: Payout & Leakage Intelligence'.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigator, surveyor, schema architect
- Working directory: /Users/hardik/Code/sarvam_campus_event/.agents/teamwork/teamwork_preview_explorer_survey_2
- Original parent: 38e535df-04e6-4a86-984a-d2641da400ff
- Milestone: phase_1_survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement production app code directly in workspace root, write reports and schemas in agent directory
- Dual-Mode operation: Must support live API key execution (`SARVAM_API_KEY`) and 100% deterministic high-fidelity simulation engine
- Coverage of realistic Indian DBT schemes: PM-KISAN, Ladli Behna, MGNREGA across Hindi, Awadhi, Marathi, English

## Current Parent
- Conversation ID: 38e535df-04e6-4a86-984a-d2641da400ff
- Updated: not yet

## Investigation State
- **Explored paths**: `node_modules/sarvamai` SDK (DocAI, TTS, STT, Chat, Text Translate), `.env`, `index.js`, `ORIGINAL_REQUEST.md`, production API endpoints `https://api.sarvam.ai`.
- **Key findings**: 
  1. Live Sarvam API key (`sk_jyll360v...`) tested and verified for `sarvam-105b-conversations` chat, `bulbul:v3` TTS, `mayura:v1` translate, and `documentIntelligence.initialise`.
  2. CORS preflight confirmed with `access-control-allow-origin: *` on Sarvam production API.
  3. Formulated complete Dual-Mode architecture (Live Proxy/Client + Deterministic Simulation Engine).
  4. Specified full schemas and realistic fixtures for 4 Bharat welfare case studies (PM-KISAN skimming, Ladli Behna ghost beneficiary, MGNREGA duplicate thumbprint, PDS clean control).
- **Unexplored areas**: None for survey phase.

## Key Decisions Made
- Dual-mode architecture provides both live API connectivity and zero-dependency deterministic simulation engine.
- Bounding box coordinates normalized to percentage format `[ymin, xmin, ymax, xmax]`.
- Web Audio API and base64 WAV buffers used for browser audio playback and waveform visualization.
- Cryptographic Merkle tree state model formalized across all 4 stages with SHA-256 state hashing.

## Artifact Index
- survey_report.md — Full technical specification, API contracts, JSON schemas, and test fixtures
- handoff.md — 5-component handoff report for orchestrator and implementer agents
- progress.md — Liveness heartbeat and milestone tracking
- DISPATCH.md — Incoming dispatch message log
