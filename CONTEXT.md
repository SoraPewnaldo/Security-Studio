# Security Studio — AI Context File

Welcome! This document provides context, architectural specifications, guidelines, and conventions for **Security Studio** to help any AI coding assistant get up to speed instantly.

---

## 📖 Project Overview
Security Studio is an offline-ready, privacy-first web-based workspace for security professionals. All core tools execute 100% locally/client-side. The backend database uses SQLite to record logs and configuration state, preventing external network leakage.

---

## 🛠️ Technology Stack
*   **Monorepo Tooling**: npm Workspaces
*   **Frontend**: React (v18), Vite, TanStack Router (for routing), TanStack Query (React Query for API caching), Tailwind CSS (vanilla CSS variables in `globals.css`)
*   **Backend**: Node.js, Express (v5), Prisma ORM (v6), SQLite database
*   **TypeScript**: Strict mode enabled across all packages and workspaces
*   **Sandboxing**: Node.js `vm` module for running plugin scripts locally

---

## 📐 Monorepo Workspaces

```text
security-studio/
├── apps/
│   ├── web/           # React + Vite frontend SPA
│   └── api/           # Express + Prisma + SQLite local API backend
├── packages/
│   ├── core/          # Event bus and local tool search indexing
│   ├── tool-sdk/      # Tool registration mechanisms
│   ├── types/         # Shared TypeScript interfaces
│   └── utils/         # Shared helper functions
```

---

## 🎨 Tool Development Guide

Security Studio is **manifest-driven**. To add or modify a tool, place all files inside a single folder under `apps/web/src/features/<category>/<tool-id>/`:

### Required Folder Structure
```text
my-tool/
├── manifest.ts    # Meta details (name, category, examples)
├── Tool.tsx       # React component representing the interface
├── logic.ts       # Pure computation logic (no UI code)
├── schema.ts      # Input parameters Zod validation schema
└── README.md      # Tool markdown documentation (rendered in UI)
```

### Conventions & Rules
1.  **Code-Splitting / Lazy Loading**: Tools must be registered lazily to optimize initial load bundle sizes. This is handled dynamically in `src/features/register-tools.ts` using `React.lazy` over a `import.meta.glob` selector.
2.  **No Eager Imports**: Avoid importing `Tool.tsx` directly in other components to protect the chunk boundaries.
3.  **Consistent UI Layout**: All tools must render their inputs and outputs using the `<ToolLayout>` wrapper, passing `readme` and `onLoadExample` as props:
    ```tsx
    import readme from './README.md?raw';
    import { manifest } from './manifest';
    
    export default function MyTool() {
      const handleLoadExample = (example: any) => { ... };
      return (
        <ToolLayout manifest={manifest} readme={readme} onLoadExample={handleLoadExample}>
           {/* UI inputs & outputs */}
        </ToolLayout>
      );
    }
    ```
4.  **Examples Panel**: Every tool must declare a minimum of 3 examples in `manifest.ts` containing mock inputs. Ensure `handleLoadExample` maps those inputs to the tool's React state.

---

## 🔌 VM Sandbox Plugin Engine

Plugins extend the system dynamically. Drop a plugin folder into the root `/plugins` directory.
*   **Safety Sandboxing**: Plugins execute in-memory inside `apps/api/src/lib/plugin-sandbox.ts` using Node.js's native `vm` module.
*   **Granular Permissions Badging**: Badges are dynamically parsed from the plugin's manifest:
    *   🟢 **Safe**: basic local features (`storage`, `history`, `workspace`).
    *   🟡 **Sensitive**: features requesting outer OS calls (`filesystem`, `network`).
    *   🔴 **Dangerous**: *Future* integrations requesting process spawns (`shell`, `process`).
*   **State Markers**: Disabling a plugin creates a `.disable` marker file inside its folder, causing the `plugin-loader` to skip the folder on subsequent boots. Uninstalling removes the folder.

---

## 🌍 Networking & Proxying

Do not query public web endpoints directly from the browser (e.g. `dns.google` or `rdap.org`) due to CORS constraints and registry rate-limiting (returning `403 Forbidden`).
*   **Backend Proxies**: Use the backend `/api/networking` endpoints:
    *   `/api/networking/dns`
    *   `/api/networking/whois`
    *   `/api/networking/asn`
*   **Authoritative Fallback**: The `/api/networking/whois` endpoint first attempts RDAP over HTTP. If it fails or returns an error, it automatically falls back to raw socket queries over **TCP Port 43** (querying `whois.iana.org` to resolve the authoritative server), parsing the text output into a pseudo-RDAP JSON structure.

---

## ⚙️ Development Commands

Run all command lines from the monorepo root:
*   **Start Dev Servers**: `npm run dev` (uses `concurrently` to boot Vite on port 3000 and Express on port 4000).
*   **Double-Click Boot (Windows)**: Run **`start.bat`**. It validates the Node environment, runs `npm install` if `node_modules` are absent, runs migrations, and starts the servers.
*   **Prisma Generates**: `npm run db:generate`
*   **Clean build caches**: `npm run clean`
*   **Linting**: `npm run lint`

---

## 🎨 UI & Design Rules
Refer to `design.md` for full instructions. Key styling standards:
*   Background: `#09090B` (Dark mode first).
*   Font Stack: `Geist` or `Inter`, code blocks use `IBM Plex Mono`.
*   Spacing: Strict 8px grid.
*   Corners: Max 12px rounding on cards and panels.
*   Animations: Kept subtle (max 150ms transitions, no bounce or flashy scaling).
*   **No gradients** or glassmorphism. Keep interfaces sleek, clean, and developer-dense.
