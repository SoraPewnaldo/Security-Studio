import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse, Setting } from '@security-studio/types';

const router = Router();

const upsertSettingSchema = z.object({
  value: z.string(),
});

// GET /api/settings — list all settings
router.get('/', async (_req, res, next) => {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });

    const body: ApiResponse<Setting[]> = {
      success: true,
      data: settings.map((s) => ({
        ...s,
        updatedAt: s.updatedAt.toISOString(),
      })),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// GET /api/settings/:key — get a single setting
router.get('/:key', async (req, res, next) => {
  try {
    const key = req.params['key'] as string;

    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      res.status(404).json({ success: false, error: 'Setting not found' });
      return;
    }

    const body: ApiResponse<Setting> = {
      success: true,
      data: {
        ...setting,
        updatedAt: setting.updatedAt.toISOString(),
      },
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings/:key — upsert a setting
router.put('/:key', validate(upsertSettingSchema), async (req, res, next) => {
  try {
    const key = req.params['key'] as string;
    const { value } = req.body as z.infer<typeof upsertSettingSchema>;

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key: key ?? '', value },
    });

    const body: ApiResponse<Setting> = {
      success: true,
      data: {
        ...setting,
        updatedAt: setting.updatedAt.toISOString(),
      },
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// GET /api/settings/export — export all data
router.get('/export', async (_req, res, next) => {
  try {
    const settings = await prisma.setting.findMany();
    const history = await prisma.history.findMany();
    const favorites = await prisma.favorite.findMany();
    const workspaces = await prisma.workspace.findMany();
    const workspaceTools = await prisma.workspaceTool.findMany();
    const snippets = await prisma.snippet.findMany();
    const recentSearches = await prisma.recentSearch.findMany();
    const pinnedTools = await prisma.pinnedTool.findMany();

    const data = {
      settings,
      history,
      favorites,
      workspaces,
      workspaceTools,
      snippets,
      recentSearches,
      pinnedTools,
      exportedAt: new Date().toISOString()
    };

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST /api/settings/reset — reset all data
router.post('/reset', async (_req, res, next) => {
  try {
    // Delete in correct order to respect foreign keys
    await prisma.workspaceTool.deleteMany();
    await prisma.workspace.deleteMany();
    
    await prisma.history.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.setting.deleteMany();
    await prisma.snippet.deleteMany();
    await prisma.recentSearch.deleteMany();
    await prisma.pinnedTool.deleteMany();

    res.json({ success: true, data: { message: 'All data reset' } });
  } catch (error) {
    next(error);
  }
});

export default router;
