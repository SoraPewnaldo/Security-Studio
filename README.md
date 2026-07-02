<div align="center">

<img src="./assets/Main logo without background.png" alt="Security Studio Logo" width="120" height="120" style="border-radius: 20%" />

# Security Studio
### The modern, privacy-first offline workspace for cybersecurity engineers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](#installation)
[![Milestone](https://img.shields.io/badge/Release-v1.1.0-orange.svg)](../../releases)

---

**Security Studio** is a self-hosted, offline-ready desktop and web-based workspace designed to bundle all the utilities a security professional, penetration tester, or developer needs. No telemetry, no cloud dependencies, and absolute data privacy.

*Privacy-first • Manifest-driven • Auto-configuring • Local SQLite • Zero-Account Overhead*

</div>

---

## 🚀 Key Features

*   **⚡ 40+ Core Utilities**: Built-in encoders, decoders, cryptographic hashers, token inspectors, web-security analyzers, and subnetting tools.
*   **🔌 Sandbox Plugin Platform**: Dynamically load third-party extensions in an isolated VM sandbox. Features permission safety tagging:
    *   🟢 **Safe** (*Storage, History, Workspaces, Logging*)
    *   🟡 **Sensitive** (*Filesystem access, local network queries*)
    *   🔴 **Dangerous** (*Future: Shell executions, system process access*)
*   **🔒 Local Network Proxy**: Proxies DNS, ASN, and WHOIS/RDAP requests directly from the local backend to bypass CORS constraints, featuring an **automatic Port 43 TCP WHOIS fallback** if registry APIs rate-limit or block connections.
*   **📁 Custom Workspaces**: Group your most-used tools into customizable project workspaces for specific security engagements or tasks.
*   **⌨️ Keyboard-First Workflow**: Launch any tool instantly using the built-in Command Palette (`Ctrl + K` or `/`) and control configurations with fast keyboard shortcuts.
*   **📊 Persistent History**: Every audit and tool execution is securely stored in a local SQLite database for instant retrieval.

---

## 🛠️ Included Tools (v1.1.0)

| Category | Tools | Description |
| :--- | :--- | :--- |
| 🔐 **Authentication** | JWT Inspector, JWT Generator, JWT Signature Verifier, OAuth PKCE, OAuth State Generator, SAML Decoder, Session Cookie Analyzer | Token decoders, crypto signature verifiers, PKCE state generators, and cookie security flags |
| 🔒 **Cryptography** | Hash Generator (MD5, SHA1/256/512), bcrypt, Password Generator, Password Strength, HMAC Generator, RSA Keypair Generator, AES Encrypt/Decrypt, Certificate Viewer, PEM/DER Converter | Standard cryptographic hashing, password entropy checks, key generation, and sym/asym crypto |
| 🌐 **Web Security** | CSP Builder, Security Header Analyzer, CSP Evaluator, Cookie Analyzer, CORS Analyzer, CSP Generator, HTTP Header Diff | Audit web app configurations, analyze CORS profiles, and construct Content Security Policies |
| 🌍 **Networking** | CIDR Calculator, IP Utilities, DNS Lookup, WHOIS / RDAP Lookup, ASN Lookup, User-Agent Parser | Subnetting planners, DNS zone resolvers, and authoritative registry queries with TCP socket failovers |
| 📝 **Encoding** | Base64, URL Encode/Decode, HTML Entity, Hex Encode/Decode, Unicode Converter, Binary Converter, ROT13 | Seamless data encoding and decoding between formats |
| 🧰 **Utilities** | JSON Formatter, Regex Playground, UUID Generator, Timestamp Converter, JSON Diff, YAML ↔ JSON Converter | Format and audit structured outputs, parse dates, and test expressions |

---

## 📦 Installation & Setup

### For Users (Desktop Application)
For the best standalone native experience on Windows, download the installer:
1. Navigate to [GitHub Releases](../../releases).
2. Download `SecurityStudio-Setup.exe`.
3. Install and run. (The Tauri desktop wrapper bundles the database, API server, and interface natively).

### For Developers & Contributors
To run the monorepo locally, you only need **Node.js (v20+)**:

```bash
# Clone the repository
git clone https://github.com/SoraPewnaldo/Security-Studio.git
cd Security-Studio

# Install dependencies and bootstrap the SQLite database
npm install

# Run the API and Web workspaces concurrently
npm run dev
```

*Note: No manual database migrations, Docker config, or local database setups are required. A SQLite DB is instantly generated inside `data/` and loaded automatically.*

---

## 📐 Architecture & Monorepo Layout

Security Studio is built as a highly structured workspaces monorepo:

```text
security-studio/
├── apps/
│   ├── web/           # React + Vite frontend SPA (uses code-split lazy loading)
│   ├── api/           # Express + Prisma + SQLite local API backend
│   └── desktop/       # Tauri desktop client wrapper
├── packages/
│   ├── core/          # Event bus and local tool search indexing
│   ├── tool-sdk/      # Tool registration mechanisms
│   ├── types/         # Shared TypeScript interfaces
│   └── utils/         # Shared helper functions
├── data/              # SQLite database (auto-generated)
└── config/            # Workspace settings config files
```

---

## 🎨 Adding a Custom Tool

Security Studio operates on a **manifest-driven architecture**. To add a new tool:

1. Create a folder in `apps/web/src/features/<category>/<tool-id>/`:
    ```text
    my-tool/
    ├── manifest.ts    # Tool metadata (name, tags, examples)
    ├── Tool.tsx       # React Component (UI)
    ├── logic.ts       # Processing functions
    ├── schema.ts      # Input schema validations
    └── README.md      # Tool documentation
    ```
2. Save your changes. The Vite glob resolver in `src/features/register-tools.ts` will automatically register the manifest and component, instantly rendering it in the Search Index, Sidebar, and Command Palette.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
