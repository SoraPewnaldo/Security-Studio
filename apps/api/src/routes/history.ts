import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse, HistoryEntry, PaginatedResponse } from '@security-studio/types';

const router = Router();

const addHistorySchema = z.object({
  toolId: z.string().min(1),
  toolName: z.string().min(1),
  action: z.string().min(1),
  inputSummary: z.string().default(''),
  outputSummary: z.string().default(''),
});

// GET /api/history — list history entries with pagination and optional toolId filter
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(String(req.query['limit'] ?? '50'), 10) || 50, 1), 200);
    const offset = Math.max(parseInt(String(req.query['offset'] ?? '0'), 10) || 0, 0);
    const toolId = req.query['toolId'] as string | undefined;

    const where = toolId ? { toolId } : {};

    const [entries, total] = await Promise.all([
      prisma.history.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.history.count({ where }),
    ]);

    const body: PaginatedResponse<HistoryEntry> = {
      success: true,
      data: entries.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// POST /api/history — add a history entry
router.post('/', validate(addHistorySchema), async (req, res, next) => {
  try {
    const data = req.body as z.infer<typeof addHistorySchema>;

    const entry = await prisma.history.create({ data });

    const body: ApiResponse<HistoryEntry> = {
      success: true,
      data: {
        ...entry,
        createdAt: entry.createdAt.toISOString(),
      },
    };

    res.status(201).json(body);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/history — clear all history
router.delete('/', async (_req, res, next) => {
  try {
    await prisma.history.deleteMany();

    const body: ApiResponse<null> = {
      success: true,
      data: null,
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/history/:id — delete a single history entry
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params['id'] ?? '', 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid id' });
      return;
    }

    await prisma.history.deleteMany({ where: { id } });

    const body: ApiResponse<null> = {
      success: true,
      data: null,
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

export default router;
