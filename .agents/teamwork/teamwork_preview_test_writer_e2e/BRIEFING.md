# BRIEFING — 2026-11-01T11:00:00Z

## Mission
Design and implement a comprehensive, requirement-driven, opaque-box E2E test suite covering all requirements and features in ORIGINAL_REQUEST.md and PROJECT.md across 4 testing tiers.

## 🔒 My Identity
- Archetype: Test Writer
- Roles: specialist, qa
- Working directory: /Users/hardik/Code/sarvam_campus_event/.agents/teamwork/teamwork_preview_test_writer_e2e
- Original parent: 38e535df-04e6-4a86-984a-d2641da400ff
- Milestone: Test Suite Creation

## 🔒 Key Constraints
- Write and modify test code ONLY — never modify implementation code.
- Escalate any implementation defects/bugs discovered to the orchestrator/implementer.
- Follow 4-tier testing methodology:
  * Tier 1: Feature Coverage (>=5 test cases per feature covering happy paths across 7 stages, dual mode, theme toggle, case studies).
  * Tier 2: Boundary & Corner Cases (>=5 test cases per feature: invalid inputs, empty receipts, zero amounts, missing biometrics, rate limit fallback, extreme values).
  * Tier 3: Cross-Feature Combinations (pairwise coverage: case study switching mid-pipeline, tamper toggle followed by recalculation, live to sim fallback, dark mode across all 7 stages).
  * Tier 4: Real-World Application Scenarios (end-to-end simulations of PM-KISAN, Ladli Behna, MGNREGA, and PDS audit flows from upload to public verification modal and RTI dossier export).
- Create `TEST_INFRA.md` at project root.
- Implement test runner and test files under `/Users/hardik/Code/sarvam_campus_event/tests/e2e/`.
- Publish `/Users/hardik/Code/sarvam_campus_event/TEST_READY.md`.
- Write handoff report to `.agents/teamwork/teamwork_preview_test_writer_e2e/handoff.md`.
- Communicate results via `send_message` to parent `38e535df-04e6-4a86-984a-d2641da400ff`.

## Current Parent
- Conversation ID: 38e535df-04e6-4a86-984a-d2641da400ff
- Updated: not yet

## Task Summary
- **What to build**: Comprehensive 4-tier E2E test suite, test runner, TEST_INFRA.md, TEST_READY.md, handoff report.
- **Success criteria**: All tests pass or accurately capture system specification, runnable with single command (`node tests/runner/run_e2e.js`), 100% feature coverage across 4 tiers.
- **Interface contracts**: `/Users/hardik/Code/sarvam_campus_event/PROJECT.md` and `/Users/hardik/Code/sarvam_campus_event/.agents/teamwork/ORIGINAL_REQUEST.md`
- **Code layout**: `/Users/hardik/Code/sarvam_campus_event/PROJECT.md`

## Loaded Skills
- Source: None specified directly in dispatch prompt. Standard Node.js / E2E testing methodology applied.

## Quality Status
- **Build/test result**: Initializing
- **Lint status**: Clean
- **Tests added/modified**: In progress

## Key Decisions Made
- [TBD]

## Artifact Index
- [TBD]
