import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  FileText,
  ScanLine,
  GitCompare,
  PhoneCall,
  AlertTriangle,
  Lock,
  BarChart3,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Moon,
  Sun,
  UploadCloud,
  ChevronRight,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Key,
  Flame,
  FileCheck2,
  Share2,
  Download,
  Radio,
  Loader2,
  Check,
  Languages
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CASE_STUDIES } from './data/caseStudies';
import { MerkleTreeEngine, sha256Sync } from './services/merkleTree';
import { WebAudioSynthesizer } from './services/simulationEngine';
import { CaseStudy } from './types/pipeline';
import { MerkleAuditTrail } from './types/audit';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedCaseKey, setSelectedCaseKey] = useState<string>('PM_KISAN');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callProgress, setCallProgress] = useState<string>('IDLE');
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [tamperSimulated, setTamperSimulated] = useState<boolean>(false);
  const [customReceiptImage, setCustomReceiptImage] = useState<string | null>(null);

  // Live Sarvam API States
  const [apiOnline, setApiOnline] = useState<boolean>(false);
  const [liveLlmLoading, setLiveLlmLoading] = useState<boolean>(false);
  const [liveLlmOutput, setLiveLlmOutput] = useState<string | null>(null);
  const [liveTtsLoading, setLiveTtsLoading] = useState<boolean>(false);
  const [liveTtsAudioUrl, setLiveTtsAudioUrl] = useState<string | null>(null);
  const [liveTranslateLoading, setLiveTranslateLoading] = useState<boolean>(false);
  const [liveTranslation, setLiveTranslation] = useState<string | null>(null);

  const activeCase: CaseStudy = CASE_STUDIES[selectedCaseKey] || CASE_STUDIES.PM_KISAN;
  const audioSynthRef = useRef<WebAudioSynthesizer | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioSynthRef.current = new WebAudioSynthesizer();
    document.documentElement.setAttribute('data-theme', theme);

    // Check Live Sarvam API connectivity
    fetch('/api/sarvam-live/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'online') {
          setApiOnline(true);
        }
      })
      .catch(() => setApiOnline(false));
  }, [theme]);

  // Handle Merkle computation
  const baseMerkle: MerkleAuditTrail = React.useMemo(() => {
    const leaves = MerkleTreeEngine.createLeafHashes(
      { receiptId: activeCase.id, scheme: activeCase.scheme, amount: activeCase.amounts.paidInSlip },
      activeCase.boundingBoxes,
      activeCase.reconciliation,
      activeCase.ivrCall
    );
    return MerkleTreeEngine.computeTree(leaves);
  }, [activeCase]);

  const [merkleTrail, setMerkleTrail] = useState<MerkleAuditTrail>(baseMerkle);

  useEffect(() => {
    setMerkleTrail(baseMerkle);
    setTamperSimulated(false);
    setIsCalling(false);
    setCallProgress('IDLE');
    setLiveLlmOutput(null);
    setLiveTtsAudioUrl(null);
    setLiveTranslation(null);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
  }, [baseMerkle]);

  const steps = [
    { num: 1, title: 'Capture', icon: FileText, desc: 'Camera / Thermal Slip' },
    { num: 2, title: 'OCR & Mayura', icon: ScanLine, desc: 'Indic Extraction' },
    { num: 3, title: 'Reconciliation', icon: GitCompare, desc: 'DBT Cross-Match' },
    { num: 4, title: 'Voice Verification', icon: PhoneCall, desc: 'Bulbul + Saaras' },
    { num: 5, title: 'Anomaly Matrix', icon: AlertTriangle, desc: 'Leakage Triage' },
    { num: 6, title: 'Merkle Anchoring', icon: Lock, desc: 'Immutable Proof' },
    { num: 7, title: 'Intelligence Report', icon: BarChart3, desc: 'Executive Audit' },
  ];

  // 1. Live Sarvam-105B Call
  const handleRunLiveLlm = async () => {
    setLiveLlmLoading(true);
    try {
      const prompt = `You are a forensic audit AI for Indian Direct Benefit Transfer (DBT) welfare schemes.
Analyze the following optical scan extracted from a beneficiary voucher:
- Scheme: ${activeCase.scheme}
- Raw Beneficiary: ${activeCase.beneficiaryName.raw}
- Amount on Voucher: Rs ${activeCase.amounts.paidInSlip}
- Sanctioned Amount: Rs ${activeCase.reconciliation.sanctionedAmount}
- Date: ${activeCase.payoutDate.raw}
- Taluk / Office: ${activeCase.talukId}
- Biometric state: ${activeCase.biometrics.type} (Duplicate: ${activeCase.biometrics.duplicateDetected})

Extract clean, structured JSON with keys:
"beneficiary_normalized", "scheme", "paid_amount_inr", "sanctioned_amount_inr", "leakage_detected", "leakage_amount_inr", "anomaly_category", "audit_action". Return ONLY valid JSON.`;

      const res = await fetch('/api/sarvam-live/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);
      setLiveLlmOutput(content);
    } catch (e: any) {
      setLiveLlmOutput(`Error calling Sarvam API: ${e.message}`);
    } finally {
      setLiveLlmLoading(false);
    }
  };

  // 2. Live Bulbul TTS Call
  const handlePlayLiveBulbulTTS = async () => {
    setLiveTtsLoading(true);
    try {
      const textToSpeak = activeCase.ivrCall.indicScriptText;
      const lang = activeCase.language || 'hi-IN';

      const res = await fetch('/api/sarvam-live/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          language_code: lang,
        }),
      });

      const data = await res.json();
      if (data.audios && data.audios[0]) {
        const audioSrc = `data:audio/wav;base64,${data.audios[0]}`;
        setLiveTtsAudioUrl(audioSrc);

        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
        }

        const audio = new Audio(audioSrc);
        currentAudioRef.current = audio;
        setAudioPlaying(true);
        audio.onended = () => setAudioPlaying(false);
        audio.onerror = () => setAudioPlaying(false);
        await audio.play();
      } else {
        alert('Could not synthesize audio via Bulbul TTS.');
      }
    } catch (e: any) {
      alert(`Bulbul TTS API Error: ${e.message}`);
    } finally {
      setLiveTtsLoading(false);
    }
  };

  // 3. Live Sarvam Translation Call
  const handleRunLiveTranslate = async () => {
    setLiveTranslateLoading(true);
    try {
      const res = await fetch('/api/sarvam-live/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: activeCase.ivrCall.indicScriptText,
          source_language_code: activeCase.language || 'hi-IN',
          target_language_code: 'en-IN',
        }),
      });
      const data = await res.json();
      if (data.translated_text) {
        setLiveTranslation(data.translated_text);
      }
    } catch (e: any) {
      alert(`Translation API Error: ${e.message}`);
    } finally {
      setLiveTranslateLoading(false);
    }
  };

  // Full Simulated Telephony Call Flow
  const handleSimulateCall = async () => {
    setIsCalling(true);
    setCallProgress('DIALING');
    if (audioSynthRef.current) {
      await audioSynthRef.current.playDialTone(1.0);
    }
    setCallProgress('RINGING');
    if (audioSynthRef.current) {
      await audioSynthRef.current.playRingbackTone(1.2);
    }
    setCallProgress('CONNECTED');

    // Automatically trigger real Bulbul TTS if available
    try {
      await handlePlayLiveBulbulTTS();
    } catch {
      // Fallback
    }

    setCallProgress('COMPLETED');
    setIsCalling(false);
  };

  const handleTamperTest = () => {
    if (!tamperSimulated) {
      const tamperedLeaves = [...merkleTrail.leafHashes];
      tamperedLeaves[1] = sha256Sync('ALTERED_OCR_PAYOUT_RS_9999');
      const tamperedH01 = sha256Sync(tamperedLeaves[0] + tamperedLeaves[1]);
      const tamperedH23 = sha256Sync(tamperedLeaves[2] + tamperedLeaves[3]);
      const tamperedRoot = sha256Sync(tamperedH01 + tamperedH23);

      setMerkleTrail({
        ...merkleTrail,
        leafHashes: tamperedLeaves as [string, string, string, string],
        merkleRoot: tamperedRoot,
        isTampered: true,
        tamperedLeafIndex: 1,
      });
      setTamperSimulated(true);
    } else {
      setMerkleTrail(baseMerkle);
      setTamperSimulated(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)' }}>
      {/* Top Navbar */}
      <header style={{
        borderBottom: '1px solid var(--border-card)',
        backgroundColor: 'var(--bg-surface)',
        padding: '0.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>SARVAM</span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(79, 70, 229, 0.3)'
              }}>
                AUDIT INTELLIGENCE
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                backgroundColor: apiOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: apiOnline ? '#10B981' : '#EF4444',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                border: apiOnline ? '1px solid #10B981' : '1px solid #EF4444',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: apiOnline ? '#10B981' : '#EF4444' }} />
                {apiOnline ? 'LIVE API: Sarvam-105B & Bulbul Active' : 'Connecting to Sarvam API...'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Bharat Payout & Leakage Verification Engine
            </p>
          </div>
        </div>

        {/* Case Study Switcher & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Case:</span>
            <select
              value={selectedCaseKey}
              onChange={(e) => {
                setSelectedCaseKey(e.target.value);
                setCustomReceiptImage(null);
              }}
              style={{
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem 0.75rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="PM_KISAN">🌾 PM-KISAN (Skimming ₹600)</option>
              <option value="LADLI_BEHNA">👩 Ladli Behna (Ghost Account ₹1250)</option>
              <option value="MGNREGA">⚒️ MGNREGA (Duplicate Thumbprint ₹3400)</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Light/Dark Theme"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Pipeline Step Navigator */}
      <nav style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-card)',
        padding: '0.75rem 1.5rem',
        overflowX: 'auto',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          maxWidth: '1300px',
          margin: '0 auto',
        }}>
          {steps.map((st, i) => {
            const Icon = st.icon;
            const isActive = currentStep === st.num;
            const isPassed = currentStep > st.num;
            return (
              <React.Fragment key={st.num}>
                <button
                  onClick={() => setCurrentStep(st.num)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: isActive
                      ? '1px solid var(--color-primary)'
                      : '1px solid transparent',
                    backgroundColor: isActive
                      ? 'var(--color-primary-light)'
                      : isPassed
                      ? 'var(--bg-muted)'
                      : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--text-main)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--color-primary)' : isPassed ? 'var(--color-success)' : 'var(--border-subtle)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {isPassed ? <CheckCircle2 size={14} /> : st.num}
                  </div>
                  <span>{st.title}</span>
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight size={16} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '1.75rem', maxWidth: '1300px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* Banner Alert on Current Case Study */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{activeCase.title}</h2>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: activeCase.reconciliation.severity === 'CRITICAL' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                color: activeCase.reconciliation.severity === 'CRITICAL' ? 'var(--color-danger)' : 'var(--color-warning)',
                border: '1px solid currentColor'
              }}>
                {activeCase.reconciliation.anomalyType}
              </span>
            </div>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Scheme: <strong>{activeCase.scheme}</strong> • Location: <strong>{activeCase.panchayat}, {activeCase.district}, {activeCase.state}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sanctioned vs Disbursed</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                ₹{activeCase.reconciliation.sanctionedAmount.toLocaleString('en-IN')} <span style={{ color: 'var(--text-subtle)' }}>→</span> <span style={{ color: activeCase.reconciliation.delta > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>₹{activeCase.amounts.paidInSlip.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button
              onClick={() => {
                if (currentStep < 7) setCurrentStep(currentStep + 1);
                else setCurrentStep(1);
              }}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {currentStep < 7 ? (
                <>Next: {steps[currentStep].title} <ChevronRight size={16} /></>
              ) : (
                <>Restart Pipeline <RotateCcw size={16} /></>
              )}
            </button>
          </div>
        </div>

        {/* STEP 1: CAPTURE */}
        {currentStep === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--color-primary)" />
                Physical Payout Receipt Slip
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Field voucher captured via basic mobile camera. Simulates thermal fading, handwritten entries, and village council seals.
              </p>

              {/* Simulated Paper Slip Graphic */}
              <div style={{
                backgroundColor: '#FFFDF9',
                color: '#1C1917',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                border: '2px dashed #D6D3D1',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                fontFamily: 'var(--font-mono)',
                position: 'relative',
                overflow: 'hidden',
                margin: '1.5rem 0'
              }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid #E7E5E4', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716C' }}>GOVERNMENT OF INDIA • DBT BENEFICIARY VOUCHER</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.25rem' }}>{activeCase.scheme.toUpperCase()}</div>
                  <div style={{ fontSize: '0.7rem', color: '#A8A29E' }}>TALUK: {activeCase.talukId} • VOUCHER #{activeCase.id.toUpperCase()}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#78716C', fontSize: '0.75rem' }}>BENEFICIARY:</span>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{activeCase.beneficiaryName.raw}</div>
                    <div style={{ fontSize: '0.75rem', color: '#A8A29E' }}>({activeCase.beneficiaryName.standardized})</div>
                  </div>
                  <div>
                    <span style={{ color: '#78716C', fontSize: '0.75rem' }}>DATE ISSUED:</span>
                    <div style={{ fontWeight: 700 }}>{activeCase.payoutDate.raw}</div>
                  </div>
                  <div>
                    <span style={{ color: '#78716C', fontSize: '0.75rem' }}>PAID CASH AMOUNT:</span>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#B91C1C' }}>₹ {activeCase.amounts.paidInSlip.toLocaleString('en-IN')}/-</div>
                  </div>
                  <div>
                    <span style={{ color: '#78716C', fontSize: '0.75rem' }}>SANCTIONED TARGET:</span>
                    <div style={{ fontWeight: 700 }}>₹ {activeCase.reconciliation.sanctionedAmount.toLocaleString('en-IN')}/-</div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #E7E5E4', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#78716C' }}>OFFICER STAMP:</span>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{activeCase.reconciliation.operatorId}</div>
                  </div>
                  <div style={{ textAlign: 'center', border: '1px solid #CBD5E1', padding: '0.4rem 0.8rem', borderRadius: '4px', backgroundColor: '#F8FAFC' }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748B' }}>BENEFICIARY THUMBPRINT</div>
                    <div style={{ fontSize: '1.2rem' }}>🖑</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setCurrentStep(2)}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Proceed to OCR & Extraction →
                </button>
              </div>
            </div>

            {/* Upload Simulator */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>Custom Receipt Ingestion</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Drop any handwritten or printed welfare receipt image. Sarvam Vision / Mayura OCR automatically parses multilingual Indic scripts.
              </p>

              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-app)',
                marginTop: '1.5rem'
              }}>
                <UploadCloud size={40} color="var(--color-primary)" />
                <span style={{ fontWeight: 600, marginTop: '0.75rem' }}>Click or drag receipt photo</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>JPG, PNG or PDF voucher scans</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setCustomReceiptImage(url);
                    }
                  }}
                />
              </label>

              {customReceiptImage && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-success)" />
                  <span>Custom receipt loaded successfully!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: OCR & MAYURA STRUCTURING */}
        {currentStep === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ScanLine size={20} color="var(--color-primary)" />
                Mayura Multilingual Vision OCR
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Bounding box extraction on Indic handwriting, degraded fonts, and thermal paper.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                {activeCase.boundingBoxes.map((b) => (
                  <div key={b.id} style={{
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{b.label}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.15rem' }}>{b.rawText}</div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Script: {b.script}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        backgroundColor: 'var(--color-success-bg)',
                        color: 'var(--color-success)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {Math.round(b.confidence * 100)}% Conf
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="var(--color-primary)" />
                  Sarvam-105B Structured Output
                </h3>
                <button
                  onClick={handleRunLiveLlm}
                  disabled={liveLlmLoading}
                  style={{
                    backgroundColor: '#4F46E5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: liveLlmLoading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {liveLlmLoading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
                  {liveLlmLoading ? 'Querying Sarvam API...' : '⚡ Call Live Sarvam-105B API'}
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0 1rem' }}>
                {liveLlmOutput
                  ? 'Real-time JSON response returned directly from the Sarvam-105B LLM API:'
                  : 'Click the button above to execute a real live API call to Sarvam-105B Conversations:'}
              </p>

              <pre style={{
                backgroundColor: 'var(--bg-app)',
                color: liveLlmOutput ? '#6EE7B7' : '#10B981',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                overflowX: 'auto',
                border: liveLlmOutput ? '1px solid #10B981' : '1px solid var(--border-subtle)',
                lineHeight: 1.5,
                maxHeight: '340px'
              }}>
{liveLlmOutput || JSON.stringify({
  receiptId: activeCase.id,
  scheme: activeCase.scheme,
  beneficiary: {
    rawIndic: activeCase.beneficiaryName.raw,
    normalized: activeCase.beneficiaryName.standardized,
    confidence: activeCase.beneficiaryName.confidence,
  },
  disbursement: {
    sanctionedAmount: activeCase.amounts.sanctionedInSlip,
    paidAmount: activeCase.amounts.paidInSlip,
    currency: 'INR',
    date: activeCase.payoutDate.isoDate,
  },
  talukCode: activeCase.talukId,
  biometricVerification: {
    detected: activeCase.biometrics.detected,
    type: activeCase.biometrics.type,
    duplicateConflict: activeCase.biometrics.duplicateDetected,
  }
}, null, 2)}
              </pre>

              <button
                onClick={() => setCurrentStep(3)}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reconcile with Sanctioned Registry →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RECONCILIATION */}
        {currentStep === 3 && (
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitCompare size={20} color="var(--color-primary)" />
              DBT Welfare Roster Cross-Reconciliation
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Cross-referencing OCR extracted receipt slip against the state sanctioned DBT master list.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              margin: '1.5rem 0'
            }}>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sanctioned Entitlement</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  ₹{activeCase.reconciliation.sanctionedAmount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.25rem' }}>
                  Official State Allocation
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disbursed per Receipt</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  ₹{activeCase.amounts.paidInSlip.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: activeCase.reconciliation.delta > 0 ? 'var(--color-danger)' : 'var(--color-success)', marginTop: '0.25rem' }}>
                  Delta: ₹{activeCase.reconciliation.delta.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anomaly Severity</span>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  marginTop: '0.25rem',
                  color: activeCase.reconciliation.severity === 'CRITICAL' ? 'var(--color-danger)' : 'var(--color-warning)'
                }}>
                  {activeCase.reconciliation.severity}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {activeCase.reconciliation.anomalyType}
                </div>
              </div>
            </div>

            {/* Reconciliation Flags List */}
            <div style={{ backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>System Integrity Flags:</div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {activeCase.reconciliation.delta > 0 && (
                  <li style={{ color: 'var(--color-danger)' }}>
                    Payout shortfall detected: ₹{activeCase.reconciliation.delta} discrepancy between sanctioned target and paper receipt.
                  </li>
                )}
                {activeCase.biometrics.duplicateDetected && (
                  <li style={{ color: 'var(--color-danger)' }}>
                    Duplicate biometric marker: Identical thumbprint found registered under previous slip {activeCase.biometrics.conflictingSlipId}.
                  </li>
                )}
                {activeCase.reconciliation.anomalyType === 'GHOST_BENEFICIARY' && (
                  <li style={{ color: 'var(--color-warning)' }}>
                    Ghost beneficiary flag: Civil registry cross-check indicates identity record anomaly.
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={() => setCurrentStep(4)}
              style={{
                marginTop: '1.5rem',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Trigger Automated Voice Verification Call →
            </button>
          </div>
        )}

        {/* STEP 4: VOICE VERIFICATION */}
        {currentStep === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={20} color="var(--color-primary)" />
                Bulbul TTS & Saaras ASR Call Engine
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Simulates real-time outbound telephone call to beneficiary phone in native vernacular language.
              </p>

              <div style={{
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
                margin: '1.5rem 0'
              }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>DIALER STATUS</div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  margin: '0.5rem 0',
                  color: isCalling ? 'var(--color-warning)' : callProgress === 'COMPLETED' ? 'var(--color-success)' : 'var(--text-main)'
                }}>
                  {callProgress === 'IDLE' && 'Ready to Connect'}
                  {callProgress === 'DIALING' && '📞 Dialing Beneficiary...'}
                  {callProgress === 'RINGING' && '🔔 Ringing (+91 98765 43210)...'}
                  {callProgress === 'CONNECTED' && '🎙️ Call In Progress (Streaming Indic Speech)'}
                  {callProgress === 'COMPLETED' && '✅ Call Completed & Transcribed'}
                </div>

                {audioPlaying && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '1rem 0' }}>
                    {[30, 60, 90, 45, 80, 50, 70, 40, 85].map((h, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: '4px',
                          height: `${h}px`,
                          backgroundColor: 'var(--color-primary)',
                          borderRadius: '2px',
                          animation: 'pulse 1s infinite alternate',
                        }}
                      />
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', marginTop: '1rem' }}>
                  <button
                    onClick={handleSimulateCall}
                    disabled={isCalling}
                    style={{
                      backgroundColor: isCalling ? 'var(--bg-muted)' : 'var(--color-primary)',
                      color: isCalling ? 'var(--text-subtle)' : '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.75rem 1.75rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: isCalling ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <PhoneCall size={18} />
                    {isCalling ? 'Call Active...' : 'Simulate Outbound Call (Bulbul Voice)'}
                  </button>

                  <button
                    onClick={handlePlayLiveBulbulTTS}
                    disabled={liveTtsLoading}
                    style={{
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.5rem 1.25rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: liveTtsLoading ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    {liveTtsLoading ? <Loader2 size={14} className="spin" /> : <Volume2 size={14} />}
                    {liveTtsLoading ? 'Generating via Sarvam Bulbul API...' : '🔊 Play Live Bulbul TTS Audio (Sarvam API)'}
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target Number: <strong>{activeCase.ivrCall.beneficiaryPhone}</strong> • Language: <strong>{activeCase.language}</strong>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Live Vernacular Transcription</h3>
                <button
                  onClick={handleRunLiveTranslate}
                  disabled={liveTranslateLoading}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: liveTranslateLoading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--text-main)'
                  }}
                >
                  <Languages size={14} />
                  {liveTranslateLoading ? 'Translating...' : 'Translate via Sarvam API'}
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.4rem 0 1rem' }}>
                Saaras ASR Indic speech-to-text transcript & Sarvam-105B contradiction detection.
              </p>

              <div style={{
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                marginTop: '1rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>INDIC ASR TRANSCRIPT:</div>
                <p style={{ fontSize: '1rem', fontWeight: 600, margin: '0.5rem 0' }}>
                  "{activeCase.ivrCall.indicScriptText}"
                </p>

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '1rem' }}>
                  ENGLISH TRANSLATION {liveTranslation && <span style={{ color: '#10B981' }}>(Live Sarvam API)</span>}:
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.4rem 0' }}>
                  "{liveTranslation || activeCase.ivrCall.englishTranslation}"
                </p>

                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONTRADICTION CONFIDENCE</span>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-danger)' }}>
                      {Math.round(activeCase.ivrCall.contradictionScore * 100)}% Confirmed Contradiction
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: 'var(--color-danger-bg)',
                    color: 'var(--color-danger)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {activeCase.ivrCall.grievanceCategory}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(5)}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Proceed to Anomaly & Leakage Matrix →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ANOMALY MATRIX */}
        {currentStep === 5 && (
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} color="var(--color-danger)" />
              Leakage Aggregation & Severity Matrix
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Quantification of confirmed leakage, loss categories, and automated triage for vigilance officers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONFIRMED LEAKAGE IN THIS VOUCHER</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '0.25rem' }}>
                  ₹{activeCase.reconciliation.leakageAmount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Siphoned from sanctioned allocation
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OPERATOR / TALUK FLAGGED</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  {activeCase.reconciliation.operatorId}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Taluk: {activeCase.talukId}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AUDIT ACTION STATUS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-warning)', marginTop: '0.25rem' }}>
                  Escalated to Vigilance Cell
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Auto-Notice Drafted for Recovery
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(6)}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Anchor Merkle Audit Trail →
            </button>
          </div>
        )}

        {/* STEP 6: MERKLE ANCHORING */}
        {currentStep === 6 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={20} color="var(--color-primary)" />
                  Cryptographic Merkle DAG
                </h3>
                <button
                  onClick={handleTamperTest}
                  style={{
                    backgroundColor: tamperSimulated ? 'var(--color-danger)' : 'var(--bg-muted)',
                    color: tamperSimulated ? '#fff' : 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {tamperSimulated ? 'Reset Clean State' : 'Simulate 1-Byte Tamper'}
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Every receipt image, Mayura OCR extraction, DBT reconciliation delta, and Saaras call transcript is hashed into an immutable Merkle Root.
              </p>

              {tamperSimulated && (
                <div style={{
                  backgroundColor: 'var(--color-danger-bg)',
                  color: 'var(--color-danger)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  margin: '1rem 0',
                  border: '1px solid var(--color-danger)'
                }}>
                  ⚠️ TAMPER DETECTED: Leaf node [1] OCR text modified in transit. Merkle root mismatch breaks blockchain verification!
                </div>
              )}

              {/* Merkle Visualizer */}
              <div style={{
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                marginTop: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>MERKLE ROOT HASH</div>
                  <div style={{
                    fontWeight: 700,
                    color: tamperSimulated ? 'var(--color-danger)' : 'var(--color-primary)',
                    wordBreak: 'break-all',
                    marginTop: '0.25rem'
                  }}>
                    {merkleTrail.merkleRoot}
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>LEAF NODE HASHES (SHA-256):</div>
                  {merkleTrail.leafHashes.map((h, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.3rem 0',
                      color: tamperSimulated && idx === 1 ? 'var(--color-danger)' : 'var(--text-main)'
                    }}>
                      <span style={{ fontWeight: 600 }}>Leaf [{idx}]:</span>
                      <span style={{ opacity: 0.85 }}>{h.slice(0, 24)}...</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0 }}>Public Auditor QR Verification</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Any auditor, RTI activist, or citizen can scan this code to independently inspect cryptographic proofs.
              </p>

              <div style={{
                display: 'inline-block',
                padding: '1.25rem',
                backgroundColor: '#fff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                margin: '1rem 0'
              }}>
                <QRCodeSVG
                  value={merkleTrail.qrPayload}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                Anchored URL: <a href="#verify" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>{merkleTrail.verificationUrl}</a>
              </div>

              <button
                onClick={() => setCurrentStep(7)}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View Executive Dashboard & Report →
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: EXECUTIVE REPORTING DASHBOARD */}
        {currentStep === 7 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL AUDITED PAYOUTS</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem' }}>14,820</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.25rem' }}>99.4% Automated Verification</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONFIRMED LEAKAGE PREVENTED</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '0.25rem' }}>
                  ₹ 1,84,60,000
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Across 3 Pilot Districts</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AVERAGE RESOLUTION TIME</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                  42 Secs
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>From Photo to Audit Verdict</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BENEFICIARY TRUST INDEX</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>
                  94.8%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Indic Voice IVR Approval Rate</div>
              </div>
            </div>

            {/* Case Studies Summary Table */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Active Welfare Program Discrepancy Registry</h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Continuous AI surveillance across rural disbursement branches.
                  </p>
                </div>
                <button
                  onClick={() => alert('Exporting full tamper-proof audit report (PDF/CSV)...')}
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Download size={14} /> Export RTI Report
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-card)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Program</th>
                      <th style={{ padding: '0.75rem' }}>Beneficiary</th>
                      <th style={{ padding: '0.75rem' }}>Sanctioned</th>
                      <th style={{ padding: '0.75rem' }}>Paid Slip</th>
                      <th style={{ padding: '0.75rem' }}>Confirmed Leakage</th>
                      <th style={{ padding: '0.75rem' }}>Discrepancy Root Cause</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(CASE_STUDIES).map((cs) => (
                      <tr key={cs.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{cs.scheme}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div>{cs.beneficiaryName.raw}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{cs.beneficiaryName.standardized}</div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>₹{cs.reconciliation.sanctionedAmount.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '0.75rem' }}>₹{cs.amounts.paidInSlip.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '0.75rem', color: cs.reconciliation.leakageAmount > 0 ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 700 }}>
                          ₹{cs.reconciliation.leakageAmount.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.75rem' }}>{cs.ivrCall.grievanceCategory}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            backgroundColor: cs.reconciliation.severity === 'CRITICAL' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                            color: cs.reconciliation.severity === 'CRITICAL' ? 'var(--color-danger)' : 'var(--color-warning)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {cs.reconciliation.anomalyType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-card)',
        backgroundColor: 'var(--bg-surface)',
        padding: '1rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        Sarvam AI Infrastructure Platform • Powered by Mayura OCR, Sarvam-105B, Bulbul TTS & Saaras ASR
      </footer>
    </div>
  );
}
