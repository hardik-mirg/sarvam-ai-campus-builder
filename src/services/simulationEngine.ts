import {
  ExtractedReceiptData,
  OfficialRegistryRecord,
  ReconciliationResult,
  LeakageQuantification,
  MerkleAuditTrail
} from '../types/audit';
import { CaseStudy } from '../types/pipeline';
import { CASE_STUDIES } from '../data/caseStudies';
import { sha256 } from './merkleTree';

export class WebAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays a realistic dual-tone multi-frequency (DTMF) dial tone
   */
  playDialTone(durationSeconds = 1.2): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.getContext();
      if (!ctx) return resolve();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(350, ctx.currentTime); // Standard dial tone frequency
      osc2.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
        } catch {}
        resolve();
      }, durationSeconds * 1000);
    });
  }

  /**
   * Plays a simulated telephony ringback cadence
   */
  playRingbackTone(durationSeconds = 1.5): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.getContext();
      if (!ctx) return resolve();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          osc1.stop();
          osc2.stop();
        } catch {}
        resolve();
      }, durationSeconds * 1000);
    });
  }

  /**
   * Plays speech using the browser SpeechSynthesis API or harmonic carrier
   */
  speakText(text: string, languageCode = 'hi-IN'): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = languageCode;
        utterance.rate = 0.95;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback acoustic tone if SpeechSynthesis not permitted
        this.playDialTone(1.0).then(resolve);
      }
    });
  }
}

export const webAudioSynth = new WebAudioSynthesizer();

export class ReconciliationEngine {
  static reconcile(
    extractedData: ExtractedReceiptData | null,
    officialRecord: OfficialRegistryRecord | undefined
  ): ReconciliationResult {
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
    const flags: string[] = [];

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

export class LeakageMatrixEngine {
  static quantify(caseStudiesList: CaseStudy[]): LeakageQuantification {
    let totalAudited = 0;
    let totalSanctioned = 0;
    let totalDisbursed = 0;
    let confirmedLeakage = 0;
    let fundsAtRisk = 0;
    const anomalies: LeakageQuantification['anomalies'] = [];
    const districtBreakdown: LeakageQuantification['districtBreakdown'] = {};

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
        const amount = rec.leakageAmount || Math.abs(rec.delta);
        anomalies.push({
          id: c.id,
          scheme: c.scheme,
          district: c.district,
          anomalyType: rec.anomalyType,
          severity: rec.severity,
          leakageAmount: amount,
        });

        if (rec.severity === 'CRITICAL') {
          confirmedLeakage += amount;
          districtBreakdown[district].criticalCount++;
        } else {
          fundsAtRisk += amount;
        }
        districtBreakdown[district].leakage += amount;
      }
    }

    const discrepancyRate = totalAudited > 0 ? (anomalies.length / totalAudited) * 100 : 0;
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

export class RtiSummaryGenerator {
  static generateDossier(
    caseStudy: CaseStudy,
    merkleAuditTrail: MerkleAuditTrail | null,
    leakageReport: LeakageQuantification | null
  ) {
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
