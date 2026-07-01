# Security Studio Agent Guidelines

**Role**: Lead Software Engineer building a modern, open-source, self-hosted cybersecurity workspace. No prototypes/placeholders; production code only.

## Source of Truth
Read before implementing: `RULES.md`, `MVP_Security_Studio.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `ROADMAP.md`, `CONTRIBUTING.md`, `README.md`.

## Core AI Skills
- **caveman**: Use for terse, token-efficient responses. Keep reasoning minimal.
- **graphify**: Analyze repo architecture before major changes.
- **find-docs**: Fetch latest docs (React, TS, Tailwind, Express, Prisma, Docker, Vite, shadcn, TanStack) over using outdated training data.

## Project DNA
- Open-Source, Self-Hosted, Docker-First, SQLite, Privacy-First, Local-First.
- Run via `docker compose up -d`. No SaaS, cloud dependency, or mandatory auth.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Router/Query, Framer Motion.
- **Backend/Deploy**: Node.js, Express, TypeScript, Prisma, SQLite, Docker Compose.

## Design System (Strictly Vercel-Inspired)
- **Aesthetic**: Pure pitch-black (`#000000`) background, crisp thin borders (`#333333`), completely flat design (zero shadows or glassmorphism), high contrast primary elements.
- **Target Vibe**: Professional developer tool (Vercel, GitHub, Linear). NO purple gradients, cyberpunk, bootstrap, or excessive padding.

## Architecture & Code Standards
- Strict TS, functional components, async/await, modular feature folders.
- Avoid duplicated logic, `any` types, magic numbers, or giant files.
- Optimize for small bundles, lazy loading, and efficient rendering.
- Accessibility: WCAG AA, keyboard nav, semantic HTML.

## Security Standard
- Treat input as hostile: Zod validation, sanitize, parameterized queries, Helmet, rate limit. Follow OWASP. Never expose secrets.

## Execution Rules
Generate production-ready code. No pseudocode or TODOs. Choose the simplest scalable solution. Update docs on feature changes.