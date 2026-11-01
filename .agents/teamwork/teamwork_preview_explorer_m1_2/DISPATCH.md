## 2026-11-01T10:59:25Z
You are Explorer 2 for Milestone 1 (State Machine & Dual-Mode Engine Architecture) of 'Sarvam Audit: Payout & Leakage Intelligence'.
Your working directory is: /Users/hardik/Code/sarvam_campus_event/.agents/teamwork/teamwork_preview_explorer_m1_2
You MUST read the user's original request verbatim at: /Users/hardik/Code/sarvam_campus_event/.agents/teamwork/ORIGINAL_REQUEST.md
You MUST read the project architecture at: /Users/hardik/Code/sarvam_campus_event/PROJECT.md

Your task:
1. Formulate the exact file contents, interfaces, and architecture for:
   - `src/types/pipeline.ts`: PipelineState, CaseStudy, BoundingBox, ExtractedReceiptData, ReconciliationResult, VoiceVerificationResult, LeakageQuantification, MerkleAuditTrail.
   - `src/types/sarvam.ts`: Live API request/response types for Sarvam-105B, Bulbul TTS, Saaras ASR, Mayura OCR.
   - `src/services/sarvamAdapter.ts`: Dual-mode interface and router between Live API and Simulation Engine.
   - `src/services/simulationEngine.ts`: High-fidelity deterministic simulation engine implementing the adapter.
   - `src/services/liveSarvamApi.ts`: Live fetch implementation calling https://api.sarvam.ai with API key.
   - `src/context/PipelineContext.tsx`: Full React context provider managing step navigation, case study switching, dual-mode toggle, stage results, and pipeline execution.
   - `src/data/caseStudies.ts`: The 4 rich Bharat welfare fixtures (PM-KISAN, Ladli Behna, MGNREGA, PDS Clean Baseline) from Explorer 2's survey.
   - `src/data/officialRegistry.ts`: Sanctioned DBT rosters.
2. Write your concrete implementation guide and code specifications to /Users/hardik/Code/sarvam_campus_event/.agents/teamwork/teamwork_preview_explorer_m1_2/m1_explorer_report.md and create handoff.md.
3. Send a message to orchestrator when finished.
