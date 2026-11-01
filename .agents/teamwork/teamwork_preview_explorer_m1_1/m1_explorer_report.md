# Milestone 1: Project Setup & Tooling Architecture Report

**Document Version**: 1.0.0  
**Date**: 2026-11-01  
**Investigator**: Explorer 1 (`teamwork_preview_explorer_m1_1`)  
**Project**: *Sarvam Audit: Payout & Leakage Intelligence*  
**Workspace**: `/Users/hardik/Code/sarvam_campus_event`  
**Target Milestone**: Milestone 1 (Project Setup & Core Tooling)

---

## 1. Executive Summary

This report establishes the complete, production-ready specification for scaffolding the **React 18.3 + TypeScript + Vite** application in the root workspace `/Users/hardik/Code/sarvam_campus_event`. 

Key findings from empirical dry-runs and codebase inspection:
1. **Host Environment**: Node.js `v24.17.0` and npm `11.13.0` are located at `/opt/homebrew/bin/`. Every worker subshell execution MUST include `export PATH="/opt/homebrew/bin:$PATH"`.
2. **Network Sandbox**: Outbound network operations (`npm install`) require `BypassSandbox: true`.
3. **Dependency Compatibility**: An empirical `npm install --dry-run` succeeded with zero peer dependency conflicts, installing 75 packages cleanly in 9 seconds.
4. **Vite & Proxy Architecture**: Vite 6 with `@vitejs/plugin-react` 4, configured with path alias `@/* -> ./src/*`, local reverse proxy at `/api/sarvam` rewriting to `https://api.sarvam.ai`, port 5173, and automatic extraction of `SARVAM_API_KEY` from `.env` via `loadEnv()`.
5. **TypeScript Configuration**: Strict TypeScript 5 with `moduleResolution: "bundler"`, `target: "ES2022"`, `module: "ESNext"`, `jsx: "react-jsx"`, and `baseUrl` path mapping.

---

## 2. Workspace File Structure Specification

Worker 1 will initialize the root workspace according to this exact layout:

```
/Users/hardik/Code/sarvam_campus_event/
├── package.json              # App manifest, dependencies & scripts
├── vite.config.ts            # Vite 6 config: React plugin, proxy, alias, env define
├── tsconfig.json             # Unified strict TypeScript bundler configuration
├── index.html                # HTML entrypoint with anti-FOUC theme script & Inter font
├── .gitignore                # Git ignore rules (node_modules, dist, .env, etc.)
├── .env                      # Existing file containing SARVAM_API_KEY (preserved)
├── src/
│   ├── vite-env.d.ts         # Vite client type declarations & env interfaces
│   ├── main.tsx              # React 18.3 createRoot entrypoint
│   ├── App.tsx               # Base layout shell (coordinated with M1 Explorer 3)
│   ├── styles/
│   │   ├── variables.css     # CSS tokens (coordinated with M1 Explorer 3)
│   │   └── global.css        # Global CSS & reset (coordinated with M1 Explorer 3)
│   ├── types/                # Types directory (populated by M1 Explorer 2)
│   ├── services/             # Service adapters (populated by M1 Explorer 2)
│   ├── context/              # Pipeline state machine (populated by M1 Explorer 2)
│   ├── data/                 # Fixtures & registries (populated by M1 Explorer 2)
│   └── components/
│       ├── common/           # Common components (Header, Nav, etc.)
│       ├── stage1_capture/   # Stage 1 components
│       ├── stage2_ocr/       # Stage 2 components
│       ├── stage3_reconcile/ # Stage 3 components
│       ├── stage4_voice/     # Stage 4 components
│       ├── stage5_leakage/   # Stage 5 components
│       ├── stage6_anchoring/ # Stage 6 components
│       └── stage7_dashboard/ # Stage 7 components
└── tests/
    ├── e2e/                  # Opaque-box test suites (by E2E track)
    └── runner/               # Test runner scripts
```

---

## 3. Concrete File Contents & Configurations

### 3.1 `package.json`

The root `package.json` preserves the existing `sarvamai: ^1.1.14` package and adds all required dependencies for React 18.3, icons, QR codes, confetti, and TypeScript build tooling.

```json
{
  "name": "sarvam-audit",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "lucide-react": "^1.66.0",
    "qrcode.react": "^4.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "sarvamai": "^1.1.14"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "@types/node": "^22.13.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.2.0"
  }
}
```

#### Package Selection Rationale:
- `react` & `react-dom` `^18.3.1`: The golden-standard production release of React 18, offering stable transitions, `useId`, and concurrent rendering without experimental React 19 breaking changes.
- `lucide-react` `^1.66.0`: Comprehensive SVG iconography (Shield, FileText, Phone, Mic, RefreshCw, QrCode, Sparkles, BarChart3, AlertTriangle, Fingerprint).
- `qrcode.react` `^4.2.0`: Provides `<QRCodeSVG>` and `<QRCodeCanvas>` components with built-in TypeScript definitions for Stage 6 immutable audit trail QR generation.
- `canvas-confetti` `^1.9.4` + `@types/canvas-confetti` `^1.9.0`: Lightweight, zero-dependency celebration animation triggered upon successful cryptographic sealing of audit receipts.
- `sarvamai` `^1.1.14`: Retained for official SDK typings and fallback server-side Node invocation.
- `vite` `^6.2.0` + `@vitejs/plugin-react` `^4.3.4`: Fast HMR, optimized production rollup build, and seamless JSX transformation.
- `@types/node` `^22.13.0`: Guarantees seamless Node API resolution in `vite.config.ts` without compiler warnings.

---

### 3.2 `vite.config.ts`

The Vite configuration provides:
1. React Fast Refresh plugin via `@vitejs/plugin-react`.
2. Path alias `@` mapped directly to `./src`.
3. Development proxy mapping `/api/sarvam` to `https://api.sarvam.ai` (rewriting prefix).
4. Environment variable bridging: reads `SARVAM_API_KEY` from `.env` using `loadEnv(mode, process.cwd(), '')` and injects `import.meta.env.VITE_SARVAM_API_KEY`.
5. Local dev server bound to port 5173 with `host: true`.

```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_SARVAM_API_KEY || env.SARVAM_API_KEY || '';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      'import.meta.env.VITE_SARVAM_API_KEY': JSON.stringify(apiKey),
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api/sarvam': {
          target: 'https://api.sarvam.ai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/sarvam/, ''),
        },
      },
    },
  };
});
```

---

### 3.3 `tsconfig.json`

A unified, strict, modern TypeScript configuration optimized for Vite bundler resolution:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Strict Type-Checking */
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,

    /* Path Aliasing */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "vite.config.ts"]
}
```

---

### 3.4 `index.html`

The HTML template includes:
1. Anti-FOUC inline script that reads `sarvam_audit_theme` from `localStorage` (defaulting to system preference or dark mode) and applies `data-theme` immediately to `<html>`.
2. Modern Inter and JetBrains Mono Google Fonts.
3. `<div id="root"></div>` and entry module script `/src/main.tsx`.

```html
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark light" />
    <title>Sarvam Audit: Payout & Leakage Intelligence</title>
    <script>
      (function() {
        try {
          const savedTheme = localStorage.getItem('sarvam_audit_theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const theme = savedTheme || (prefersDark ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### 3.5 `src/vite-env.d.ts`

TypeScript client declarations ensuring `import.meta.env` and Vite asset imports type-check cleanly:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SARVAM_API_KEY?: string;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

### 3.6 `.gitignore`

Ensure standard Node and Vite build outputs are ignored while preserving necessary project files:

```gitignore
node_modules
dist
dist-ssr
*.local
.env
.env.*
!.env.example
.DS_Store
```

---

## 4. Worker Shell Command Sequence & Execution Plan

When Worker 1 executes Milestone 1 scaffolding, it must execute the following structured sequence:

### Step 1: Write Configuration Files
1. Write `/Users/hardik/Code/sarvam_campus_event/package.json`
2. Write `/Users/hardik/Code/sarvam_campus_event/vite.config.ts`
3. Write `/Users/hardik/Code/sarvam_campus_event/tsconfig.json`
4. Write `/Users/hardik/Code/sarvam_campus_event/index.html`
5. Write `/Users/hardik/Code/sarvam_campus_event/.gitignore`
6. Write `/Users/hardik/Code/sarvam_campus_event/src/vite-env.d.ts`

### Step 2: Create Subdirectory Skeletons
Execute command to create the planned module directories:
```bash
export PATH="/opt/homebrew/bin:$PATH" && mkdir -p src/styles/components src/types src/services src/context src/data src/components/common src/components/stage1_capture src/components/stage2_ocr src/components/stage3_reconcile src/components/stage4_voice src/components/stage5_leakage src/components/stage6_anchoring src/components/stage7_dashboard tests/e2e tests/runner
```

### Step 3: Run `npm install`
Execute with `BypassSandbox: true` and `/opt/homebrew/bin` in PATH:
```bash
export PATH="/opt/homebrew/bin:$PATH" && npm install
```

### Step 4: Verify TypeScript & Build
Execute build verification:
```bash
export PATH="/opt/homebrew/bin:$PATH" && npm run build
```
Verify that `dist/` is generated and exit code is 0.

### Step 5: Start Dev Server
Launch Vite dev server on port 5173 as a background process:
```bash
export PATH="/opt/homebrew/bin:$PATH" && npm run dev
```
(Using `IsDaemon: true` or background task management).

---

## 5. Risk Assessment & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| PATH missing `/opt/homebrew/bin` | Subshell fails with `node: command not found` | Mandate `export PATH="/opt/homebrew/bin:$PATH"` prefix on every shell invocation. |
| Sandbox blocking npm download | `npm install` times out with network unreachable | Specify `BypassSandbox: true` on `run_command` for installation. |
| Missing `VITE_` prefix on `.env` | Client code unable to read `SARVAM_API_KEY` | `vite.config.ts` uses `loadEnv('', ...)` and injects `import.meta.env.VITE_SARVAM_API_KEY`. |
| Port 5173 collision | Vite server fails or picks random port | Explicit `server.port = 5173` and kill any stale processes before starting. |
| Type errors during `tsc` | `npm run build` fails | Unified `tsconfig.json` with `moduleResolution: "bundler"`, `skipLibCheck: true`, and explicit `vite-env.d.ts`. |

---

## 6. Handoff Checklist for Worker 1

- [ ] `package.json` created with exact specified dependencies and scripts.
- [ ] `tsconfig.json` created with strict bundler options and `@/*` alias.
- [ ] `vite.config.ts` created with React plugin, proxy, alias, and env bridge.
- [ ] `index.html` created with anti-FOUC theme script and font links.
- [ ] `src/vite-env.d.ts` created.
- [ ] Module directories created under `src/`.
- [ ] `npm install` executed cleanly with exit code 0.
- [ ] `npm run build` verifies clean compilation.
- [ ] `npm run dev` serves on `http://localhost:5173`.
