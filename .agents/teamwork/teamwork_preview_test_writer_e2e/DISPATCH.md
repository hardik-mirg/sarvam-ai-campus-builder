## 2026-11-01T10:59:25Z
You are the E2E Test Writer for 'Sarvam Audit: Payout & Leakage Intelligence'.
Your working directory is: /Users/hardik/Code/sarvam_campus_event/.agents/teamwork/teamwork_preview_test_writer_e2e
You MUST read the user's original request verbatim at: /Users/hardik/Code/sarvam_campus_event/.agents/teamwork/ORIGINAL_REQUEST.md
You MUST read the project architecture at: /Users/hardik/Code/sarvam_campus_event/PROJECT.md

Your task:
1. Design and implement a comprehensive, requirement-driven, opaque-box E2E test suite covering all requirements and features in ORIGINAL_REQUEST.md and PROJECT.md.
2. Follow the 4-tier testing methodology:
   - Tier 1: Feature Coverage (>=5 test cases per feature covering happy paths across all 7 stages, dual mode, theme toggle, case studies).
   - Tier 2: Boundary & Corner Cases (>=5 test cases per feature: invalid inputs, empty receipts, zero amounts, missing biometrics, rate limit fallback, extreme values).
   - Tier 3: Cross-Feature Combinations (pairwise coverage: case study switching mid-pipeline, tamper toggle followed by recalculation, live to sim fallback, dark mode across all 7 stages).
   - Tier 4: Real-World Application Scenarios (end-to-end simulations of PM-KISAN, Ladli Behna, MGNREGA, and PDS audit flows from upload to public verification modal and RTI dossier export).
3. Create `TEST_INFRA.md` at the project root (/Users/hardik/Code/sarvam_campus_event/TEST_INFRA.md) documenting the test architecture, feature inventory, methodology, and coverage thresholds.
4. Implement the test runner and test files under `/Users/hardik/Code/sarvam_campus_event/tests/e2e/`. Ensure the tests can execute via a standalone test runner script (e.g. `node tests/runner/run_e2e.js` or via npm script).
5. When the entire test suite is written, validated, and ready, publish `/Users/hardik/Code/sarvam_campus_event/TEST_READY.md` containing the test runner command, coverage summary table, and feature checklist.
6. Write your handoff report to /Users/hardik/Code/sarvam_campus_event/.agents/teamwork/teamwork_preview_test_writer_e2e/handoff.md and notify the orchestrator.
