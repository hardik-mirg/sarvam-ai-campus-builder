/**
 * Tier 4: Real-World Application Scenarios Test Suite
 * End-to-end simulations of PM-KISAN, Ladli Behna, MGNREGA, PDS, and Multi-Case Batch
 * from physical receipt upload to public verification modal and RTI dossier export.
 * Threshold: >= 15 test cases across 5 real-world flows
 */

const { describe, it, expect } = require('./harness/testFramework.js');
const {
  CASE_STUDIES,
  OFFICIAL_REGISTRY_ROSTER,
  MerkleTreeEngine,
  ReconciliationEngine,
  LeakageMatrixEngine,
  RtiSummaryGenerator,
  sha256,
} = require('./harness/oracleModels.js');
const { ModuleResolver } = require('./harness/moduleResolver.js');

describe('Tier 4 - Scenario 1: PM-KISAN Rural Skimming Investigation E2E Flow', () => {
  let pipelineState = null;

  it('1.1 should ingest crumpled cash slip voucher in Stage 1 Capture', () => {
    pipelineState = ModuleResolver.createInitialPipelineState({ selectedCaseId: CASE_STUDIES.PM_KISAN.id });
    pipelineState = ModuleResolver.executeStage(pipelineState, 1, CASE_STUDIES.PM_KISAN);

    expect(pipelineState.currentStep).toBe(1);
    expect(pipelineState.capturedReceipt.scheme).toBe(CASE_STUDIES.PM_KISAN.scheme);
    expect(pipelineState.capturedReceipt.voucherType).toBe('Crumpled Cash Slip');
  });

  it('1.2 should extract Devanagari beneficiary name and ₹1,400 paid amount via Mayura OCR in Stage 2', () => {
    pipelineState = ModuleResolver.executeStage(pipelineState, 2, CASE_STUDIES.PM_KISAN);

    expect(pipelineState.currentStep).toBe(2);
    expect(pipelineState.ocrExtraction.beneficiaryName.raw).toBe('रामेश्वर यादव');
    expect(pipelineState.ocrExtraction.amounts.paidInSlip).toBe(1400);
    expect(pipelineState.ocrExtraction.officeMetadata.talukId).toBe('TLK-UP-VAR-09');
  });

  it('1.3 should detect ₹600 skimming delta against DBT welfare roster in Stage 3', () => {
    pipelineState = ModuleResolver.executeStage(pipelineState, 3, CASE_STUDIES.PM_KISAN);

    expect(pipelineState.currentStep).toBe(3);
    expect(pipelineState.reconciliationResult.sanctionedAmount).toBe(2000);
    expect(pipelineState.reconciliationResult.paidAmount).toBe(1400);
    expect(pipelineState.reconciliationResult.delta).toBe(600);
    expect(pipelineState.reconciliationResult.anomalyType).toBe('AMOUNT_MISMATCH');
    expect(pipelineState.reconciliationResult.severity).toBe('CRITICAL');
  });

  it('1.4 should execute outbound Hindi IVR call confirming ₹1,400 received in Stage 4', () => {
    pipelineState = ModuleResolver.executeStage(pipelineState, 4, CASE_STUDIES.PM_KISAN);

    expect(pipelineState.currentStep).toBe(4);
    expect(pipelineState.voiceVerificationResult.indicScriptText).toContain('चौदह सौ रुपये');
    expect(pipelineState.voiceVerificationResult.statedAmountReceived).toBe(1400);
    expect(pipelineState.voiceVerificationResult.contradictionScore).toBeGreaterThanOrEqual(0.95);
    expect(pipelineState.voiceVerificationResult.confirmedLeakage).toBe(true);
  });

  it('1.5 should quantify confirmed leakage in Stage 5, seal Merkle root in Stage 6, and export RTI dossier in Stage 7', () => {
    pipelineState = ModuleResolver.executeStage(pipelineState, 5, CASE_STUDIES.PM_KISAN);
    expect(pipelineState.leakageAnalysis.confirmedLeakage).toBe(600);

    pipelineState = ModuleResolver.executeStage(pipelineState, 6, CASE_STUDIES.PM_KISAN);
    expect(pipelineState.merkleAuditTrail.merkleRoot.length).toBe(64);
    expect(pipelineState.merkleAuditTrail.isTampered).toBe(false);

    pipelineState = ModuleResolver.executeStage(pipelineState, 7, CASE_STUDIES.PM_KISAN);
    const dossier = RtiSummaryGenerator.generateDossier(
      CASE_STUDIES.PM_KISAN,
      pipelineState.merkleAuditTrail,
      pipelineState.leakageAnalysis
    );
    expect(dossier.financialAudit.leakageDeltaINR).toBe(600);
    expect(dossier.cryptographicProof.merkleRoot).toBe(pipelineState.merkleAuditTrail.merkleRoot);
  });
});

describe('Tier 4 - Scenario 2: Ladli Behna Deceased Ghost Beneficiary Investigation E2E Flow', () => {
  let state = null;

  it('2.1 should extract Marathi thermal slip and flag deceased status during reconciliation', () => {
    state = ModuleResolver.createInitialPipelineState({ selectedCaseId: CASE_STUDIES.LADLI_BEHNA.id });
    state = ModuleResolver.executeStage(state, 1, CASE_STUDIES.LADLI_BEHNA);
    state = ModuleResolver.executeStage(state, 2, CASE_STUDIES.LADLI_BEHNA);
    state = ModuleResolver.executeStage(state, 3, CASE_STUDIES.LADLI_BEHNA);

    expect(state.ocrExtraction.beneficiaryName.raw).toBe('सुनीता कांबळे');
    expect(state.reconciliationResult.anomalyType).toBe('GHOST_BENEFICIARY');
    expect(state.reconciliationResult.flags).toContain('DECEASED_RECIPIENT');
  });

  it('2.2 should record disconnected phone call and confirm ghost account leakage', () => {
    state = ModuleResolver.executeStage(state, 4, CASE_STUDIES.LADLI_BEHNA);
    state = ModuleResolver.executeStage(state, 5, CASE_STUDIES.LADLI_BEHNA);

    expect(state.voiceVerificationResult.dialerState).toBe('FAILED_UNREACHABLE');
    expect(state.voiceVerificationResult.grievanceCategory).toBe('GHOST_ACCOUNT');
    expect(state.leakageAnalysis.fundsAtRisk).toBe(1250);
  });

  it('2.3 should seal record with Merkle tree and verify tamper sensitivity for ghost claim', () => {
    state = ModuleResolver.executeStage(state, 6, CASE_STUDIES.LADLI_BEHNA);
    const tamperSim = MerkleTreeEngine.simulateTamper(state.merkleAuditTrail, 2);

    expect(state.merkleAuditTrail.merkleRoot.length).toBe(64);
    expect(tamperSim.mismatchDetected).toBe(true);
  });
});

describe('Tier 4 - Scenario 3: MGNREGA Duplicate Muster Roll Investigation E2E Flow', () => {
  let state = null;

  it('3.1 should detect duplicate thumbprint collision on handwritten muster roll', () => {
    state = ModuleResolver.createInitialPipelineState({ selectedCaseId: CASE_STUDIES.MGNREGA.id });
    state = ModuleResolver.executeStage(state, 1, CASE_STUDIES.MGNREGA);
    state = ModuleResolver.executeStage(state, 2, CASE_STUDIES.MGNREGA);
    state = ModuleResolver.executeStage(state, 3, CASE_STUDIES.MGNREGA);

    expect(state.ocrExtraction.biometrics.type).toBe('THUMBPRINT');
    expect(state.ocrExtraction.biometrics.duplicateDetected).toBe(true);
    expect(state.reconciliationResult.anomalyType).toBe('DUPLICATE_THUMBPRINT');
  });

  it('3.2 should capture Awadhi transcript confirming identity theft and seal audit trail', () => {
    state = ModuleResolver.executeStage(state, 4, CASE_STUDIES.MGNREGA);
    state = ModuleResolver.executeStage(state, 5, CASE_STUDIES.MGNREGA);
    state = ModuleResolver.executeStage(state, 6, CASE_STUDIES.MGNREGA);

    expect(state.voiceVerificationResult.grievanceCategory).toBe('DUPLICATE_IDENTITY_MISUSE');
    expect(state.voiceVerificationResult.indicScriptText).toContain('शांति देवी');
    expect(state.merkleAuditTrail.qrPayload).toContain(state.merkleAuditTrail.merkleRoot);
  });
});

describe('Tier 4 - Scenario 4: PDS Ration Zero-Leakage Clean Baseline Verification E2E Flow', () => {
  let state = null;

  it('4.1 should extract digital ePDS voucher and verify 100% exact roster match with zero delta', () => {
    state = ModuleResolver.createInitialPipelineState({ selectedCaseId: CASE_STUDIES.PDS.id });
    state = ModuleResolver.executeStage(state, 1, CASE_STUDIES.PDS);
    state = ModuleResolver.executeStage(state, 2, CASE_STUDIES.PDS);
    state = ModuleResolver.executeStage(state, 3, CASE_STUDIES.PDS);

    expect(state.ocrExtraction.amounts.paidInSlip).toBe(850);
    expect(state.reconciliationResult.delta).toBe(0);
    expect(state.reconciliationResult.anomalyType).toBe('CLEAN_PASS');
    expect(state.reconciliationResult.isClean).toBe(true);
  });

  it('4.2 should complete verification call with 0.0 contradiction score and emit clean audit certificate', () => {
    state = ModuleResolver.executeStage(state, 4, CASE_STUDIES.PDS);
    state = ModuleResolver.executeStage(state, 5, CASE_STUDIES.PDS);
    state = ModuleResolver.executeStage(state, 6, CASE_STUDIES.PDS);

    expect(state.voiceVerificationResult.statedAmountReceived).toBe(850);
    expect(state.voiceVerificationResult.contradictionScore).toBe(0.0);
    expect(state.voiceVerificationResult.grievanceCategory).toBe('FULLY_SATISFIED');
    expect(state.leakageAnalysis.confirmedLeakage).toBe(0);
    expect(state.merkleAuditTrail.isTampered).toBe(false);
  });
});

describe('Tier 4 - Scenario 5: Multi-Case Comparative Audit Batch E2E Flow', () => {
  it('5.1 should process all 4 case studies in batch and aggregate Executive KPI metrics', () => {
    const allCases = Object.values(CASE_STUDIES);
    const masterReport = LeakageMatrixEngine.quantify(allCases);

    expect(masterReport.totalAudited).toBe(4);
    expect(masterReport.totalSanctioned).toBe(2000 + 1250 + 3416 + 850); // 7,516 INR
    expect(masterReport.totalDisbursed).toBe(1400 + 1250 + 3416 + 850); // 6,916 INR
    expect(masterReport.confirmedLeakage).toBe(600); // 600 INR
    expect(masterReport.fundsAtRisk).toBe(1250 + 3416); // 4,666 INR
    expect(masterReport.discrepancyRate).toBe(75.0); // 3 of 4 cases anomalous
  });

  it('5.2 should compile multi-district risk breakdown identifying hotspots', () => {
    const allCases = Object.values(CASE_STUDIES);
    const masterReport = LeakageMatrixEngine.quantify(allCases);

    const breakdown = masterReport.districtBreakdown;
    expect(breakdown['Varanasi'].criticalCount).toBe(1);
    expect(breakdown['Kolhapur'].leakage).toBe(1250);
    expect(breakdown['Ranchi'].leakage).toBe(3416);
    expect(breakdown['Ballia'].leakage).toBe(0);
  });

  it('5.3 should export consolidated master RTI audit dossier encompassing all 4 schemes', () => {
    const allCases = Object.values(CASE_STUDIES);
    const masterReport = LeakageMatrixEngine.quantify(allCases);

    const masterDossiers = allCases.map(c => {
      const tree = MerkleTreeEngine.computeTree(
        MerkleTreeEngine.createLeafHashes(c.id, c.scheme, c.reconciliation.delta, c.reconciliation.severity)
      );
      return RtiSummaryGenerator.generateDossier(c, tree, masterReport);
    });

    expect(masterDossiers.length).toBe(4);
    for (const d of masterDossiers) {
      expect(d.metadata.auditorAuthority).toBeDefined();
      expect(d.cryptographicProof.merkleRoot).toBeDefined();
    }
  });

  it('5.4 should maintain immutable audit trail where every individual case study has an independent Merkle root', () => {
    const allCases = Object.values(CASE_STUDIES);
    const roots = new Set();

    for (const c of allCases) {
      const tree = MerkleTreeEngine.computeTree(
        MerkleTreeEngine.createLeafHashes(c.id, c.scheme, c.reconciliation.delta, c.reconciliation.severity)
      );
      roots.add(tree.merkleRoot);
    }

    expect(roots.size).toBe(4); // 4 distinct unique roots
  });
});
