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

## Quick Start (Contributor Edition)

A contributor should only need three commands to spin up the entire application.

```bash
git clone https://github.com/SoraPewnaldo/security-studio.git
cd security-studio
npm install
npm run dev
```

Everything else happens automatically:
- SQLite database is created and initialized.
- Prisma client is generated.
- Express backend starts and binds to `127.0.0.1`.
- React frontend starts and opens in your browser.

*Note: No Docker, no Node versions managers, no manual migrations needed.*

Frontend runs on [http://localhost:5173](http://localhost:5173) (or 3000 depending on Vite config)
Backend runs on [http://127.0.0.1:4000](http://127.0.0.1:4000)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| UI | Lucide Icons, Framer Motion |
| Routing | TanStack Router |
| Data | TanStack Query |
| Backend | Express 5, TypeScript |
| ORM | Prisma |
| Database | SQLite |
| Search | Fuse.js |
| Deployment | Docker Compose |

## Architecture

```
security-studio/
├── apps/
│   ├── web/           # React frontend
│   └── api/           # Express backend
├── packages/
│   ├── types/         # Shared TypeScript types
│   ├── tool-sdk/      # Tool registry & SDK
│   ├── core/          # Event bus, search index
│   └── utils/         # Shared utilities
├── docker/            # Dockerfiles
└── data/              # SQLite database
```

## Adding a Tool

Create a folder in `apps/web/src/features/<category>/<tool-id>/`:

```
my-tool/
├── manifest.ts    # Tool metadata (name, tags, examples)
├── Tool.tsx       # React component
├── logic.ts       # Pure computation functions
├── schema.ts      # Zod validation schemas
└── README.md      # Tool documentation
```

Register it in `src/features/register-tools.ts`. The tool automatically appears in the sidebar, search, command palette, and dashboard.

## MVP Tools

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
