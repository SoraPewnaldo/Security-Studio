import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup database URL strictly relative to the project root
const PROJECT_ROOT = path.resolve(__dirname, '../../../');
if (!process.env.DATABASE_URL) {
  const dbPath = path.join(PROJECT_ROOT, 'data', 'security-studio.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

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
import pluginsRouter from './routes/plugins.js';
import networkingRouter from './routes/networking.js';
import { loadPlugins } from './lib/plugin-loader.js';

const app = express();

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
app.use('/api/plugins', pluginsRouter);
app.use('/api/networking', networkingRouter);

app.use(errorHandler);

// ---------------------------------------------------------------------------
// Static Frontend Serving (For Production)
// ---------------------------------------------------------------------------

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  // SPA Fallback
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// ---------------------------------------------------------------------------
// Scaffolding & Setup
// ---------------------------------------------------------------------------

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
  ensureDirectories();

  await prisma.$connect();
  console.log('[API] Database connected');

  // Discover and load plugins
  const pluginResult = await loadPlugins();
  console.log(
    `[API] Plugins: ${pluginResult.loaded} loaded, ${pluginResult.failed} failed`
  );
  if (pluginResult.errors.length > 0) {
    for (const err of pluginResult.errors) {
      console.warn(`[API]   ↳ ${err.id}: ${err.error}`);
    }
  }

  const assignedPort = parseInt(process.env['PORT'] ?? '4000', 10);

  app.listen(assignedPort, '127.0.0.1', () => {
    console.log(`[API] Security Studio API running on http://127.0.0.1:${assignedPort}`);
    console.log(`[API] Health check: http://127.0.0.1:${assignedPort}/api/health`);
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
