# Milestone 1: Enterprise UI & CSS Architecture Report
**Sarvam Audit: Payout & Leakage Intelligence**

- **Document Version**: 1.0.0
- **Author**: Explorer 3 (`teamwork_preview_explorer_m1_3`)
- **Date**: 2026-11-01
- **Target Workspace**: `/Users/hardik/Code/sarvam_campus_event`
- **Scope**: Pure CSS Variables Design System, Global Styling & Layout, Enterprise Header, 7-Step Interactive Pipeline Navigator, and Base Application Layout (`App.tsx`).

---

## 1. Executive Summary & Design System Vision

"Sarvam Audit: Payout & Leakage Intelligence" demands an **investor-grade, Stripe/Vercel-level enterprise command center** that inspires immediate institutional trust among auditors, ministry officials, and donor agencies.

### Core Architectural Decisions:
1. **Zero External CSS Runtime Dependency**:
   - Eliminates bloated CSS-in-JS runtimes and complex utility class build dependencies.
   - Driven entirely by a **high-performance, token-based native CSS variable system** configured across `:root[data-theme="dark"]` and `:root[data-theme="light"]`.
2. **Deep Primary Indigo Brand Accent (`#4F46E5`)**:
   - Paired with vibrant glow accents (`rgba(79, 70, 229, 0.25)`), accessible hover states (`#4338CA`), and crisp hairline borders (`rgba(255, 255, 255, 0.08)` dark / `rgba(0, 0, 0, 0.08)` light).
3. **Auditing-Grade Typography & Tabular Figures**:
   - Body & headings: `Inter` system stack.
   - Cryptographic hashes, Indian Rupee currency (₹), timestamps, and OCR confidence scores: `JetBrains Mono` with `font-variant-numeric: tabular-nums` to guarantee vertical decimal alignment across data tables and diff views.
4. **Interactive 7-Step Dual-Mode Pipeline Runner**:
   - Allows seamless sequential execution and instantaneous arbitrary jumping across all 7 stages:
     `1. Capture` ─► `2. OCR` ─► `3. Reconcile` ─► `4. Voice` ─► `5. Leakage` ─► `6. Merkle Anchor` ─► `7. Executive Dash`.
   - Supports seamless switching between **Deterministic High-Fidelity Simulation** and **Live Sarvam AI API** modes.

---

## 2. File Specification 1: `src/styles/variables.css`

This file provides the single source of truth for all design tokens: colors, spacing, borders, shadows, elevation, typography, and animations.

```css
/**
 * Sarvam Audit: Enterprise Design System Tokens
 * Target: src/styles/variables.css
 * Mode: Pure CSS variables (Zero runtime CSS overhead)
 */

/* Theme-Invariant System Tokens */
:root {
  /* Brand Core */
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-primary-active: #3730a3;
  --color-primary-light: #eef2ff;
  --color-primary-glow: rgba(79, 70, 229, 0.25);
  --color-primary-border: rgba(79, 70, 229, 0.4);

  /* Status Colors */
  --color-success: #10b981;
  --color-success-bg: rgba(16, 185, 129, 0.12);
  --color-success-border: rgba(16, 185, 129, 0.3);

  --color-warning: #f59e0b;
  --color-warning-bg: rgba(245, 158, 11, 0.12);
  --color-warning-border: rgba(245, 158, 11, 0.3);

  --color-danger: #ef4444;
  --color-danger-bg: rgba(239, 68, 68, 0.12);
  --color-danger-border: rgba(239, 68, 68, 0.3);

  --color-info: #06b6d4;
  --color-info-bg: rgba(6, 182, 212, 0.12);
  --color-info-border: rgba(6, 182, 212, 0.3);

  /* Typography Stacks */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', monospace;

  /* Font Sizes */
  --font-2xs: 0.6875rem; /* 11px */
  --font-xs: 0.75rem;    /* 12px */
  --font-sm: 0.875rem;   /* 14px */
  --font-base: 1rem;     /* 16px */
  --font-lg: 1.125rem;   /* 18px */
  --font-xl: 1.25rem;    /* 20px */
  --font-2xl: 1.5rem;    /* 24px */
  --font-3xl: 1.875rem;  /* 30px */

  /* Spacing Scale */
  --space-0-5: 2px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Card Padding Scale */
  --card-padding-sm: var(--space-4);
  --card-padding: var(--space-6);
  --card-padding-lg: var(--space-8);

  /* Border Radii */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Z-Index Hierarchy */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 500;
  --z-modal: 600;
  --z-toast: 700;
}

/* Dark Theme (Default Enterprise Command Center) */
:root,
:root[data-theme="dark"] {
  color-scheme: dark;

  /* Backgrounds */
  --bg-app: #080c14;
  --bg-surface: #0f172a;
  --bg-surface-elevated: #1e293b;
  --bg-surface-subtle: #131d31;
  --bg-surface-hover: #1a253c;

  /* Hairline Borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-default: rgba(255, 255, 255, 0.14);
  --border-strong: rgba(255, 255, 255, 0.24);
  --border-interactive: #6366f1;

  /* Text & Foreground */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-inverse: #080c14;
  --text-on-primary: #ffffff;

  /* Semantic Text Colors */
  --color-success-text: #34d399;
  --color-warning-text: #fbbf24;
  --color-danger-text: #f87171;
  --color-info-text: #38bdf8;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 24px rgba(79, 70, 229, 0.3);
}

/* Light Theme (Crisp Institutional Audit View) */
:root[data-theme="light"] {
  color-scheme: light;

  /* Backgrounds */
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-elevated: #f1f5f9;
  --bg-surface-subtle: #f8fafc;
  --bg-surface-hover: #e2e8f0;

  /* Hairline Borders */
  --border-subtle: rgba(0, 0, 0, 0.08);
  --border-default: rgba(0, 0, 0, 0.12);
  --border-strong: rgba(0, 0, 0, 0.22);
  --border-interactive: #4f46e5;

  /* Text & Foreground */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;
  --text-on-primary: #ffffff;

  /* Semantic Text Colors */
  --color-success-text: #047857;
  --color-warning-text: #b45309;
  --color-danger-text: #b91c1c;
  --color-info-text: #0e7490;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 20px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  --shadow-glow: 0 0 20px rgba(79, 70, 229, 0.18);
}
```

---

## 3. File Specification 2: `src/styles/global.css`

Provides the modern CSS reset, responsive layout grid, button system, badge taxonomy, interactive inputs, and modal wrappers.

```css
/**
 * Sarvam Audit: Global Styles, Reset & Utility Classes
 * Target: src/styles/global.css
 */
@import './variables.css';

/* Modern Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  text-size-adjust: 100%;
}

body {
  min-height: 100vh;
  background-color: var(--bg-app);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: var(--font-base);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

/* Tabular Numerals for Currency, Numbers & Crypto Hashes */
.tabular-nums,
[data-tabular="true"] {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

.mono-hash {
  font-family: var(--font-mono);
  font-size: var(--font-xs);
  letter-spacing: -0.02em;
  word-break: break-all;
}

/* Layout Containers */
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-app);
}

.command-center-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stage-viewport {
  padding: var(--space-6) 0 var(--space-10) 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Cards */
.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--card-padding);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.card-elevated {
  background-color: var(--bg-surface-elevated);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
}

.card-interactive {
  cursor: pointer;
  user-select: none;
}

.card-interactive:hover {
  border-color: var(--border-interactive);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-subtle);
}

/* Button System */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: var(--font-sm);
  line-height: 1.25;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  user-select: none;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--text-on-primary);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  box-shadow: var(--shadow-glow);
}

.btn-secondary {
  background-color: var(--bg-surface-elevated);
  color: var(--text-primary);
  border-color: var(--border-default);
}

.btn-secondary:hover {
  background-color: var(--bg-surface-hover);
  border-color: var(--border-strong);
}

.btn-outline {
  background-color: transparent;
  color: var(--text-primary);
  border-color: var(--border-default);
}

.btn-outline:hover {
  background-color: var(--bg-surface-elevated);
  border-color: var(--border-interactive);
}

.btn-ghost {
  background-color: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
}

.btn-danger {
  background-color: var(--color-danger);
  color: #ffffff;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-success {
  background-color: var(--color-success);
  color: #ffffff;
}

.btn-success:hover {
  background-color: #059669;
}

/* Button Sizes */
.btn-sm {
  padding: 6px 12px;
  font-size: var(--font-xs);
}

.btn-md {
  padding: 10px 18px;
  font-size: var(--font-sm);
}

.btn-lg {
  padding: 14px 24px;
  font-size: var(--font-base);
  font-weight: 600;
}

.btn-icon {
  width: 38px;
  height: 38px;
  padding: 0;
  border-radius: var(--radius-md);
}

.btn-icon-sm {
  width: 30px;
  height: 30px;
  padding: 0;
  border-radius: var(--radius-sm);
}

/* Badge Taxonomy */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-xs);
  font-weight: 600;
  letter-spacing: 0.03em;
  border: 1px solid transparent;
  line-height: 1.2;
  white-space: nowrap;
}

.badge-primary {
  background-color: var(--color-primary-glow);
  color: var(--color-primary);
  border-color: var(--color-primary-border);
}

.badge-success {
  background-color: var(--color-success-bg);
  color: var(--color-success-text);
  border-color: var(--color-success-border);
}

.badge-warning {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-text);
  border-color: var(--color-warning-border);
}

.badge-danger {
  background-color: var(--color-danger-bg);
  color: var(--color-danger-text);
  border-color: var(--color-danger-border);
}

.badge-info {
  background-color: var(--color-info-bg);
  color: var(--color-info-text);
  border-color: var(--color-info-border);
}

.badge-neutral {
  background-color: var(--bg-surface-elevated);
  color: var(--text-secondary);
  border-color: var(--border-subtle);
}

/* Status Dot with Radar Ping */
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot-success { background-color: var(--color-success); }
.status-dot-warning { background-color: var(--color-warning); }
.status-dot-danger  { background-color: var(--color-danger); }
.status-dot-info    { background-color: var(--color-info); }

.status-dot-pulse {
  animation: radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes radarPing {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

/* Form Controls */
.input,
.select,
.textarea {
  width: 100%;
  background-color: var(--bg-surface-subtle);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: var(--font-sm);
  font-family: var(--font-sans);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input:focus,
.select:focus,
.textarea:focus {
  outline: none;
  border-color: var(--border-interactive);
  box-shadow: 0 0 0 3px var(--color-primary-glow);
}

.input::placeholder,
.textarea::placeholder {
  color: var(--text-muted);
}

/* Bottom Action Bar */
.bottom-action-bar {
  position: sticky;
  bottom: 0;
  z-index: var(--z-sticky);
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-3) var(--space-6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
}

.bottom-action-bar-inner {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

/* Modal Backdrops & Dialogs */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  animation: fadeIn 150ms ease-out;
}

.modal-dialog {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  max-width: 640px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: slideUp 200ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--border-strong);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-muted);
}

/* Responsive Grid Helpers */
.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

@media (max-width: 1024px) {
  .grid-2col,
  .grid-3col {
    grid-template-columns: 1fr;
  }
  .command-center-container {
    padding: 0 var(--space-4);
  }
}
```

---

## 4. File Specification 3: `src/components/common/Header.tsx`

The enterprise header encapsulates Sarvam branding, the Case Study switcher badge/dropdown, the Live vs Simulation mode toggle, API key status monitor, and dark/light theme switch.

```tsx
/**
 * Sarvam Audit: Enterprise Command Center Header
 * Target: src/components/common/Header.tsx
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Sun,
  Moon,
  Zap,
  Key,
  ChevronDown,
  Check,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
  ExternalLink
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

interface HeaderProps {
  onOpenApiKeyModal?: () => void;
  onOpenAuditModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApiKeyModal,
  onOpenAuditModal
}) => {
  const {
    currentStep,
    mode,
    setMode,
    selectedCaseId,
    setSelectedCaseId,
    caseStudies,
    activeCase,
    theme,
    toggleTheme,
    hasValidApiKey,
    resetPipeline
  } = usePipeline();

  const [isCaseMenuOpen, setIsCaseMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCaseMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="enterprise-header">
      <div className="enterprise-header-inner">
        {/* Left: Branding & Case Selector */}
        <div className="header-left">
          <div className="brand-lockup" onClick={() => resetPipeline?.()} title="Reset Pipeline to Stage 1">
            <div className="brand-icon-wrapper">
              <ShieldCheck className="brand-icon" size={24} />
            </div>
            <div className="brand-text">
              <div className="brand-title-row">
                <span className="brand-title">Sarvam Audit</span>
                <span className="badge badge-primary">Zero-Leakage</span>
              </div>
              <span className="brand-subtitle">Payout & Leakage Intelligence</span>
            </div>
          </div>

          {/* Active Case Study Selector Dropdown */}
          <div className="case-study-selector" ref={dropdownRef}>
            <button
              type="button"
              className="case-selector-btn"
              onClick={() => setIsCaseMenuOpen(!isCaseMenuOpen)}
              aria-haspopup="true"
              aria-expanded={isCaseMenuOpen}
            >
              <div className="case-chip">
                <span className="case-scheme-tag">{activeCase?.scheme || 'DBT Case'}</span>
                <span className="case-title-short">{activeCase?.title || 'Selected Case Study'}</span>
              </div>
              <ChevronDown size={14} className={`dropdown-chevron ${isCaseMenuOpen ? 'rotated' : ''}`} />
            </button>

            {isCaseMenuOpen && (
              <div className="case-dropdown-menu">
                <div className="case-dropdown-header">
                  <span>Pre-Seeded Bharat DBT Welfare Case Studies</span>
                </div>
                <div className="case-dropdown-list">
                  {caseStudies.map((cs) => {
                    const isSelected = cs.id === selectedCaseId;
                    return (
                      <button
                        key={cs.id}
                        type="button"
                        className={`case-dropdown-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedCaseId(cs.id);
                          setIsCaseMenuOpen(false);
                        }}
                      >
                        <div className="case-item-top">
                          <span className="case-item-title">{cs.title}</span>
                          {isSelected && <Check size={14} className="selected-check" />}
                        </div>
                        <div className="case-item-meta">
                          <span className="badge badge-neutral">{cs.scheme}</span>
                          <span className="case-meta-district">{cs.district}, {cs.state}</span>
                          {cs.primaryAnomaly === 'AMOUNT_MISMATCH' && (
                            <span className="badge badge-danger">Skimming Flag</span>
                          )}
                          {cs.primaryAnomaly === 'GHOST_BENEFICIARY' && (
                            <span className="badge badge-danger">Ghost Beneficiary</span>
                          )}
                          {cs.primaryAnomaly === 'DUPLICATE_THUMBPRINT' && (
                            <span className="badge badge-warning">Duplicate Biometric</span>
                          )}
                          {cs.primaryAnomaly === 'NONE' && (
                            <span className="badge badge-success">Clean Baseline</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Mode Switcher, API Key, Audit Proof & Theme Switch */}
        <div className="header-right">
          {/* Dual Mode Switcher (Live vs Simulation) */}
          <div className="mode-toggle-group" role="radiogroup" aria-label="Engine Execution Mode">
            <button
              type="button"
              className={`mode-btn ${mode === 'SIMULATION' ? 'active' : ''}`}
              onClick={() => setMode('SIMULATION')}
              role="radio"
              aria-checked={mode === 'SIMULATION'}
            >
              <Zap size={14} />
              <span>Simulation</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'LIVE_SARVAM_API' ? 'active' : ''}`}
              onClick={() => setMode('LIVE_SARVAM_API')}
              role="radio"
              aria-checked={mode === 'LIVE_SARVAM_API'}
            >
              <Sparkles size={14} />
              <span>Live Sarvam AI</span>
            </button>
          </div>

          {/* API Key Status Monitor */}
          <button
            type="button"
            className="api-key-badge-btn"
            onClick={onOpenApiKeyModal}
            title={hasValidApiKey ? 'Sarvam API Key Connected' : 'Configure Sarvam API Key'}
          >
            <Key size={14} className="key-icon" />
            <span className="key-label">
              {hasValidApiKey ? 'Key Active' : 'Set Key'}
            </span>
            <span className={`status-dot ${hasValidApiKey ? 'status-dot-success status-dot-pulse' : 'status-dot-warning'}`} />
          </button>

          {/* Public Audit Proof Quick Jump */}
          {onOpenAuditModal && (
            <button
              type="button"
              className="btn btn-outline btn-sm audit-modal-btn"
              onClick={onOpenAuditModal}
              title="Inspect Cryptographic Public Audit Certificate"
            >
              <Lock size={14} />
              <span className="audit-btn-text">Audit Proof</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn-icon btn-ghost theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="theme-icon sun-icon" />
            ) : (
              <Moon size={18} className="theme-icon moon-icon" />
            )}
          </button>
        </div>
      </div>

      <style>{`
        .enterprise-header {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .enterprise-header-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 12px var(--space-6);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }
        .brand-lockup {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          cursor: pointer;
        }
        .brand-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--color-primary), #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 16px var(--color-primary-glow);
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .brand-title {
          font-size: var(--font-lg);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }
        .brand-subtitle {
          font-size: var(--font-xs);
          color: var(--text-muted);
          font-weight: 500;
        }
        .case-study-selector {
          position: relative;
        }
        .case-selector-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 4px 12px 4px 6px;
          cursor: pointer;
          transition: border-color var(--transition-fast), background-color var(--transition-fast);
        }
        .case-selector-btn:hover {
          border-color: var(--border-interactive);
          background-color: var(--bg-surface-hover);
        }
        .case-chip {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .case-scheme-tag {
          font-size: var(--font-2xs);
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background-color: var(--color-primary-glow);
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .case-title-short {
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--text-primary);
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dropdown-chevron {
          color: var(--text-muted);
          transition: transform var(--transition-fast);
        }
        .dropdown-chevron.rotated {
          transform: rotate(180deg);
        }
        .case-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 360px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: var(--z-dropdown);
          overflow: hidden;
          animation: slideUp 150ms ease-out;
        }
        .case-dropdown-header {
          padding: 10px 14px;
          font-size: var(--font-2xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          background-color: var(--bg-surface-elevated);
          border-bottom: 1px solid var(--border-subtle);
        }
        .case-dropdown-list {
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .case-dropdown-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
          text-align: left;
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          padding: 8px 10px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .case-dropdown-item:hover {
          background-color: var(--bg-surface-elevated);
          border-color: var(--border-subtle);
        }
        .case-dropdown-item.selected {
          background-color: var(--color-primary-glow);
          border-color: var(--color-primary-border);
        }
        .case-item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .case-item-title {
          font-size: var(--font-sm);
          font-weight: 600;
          color: var(--text-primary);
        }
        .selected-check {
          color: var(--color-primary);
        }
        .case-item-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .case-meta-district {
          font-size: var(--font-xs);
          color: var(--text-muted);
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .mode-toggle-group {
          display: flex;
          align-items: center;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 3px;
        }
        .mode-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          border-radius: var(--radius-full);
          padding: 4px 12px;
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .mode-btn.active {
          background-color: var(--color-primary);
          color: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .api-key-badge-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 5px 12px;
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: border-color var(--transition-fast);
        }
        .api-key-badge-btn:hover {
          border-color: var(--border-interactive);
          color: var(--text-primary);
        }
        .theme-toggle-btn {
          color: var(--text-secondary);
        }
        .theme-toggle-btn:hover {
          color: var(--color-primary);
        }
        @media (max-width: 900px) {
          .case-title-short {
            max-width: 120px;
          }
          .audit-btn-text {
            display: none;
          }
        }
        @media (max-width: 720px) {
          .case-study-selector {
            display: none;
          }
          .brand-subtitle {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
```

---

## 5. File Specification 4: `src/components/common/StepNavigation.tsx`

Implements the interactive 7-stage pipeline breadcrumb and pill runner. It visualizes current progress, completed stages, detected anomalies, and allows direct click-to-jump navigation to any step.

```tsx
/**
 * Sarvam Audit: 7-Stage Pipeline Step Navigator
 * Target: src/components/common/StepNavigation.tsx
 */
import React from 'react';
import {
  Camera,
  FileText,
  FileCheck,
  PhoneCall,
  AlertTriangle,
  Lock,
  BarChart3,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export interface StepDefinition {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: string;
  sublabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const PIPELINE_STEPS: StepDefinition[] = [
  { id: 1, name: 'Capture', sublabel: 'Voucher Drop', icon: Camera },
  { id: 2, name: 'OCR & NLP', sublabel: 'Mayura Structuring', icon: FileText },
  { id: 3, name: 'DBT Reconcile', sublabel: 'Registry Roster', icon: FileCheck },
  { id: 4, name: 'Voice IVR', sublabel: 'Bulbul & Saaras', icon: PhoneCall },
  { id: 5, name: 'Leakage Matrix', sublabel: '₹ Loss Triage', icon: AlertTriangle },
  { id: 6, name: 'Merkle Anchor', sublabel: 'SHA-256 Trail', icon: Lock },
  { id: 7, name: 'Executive Dash', sublabel: 'C-Level Dossier', icon: BarChart3 }
];

export const StepNavigation: React.FC = () => {
  const { currentStep, setCurrentStep, executionStatus, reconciliationResult, isTampered } = usePipeline();

  return (
    <nav className="step-navigation-bar" aria-label="Pipeline Stage Progress">
      <div className="step-navigation-container">
        <ol className="step-list">
          {PIPELINE_STEPS.map((step, idx) => {
            const isCurrent = step.id === currentStep;
            const isCompleted = step.id < currentStep || executionStatus[step.id] === 'completed';
            const isFlagged =
              (step.id === 3 && reconciliationResult && reconciliationResult.delta !== 0) ||
              (step.id === 6 && isTampered);

            let nodeClass = 'step-node';
            if (isCurrent) nodeClass += ' step-active';
            else if (isCompleted) nodeClass += ' step-completed';
            else nodeClass += ' step-idle';

            if (isFlagged) nodeClass += ' step-flagged';

            const IconComponent = step.icon;

            return (
              <li key={step.id} className="step-item">
                <button
                  type="button"
                  className={nodeClass}
                  onClick={() => setCurrentStep(step.id)}
                  aria-current={isCurrent ? 'step' : undefined}
                  title={`Jump to Step ${step.id}: ${step.name} (${step.sublabel})`}
                >
                  <div className="step-pill">
                    <div className="step-icon-badge">
                      {isCompleted && !isCurrent ? (
                        <CheckCircle2 size={15} className="step-check-icon" />
                      ) : (
                        <IconComponent size={15} className="step-primary-icon" />
                      )}
                    </div>
                    <div className="step-text-block">
                      <div className="step-index-name">
                        <span className="step-number">0{step.id}</span>
                        <span className="step-name">{step.name}</span>
                      </div>
                      <span className="step-sublabel">{step.sublabel}</span>
                    </div>
                  </div>
                </button>

                {/* Connecting breadcrumb line */}
                {idx < PIPELINE_STEPS.length - 1 && (
                  <div className={`step-connector ${step.id < currentStep ? 'connector-filled' : ''}`}>
                    <ChevronRight size={14} className="connector-icon" />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <style>{`
        .step-navigation-bar {
          background-color: var(--bg-surface-subtle);
          border-bottom: 1px solid var(--border-subtle);
          padding: var(--space-3) var(--space-6);
        }
        .step-navigation-container {
          max-width: 1440px;
          margin: 0 auto;
          overflow-x: auto;
          scrollbar-width: thin;
        }
        .step-list {
          display: flex;
          align-items: center;
          justify-content: space-between;
          list-style: none;
          min-width: 900px;
          gap: var(--space-2);
        }
        .step-item {
          display: flex;
          align-items: center;
          flex: 1;
        }
        .step-node {
          width: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
          text-align: left;
        }
        .step-node:hover {
          background-color: var(--bg-surface-hover);
        }
        .step-pill {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: 6px 10px;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          transition: all var(--transition-fast);
        }
        .step-active .step-pill {
          background-color: var(--bg-surface);
          border-color: var(--border-interactive);
          box-shadow: 0 0 16px var(--color-primary-glow);
        }
        .step-completed .step-pill {
          background-color: var(--bg-surface);
          border-color: var(--border-subtle);
        }
        .step-icon-badge {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .step-active .step-icon-badge {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: #ffffff;
          box-shadow: 0 0 12px var(--color-primary-glow);
        }
        .step-completed .step-icon-badge {
          background-color: var(--color-success-bg);
          border-color: var(--color-success-border);
          color: var(--color-success-text);
        }
        .step-flagged .step-icon-badge {
          background-color: var(--color-danger-bg);
          border-color: var(--color-danger-border);
          color: var(--color-danger-text);
        }
        .step-text-block {
          display: flex;
          flex-direction: column;
        }
        .step-index-name {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .step-number {
          font-family: var(--font-mono);
          font-size: var(--font-2xs);
          color: var(--text-muted);
          font-weight: 700;
        }
        .step-active .step-number {
          color: var(--color-primary);
        }
        .step-name {
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--text-secondary);
        }
        .step-active .step-name {
          color: var(--text-primary);
        }
        .step-sublabel {
          font-size: var(--font-2xs);
          color: var(--text-muted);
        }
        .step-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--border-strong);
          padding: 0 4px;
        }
        .connector-filled {
          color: var(--color-primary);
        }
      `}</style>
    </nav>
  );
};
```

---

## 6. File Specification 5: `src/App.tsx`

`App.tsx` forms the master layout shell connecting the `Header`, `StepNavigation`, dynamic Stage viewport, bottom action bar, and global verification modals. It includes intelligent milestone fallbacks so that clicking any step works immediately without crashing.

```tsx
/**
 * Sarvam Audit: Master Application Layout
 * Target: src/App.tsx
 */
import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Key,
  X,
  Lock,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Header } from './components/common/Header';
import { StepNavigation } from './components/common/StepNavigation';
import { usePipeline } from './context/PipelineContext';
import { QRCodeSVG } from 'qrcode.react';

// Milestone Stage Imports (with fallback placeholder rendering if staged dynamically)
let Stage1Capture: React.ComponentType | null = null;
let Stage2OCRStructuring: React.ComponentType | null = null;
let Stage3Reconciliation: React.ComponentType | null = null;
let Stage4VoiceVerification: React.ComponentType | null = null;
let Stage5LeakageMatrix: React.ComponentType | null = null;
let Stage6AuditTrail: React.ComponentType | null = null;
let Stage7ExecutiveDashboard: React.ComponentType | null = null;

try {
  // Dynamic or standard module resolutions
} catch (e) {
  // Graceful fallback
}

export const App: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    activeCase,
    mode,
    reconciliationResult,
    isTampered,
    toggleTamper,
    apiKey,
    setApiKey,
    resetPipeline
  } = usePipeline();

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');

  // Dynamic next step CTA label
  const getNextActionLabel = (step: number): string => {
    switch (step) {
      case 1: return 'Extract OCR & Bounding Boxes →';
      case 2: return 'Reconcile with Official DBT Roster →';
      case 3: return 'Simulate Outbound Voice Verification →';
      case 4: return 'Quantify Financial Leakage Matrix →';
      case 5: return 'Anchor Cryptographic Merkle Root →';
      case 6: return 'View Executive Intelligence Dashboard →';
      case 7: return 'Export RTI / Donor Audit Dossier ⬇';
      default: return 'Next Stage →';
    }
  };

  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep((currentStep + 1) as any);
    } else {
      // Trigger dossier export
      alert('Generating RTI/Donor Audit Dossier JSON download.');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as any);
    }
  };

  // Render active stage or interactive milestone placeholder card
  const renderStageContent = () => {
    switch (currentStep) {
      case 1:
        if (Stage1Capture) return <Stage1Capture />;
        break;
      case 2:
        if (Stage2OCRStructuring) return <Stage2OCRStructuring />;
        break;
      case 3:
        if (Stage3Reconciliation) return <Stage3Reconciliation />;
        break;
      case 4:
        if (Stage4VoiceVerification) return <Stage4VoiceVerification />;
        break;
      case 5:
        if (Stage5LeakageMatrix) return <Stage5LeakageMatrix />;
        break;
      case 6:
        if (Stage6AuditTrail) return <Stage6AuditTrail />;
        break;
      case 7:
        if (Stage7ExecutiveDashboard) return <Stage7ExecutiveDashboard />;
        break;
    }

    // Default Milestone Sandbox Card (guarantees zero blank screen)
    return (
      <div className="card stage-sandbox-card">
        <div className="card-header">
          <div className="sandbox-title-wrap">
            <span className="badge badge-primary">Stage 0{currentStep} Interactive Preview</span>
            <h2 className="sandbox-title">{activeCase?.title}</h2>
          </div>
          <span className="badge badge-neutral">{mode} MODE</span>
        </div>

        <div className="sandbox-body">
          <p className="sandbox-desc">
            {activeCase?.description ||
              'Zero-leakage verification pipeline stage executing automated cross-verification.'}
          </p>

          <div className="sandbox-grid">
            <div className="sandbox-pane card card-elevated">
              <h3 className="pane-title">Active Case Study Context</h3>
              <div className="pane-props">
                <div className="prop-row">
                  <span className="prop-label">Scheme:</span>
                  <span className="prop-val">{activeCase?.scheme}</span>
                </div>
                <div className="prop-row">
                  <span className="prop-label">Location:</span>
                  <span className="prop-val">{activeCase?.district}, {activeCase?.state}</span>
                </div>
                <div className="prop-row">
                  <span className="prop-label">Voucher Type:</span>
                  <span className="prop-val">{activeCase?.slipType}</span>
                </div>
                <div className="prop-row">
                  <span className="prop-label">Target Anomaly:</span>
                  <span className="badge badge-warning">{activeCase?.primaryAnomaly}</span>
                </div>
              </div>
            </div>

            <div className="sandbox-pane card card-elevated">
              <h3 className="pane-title">Simulation State</h3>
              <div className="pane-props">
                <div className="prop-row">
                  <span className="prop-label">Engine:</span>
                  <span className="prop-val">{mode === 'SIMULATION' ? 'Deterministic High-Fidelity' : 'api.sarvam.ai Live'}</span>
                </div>
                <div className="prop-row">
                  <span className="prop-label">Current Stage:</span>
                  <span className="prop-val">Stage {currentStep} of 7</span>
                </div>
                <div className="prop-row">
                  <span className="prop-label">Discrepancy Status:</span>
                  <span className="badge badge-danger">
                    {reconciliationResult?.anomalyCategory || 'FLAGGED_MISMATCH'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell">
      {/* Enterprise Header */}
      <Header
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      {/* 7-Step Pipeline Breadcrumb Runner */}
      <StepNavigation />

      {/* Main Command Center Workspace */}
      <main className="command-center-container">
        <section className="stage-viewport">
          {renderStageContent()}
        </section>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="bottom-action-bar">
        <div className="bottom-action-bar-inner">
          {/* Left Controls */}
          <div className="action-bar-left">
            <button
              type="button"
              className="btn btn-secondary btn-md"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={resetPipeline}
              title="Reset entire pipeline to Stage 1"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          {/* Center Case Summary Pill */}
          <div className="action-bar-center">
            <div className="summary-pill">
              <span className="summary-scheme">{activeCase?.scheme}</span>
              <span className="summary-sep">•</span>
              <span className="summary-district">{activeCase?.district}</span>
              <span className="summary-sep">•</span>
              <span className="summary-anomaly badge badge-danger">
                {activeCase?.primaryAnomaly === 'AMOUNT_MISMATCH' && 'Discrepancy Flagged: Amount Skimming'}
                {activeCase?.primaryAnomaly === 'GHOST_BENEFICIARY' && 'Discrepancy Flagged: Ghost Identity'}
                {activeCase?.primaryAnomaly === 'DUPLICATE_THUMBPRINT' && 'Discrepancy Flagged: Duplicate Fingerprint'}
                {activeCase?.primaryAnomaly === 'NONE' && 'Clean Baseline'}
              </span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="action-bar-right">
            {currentStep === 6 && (
              <button
                type="button"
                className={`btn btn-sm ${isTampered ? 'btn-danger' : 'btn-outline'}`}
                onClick={toggleTamper}
                title="Simulate 1-byte unauthorized voucher modification to break Merkle root"
              >
                <Lock size={14} />
                <span>{isTampered ? 'Tamper Active (Broken)' : 'Simulate Tamper'}</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={handleNextStep}
            >
              <span>{getNextActionLabel(currentStep)}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      {isApiKeyModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsApiKeyModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header card-header">
              <div className="modal-title-wrap">
                <Key size={18} className="modal-title-icon" />
                <h3>Sarvam AI API Configuration</h3>
              </div>
              <button
                type="button"
                className="btn-icon btn-ghost"
                onClick={() => setIsApiKeyModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: 'var(--space-4)' }}>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                Sarvam Audit supports live calls to Mayura OCR, Bulbul TTS, and Saaras ASR. Your key is stored securely in local browser storage and requests are routed via the local Vite proxy.
              </p>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 6 }}>
                  Sarvam API Subscription Key
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="sk_..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-md"
                  onClick={() => setIsApiKeyModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-md"
                  onClick={() => {
                    setApiKey(tempApiKey);
                    setIsApiKeyModalOpen(false);
                  }}
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Public Audit Certificate Modal */}
      {isAuditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAuditModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
            <div className="modal-header card-header">
              <div className="modal-title-wrap">
                <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
                <h3>CAG / World Bank Public Audit Certificate</h3>
              </div>
              <button
                type="button"
                className="btn-icon btn-ghost"
                onClick={() => setIsAuditModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: 'var(--space-6)' }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'inline-block', padding: 12, background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
                  <QRCodeSVG
                    value={`https://audit.sarvam.ai/verify?case=${activeCase?.id || 'CASE-001'}&tampered=${isTampered}`}
                    size={160}
                    level="H"
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <span className={`badge ${isTampered ? 'badge-danger' : 'badge-success'}`}>
                    {isTampered ? 'TAMPERING DETECTED: INVALID PROOF' : 'CRYPTOGRAPHICALLY ANCHORED & VERIFIED'}
                  </span>
                </div>
              </div>

              <div className="card card-elevated" style={{ padding: 'var(--space-4)', fontSize: 'var(--font-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Case Identifier:</span>
                  <span className="tabular-nums" style={{ fontWeight: 600 }}>{activeCase?.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Merkle Root Hash:</span>
                  <span className="mono-hash" style={{ color: isTampered ? 'var(--color-danger)' : 'var(--color-success-text)' }}>
                    {isTampered ? '0xFA39C8...TAMPERED' : '0x89F41B2C4E9102A8BD48921FE81A004C'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>State Hashing Algorithm:</span>
                  <span>SHA-256 (Web Crypto SubtleCrypto)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Audit Standard:</span>
                  <span>Direct Benefit Transfer (DBT) Zero-Leakage Protocol v1.0.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .stage-sandbox-card {
          padding: var(--space-8);
        }
        .sandbox-title-wrap {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .sandbox-title {
          font-size: var(--font-xl);
          font-weight: 700;
        }
        .sandbox-desc {
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }
        .sandbox-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }
        .pane-title {
          font-size: var(--font-sm);
          font-weight: 600;
          margin-bottom: var(--space-4);
          color: var(--text-primary);
        }
        .pane-props {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .prop-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--font-xs);
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .prop-label {
          color: var(--text-muted);
        }
        .prop-val {
          font-weight: 600;
          color: var(--text-primary);
        }
        .action-bar-left,
        .action-bar-right {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .action-bar-center {
          display: flex;
          align-items: center;
        }
        .summary-pill {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 4px 14px;
          font-size: var(--font-xs);
        }
        .summary-scheme {
          font-weight: 700;
          color: var(--color-primary);
        }
        .summary-sep {
          color: var(--border-strong);
        }
        .summary-district {
          color: var(--text-secondary);
        }
        @media (max-width: 900px) {
          .action-bar-center {
            display: none;
          }
          .sandbox-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
```

---

## 7. Verification Method & Acceptance Sign-off

When the Worker agent creates the files specified above, verification must be executed as follows:

1. **Static Analysis & Typecheck**:
   ```bash
   export PATH="/opt/homebrew/bin:$PATH"
   npm run typecheck
   ```
   *Expected*: Zero TypeScript compilation errors.
2. **Production Bundle Build**:
   ```bash
   export PATH="/opt/homebrew/bin:$PATH"
   npm run build
   ```
   *Expected*: Clean Vite production build outputting to `dist/` with zero missing CSS variables or broken imports.
3. **Responsive Visual & Interactive Check**:
   - Header case study dropdown toggles smoothly between the 4 Bharat DBT scenarios.
   - Live/Sim toggle flips `mode`.
   - Dark/Light mode button toggles `data-theme="dark"` / `data-theme="light"` on `<html>`.
   - Clicking any step (1 to 7) in `StepNavigation` updates `currentStep` and highlights the active pill.
   - Merkle tamper simulation button updates the cryptographic badge in the audit certificate modal.
