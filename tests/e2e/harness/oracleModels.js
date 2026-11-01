/**
 * Authoritative Oracle & Contract Specification Engine
 * Source of Truth derived from PROJECT.md and ORIGINAL_REQUEST.md
 */

const crypto = require('node:crypto');

// SHA-256 Utility matching Browser Web Crypto standard
function sha256(data) {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

// 4 Bharat DBT Welfare Case Studies (Authoritative Fixtures)
const CASE_STUDIES = {
  PM_KISAN: {
    id: 'pm-kisan-01',
    code: 'PM_KISAN',
    title: 'PM-KISAN Cash Payout Skimming',
    scheme: 'Pradhan Mantri Kisan Samman Nidhi',
    category: 'Agricultural DBT Payout',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    talukId: 'TLK-UP-VAR-09',
    panchayat: 'Kashi Gram',
    language: 'hi-IN',
    voucherType: 'Crumpled Cash Slip',
    beneficiaryName: {
      raw: 'रामेश्वर यादव',
      standardized: 'Rameshwar Yadav',
      confidence: 0.96,
      boxId: 'box-name-01',
    },
    amounts: {
      sanctionedInSlip: 2000,
      paidInSlip: 1400,
      currency: 'INR',
      confidence: 0.99,
      boxId: 'box-amount-01',
    },
    payoutDate: {
      raw: '14/10/2026',
      isoDate: '2026-10-14',
      confidence: 0.97,
      boxId: 'box-date-01',
    },
    biometrics: {
      type: 'SIGNATURE',
      detected: true,
      box: [78.2, 54.1, 91.5, 88.4],
      qualityScore: 0.88,
      duplicateDetected: false,
    },
    boundingBoxes: [
      { id: 'box-name-01', field: 'beneficiaryName', label: 'Beneficiary Name', box: [22.0, 15.0, 31.0, 65.0], rawText: 'रामेश्वर यादव', confidence: 0.96, script: 'Devanagari' },
      { id: 'box-amount-01', field: 'paidAmount', label: 'Paid Amount', box: [42.0, 50.0, 52.0, 85.0], rawText: '₹ 1,400/-', confidence: 0.99, script: 'Latin' },
      { id: 'box-date-01', field: 'payoutDate', label: 'Payout Date', box: [15.0, 60.0, 24.0, 90.0], rawText: '14/10/2026', confidence: 0.97, script: 'Latin' },
      { id: 'box-taluk-01', field: 'officeMetadata', label: 'Taluk Stamp', box: [65.0, 10.0, 85.0, 45.0], rawText: 'TLK-UP-VAR-09', confidence: 0.94, script: 'Latin' },
    ],
    overallExtractionConfidence: 0.96,
    reconciliation: {
      sanctionedAmount: 2000,
      paidAmount: 1400,
      delta: 600,
      anomalyType: 'AMOUNT_MISMATCH',
      severity: 'CRITICAL',
      operatorId: 'OP-VAR-441',
      leakageAmount: 600,
    },
    ivrCall: {
      beneficiaryPhone: '+91 98765 43210',
      dialerState: 'COMPLETED',
      indicScriptText: 'हाँ बाबूजी, हमें सिर्फ चौदह सौ रुपये मिले हैं। छह सौ रुपये बाबू ने फीस बोलकर काट लिए।',
      englishTranslation: 'Yes sir, I only received 1,400 rupees. The clerk deducted 600 rupees saying it was an inspection fee.',
      statedAmountReceived: 1400,
      sanctionedAmount: 2000,
      contradictionScore: 0.98,
      grievanceCategory: 'MIDDLEMAN_EXTORTION',
      confirmedLeakage: true,
    },
  },

  LADLI_BEHNA: {
    id: 'ladli-behna-02',
    code: 'LADLI_BEHNA',
    title: 'Ladli Behna Yojana Ghost Payout',
    scheme: 'Mukhya Mantri Ladli Behna Yojana',
    category: 'Direct Women Cash Assistance',
    state: 'Maharashtra',
    district: 'Kolhapur',
    talukId: 'TLK-MH-KOL-04',
    panchayat: 'Radhanagari',
    language: 'mr-IN',
    voucherType: 'Thermal Slip',
    beneficiaryName: {
      raw: 'सुनीता कांबळे',
      standardized: 'Sunita Kamble',
      confidence: 0.92,
      boxId: 'box-name-02',
    },
    amounts: {
      sanctionedInSlip: 1250,
      paidInSlip: 1250,
      currency: 'INR',
      confidence: 0.98,
      boxId: 'box-amount-02',
    },
    payoutDate: {
      raw: '20/10/2026',
      isoDate: '2026-10-20',
      confidence: 0.95,
      boxId: 'box-date-02',
    },
    biometrics: {
      type: 'THUMBPRINT',
      detected: true,
      box: [70.0, 60.0, 92.0, 88.0],
      qualityScore: 0.42,
      duplicateDetected: true,
      conflictingSlipId: 'LB-MH-2026-0041',
    },
    boundingBoxes: [
      { id: 'box-name-02', field: 'beneficiaryName', label: 'Beneficiary Name', box: [20.0, 12.0, 29.0, 62.0], rawText: 'सुनीता कांबळे', confidence: 0.92, script: 'Devanagari' },
      { id: 'box-amount-02', field: 'paidAmount', label: 'Disbursed Amount', box: [38.0, 48.0, 48.0, 82.0], rawText: '₹ 1,250/-', confidence: 0.98, script: 'Latin' },
      { id: 'box-date-02', field: 'payoutDate', label: 'Disbursement Date', box: [12.0, 58.0, 20.0, 90.0], rawText: '20/10/2026', confidence: 0.95, script: 'Latin' },
    ],
    overallExtractionConfidence: 0.94,
    reconciliation: {
      sanctionedAmount: 1250,
      paidAmount: 1250,
      delta: 0,
      anomalyType: 'GHOST_BENEFICIARY',
      severity: 'HIGH',
      operatorId: 'OP-KOL-118',
      leakageAmount: 1250,
    },
    ivrCall: {
      beneficiaryPhone: '+91 91234 56789',
      dialerState: 'FAILED_UNREACHABLE',
      indicScriptText: 'हा क्रमांक अस्तित्वात नाही किंवा तात्पुरता बंद आहे. (कॉल अनुत्तरीत)',
      englishTranslation: 'This number does not exist or is currently suspended. Beneficiary flagged as deceased in 2025 civil registry.',
      statedAmountReceived: 0,
      sanctionedAmount: 1250,
      contradictionScore: 1.0,
      grievanceCategory: 'GHOST_ACCOUNT',
      confirmedLeakage: true,
    },
  },

  MGNREGA: {
    id: 'mgnrega-03',
    code: 'MGNREGA',
    title: 'MGNREGA Muster Roll Duplicate Claim',
    scheme: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    category: 'Rural Wage Employment',
    state: 'Jharkhand',
    district: 'Ranchi',
    talukId: 'TLK-JH-RAN-12',
    panchayat: 'Bundu Block',
    language: 'hi-IN',
    voucherType: 'Handwritten Muster Roll',
    beneficiaryName: {
      raw: 'Shanti Devi',
      standardized: 'Shanti Devi',
      confidence: 0.95,
      boxId: 'box-name-03',
    },
    amounts: {
      sanctionedInSlip: 3416,
      paidInSlip: 3416,
      currency: 'INR',
      confidence: 0.97,
      boxId: 'box-amount-03',
    },
    payoutDate: {
      raw: '18/10/2026',
      isoDate: '2026-10-18',
      confidence: 0.96,
      boxId: 'box-date-03',
    },
    biometrics: {
      type: 'THUMBPRINT',
      detected: true,
      box: [72.0, 55.0, 93.0, 89.0],
      qualityScore: 0.89,
      duplicateDetected: true,
      conflictingSlipId: 'MG-JH-2026-0818',
    },
    boundingBoxes: [
      { id: 'box-name-03', field: 'beneficiaryName', label: 'Worker Name', box: [24.0, 14.0, 33.0, 66.0], rawText: 'Shanti Devi', confidence: 0.95, script: 'Latin' },
      { id: 'box-amount-03', field: 'paidAmount', label: '14 Days Wages', box: [45.0, 52.0, 55.0, 86.0], rawText: '₹ 3,416.00', confidence: 0.97, script: 'Latin' },
      { id: 'box-date-03', field: 'payoutDate', label: 'Muster Date', box: [14.0, 62.0, 22.0, 92.0], rawText: '18/10/2026', confidence: 0.96, script: 'Latin' },
    ],
    overallExtractionConfidence: 0.95,
    reconciliation: {
      sanctionedAmount: 3416,
      paidAmount: 3416,
      delta: 0,
      anomalyType: 'DUPLICATE_THUMBPRINT',
      severity: 'HIGH',
      operatorId: 'OP-RAN-709',
      leakageAmount: 3416,
    },
    ivrCall: {
      beneficiaryPhone: '+91 99887 76655',
      dialerState: 'COMPLETED',
      indicScriptText: 'हमार नाम शांति देवी है, लेकिन हम तो पिछला महीना काम पर गइबे नहीं किए रहे। हमार अंगूठा कौनू दूसरा रसीद पर लगा है।',
      englishTranslation: 'My name is Shanti Devi, but I did not even go to work last month. Someone else used my thumbprint on this voucher.',
      statedAmountReceived: 0,
      sanctionedAmount: 3416,
      contradictionScore: 0.88,
      grievanceCategory: 'DUPLICATE_IDENTITY_MISUSE',
      confirmedLeakage: true,
    },
  },

  PDS: {
    id: 'pds-clean-04',
    code: 'PDS',
    title: 'National Food Security PDS Subsidy',
    scheme: 'Pradhan Mantri Garib Kalyan Anna Yojana / NFSA',
    category: 'Essential Food Grain Subsidy',
    state: 'Uttar Pradesh',
    district: 'Ballia',
    talukId: 'TLK-UP-BAL-02',
    panchayat: 'Bairia',
    language: 'hi-IN',
    voucherType: 'Digital ePDS Printout',
    beneficiaryName: {
      raw: 'Anand Prakash Verma',
      standardized: 'Anand Prakash Verma',
      confidence: 0.99,
      boxId: 'box-name-04',
    },
    amounts: {
      sanctionedInSlip: 850,
      paidInSlip: 850,
      currency: 'INR',
      confidence: 0.99,
      boxId: 'box-amount-04',
    },
    payoutDate: {
      raw: '25/10/2026',
      isoDate: '2026-10-25',
      confidence: 0.99,
      boxId: 'box-date-04',
    },
    biometrics: {
      type: 'THUMBPRINT',
      detected: true,
      box: [75.0, 60.0, 94.0, 88.0],
      qualityScore: 0.97,
      duplicateDetected: false,
    },
    boundingBoxes: [
      { id: 'box-name-04', field: 'beneficiaryName', label: 'Cardholder Name', box: [20.0, 15.0, 28.0, 65.0], rawText: 'Anand Prakash Verma', confidence: 0.99, script: 'Latin' },
      { id: 'box-amount-04', field: 'paidAmount', label: 'Cash Subsidy', box: [40.0, 50.0, 50.0, 85.0], rawText: '₹ 850.00', confidence: 0.99, script: 'Latin' },
      { id: 'box-date-04', field: 'payoutDate', label: 'POS Auth Date', box: [12.0, 60.0, 20.0, 90.0], rawText: '25/10/2026', confidence: 0.99, script: 'Latin' },
    ],
    overallExtractionConfidence: 0.99,
    reconciliation: {
      sanctionedAmount: 850,
      paidAmount: 850,
      delta: 0,
      anomalyType: 'CLEAN_PASS',
      severity: 'CLEAN',
      operatorId: 'OP-BAL-014',
      leakageAmount: 0,
    },
    ivrCall: {
      beneficiaryPhone: '+91 97654 32109',
      dialerState: 'COMPLETED',
      indicScriptText: 'हाँ जी, हमें पूरी राशन सामग्री और 850 रुपये की पूरी नकद सब्सिडी समय पर मिल गई है। कोई शिकायत नहीं है।',
      englishTranslation: 'Yes sir, we received full ration supplies and the full 850 rupees cash subsidy on time. No complaints.',
      statedAmountReceived: 850,
      sanctionedAmount: 850,
      contradictionScore: 0.0,
      grievanceCategory: 'FULLY_SATISFIED',
      confirmedLeakage: false,
    },
  },
};

// Official DBT Roster Dataset
const OFFICIAL_REGISTRY_ROSTER = [
  {
    recordId: 'REG-UP-VAR-001',
    caseCode: 'PM_KISAN',
    beneficiaryName: 'रामेश्वर यादव',
    standardizedName: 'Rameshwar Yadav',
    aadhaarEnding: '4912',
    accountEnding: '8831',
    sanctionedAmount: 2000,
    scheme: 'Pradhan Mantri Kisan Samman Nidhi',
    district: 'Varanasi',
    talukId: 'TLK-UP-VAR-09',
    status: 'ACTIVE',
    validBiometricHash: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
  },
  {
    recordId: 'REG-MH-KOL-002',
    caseCode: 'LADLI_BEHNA',
    beneficiaryName: 'सुनीता कांबळे',
    standardizedName: 'Sunita Kamble',
    aadhaarEnding: '8124',
    accountEnding: '1042',
    sanctionedAmount: 1250,
    scheme: 'Mukhya Mantri Ladli Behna Yojana',
    district: 'Kolhapur',
    talukId: 'TLK-MH-KOL-04',
    status: 'DECEASED',
    validBiometricHash: null,
  },
  {
    recordId: 'REG-JH-RAN-003',
    caseCode: 'MGNREGA',
    beneficiaryName: 'Shanti Devi',
    standardizedName: 'Shanti Devi',
    aadhaarEnding: '3349',
    accountEnding: '5561',
    sanctionedAmount: 3416,
    scheme: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    district: 'Ranchi',
    talukId: 'TLK-JH-RAN-12',
    status: 'ACTIVE',
    validBiometricHash: '8f434346648f6b96df89dda901c5176b10e6d0ceec3e46e8f47c87c9ad5e4b7b',
  },
  {
    recordId: 'REG-UP-BAL-004',
    caseCode: 'PDS',
    beneficiaryName: 'Anand Prakash Verma',
    standardizedName: 'Anand Prakash Verma',
    aadhaarEnding: '9012',
    accountEnding: '7723',
    sanctionedAmount: 850,
    scheme: 'Pradhan Mantri Garib Kalyan Anna Yojana / NFSA',
    district: 'Ballia',
    talukId: 'TLK-UP-BAL-02',
    status: 'ACTIVE',
    validBiometricHash: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
  },
];

// Cryptographic Merkle Tree Engine
class MerkleTreeEngine {
  static createLeafHashes(receiptData, ocrData, reconcileData, voiceData) {
    const leaf0 = sha256(receiptData);
    const leaf1 = sha256(ocrData);
    const leaf2 = sha256(reconcileData);
    const leaf3 = sha256(voiceData);
    return [leaf0, leaf1, leaf2, leaf3];
  }

  static computeTree(leafHashes) {
    if (!Array.isArray(leafHashes) || leafHashes.length !== 4) {
      throw new Error(`MerkleTree requires exactly 4 leaf hashes, got ${leafHashes?.length}`);
    }
    const h01 = sha256(leafHashes[0] + leafHashes[1]);
    const h23 = sha256(leafHashes[2] + leafHashes[3]);
    const root = sha256(h01 + h23);
    const timestamp = new Date().toISOString();

    return {
      leafHashes: [...leafHashes],
      intermediateHashes: [h01, h23],
      merkleRoot: root,
      timestamp,
      isTampered: false,
      verificationUrl: `https://sarvam-audit.gov.in/verify/${root.slice(0, 16)}`,
      qrPayload: JSON.stringify({
        root,
        h01,
        h23,
        ts: timestamp,
        verified: true,
      }),
    };
  }

  static simulateTamper(tree, leafIndex = 1, tamperedPayload = 'MODIFIED_1_BYTE_TAMPER') {
    const tamperedLeaves = [...tree.leafHashes];
    tamperedLeaves[leafIndex] = sha256(tamperedPayload);
    const tamperedH01 = sha256(tamperedLeaves[0] + tamperedLeaves[1]);
    const tamperedH23 = sha256(tamperedLeaves[2] + tamperedLeaves[3]);
    const tamperedRoot = sha256(tamperedH01 + tamperedH23);

    return {
      originalRoot: tree.merkleRoot,
      tamperedRoot,
      tamperedLeafIndex: leafIndex,
      isTampered: true,
      mismatchDetected: tree.merkleRoot !== tamperedRoot,
      alertMessage: 'TAMPER DETECTED: Cryptographic Merkle Root mismatch! Record altered in transit.',
    };
  }
}

// Reconciliation Calculation Engine
class ReconciliationEngine {
  static reconcile(extractedData, officialRecord) {
    if (!extractedData) throw new Error('extractedData is required');
    if (!officialRecord) {
      return {
        sanctionedAmount: 0,
        paidAmount: extractedData.amounts?.paidInSlip || 0,
        delta: -(extractedData.amounts?.paidInSlip || 0),
        anomalyType: 'GHOST_BENEFICIARY',
        severity: 'HIGH',
        flags: ['UNREGISTERED_CLAIMANT', 'ROSTER_NOT_FOUND'],
        isClean: false,
      };
    }

    const sanctioned = officialRecord.sanctionedAmount;
    const paid = extractedData.amounts?.paidInSlip || 0;
    const delta = sanctioned - paid;
    const flags = [];

    if (officialRecord.status === 'DECEASED') {
      flags.push('DECEASED_RECIPIENT');
      return {
        sanctionedAmount: sanctioned,
        paidAmount: paid,
        delta,
        anomalyType: 'GHOST_BENEFICIARY',
        severity: 'HIGH',
        flags,
        isClean: false,
      };
    }

    if (extractedData.biometrics?.duplicateDetected) {
      flags.push('DUPLICATE_THUMBPRINT_OR_SIGNATURE');
      return {
        sanctionedAmount: sanctioned,
        paidAmount: paid,
        delta,
        anomalyType: 'DUPLICATE_THUMBPRINT',
        severity: 'HIGH',
        flags,
        isClean: false,
      };
    }

    if (delta > 0) {
      flags.push('AMOUNT_SKIMMING_DETECTED');
      return {
        sanctionedAmount: sanctioned,
        paidAmount: paid,
        delta,
        anomalyType: 'AMOUNT_MISMATCH',
        severity: delta >= 500 ? 'CRITICAL' : 'HIGH',
        flags,
        isClean: false,
      };
    }

    if (delta < 0) {
      flags.push('OVERPAYMENT_OR_RECORD_IRREGULARITY');
      return {
        sanctionedAmount: sanctioned,
        paidAmount: paid,
        delta,
        anomalyType: 'AMOUNT_MISMATCH',
        severity: 'HIGH',
        flags,
        isClean: false,
      };
    }

    return {
      sanctionedAmount: sanctioned,
      paidAmount: paid,
      delta: 0,
      anomalyType: 'CLEAN_PASS',
      severity: 'CLEAN',
      flags: ['VERIFIED_MATCH'],
      isClean: true,
    };
  }
}

// Leakage Matrix & Loss Quantification Engine
class LeakageMatrixEngine {
  static quantify(caseStudiesList) {
    let totalAudited = 0;
    let totalSanctioned = 0;
    let totalDisbursed = 0;
    let confirmedLeakage = 0;
    let fundsAtRisk = 0;
    const anomalies = [];
    const districtBreakdown = {};

    for (const c of caseStudiesList) {
      totalAudited++;
      const sanctioned = c.amounts?.sanctionedInSlip || c.reconciliation?.sanctionedAmount || 0;
      const paid = c.amounts?.paidInSlip || 0;
      totalSanctioned += sanctioned;
      totalDisbursed += paid;

      const district = c.district || 'Unknown';
      if (!districtBreakdown[district]) {
        districtBreakdown[district] = { total: 0, leakage: 0, criticalCount: 0 };
      }
      districtBreakdown[district].total += sanctioned;

      const rec = c.reconciliation;
      if (rec && rec.anomalyType !== 'CLEAN_PASS') {
        anomalies.push({
          id: c.id,
          scheme: c.scheme,
          district: c.district,
          anomalyType: rec.anomalyType,
          severity: rec.severity,
          leakageAmount: rec.leakageAmount || Math.abs(rec.delta),
        });

        if (rec.severity === 'CRITICAL') {
          confirmedLeakage += (rec.leakageAmount || Math.abs(rec.delta));
          districtBreakdown[district].criticalCount++;
        } else {
          fundsAtRisk += (rec.leakageAmount || Math.abs(rec.delta));
        }
        districtBreakdown[district].leakage += (rec.leakageAmount || Math.abs(rec.delta));
      }
    }

    const discrepancyRate = totalAudited > 0 ? (anomalies.length / totalAudited) * 100 : 0;
    // Recovery probability formula: higher if operator is identified and fraud is middleman skimming
    const recoveryProbability = confirmedLeakage > 0 ? 84.5 : (fundsAtRisk > 0 ? 62.0 : 100.0);

    return {
      totalAudited,
      totalSanctioned,
      totalDisbursed,
      confirmedLeakage,
      fundsAtRisk,
      discrepancyRate: Number(discrepancyRate.toFixed(1)),
      recoveryProbability: Number(recoveryProbability.toFixed(1)),
      anomalies,
      districtBreakdown,
    };
  }
}

// RTI & Donor Audit Summary Generator
class RtiSummaryGenerator {
  static generateDossier(caseStudy, merkleAuditTrail, leakageReport) {
    const timestamp = new Date().toISOString();
    return {
      dossierId: `RTI-AUDIT-${timestamp.slice(0, 10)}-${caseStudy.id.toUpperCase()}`,
      metadata: {
        application: 'Sarvam Audit: Payout & Leakage Intelligence',
        generatedAt: timestamp,
        auditorAuthority: 'Comptroller & Public DBT Verification Cell',
        integrityHash: merkleAuditTrail?.merkleRoot || sha256(caseStudy.id + timestamp),
        verificationUrl: merkleAuditTrail?.verificationUrl || `https://sarvam-audit.gov.in/verify`,
      },
      schemeDetails: {
        scheme: caseStudy.scheme,
        state: caseStudy.state,
        district: caseStudy.district,
        talukId: caseStudy.talukId,
        beneficiaryStandardized: caseStudy.beneficiaryName?.standardized,
      },
      financialAudit: {
        sanctionedINR: caseStudy.reconciliation?.sanctionedAmount || caseStudy.amounts?.sanctionedInSlip,
        actualDisbursedINR: caseStudy.amounts?.paidInSlip,
        leakageDeltaINR: caseStudy.reconciliation?.delta,
        severity: caseStudy.reconciliation?.severity,
        confirmedLeakage: caseStudy.ivrCall?.confirmedLeakage,
      },
      cryptographicProof: {
        merkleRoot: merkleAuditTrail?.merkleRoot,
        leafHashes: merkleAuditTrail?.leafHashes,
        tamperStatus: merkleAuditTrail?.isTampered ? 'TAMPER_ALERT' : 'VERIFIED_IMMUTABLE',
        qrPayload: merkleAuditTrail?.qrPayload,
      },
      executiveSummary: {
        overallDiscrepancyRate: leakageReport?.discrepancyRate,
        recoveryProbability: leakageReport?.recoveryProbability,
      },
    };
  }
}

// Design System Standard Tokens
const DESIGN_SYSTEM = {
  primaryAccent: '#4F46E5',
  primaryHover: '#4338CA',
  tokens: {
    '--color-primary': '#4F46E5',
    '--color-primary-hover': '#4338CA',
    '--color-accent': '#7C3AED',
    '--color-danger': '#DC2626',
    '--color-warning': '#D97706',
    '--color-success': '#059669',
  },
  lightTheme: {
    '--bg-app': '#F8FAFC',
    '--bg-card': '#FFFFFF',
    '--border-card': '#E2E8F0',
    '--text-main': '#0F172A',
    '--text-muted': '#64748B',
  },
  darkTheme: {
    '--bg-app': '#0B0F19',
    '--bg-card': '#111827',
    '--border-card': '#1E293B',
    '--text-main': '#F8FAFC',
    '--text-muted': '#94A3B8',
  },
};

module.exports = {
  sha256,
  CASE_STUDIES,
  OFFICIAL_REGISTRY_ROSTER,
  MerkleTreeEngine,
  ReconciliationEngine,
  LeakageMatrixEngine,
  RtiSummaryGenerator,
  DESIGN_SYSTEM,
};
