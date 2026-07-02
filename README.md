# Security Studio

The modern open-source workspace for security engineers.

> Self-hosted • Privacy-first • Auto-configuring • SQLite • No accounts required

## Features

- **15+ Security Tools** — Encoding, cryptography, JWT inspection, networking, and more
- **Manifest-Driven Architecture** — Every tool auto-registers: sidebar, search, favorites, history
- **Command Palette** — `Ctrl+K` to search and launch any tool instantly
- **Workspaces** — Organize tools into project-specific collections
- **Persistent History** — All tool usage saved locally in SQLite
- **5 Themes** — Dark, Light, GitHub Dark, GitHub Light, System
- **Keyboard-First** — Full keyboard navigation and shortcuts
- **Offline-Ready** — Works without internet (all computation is local)

## Installation

### Desktop Users

For the best native experience on Windows, download the self-contained Desktop installer:
1. Go to the [GitHub Releases](../../releases) page.
2. Download `SecurityStudio-Setup.exe`.
3. Install and run! The desktop version bundles the backend, database, and frontend seamlessly in a standalone environment using Tauri.

### Contributors

To run the application in Contributor Mode for development, you just need Node.js (v20+):

```bash
git clone https://github.com/SoraPewnaldo/security-studio.git
cd security-studio
npm install
npm run dev
```

Everything else happens automatically:
- SQLite database is created in `/data`.
- Prisma client is generated.
- Express backend starts and binds to `127.0.0.1:4000`.
- React frontend starts and opens via Vite.

*Note: No Docker, no manual migrations needed.*

## Architecture

The project is built as a monorepo containing everything needed for both development and production deployment.

```text
security-studio/
├── apps/
│   ├── web/           # React frontend (Vite)
│   ├── api/           # Express backend (Prisma + SQLite)
│   └── desktop/       # Tauri Desktop Shell
├── packages/
│   ├── types/         # Shared TypeScript types
│   ├── tool-sdk/      # Tool registry & SDK
│   ├── core/          # Event bus, search index
│   └── utils/         # Shared utilities
├── data/              # SQLite database (auto-generated)
└── cache/             # Inter-process handshakes
```

## Contributing & Adding Tools

Create a folder in `apps/web/src/features/<category>/<tool-id>/`:

```text
my-tool/
├── manifest.ts    # Tool metadata (name, tags, examples)
├── Tool.tsx       # React component
├── logic.ts       # Pure computation functions
├── schema.ts      # Zod validation schemas
└── README.md      # Tool documentation
```

Register it in `src/features/register-tools.ts`. The tool automatically appears in the sidebar, search, command palette, and dashboard.

## MVP Tools Included

| Category | Tools |
|----------|-------|
| Encoding | Base64, URL Encoder, HTML Entities |
| Cryptography | Hash Generator, bcrypt, Password Generator, Password Strength |
| Authentication | JWT Inspector |
| Web Security | CSP Builder, Security Header Analyzer |
| Networking | CIDR Calculator, IP Utilities |
| Utilities | JSON Formatter, Regex Playground, UUID Generator, Timestamp Converter |

## License

MIT
