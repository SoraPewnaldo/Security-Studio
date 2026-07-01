# Security Studio MVP

## Vision & Goals
Open-source, self-hosted cybersecurity workspace unifying common tools.
Privacy-first, Docker-first, persistent local data, no login, no SaaS, no telemetry.

## Tech Stack
- **Frontend**: React 19, TS, Vite, Tailwind, shadcn/ui, Framer Motion, TanStack Router/Query, Monaco.
- **Backend**: Node.js, Express, TS, Prisma, Zod, Helmet.
- **Database**: SQLite (`/data/security-studio.db`).

## Deployment
`docker compose up -d`

## Pages & Persistence
Dashboard, Tool Workspace, Documentation, About, Settings.
SQLite stores favorites, history, settings, workspaces.

## UI
Vercel-inspired pitch-black dark theme. Background #000000, Border #333333, Primary #EDEDED.

## MVP Tools
- **Encoding**: Base64, URL, HTML
- **Crypto**: SHA256/512, MD5, bcrypt, Password Generator & Strength
- **Auth**: JWT Decode/Gen
- **Web**: CSP Builder, Security Headers
- **Network**: CIDR Calculator, IPv4/v6 Utilities
- **Utils**: JSON Format, Regex Playground, UUID, Timestamp

## Roadmap
- v1.1: Complete UI overhaul (done), HTTP Builder, Cookie Parser, HMAC.
- v2: Plugin System.
- v3: AI Assistant, MITRE Mapping, Sigma Suggestions.
