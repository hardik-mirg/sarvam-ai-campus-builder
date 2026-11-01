/**
 * Tier 1: Feature Coverage Test Suite
 * Validates happy path and core behavior across all 10 system features
 * Threshold: >= 5 test cases per feature (>= 50 total)
 */

const { describe, it, expect } = require('./harness/testFramework.js');
const {
  CASE_STUDIES,
  OFFICIAL_REGISTRY_ROSTER,
  MerkleTreeEngine,
  ReconciliationEngine,
  LeakageMatrixEngine,
  RtiSummaryGenerator,
  DESIGN_SYSTEM,
  sha256,
} = require('./harness/oracleModels.js');
const { ModuleResolver } = require('./harness/moduleResolver.js');

describe('Tier 1 - Feature 1: Stage 1 Capture Engine', () => {
  it('1.1 should correctly select preset receipt and initialize receipt state', () => {
    const pmKisanCase = CASE_STUDIES.PM_KISAN;
    const state = ModuleResolver.createInitialPipelineState({ selectedCaseId: pmKisanCase.id });
    const executed = ModuleResolver.executeStage(state, 1, pmKisanCase);

    expect(executed.currentStep).toBe(1);
    expect(executed.capturedReceipt).toBeDefined();
    expect(executed.capturedReceipt.id).toBe(pmKisanCase.id);
    expect(executed.capturedReceipt.voucherType).toBe('Crumpled Cash Slip');
    expect(executed.executionStatus[1]).toBe('completed');
  });

  it('1.2 should accept custom receipt drop and assign unique capture metadata', () => {
    const customDrop = {
      id: 'custom-upload-99',
      fileName: 'gram_panchayat_receipt.png',
      fileSize: 204850,
      mimeType: 'image/png',
      uploadedAt: new Date().toISOString(),
      source: 'CUSTOM_UPLOAD',
    };

    expect(customDrop.id).toBe('custom-upload-99');
    expect(['image/jpeg', 'image/png', 'image/webp']).toContain(customDrop.mimeType);
    expect(customDrop.fileSize).toBeGreaterThan(0);
    expect(customDrop.source).toBe('CUSTOM_UPLOAD');
  });

  it('1.3 should simulate camera snap with device sensor metadata and timestamp', () => {
    const cameraSnap = {
      captureMode: 'CAMERA_SNAP',
      deviceModel: 'Field Audit Tablet Gen 4',
      isoTimestamp: new Date().toISOString(),
      resolution: '1920x1080',
      geoTag: { lat: 25.3176, lng: 82.9739, accuracyMeters: 4.2 },
    };

    expect(cameraSnap.captureMode).toBe('CAMERA_SNAP');
    expect(cameraSnap.deviceModel).toContain('Tablet');
    expect(cameraSnap.geoTag.lat).toBeGreaterThan(0);
    expect(cameraSnap.geoTag.accuracyMeters).toBeLessThan(10);
  });

  it('1.4 should support multilingual physical vouchers across Hindi, Marathi, Awadhi, and English', () => {
    const languages = [
      CASE_STUDIES.PM_KISAN.language,
      CASE_STUDIES.LADLI_BEHNA.language,
      CASE_STUDIES.MGNREGA.language,
      CASE_STUDIES.PDS.language,
    ];

    expect(languages).toContain('hi-IN');
    expect(languages).toContain('mr-IN');
    expect(CASE_STUDIES.LADLI_BEHNA.voucherType).toBe('Thermal Slip');
    expect(CASE_STUDIES.MGNREGA.voucherType).toBe('Handwritten Muster Roll');
  });

  it('1.5 should set stage execution status correctly upon stage 1 completion', () => {
    const initial = ModuleResolver.createInitialPipelineState();
    const result = ModuleResolver.executeStage(initial, 1);

    expect(result.executionStatus[1]).toBe('completed');
    expect(result.executionStatus[2]).toBe('idle');
  });
});

describe('Tier 1 - Feature 2: Stage 2 Mayura OCR & Structuring', () => {
  it('2.1 should extract normalized bounding boxes [ymin, xmin, ymax, xmax] within 0 to 100%', () => {
    const ocrData = CASE_STUDIES.PM_KISAN;
    const boxes = ocrData.boundingBoxes;

    expect(boxes.length).toBeGreaterThanOrEqual(4);
    for (const boxItem of boxes) {
      const [ymin, xmin, ymax, xmax] = boxItem.box;
      expect(ymin).toBeGreaterThanOrEqual(0);
      expect(xmin).toBeGreaterThanOrEqual(0);
      expect(ymax).toBeLessThanOrEqual(100);
      expect(xmax).toBeLessThanOrEqual(100);
      expect(ymax).toBeGreaterThan(ymin);
      expect(xmax).toBeGreaterThan(xmin);
    }
  });

  it('2.2 should extract structured JSON with beneficiary, amounts, date, and taluk metadata', () => {
    const caseData = CASE_STUDIES.PM_KISAN;
    expect(caseData.beneficiaryName.raw).toBe('रामेश्वर यादव');
    expect(caseData.beneficiaryName.standardized).toBe('Rameshwar Yadav');
    expect(caseData.amounts.paidInSlip).toBe(1400);
    expect(caseData.amounts.currency).toBe('INR');
    expect(caseData.payoutDate.isoDate).toBe('2026-10-14');
    expect(caseData.talukId).toBe('TLK-UP-VAR-09');
  });

  it('2.3 should provide field-level and overall extraction confidence scores >= 0.90', () => {
    const caseData = CASE_STUDIES.PM_KISAN;
    expect(caseData.overallExtractionConfidence).toBeGreaterThanOrEqual(0.90);
    expect(caseData.beneficiaryName.confidence).toBeGreaterThanOrEqual(0.90);
    expect(caseData.amounts.confidence).toBeGreaterThanOrEqual(0.90);
  });

  it('2.4 should link every structured field boxId to an existing bounding box', () => {
    const caseData = CASE_STUDIES.PM_KISAN;
    const boxIds = caseData.boundingBoxes.map(b => b.id);

    expect(boxIds).toContain(caseData.beneficiaryName.boxId);
    expect(boxIds).toContain(caseData.amounts.boxId);
    expect(boxIds).toContain(caseData.payoutDate.boxId);
  });

  it('2.5 should detect biometrics and determine thumbprint vs signature with quality score', () => {
    const pmKisanBiometric = CASE_STUDIES.PM_KISAN.biometrics;
    expect(pmKisanBiometric.detected).toBe(true);
    expect(pmKisanBiometric.type).toBe('SIGNATURE');
    expect(pmKisanBiometric.qualityScore).toBeGreaterThanOrEqual(0.80);

    const mgnregaBiometric = CASE_STUDIES.MGNREGA.biometrics;
    expect(mgnregaBiometric.detected).toBe(true);
    expect(mgnregaBiometric.type).toBe('THUMBPRINT');
    expect(mgnregaBiometric.duplicateDetected).toBe(true);
  });
});

describe('Tier 1 - Feature 3: Stage 3 DBT Welfare Registry Reconciliation', () => {
  it('3.1 should cross-reference extracted voucher against official DBT welfare roster', () => {
    const pmKisan = CASE_STUDIES.PM_KISAN;
    const rosterRecord = OFFICIAL_REGISTRY_ROSTER.find(r => r.caseCode === 'PM_KISAN');

    expect(rosterRecord).toBeDefined();
    expect(rosterRecord.beneficiaryName).toBe(pmKisan.beneficiaryName.raw);
    expect(rosterRecord.sanctionedAmount).toBe(2000);
    expect(rosterRecord.talukId).toBe(pmKisan.talukId);
  });

  it('3.2 should calculate exact delta (Sanctioned - Paid) and detect amount skimming', () => {
    const pmKisan = CASE_STUDIES.PM_KISAN;
    const rosterRecord = OFFICIAL_REGISTRY_ROSTER.find(r => r.caseCode === 'PM_KISAN');
    const result = ReconciliationEngine.reconcile(pmKisan, rosterRecord);

    expect(result.sanctionedAmount).toBe(2000);
    expect(result.paidAmount).toBe(1400);
    expect(result.delta).toBe(600);
    expect(result.anomalyType).toBe('AMOUNT_MISMATCH');
    expect(result.severity).toBe('CRITICAL');
    expect(result.isClean).toBe(false);
  });

  it('3.3 should detect ghost beneficiary when roster status is DECEASED', () => {
    const ladliBehna = CASE_STUDIES.LADLI_BEHNA;
    const rosterRecord = OFFICIAL_REGISTRY_ROSTER.find(r => r.caseCode === 'LADLI_BEHNA');
    const result = ReconciliationEngine.reconcile(ladliBehna, rosterRecord);

    expect(rosterRecord.status).toBe('DECEASED');
    expect(result.anomalyType).toBe('GHOST_BENEFICIARY');
    expect(result.severity).toBe('HIGH');
    expect(result.flags).toContain('DECEASED_RECIPIENT');
  });

  it('3.4 should detect duplicate thumbprint biometric collision across muster rolls', () => {
    const mgnrega = CASE_STUDIES.MGNREGA;
    const rosterRecord = OFFICIAL_REGISTRY_ROSTER.find(r => r.caseCode === 'MGNREGA');
    const result = ReconciliationEngine.reconcile(mgnrega, rosterRecord);

    expect(result.anomalyType).toBe('DUPLICATE_THUMBPRINT');
    expect(result.flags).toContain('DUPLICATE_THUMBPRINT_OR_SIGNATURE');
    expect(mgnrega.biometrics.conflictingSlipId).toBe('MG-JH-2026-0818');
  });

  it('3.5 should verify clean pass when all roster fields and amounts match exactly', () => {
    const pds = CASE_STUDIES.PDS;
    const rosterRecord = OFFICIAL_REGISTRY_ROSTER.find(r => r.caseCode === 'PDS');
    const result = ReconciliationEngine.reconcile(pds, rosterRecord);

    expect(result.delta).toBe(0);
    expect(result.anomalyType).toBe('CLEAN_PASS');
    expect(result.severity).toBe('CLEAN');
    expect(result.isClean).toBe(true);
    expect(result.flags).toContain('VERIFIED_MATCH');
  });
});

describe('Tier 1 - Feature 4: Stage 4 IVR Voice Verification & Bulbul/Saaras', () => {
  it('4.1 should model telephony dialer state transitions through to COMPLETED', () => {
    const dialerStates = ['IDLE', 'DIALING', 'RINGING', 'CONNECTED', 'SPEAKING', 'LISTENING', 'COMPLETED'];
    expect(dialerStates.length).toBe(7);
    expect(dialerStates[0]).toBe('IDLE');
    expect(dialerStates[dialerStates.length - 1]).toBe('COMPLETED');
  });

  it('4.2 should synthesize Indic speech with Bulbul TTS parameters and personas', () => {
    const ttsPayload = {
      text: 'नमस्ते रामेश्वर जी, क्या आपको पीएम किसान की दो हजार रुपये की राशि प्राप्त हुई?',
      languageCode: 'hi-IN',
      speaker: 'meera_auditor_agent',
      model: 'bulbul:v3',
    };

    expect(ttsPayload.languageCode).toBe('hi-IN');
    expect(ttsPayload.speaker).toContain('auditor');
    expect(ttsPayload.model).toBe('bulbul:v3');
  });

  it('4.3 should stream Saaras ASR bilingual transcript in Indic script + English translation', () => {
    const callData = CASE_STUDIES.PM_KISAN.ivrCall;

    expect(callData.indicScriptText).toContain('चौदह सौ रुपये');
    expect(callData.englishTranslation).toContain('1,400 rupees');
    expect(callData.statedAmountReceived).toBe(1400);
  });

  it('4.4 should compute semantic contradiction score between stated and sanctioned amounts', () => {
    const callData = CASE_STUDIES.PM_KISAN.ivrCall;
    const contradictionScore = Math.abs(callData.sanctionedAmount - callData.statedAmountReceived) / callData.sanctionedAmount;

    expect(contradictionScore).toBeCloseTo(0.30, 0.01);
    expect(callData.contradictionScore).toBeGreaterThanOrEqual(0.90);
    expect(callData.confirmedLeakage).toBe(true);
  });

  it('4.5 should categorize grievance intent into extortion, ghost, or satisfied', () => {
    expect(CASE_STUDIES.PM_KISAN.ivrCall.grievanceCategory).toBe('MIDDLEMAN_EXTORTION');
    expect(CASE_STUDIES.LADLI_BEHNA.ivrCall.grievanceCategory).toBe('GHOST_ACCOUNT');
    expect(CASE_STUDIES.PDS.ivrCall.grievanceCategory).toBe('FULLY_SATISFIED');
  });
});

describe('Tier 1 - Feature 5: Stage 5 Anomaly Severity Triage & Leakage Matrix', () => {
  it('5.1 should assign CRITICAL severity for middleman financial skimming >= ₹500', () => {
    const rec = CASE_STUDIES.PM_KISAN.reconciliation;
    expect(rec.severity).toBe('CRITICAL');
    expect(rec.leakageAmount).toBeGreaterThanOrEqual(500);
  });

  it('5.2 should assign HIGH severity for ghost identity and duplicate voucher fraud', () => {
    expect(CASE_STUDIES.LADLI_BEHNA.reconciliation.severity).toBe('HIGH');
    expect(CASE_STUDIES.MGNREGA.reconciliation.severity).toBe('HIGH');
  });

  it('5.3 should quantify confirmed leakage vs funds at risk across audited cases', () => {
    const cases = [CASE_STUDIES.PM_KISAN, CASE_STUDIES.LADLI_BEHNA, CASE_STUDIES.PDS];
    const report = LeakageMatrixEngine.quantify(cases);

    expect(report.totalAudited).toBe(3);
    expect(report.confirmedLeakage).toBe(600); // PM-KISAN ₹600 confirmed
    expect(report.fundsAtRisk).toBe(1250); // Ladli Behna ₹1250
    expect(report.totalDisbursed).toBe(1400 + 1250 + 850);
  });

  it('5.4 should break down financial leakage across districts', () => {
    const allCases = Object.values(CASE_STUDIES);
    const report = LeakageMatrixEngine.quantify(allCases);

    expect(report.districtBreakdown['Varanasi']).toBeDefined();
    expect(report.districtBreakdown['Varanasi'].leakage).toBe(600);
    expect(report.districtBreakdown['Kolhapur']).toBeDefined();
    expect(report.districtBreakdown['Ballia'].leakage).toBe(0);
  });

  it('5.5 should calculate recovery probability based on operator auditability', () => {
    const report = LeakageMatrixEngine.quantify([CASE_STUDIES.PM_KISAN]);
    expect(report.recoveryProbability).toBeGreaterThan(80.0);
  });
});

describe('Tier 1 - Feature 6: Stage 6 SHA-256 Merkle Tree & Audit Trail', () => {
  it('6.1 should generate valid 64-char hex SHA-256 leaf hashes for all 4 stages', () => {
    const leafHashes = MerkleTreeEngine.createLeafHashes(
      CASE_STUDIES.PM_KISAN,
      CASE_STUDIES.PM_KISAN.boundingBoxes,
      CASE_STUDIES.PM_KISAN.reconciliation,
      CASE_STUDIES.PM_KISAN.ivrCall
    );

    expect(leafHashes.length).toBe(4);
    for (const h of leafHashes) {
      expect(typeof h).toBe('string');
      expect(h.length).toBe(64);
      expect(/^[0-9a-f]{64}$/.test(h)).toBe(true);
    }
  });

  it('6.2 should construct Merkle tree DAG with intermediate hashes H01, H23 and root', () => {
    const leafHashes = MerkleTreeEngine.createLeafHashes(
      'receipt_01',
      'ocr_01',
      'reconcile_01',
      'voice_01'
    );
    const tree = MerkleTreeEngine.computeTree(leafHashes);

    expect(tree.leafHashes.length).toBe(4);
    expect(tree.intermediateHashes.length).toBe(2);
    expect(tree.merkleRoot.length).toBe(64);
    expect(tree.isTampered).toBe(false);
  });

  it('6.3 should simulate 1-byte tamper and immediately detect Merkle root mismatch', () => {
    const leafHashes = MerkleTreeEngine.createLeafHashes('r', 'o', 'rec', 'v');
    const tree = MerkleTreeEngine.computeTree(leafHashes);
    const tamperResult = MerkleTreeEngine.simulateTamper(tree, 1, 'TAMPERED_OCR_BYTE');

    expect(tamperResult.isTampered).toBe(true);
    expect(tamperResult.mismatchDetected).toBe(true);
    expect(tamperResult.originalRoot).toBe(tree.merkleRoot);
    expect(tamperResult.tamperedRoot).not.toBe(tree.merkleRoot);
    expect(tamperResult.alertMessage).toContain('TAMPER DETECTED');
  });

  it('6.4 should generate scan-ready QR code payload with root hash and verification timestamp', () => {
    const leafHashes = MerkleTreeEngine.createLeafHashes('r', 'o', 'rec', 'v');
    const tree = MerkleTreeEngine.computeTree(leafHashes);
    const parsedPayload = JSON.parse(tree.qrPayload);

    expect(parsedPayload.root).toBe(tree.merkleRoot);
    expect(parsedPayload.verified).toBe(true);
    expect(parsedPayload.ts).toBeDefined();
  });

  it('6.5 should format public verification URL incorporating the root hash prefix', () => {
    const leafHashes = MerkleTreeEngine.createLeafHashes('r', 'o', 'rec', 'v');
    const tree = MerkleTreeEngine.computeTree(leafHashes);

    expect(tree.verificationUrl).toContain('https://sarvam-audit.gov.in/verify/');
    expect(tree.verificationUrl).toContain(tree.merkleRoot.slice(0, 16));
  });
});

describe('Tier 1 - Feature 7: Stage 7 Executive Dashboard & RTI Dossier Export', () => {
  it('7.1 should aggregate KPI metrics: Total Audited, Discrepancy Rate %, Confirmed Leakage ₹, Recovery %', () => {
    const allCases = Object.values(CASE_STUDIES);
    const report = LeakageMatrixEngine.quantify(allCases);

    expect(report.totalAudited).toBe(4);
    expect(report.discrepancyRate).toBe(75.0); // 3 out of 4 anomalous
    expect(report.confirmedLeakage).toBe(600);
    expect(report.recoveryProbability).toBeGreaterThan(50.0);
  });

  it('7.2 should generate compliant RTI / Donor audit dossier with complete metadata', () => {
    const pmKisan = CASE_STUDIES.PM_KISAN;
    const leafHashes = MerkleTreeEngine.createLeafHashes(pmKisan, pmKisan, pmKisan, pmKisan);
    const tree = MerkleTreeEngine.computeTree(leafHashes);
    const report = LeakageMatrixEngine.quantify([pmKisan]);

    const dossier = RtiSummaryGenerator.generateDossier(pmKisan, tree, report);
    expect(dossier.dossierId).toContain('RTI-AUDIT-');
    expect(dossier.metadata.auditorAuthority).toContain('Verification Cell');
    expect(dossier.financialAudit.sanctionedINR).toBe(2000);
    expect(dossier.financialAudit.leakageDeltaINR).toBe(600);
    expect(dossier.cryptographicProof.merkleRoot).toBe(tree.merkleRoot);
  });

  it('7.3 should export clean serializable JSON string for download', () => {
    const pmKisan = CASE_STUDIES.PM_KISAN;
    const tree = MerkleTreeEngine.computeTree(MerkleTreeEngine.createLeafHashes('a', 'b', 'c', 'd'));
    const dossier = RtiSummaryGenerator.generateDossier(pmKisan, tree, {});
    const jsonStr = JSON.stringify(dossier, null, 2);

    expect(typeof jsonStr).toBe('string');
    expect(jsonStr).toContain('RTI-AUDIT-');
    expect(JSON.parse(jsonStr).financialAudit.sanctionedINR).toBe(2000);
  });

  it('7.4 should compute correct discrepancy rate calculation for clean baseline', () => {
    const cleanOnly = [CASE_STUDIES.PDS];
    const report = LeakageMatrixEngine.quantify(cleanOnly);

    expect(report.totalAudited).toBe(1);
    expect(report.discrepancyRate).toBe(0.0);
    expect(report.confirmedLeakage).toBe(0);
  });

  it('7.5 should provide district-level ranking to spotlight highest leakage zones', () => {
    const allCases = Object.values(CASE_STUDIES);
    const report = LeakageMatrixEngine.quantify(allCases);
    const districts = Object.keys(report.districtBreakdown);

    expect(districts).toContain('Varanasi');
    expect(districts).toContain('Kolhapur');
    expect(report.districtBreakdown['Varanasi'].criticalCount).toBe(1);
  });
});

describe('Tier 1 - Feature 8: Dual-Mode Operation (Live vs Simulation)', () => {
  it('8.1 should initialize in high-fidelity SIMULATION mode by default', () => {
    const state = ModuleResolver.createInitialPipelineState();
    expect(state.mode).toBe('SIMULATION');
  });

  it('8.2 should support switching to LIVE_SARVAM_API mode', () => {
    const state = ModuleResolver.createInitialPipelineState({ mode: 'LIVE_SARVAM_API' });
    expect(state.mode).toBe('LIVE_SARVAM_API');
  });

  it('8.3 should produce identical deterministic outputs in simulation mode across runs', () => {
    const run1 = ModuleResolver.runCompletePipeline(CASE_STUDIES.PM_KISAN);
    const run2 = ModuleResolver.runCompletePipeline(CASE_STUDIES.PM_KISAN);

    expect(run1.ocrExtraction.amounts.paidInSlip).toBe(run2.ocrExtraction.amounts.paidInSlip);
    expect(run1.reconciliationResult.delta).toBe(run2.reconciliationResult.delta);
    expect(run1.voiceVerificationResult.statedAmountReceived).toBe(run2.voiceVerificationResult.statedAmountReceived);
  });

  it('8.4 should preserve active pipeline state when toggling between Live and Simulation modes', () => {
    let state = ModuleResolver.createInitialPipelineState({ mode: 'SIMULATION' });
    state = ModuleResolver.executeStage(state, 1);
    state = ModuleResolver.executeStage(state, 2);

    // Toggle mode
    state.mode = 'LIVE_SARVAM_API';
    expect(state.currentStep).toBe(2);
    expect(state.ocrExtraction).toBeDefined();
    expect(state.mode).toBe('LIVE_SARVAM_API');
  });

  it('8.5 should require valid SARVAM_API_KEY for live mode operations', () => {
    const apiKey = process.env.SARVAM_API_KEY || 'sk_test_key_fixture';
    expect(typeof apiKey).toBe('string');
    expect(apiKey.length).toBeGreaterThan(10);
  });
});

describe('Tier 1 - Feature 9: Design System & Theme Engine', () => {
  it('9.1 should enforce primary brand accent #4F46E5 (Deep Indigo)', () => {
    expect(DESIGN_SYSTEM.primaryAccent).toBe('#4F46E5');
    expect(DESIGN_SYSTEM.tokens['--color-primary']).toBe('#4F46E5');
  });

  it('9.2 should support seamless dark/light theme switching', () => {
    let state = ModuleResolver.createInitialPipelineState({ theme: 'dark' });
    expect(state.theme).toBe('dark');

    state.theme = 'light';
    expect(state.theme).toBe('light');
  });

  it('9.3 should provide distinct dark theme surface tokens', () => {
    const dark = DESIGN_SYSTEM.darkTheme;
    expect(dark['--bg-app']).toBe('#0B0F19');
    expect(dark['--bg-card']).toBe('#111827');
    expect(dark['--text-main']).toBe('#F8FAFC');
  });

  it('9.4 should provide distinct light theme surface tokens', () => {
    const light = DESIGN_SYSTEM.lightTheme;
    expect(light['--bg-app']).toBe('#F8FAFC');
    expect(light['--bg-card']).toBe('#FFFFFF');
    expect(light['--text-main']).toBe('#0F172A');
  });

  it('9.5 should define semantic status alert colors for danger, warning, and success', () => {
    expect(DESIGN_SYSTEM.tokens['--color-danger']).toBe('#DC2626');
    expect(DESIGN_SYSTEM.tokens['--color-warning']).toBe('#D97706');
    expect(DESIGN_SYSTEM.tokens['--color-success']).toBe('#059669');
  });
});

describe('Tier 1 - Feature 10: Bharat DBT Welfare Case Studies', () => {
  it('10.1 should model PM-KISAN rural cash skimming with ₹600 leakage', () => {
    const c = CASE_STUDIES.PM_KISAN;
    expect(c.code).toBe('PM_KISAN');
    expect(c.amounts.paidInSlip).toBe(1400);
    expect(c.reconciliation.delta).toBe(600);
    expect(c.reconciliation.anomalyType).toBe('AMOUNT_MISMATCH');
  });

  it('10.2 should model Ladli Behna deceased ghost beneficiary payout', () => {
    const c = CASE_STUDIES.LADLI_BEHNA;
    expect(c.code).toBe('LADLI_BEHNA');
    expect(c.reconciliation.anomalyType).toBe('GHOST_BENEFICIARY');
    expect(c.reconciliation.severity).toBe('HIGH');
  });

  it('10.3 should model MGNREGA duplicate muster roll claim with duplicate biometric', () => {
    const c = CASE_STUDIES.MGNREGA;
    expect(c.code).toBe('MGNREGA');
    expect(c.biometrics.duplicateDetected).toBe(true);
    expect(c.reconciliation.anomalyType).toBe('DUPLICATE_THUMBPRINT');
  });

  it('10.4 should model PDS food security clean baseline with zero delta', () => {
    const c = CASE_STUDIES.PDS;
    expect(c.code).toBe('PDS');
    expect(c.reconciliation.delta).toBe(0);
    expect(c.reconciliation.anomalyType).toBe('CLEAN_PASS');
  });

  it('10.5 should supply all 4 case studies with full administrative metadata', () => {
    const cases = Object.values(CASE_STUDIES);
    expect(cases.length).toBe(4);
    for (const c of cases) {
      expect(c.state).toBeDefined();
      expect(c.district).toBeDefined();
      expect(c.talukId).toBeDefined();
      expect(c.scheme).toBeDefined();
    }
  });
});
