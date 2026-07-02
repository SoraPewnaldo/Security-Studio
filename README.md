<div align="center">

<img src="./assets/Main logo without background.png" alt="Security Studio Logo" width="120" height="120" style="border-radius: 20%" />

# Security Studio
### The modern, privacy-first offline workspace for cybersecurity engineers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](#prerequisites--quickstart)
[![Release](https://img.shields.io/badge/Release-v1.2.0-orange.svg)](../../releases)

---

**Security Studio** is a self-hosted, offline-ready web-based workspace designed to bundle all the tools a security professional, penetration tester, or developer needs — inside one cohesive platform. No telemetry, no cloud dependencies, and absolute data privacy.

*Privacy-first • Manifest-driven • Auto-configuring • Local SQLite • Zero-Account Overhead*

<br />

<img src="./assets/ui_demo.png" alt="Security Studio Interface Preview" width="100%" style="border-radius: 12px; border: 1px solid #30363D; box-shadow: 0px 4px 20px rgba(0,0,0,0.4);" />

</div>

---

## 🆕 What's New in v1.2

### 📚 Security Playbooks
A guided methodology engine that transforms Security Studio from a toolbox into a **cybersecurity platform**. Instead of opening isolated tools, you follow step-by-step workflows with each tool embedded inline — similar to TryHackMe or PortSwigger Academy.

- **4 bundled playbooks**: Domain Investigation, JWT Security Audit, Session Cookie Review, Web Application Recon
- **Inline tool embedding**: Every step loads the real tool directly — no page reloads, no tab switching
- **Beginner / Expert toggle**: Beginner mode shows *"Why this step?"* and *"What to look for"* guidance panels. Expert mode strips it down to just the tool
- **Progress tracking**: Timeline stepper, progress bar, and step completion stored in localStorage
- **Fully extensible**: Plugin authors can contribute new playbooks in future releases

### 🌐 HTTP Client
A built-in API testing tool that connects to your other Security Studio tools.

- **All HTTP methods**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Custom headers** with a live key/value editor
- **Request body** editor for POST/PUT/PATCH
- **Response tabs**: Body, Headers, Cookies
- **Auto Content Detection**: Scans every response and suggests opening Security Studio tools — detects JWTs, Set-Cookie headers, JSON, XML, and PEM certificates
- **No localhost blocking**: Test APIs on `127.0.0.1`, `192.168.x.x`, Docker, Kubernetes, Burp, DVWA, Metasploitable — all fully supported

---

## 🛠️ The Security Toolset (39 Tools)

Security Studio features 39 specialized tools. Every tool operates strictly client-side — your keys, payloads, and tokens never leave your machine. Each tool ships with a **Documentation** tab (rendered from local Markdown) and **Examples** that load instantly into the input panel.

### 🔐 Authentication
- **JWT Inspector** — Parse, decode, and visually audit header and payload claims
- **JWT Verifier** — Decode tokens, verify signatures against a secret or public key
- **OAuth PKCE Generator** — Generate cryptographic code verifiers and SHA-256 code challenges
- **OAuth State Generator** — Produce cryptographically secure CSRF state tokens for redirect flows
- **SAML Decoder** — Decode SAML assertions and responses
- **Session Cookie Analyzer** — Inspect cookie structures and audit security flags (Secure, HttpOnly, SameSite)

### 🔒 Cryptography
- **AES Encrypt/Decrypt** — Encrypt and decrypt payloads symmetrically
- **Certificate Viewer** — Parse and inspect X.509 SSL/TLS certificates (auto-normalizes corrupted PEM pastes)
- **Hash Generator** — Instant MD5, SHA-1, SHA-256, and SHA-512 hashing
- **HMAC Generator** — Verify message integrity with shared secret keys
- **Password Generator** — Generate highly customizable secure passwords
- **Password Strength** — Analyze entropy, length, and estimate crack times
- **PEM/DER Converter** — Convert between binary DER and ASCII PEM formats
- **RSA Key Generator** — Generate 2048-bit or 4096-bit public/private RSA key pairs

### 🌐 Web Security
- **CORS Analyzer** — Test CORS configurations for wildcard and misconfiguration exposures
- **CSP Builder** — Graphically build Content Security Policies directive by directive
- **HTTP Header Diff** — Compare differences between two HTTP header sets
- **Security Header Analyzer** — Audit HTTP response headers for missing security guards (HSTS, CSP, X-Frame-Options, etc.)

### 🌍 Networking
- **ASN Lookup** — Resolve Autonomous System Numbers and hosting providers
- **CIDR Calculator** — Map subnets, calculate IP ranges, and get network sizes
- **DNS Lookup** — Resolve DNS zones (A, AAAA, CNAME, MX, TXT) via local proxy
- **HTTP Client** — *(New in v1.2)* Full API testing tool with auto content detection and tool suggestions
- **IP Utilities** — Inspect network addresses, headers, and geolocation context
- **WHOIS / RDAP Lookup** — Authoritative WHOIS records with automatic TCP Port 43 socket fallback when RDAP APIs return 403

### 📝 Encoding & Formatting
- **Base64 Converter** — Encode/decode textual and binary values
- **Binary Converter** — Text-to-binary and binary-to-text conversions
- **Hex Encode/Decode** — Hexadecimal encoding and decoding
- **HTML Entity Converter** — Interconvert between HTML entities and character outputs
- **ROT13 Converter** — Caesar cipher with arbitrary shift support
- **Unicode Converter** — Convert code points to readable characters
- **URL Encode/Decode** — Safely encode string parameters for URLs

### 🧰 Utilities
- **Cron Expression Parser** — Parse crontab expressions into readable human schedules
- **JSON Diff** — Compare structural and value differences between two JSON objects
- **JSON Formatter** — Format, minify, and validate JSON strings
- **Regex Playground** — Test regular expressions live against text inputs
- **Timestamp Converter** — Convert Epoch timestamps to UTC/Local datetimes
- **UUID Generator** — Cryptographically random UUID v4 generation
- **XML Formatter** — Format, pretty-print, and minify XML inputs
- **YAML ↔ JSON Converter** — Convert structures between YAML and JSON

---

## 📚 Security Playbooks

Playbooks are **step-by-step guided methodologies** for common cybersecurity tasks. Each step embeds a real Security Studio tool inline, so you never leave the workflow.

| Playbook | Category | Steps | Difficulty |
|---|---|---|---|
| 🌐 Domain Investigation | Recon & OSINT | WHOIS → DNS → ASN → TLS Cert | Beginner |
| 🔐 JWT Security Audit | Authentication | Decode → Verify | Intermediate |
| 🍪 Session Cookie Review | Web Security | Cookie Analyzer | Beginner |
| 🐞 Web Application Recon | Recon & OSINT | WHOIS → DNS → Security Headers → TLS Cert | Intermediate |

> More playbooks are planned for v1.3: Incident Response, OSINT Deep Dive, Cloud Security Audit, API Fuzzing.

---

## 📁 Workspaces & Audit History

Security Studio organizes your security audits through a persistent workspace system.

- **Project isolation** — Group tools under a dedicated workspace (e.g., *External Audit*, *Internal Pentest*) for focused access
- **Persistent Audit History** — Inputs, configurations, and outputs are logged locally into an SQLite database. Review, reload, or clear past runs at any time
- **Settings & Exporting** — Export all workspace files, settings, and database tables as a single JSON schema for backup, or securely wipe the database

---

## 🔌 Plugin Engine

Expand Security Studio by writing custom plugins. Drop any plugin directory into the `/plugins` folder and the application loads it dynamically — no restart required.

- **Logical Isolation** — Plugins execute inside a secure backend Node.js `vm` sandbox, protecting the host server from malicious scripts
- **Granular Permission Badges** — Every plugin is badged based on what resources it declares in its manifest:
  - 🟢 **Safe** — Basic sandbox operations, local storage, history logging, internal event-bus access
  - 🟡 **Sensitive** — Direct filesystem access or outbound network calls
  - 🔴 **Dangerous** — *(Future)* Shell command execution or system process spawning
- **Live Logs** — Click **Logs** in the plugin panel to view real-time console output from the sandbox

---

## ⚙️ Prerequisites & Quickstart

### Prerequisites
1. **Node.js** `v20.0.0` or higher
2. **Git** (to clone the repository)
3. *(Optional)* **Windows** to use the one-click `start.bat` script

---

### 🚀 Windows — One-Click Startup

Double-click **`start.bat`** in the root directory. The script will:
1. Verify Node.js is installed and on your `PATH`
2. Run `npm install` automatically if `node_modules` are missing
3. Connect to the local SQLite database (auto-created in `/data`)
4. Launch the API server and Vite dev server concurrently

Then open **`http://localhost:3000`** in your browser.

---

### 💻 Manual CLI Startup (Any OS)

```bash
# 1. Clone the repository
git clone https://github.com/SoraPewnaldo/Security-Studio.git
cd Security-Studio

# 2. Install all dependencies (triggers Prisma DB generation automatically)
npm install

# 3. Start the API and web servers concurrently
npm run dev
```

The SQLite database is auto-created in `/data`. Open `http://localhost:3000`.

---

## 🎨 Adding a Custom Tool

Security Studio uses a **manifest-driven auto-discovery** architecture. To add a new tool:

1. Create a folder under `apps/web/src/features/<category>/<tool-id>/`:

```
my-tool/
├── manifest.ts    # Tool metadata (id, name, tags, examples)
├── Tool.tsx       # React component (UI)
├── logic.ts       # Processing functions
└── README.md      # Tool documentation (rendered in the Documentation tab)
```

2. Save. The glob resolver in `register-tools.ts` automatically discovers the manifest and component, and registers the tool across the Search Index, Sidebar, and Command Palette — no manual registration required.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
