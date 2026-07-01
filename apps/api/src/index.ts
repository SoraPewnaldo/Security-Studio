import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { errorHandler } from './middleware/error-handler.js';
import { prisma } from './lib/prisma.js';

import healthRouter from './routes/health.js';
import versionRouter from './routes/version.js';
import favoritesRouter from './routes/favorites.js';
import historyRouter from './routes/history.js';
import workspacesRouter from './routes/workspaces.js';
import settingsRouter from './routes/settings.js';
import pinnedRouter from './routes/pinned.js';
import snippetsRouter from './routes/snippets.js';
import searchRouter from './routes/search.js';

const app = express();
const PORT = parseInt(process.env['PORT'] ?? '4000', 10);

// ---------------------------------------------------------------------------
// Global Middleware
// ---------------------------------------------------------------------------

app.use(helmet());

app.use(
  cors({
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
    credentials: true,
  })
);

app.use(compression());

app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

app.use('/api', limiter);

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

app.use('/api/health', healthRouter);
app.use('/api/version', versionRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/history', historyRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/pinned', pinnedRouter);
app.use('/api/snippets', snippetsRouter);
app.use('/api/search', searchRouter);

// ---------------------------------------------------------------------------
// Global Error Handler
// ---------------------------------------------------------------------------

app.use(errorHandler);

// ---------------------------------------------------------------------------
// Scaffolding & Setup
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../../');

function ensureDirectories() {
  const dirs = ['data', 'config', 'plugins', 'exports', 'snippets', 'logs', 'backups', 'cache'];
  
  console.log('[API] Bootstrapping offline directories...');
  for (const dir of dirs) {
    const dirPath = path.join(PROJECT_ROOT, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`[API] Created directory: /${dir}`);
    }
  }

  const settingsPath = path.join(PROJECT_ROOT, 'config', 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    const defaultSettings = {
      theme: 'system',
      language: 'en',
      telemetry: false,
      windowSize: { width: 1280, height: 800 }
    };
    fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
    console.log('[API] Created default settings.json');
  }
}

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  // Ensure directories exist before connecting to the DB
  ensureDirectories();

  // Ensure database connection is alive
  await prisma.$connect();
  console.log('[API] Database connected');

  // Bind exclusively to 127.0.0.1 for security
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`[API] Security Studio API running on http://127.0.0.1:${PORT}`);
    console.log(`[API] Health check: http://127.0.0.1:${PORT}/api/health`);
  });
}

main().catch((error: unknown) => {
  console.error('[API] Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
const shutdown = async (): Promise<void> => {
  console.log('\n[API] Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
