# Handoff Report: Pipeline & UI Architecture Survey

**Agent**: Explorer 3 (Pipeline & UI Architecture Surveyor)  
**Date**: 2026-11-01  
**Target Recipient**: Orchestrator (Conversation ID: 38e535df-04e6-4a86-984a-d2641da400ff)  
**Handoff Type**: Hard (Task Complete)  

---

## 1. Observation
- Verified `/Users/hardik/Code/sarvam_campus_event/.agents/teamwork/ORIGINAL_REQUEST.md`:
  - R1 specifies a complete 7-step interactive workflow: Capture, OCR + Structuring, Reconciliation, Voice Verification, Anomaly Aggregation & Leakage Matrix, Anchoring & Tamper-Evident Audit Trail, Executive Intelligence Dashboard.
  - R2 specifies design standards: Stripe/Vercel enterprise aesthetic, Inter/Geist typography, `#4F46E5` primary accent, dark/light mode toggle, Lucide React icons, pure modular CSS / CSS variables with zero bulky runtime CSS dependencies.
  - R3 specifies dual-mode operation: Live Sarvam AI API integration and high-fidelity deterministic simulation mode.
- Verified workspace runtime environment:
  - Node.js v24.17.0 and npm 11.13.0 are installed at `/opt/homebrew/bin/node` and `/opt/homebrew/bin/npm`.
  - `.env` contains `SARVAM_API_KEY=sk_jyll...` (lines 1-2).
  - Current root `package.json` contains only minimal `sarvamai: ^1.1.14` dependency.
- Verified all 7 pipeline stage interaction requirements and drafted comprehensive specification in:
  `/Users/hardik/Code/sarvam_campus_event/.agents/teamwork/teamwork_preview_explorer_survey_3/survey_report.md`.

## 2. Logic Chain
1. **Observation**: R1 and R2 mandate a highly polished, responsive 7-stage workflow with rich interactive visualizations (bounding box overlay, audio wave visualizer, Merkle tree DAG, executive charts) without heavy third-party CSS frameworks.
2. **Inference**: A pure CSS Custom Properties (CSS variables) architecture coupled with modular CSS files provides instant zero-build overhead styling, instant dark/light switching via `data-theme` attribute, and full Stripe/Vercel-level polish with no runtime penalty.
3. **Observation**: R3 requires seamless demonstration even offline or when hitting API rate limits.
4. **Inference**: The state machine must decouple the pipeline logic into an abstract `PipelineContext` provider where each stage consumes standardized state contracts. Under `SIMULATION` mode, 4 rich Bharat DBT case studies (PM-KISAN over-disbursement, Ladli Behna ghost beneficiary, MGNREGA duplicate biometric, Clean baseline) provide realistic deterministic data. Under `LIVE_SARVAM_API` mode, the client communicates with Sarvam endpoints.
5. **Observation**: Stage 6 requires cryptographic state hashing and tamper simulation.
6. **Inference**: Using the browser's native `window.crypto.subtle.digest('SHA-256', ...)` allows instant client-side calculation of the Merkle Tree leaves and root with zero external hashing libraries. The interactive tamper toggle allows toggling 1 byte of the OCR amount to demonstrate real-time cryptographic failure and alert states.

## 3. Caveats
- Bounding box coordinates in mock data need to be normalized as percentages or exact pixel coordinates matching the sample voucher image aspect ratios so that SVG/DOM overlay lines up precisely.
- Live Sarvam API calls from the browser will require either CORS support on the Sarvam endpoints or a lightweight Vite proxy configured in `vite.config.js` (`/api/sarvam/*` -> `https://api.sarvam.ai/*`). The deterministic simulation mode guarantees complete functionality regardless of CORS or network status.

## 4. Conclusion
The 7-step pipeline flow, state management architecture, component hierarchy, and Stripe/Vercel-grade design system have been thoroughly architected and documented in `survey_report.md`. The design is modular, high-performance, and ready for immediate implementation across 5 sequential milestones (Foundation, Capture & OCR, Reconciliation & Voice, Leakage & Anchoring, Executive Dashboard & Polish).

## 5. Verification Method
To independently verify this specification:
1. Inspect the architectural specification:
   ```bash
   cat /Users/hardik/Code/sarvam_campus_event/.agents/teamwork/teamwork_preview_explorer_survey_3/survey_report.md
   ```
2. Verify that all 7 stages in `survey_report.md` correspond exactly to R1 requirements in `ORIGINAL_REQUEST.md`.
3. Verify that the CSS token architecture supports both dark and light modes with semantic variables (`--bg-app`, `--text-primary`, `--color-primary: #4f46e5`).
4. Invalidation condition: If any required pipeline step (1 through 7) or acceptance criterion from `ORIGINAL_REQUEST.md` is unaddressed or requires an incompatible dependency.
