export type AnomalyType = 'AMOUNT_MISMATCH' | 'GHOST_BENEFICIARY' | 'DUPLICATE_THUMBPRINT' | 'CLEAN_PASS';
export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'LOW' | 'CLEAN';

export interface BoundingBox {
  id: string;
  field: string;
  label: string;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in %
  rawText: string;
  confidence: number;
  script: string;
}

export interface ExtractedReceiptData {
  receiptId: string;
  scheme: string;
  beneficiaryName: {
    raw: string;
    standardized: string;
    confidence: number;
    boxId: string;
  };
  amounts: {
    sanctionedInSlip: number | null;
    paidInSlip: number;
    currency: 'INR';
    confidence: number;
    boxId: string;
  };
  payoutDate: {
    raw: string;
    isoDate: string;
    confidence: number;
    boxId: string;
  };
  officeMetadata: {
    talukId: string;
    gramPanchayat: string;
    district: string;
    state: string;
    operatorId: string;
  };
  biometrics: {
    type: 'THUMBPRINT' | 'SIGNATURE' | 'BOTH' | 'MISSING';
    detected: boolean;
    box: [number, number, number, number];
    qualityScore: number;
    duplicateDetected: boolean;
    conflictingSlipId?: string;
  };
  boundingBoxes: BoundingBox[];
  overallExtractionConfidence: number;
}

export interface ReconciliationResult {
  sanctionedAmount: number;
  paidAmount: number;
  delta: number;
  anomalyType: AnomalyType;
  severity: SeverityLevel;
  flags: string[];
  isClean: boolean;
  operatorId?: string;
  leakageAmount?: number;
}

export interface VoiceVerificationResult {
  beneficiaryPhone: string;
  dialerState: 'IDLE' | 'DIALING' | 'RINGING' | 'CONNECTED' | 'COMPLETED' | 'FAILED_UNREACHABLE';
  indicScriptText: string;
  englishTranslation: string;
  statedAmountReceived: number;
  sanctionedAmount: number;
  contradictionScore: number;
  grievanceCategory: string;
  confirmedLeakage: boolean;
  verifiedAt?: string;
}

export interface MerkleAuditTrail {
  receiptHash?: string;
  ocrHash?: string;
  reconciliationHash?: string;
  voiceVerificationHash?: string;
  leafHashes: [string, string, string, string] | string[];
  intermediateHashes: [string, string] | string[];
  merkleRoot: string;
  timestamp: string;
  tamperedLeafIndex?: number;
  tamperedRoot?: string;
  isTampered: boolean;
  verificationUrl: string;
  qrPayload: string;
}

export interface LeakageQuantification {
  totalAudited: number;
  totalSanctioned: number;
  totalDisbursed: number;
  confirmedLeakage: number;
  fundsAtRisk: number;
  discrepancyRate: number;
  recoveryProbability: number;
  anomalies: Array<{
    id: string;
    scheme: string;
    district: string;
    anomalyType: string;
    severity: string;
    leakageAmount: number;
  }>;
  districtBreakdown: Record<string, {
    total: number;
    leakage: number;
    criticalCount: number;
  }>;
}

export interface OfficialRegistryRecord {
  recordId: string;
  caseCode: string;
  beneficiaryName: string;
  standardizedName: string;
  aadhaarEnding: string;
  accountEnding: string;
  sanctionedAmount: number;
  scheme: string;
  district: string;
  talukId: string;
  status: 'ACTIVE' | 'DECEASED' | 'FLAGGED';
  validBiometricHash: string | null;
}
