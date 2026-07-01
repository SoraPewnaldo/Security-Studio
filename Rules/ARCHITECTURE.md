# ARCHITECTURE

## Overview
Security Studio: modular, self-hosted security workspace.
Frontend (React+TS+Vite) -> REST API -> Backend (Express+TS) -> Prisma -> SQLite

## Monorepo Structure
- `apps/web/`: Frontend React application.
- `apps/api/`: Backend Express server.
- `packages/core/`: Security logic and shared algorithms.
- `packages/tool-sdk/`: Tool registry and plugin architecture.
- `packages/types/`: Shared TypeScript types.
- `packages/utils/`: Shared utilities.

## Feature Module (Web)
Each tool under `src/features/` contains: `Tool.tsx` (UI component), `logic.ts` (if executed in browser), `schema.ts`.
