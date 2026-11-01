import {
  ExtractedReceiptData,
  ReconciliationResult,
  VoiceVerificationResult,
  MerkleAuditTrail,
  LeakageQuantification,
  BoundingBox,
  AnomalyType,
  SeverityLevel
} from './audit';

export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type ExecutionStatus = 'idle' | 'running' | 'completed' | 'error';
export type AppMode = 'SIMULATION' | 'LIVE_SARVAM_API';

export interface CapturedReceipt {
  id: string;
  voucherType: string;
  source: 'PRESET' | 'CUSTOM_UPLOAD' | 'CAMERA_SNAP';
  timestamp: string;
  scheme: string;
  fileName?: string;
  fileSize?: number;
  imageUrl?: string;
  rawVisualData?: string;
}

export interface CaseStudy {
  id: string;
  code: string;
  title: string;
  scheme: string;
  category: string;
  state: string;
  district: string;
  talukId: string;
  panchayat: string;
  language: string;
  voucherType: string;
  beneficiaryName: {
    raw: string;
    standardized: string;
    confidence: number;
    boxId: string;
  };
  amounts: {
    sanctionedInSlip: number;
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
  reconciliation: {
    sanctionedAmount: number;
    paidAmount: number;
    delta: number;
    anomalyType: AnomalyType;
    severity: SeverityLevel;
    operatorId: string;
    leakageAmount: number;
  };
  ivrCall: {
    beneficiaryPhone: string;
    dialerState: 'IDLE' | 'DIALING' | 'RINGING' | 'CONNECTED' | 'COMPLETED' | 'FAILED_UNREACHABLE';
    indicScriptText: string;
    englishTranslation: string;
    statedAmountReceived: number;
    sanctionedAmount: number;
    contradictionScore: number;
    grievanceCategory: string;
    confirmedLeakage: boolean;
  };
}

export interface PipelineState {
  currentStep: StageNumber;
  mode: AppMode;
  selectedCaseId: string;
  theme: 'dark' | 'light';
  capturedReceipt: CapturedReceipt | null;
  ocrExtraction: ExtractedReceiptData | null;
  reconciliationResult: ReconciliationResult | null;
  voiceVerificationResult: VoiceVerificationResult | null;
  leakageAnalysis: LeakageQuantification | null;
  merkleAuditTrail: MerkleAuditTrail | null;
  tamperSimulated: boolean;
  executionStatus: Record<StageNumber, ExecutionStatus>;
}
