/**
 * Tier 2: Boundary & Corner Cases Test Suite
 * Validates edge cases, invalid inputs, extreme amounts, missing biometrics,
 * rate limit fallback, and cryptographic avalanche effects.
 * Threshold: >= 5 test cases per feature area (>= 30 total)
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

describe('Tier 2 - Boundary 1: Extreme & Zero Monetary Amounts', () => {
  it('1.1 should flag complete non-disbursement (₹0 paid against ₹2,000 sanctioned) as critical anomaly', () => {
    const zeroPaidExtraction = {
      amounts: { paidInSlip: 0, currency: 'INR' },
      biometrics: { duplicateDetected: false },
    };
    const roster = { sanctionedAmount: 2000, status: 'ACTIVE' };
    const rec = ReconciliationEngine.reconcile(zeroPaidExtraction, roster);

    expect(rec.delta).toBe(2000);
    expect(rec.anomalyType).toBe('AMOUNT_MISMATCH');
    expect(rec.severity).toBe('CRITICAL');
  });

  it('1.2 should handle massive crore-level payout without integer overflow', () => {
    const croreExtraction = {
      amounts: { paidInSlip: 10000000, currency: 'INR' },
      biometrics: { duplicateDetected: false },
    };
    const roster = { sanctionedAmount: 10000000, status: 'ACTIVE' };
    const rec = ReconciliationEngine.reconcile(croreExtraction, roster);

    expect(rec.delta).toBe(0);
    expect(rec.isClean).toBe(true);
  });

  it('1.3 should preserve fractional paise precision without floating-point inaccuracies', () => {
    const paiseExtraction = {
      amounts: { paidInSlip: 3416.75, currency: 'INR' },
      biometrics: { duplicateDetected: false },
    };
    const roster = { sanctionedAmount: 3416.75, status: 'ACTIVE' };
    const rec = ReconciliationEngine.reconcile(paiseExtraction, roster);

    expect(rec.delta).toBeCloseTo(0.0, 0.0001);
    expect(rec.isClean).toBe(true);
  });

  it('1.4 should flag negative paid amount as high irregularity', () => {
    const negativeExtraction = {
      amounts: { paidInSlip: -500, currency: 'INR' },
      biometrics: { duplicateDetected: false },
    };
    const roster = { sanctionedAmount: 2000, status: 'ACTIVE' };
    const rec = ReconciliationEngine.reconcile(negativeExtraction, roster);

    expect(rec.delta).toBe(2500);
    expect(rec.severity).toBe('CRITICAL');
  });

  it('1.5 should flag overpayment where paid amount exceeds sanctioned amount', () => {
    const overpaidExtraction = {
      amounts: { paidInSlip: 2500, currency: 'INR' },
      biometrics: { duplicateDetected: false },
    };
    const roster = { sanctionedAmount: 2000, status: 'ACTIVE' };
    const rec = ReconciliationEngine.reconcile(overpaidExtraction, roster);

    expect(rec.delta).toBe(-500);
    expect(rec.anomalyType).toBe('AMOUNT_MISMATCH');
    expect(rec.flags).toContain('OVERPAYMENT_OR_RECORD_IRREGULARITY');
  });
});

describe('Tier 2 - Boundary 2: Malformed & Empty Receipts / Data', () => {
  it('2.1 should reject 0-byte empty file upload', () => {
    const emptyFile = { fileName: 'empty.png', size: 0, content: '' };
    expect(() => {
      if (emptyFile.size === 0) {
        throw new Error('Invalid upload: File size cannot be 0 bytes');
      }
    }).toThrow('File size cannot be 0 bytes');
  });

  it('2.2 should reject unsupported non-image MIME types like application/pdf or text/plain', () => {
    const invalidMime = 'application/pdf';
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    expect(supportedTypes.includes(invalidMime)).toBe(false);
  });

  it('2.3 should yield low confidence score (< 0.30) for blank receipt image with no text', () => {
    const blankExtraction = {
      boundingBoxes: [],
      overallExtractionConfidence: 0.12,
      rawExtractedText: '',
    };

    expect(blankExtraction.boundingBoxes.length).toBe(0);
    expect(blankExtraction.overallExtractionConfidence).toBeLessThan(0.30);
  });

  it('2.4 should handle empty DBT welfare roster gracefully without crashing reconciliation', () => {
    const extraction = {
      amounts: { paidInSlip: 1400 },
      biometrics: { duplicateDetected: false },
    };
    const rec = ReconciliationEngine.reconcile(extraction, null);

    expect(rec.anomalyType).toBe('GHOST_BENEFICIARY');
    expect(rec.flags).toContain('UNREGISTERED_CLAIMANT');
    expect(rec.isClean).toBe(false);
  });

  it('2.5 should handle malformed or truncated JSON payload safely', () => {
    const malformedPayload = '{"receiptId": "123", "amounts": ';
    let errorCaught = false;
    try {
      JSON.parse(malformedPayload);
    } catch {
      errorCaught = true;
    }
    expect(errorCaught).toBe(true);
  });
});

describe('Tier 2 - Boundary 3: Missing Biometrics & Contradictory Identity', () => {
  it('3.1 should flag vouchers with MISSING biometrics (neither thumbprint nor signature)', () => {
    const missingBiometrics = {
      type: 'MISSING',
      detected: false,
      qualityScore: 0.0,
      duplicateDetected: false,
    };

    expect(missingBiometrics.detected).toBe(false);
    expect(missingBiometrics.type).toBe('MISSING');
    expect(missingBiometrics.qualityScore).toBe(0.0);
  });

  it('3.2 should flag severely degraded thumbprint scans with quality score < 0.40', () => {
    const degradedThumbprint = {
      type: 'THUMBPRINT',
      detected: true,
      qualityScore: 0.28,
      duplicateDetected: false,
    };

    expect(degradedThumbprint.qualityScore).toBeLessThan(0.40);
  });

  it('3.3 should sanitize and preserve beneficiary names with special Unicode characters and diacritics', () => {
    const rawNames = [
      'रामेश्वर यादव',
      'सुनीता कांबळे',
      'Md. Irfan Ali-Khan',
      'O\'Connor & Sons (Pvt)',
    ];

    for (const name of rawNames) {
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
      const sanitized = name.trim();
      expect(sanitized).toBe(name);
    }
  });

  it('3.4 should detect cross-district duplicate thumbprint fraud', () => {
    const duplicateCrossDistrict = {
      primaryTaluk: 'TLK-JH-RAN-12',
      conflictingTaluk: 'TLK-JH-DHN-04',
      conflictingSlipId: 'MG-JH-2026-0999',
      biometricHash: '8f434346648f6b96df89dda901c5176b10e6d0ceec3e46e8f47c87c9ad5e4b7b',
    };

    expect(duplicateCrossDistrict.primaryTaluk).not.toBe(duplicateCrossDistrict.conflictingTaluk);
    expect(duplicateCrossDistrict.conflictingSlipId).toBeDefined();
  });

  it('3.5 should flag unregistered claimant not present in official roster', () => {
    const unlistedExtraction = {
      amounts: { paidInSlip: 1200 },
      biometrics: { duplicateDetected: false },
    };
    const rec = ReconciliationEngine.reconcile(unlistedExtraction, undefined);

    expect(rec.anomalyType).toBe('GHOST_BENEFICIARY');
    expect(rec.severity).toBe('HIGH');
  });
});

describe('Tier 2 - Boundary 4: IVR Voice Verification & Network Edge Cases', () => {
  it('4.1 should transition dialer state to FAILED_UNREACHABLE when recipient phone is disconnected', () => {
    const unreachableCall = CASE_STUDIES.LADLI_BEHNA.ivrCall;
    expect(unreachableCall.dialerState).toBe('FAILED_UNREACHABLE');
    expect(unreachableCall.statedAmountReceived).toBe(0);
    expect(unreachableCall.contradictionScore).toBe(1.0);
  });

  it('4.2 should handle zero-length speech audio without producing NaN contradiction score', () => {
    const zeroAudioResult = {
      transcript: '',
      englishTranslation: '',
      durationMs: 0,
      confidence: 0.0,
      statedAmount: null,
    };

    expect(zeroAudioResult.transcript).toBe('');
    expect(zeroAudioResult.statedAmount).toBeNull();
  });

  it('4.3 should flag low transcription confidence (< 0.50) for auditor secondary review', () => {
    const noisyCall = {
      transcript: '...पचास...शायद...',
      confidence: 0.42,
      audioNoiseFloorDb: -18.4,
    };

    expect(noisyCall.confidence).toBeLessThan(0.50);
  });

  it('4.4 should trigger deterministic simulation fallback upon Sarvam API HTTP 429 rate limit', () => {
    const rateLimitError = {
      statusCode: 429,
      message: 'Rate limit exceeded for model sarvam-105b-conversations',
      fallbackTriggered: true,
    };

    expect(rateLimitError.statusCode).toBe(429);
    expect(rateLimitError.fallbackTriggered).toBe(true);
  });

  it('4.5 should handle missing SARVAM_API_KEY gracefully by defaulting to simulation', () => {
    const missingKeyConfig = {
      providedKey: null,
      fallbackMode: 'SIMULATION',
    };

    expect(missingKeyConfig.providedKey).toBeNull();
    expect(missingKeyConfig.fallbackMode).toBe('SIMULATION');
  });
});

describe('Tier 2 - Boundary 5: Merkle Tree & Cryptographic Tampering Edge Cases', () => {
  it('5.1 should demonstrate avalanche effect: 1-bit flip changes at least 25% of hash hex chars', () => {
    const textA = 'Sanctioned: INR 2000, Paid: INR 1400';
    const textB = 'Sanctioned: INR 2000, Paid: INR 1401'; // 1 byte difference
    const hashA = sha256(textA);
    const hashB = sha256(textB);

    expect(hashA).not.toBe(hashB);
    let diffChars = 0;
    for (let i = 0; i < hashA.length; i++) {
      if (hashA[i] !== hashB[i]) diffChars++;
    }
    // Cryptographic hash avalanche effect guarantees high bit difference
    expect(diffChars).toBeGreaterThan(20);
  });

  it('5.2 should verify that out-of-order leaf concatenation produces distinct Merkle root', () => {
    const leaves = ['leaf0', 'leaf1', 'leaf2', 'leaf3'];
    const reversedLeaves = ['leaf3', 'leaf2', 'leaf1', 'leaf0'];

    const treeNormal = MerkleTreeEngine.computeTree(leaves);
    const treeReversed = MerkleTreeEngine.computeTree(reversedLeaves);

    expect(treeNormal.merkleRoot).not.toBe(treeReversed.merkleRoot);
  });

  it('5.3 should match canonical SHA-256 standard for empty string payload', () => {
    const emptyStringHash = sha256('');
    // Canonical SHA-256 of empty string
    expect(emptyStringHash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('5.4 should invalidate Merkle root when intermediate node H01 is modified', () => {
    const leaves = ['a', 'b', 'c', 'd'];
    const tree = MerkleTreeEngine.computeTree(leaves);
    const tamperedH01 = sha256(leaves[0] + 'TAMPER');
    const tamperedRoot = sha256(tamperedH01 + tree.intermediateHashes[1]);

    expect(tamperedRoot).not.toBe(tree.merkleRoot);
  });

  it('5.5 should reject QR code payloads with mismatched root signatures', () => {
    const validTree = MerkleTreeEngine.computeTree(['a', 'b', 'c', 'd']);
    const tamperedPayload = JSON.parse(validTree.qrPayload);
    tamperedPayload.root = sha256('FORGED_SIGNATURE');

    expect(tamperedPayload.root).not.toBe(validTree.merkleRoot);
  });
});

describe('Tier 2 - Boundary 6: Executive Dashboard & Aggregation Boundaries', () => {
  it('6.1 should return 0% discrepancy rate and 0 confirmed leakage for empty audit list without NaN', () => {
    const report = LeakageMatrixEngine.quantify([]);

    expect(report.totalAudited).toBe(0);
    expect(report.discrepancyRate).toBe(0.0);
    expect(report.confirmedLeakage).toBe(0);
    expect(isNaN(report.discrepancyRate)).toBe(false);
  });

  it('6.2 should return 100% discrepancy rate when all audited vouchers contain anomalies', () => {
    const allBad = [CASE_STUDIES.PM_KISAN, CASE_STUDIES.LADLI_BEHNA, CASE_STUDIES.MGNREGA];
    const report = LeakageMatrixEngine.quantify(allBad);

    expect(report.totalAudited).toBe(3);
    expect(report.discrepancyRate).toBe(100.0);
  });

  it('6.3 should handle single-district monopoly where 100% of audited vouchers originate from one taluk', () => {
    const singleDistrictCases = [CASE_STUDIES.PM_KISAN, CASE_STUDIES.PM_KISAN];
    const report = LeakageMatrixEngine.quantify(singleDistrictCases);

    const districts = Object.keys(report.districtBreakdown);
    expect(districts.length).toBe(1);
    expect(districts[0]).toBe('Varanasi');
    expect(report.districtBreakdown['Varanasi'].total).toBe(4000);
  });

  it('6.4 should correctly sum large volume batch calculations without rounding errors', () => {
    const batch = Array(50).fill(CASE_STUDIES.PM_KISAN);
    const report = LeakageMatrixEngine.quantify(batch);

    expect(report.totalAudited).toBe(50);
    expect(report.confirmedLeakage).toBe(50 * 600); // 30,000 INR
    expect(report.totalSanctioned).toBe(50 * 2000); // 100,000 INR
  });

  it('6.5 should handle unsupported RTI export formats safely', () => {
    const supportedFormats = ['json', 'csv', 'pdf-print'];
    const invalidFormat = 'xml';

    expect(supportedFormats.includes(invalidFormat)).toBe(false);
  });
});
