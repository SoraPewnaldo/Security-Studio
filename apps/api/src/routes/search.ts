import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse, RecentSearch } from '@security-studio/types';

const router = Router();

const logSearchSchema = z.object({
  query: z.string().min(1, 'query is required'),
  resultCount: z.number().int().min(0).default(0),
});

// GET /api/search/recent — get recent searches
router.get('/recent', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(String(req.query['limit'] ?? '20'), 10) || 20, 1), 100);

    const searches = await prisma.recentSearch.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const body: ApiResponse<RecentSearch[]> = {
      success: true,
      data: searches.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
      })),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// POST /api/search/log — log a search query
router.post('/log', validate(logSearchSchema), async (req, res, next) => {
  try {
    const data = req.body as z.infer<typeof logSearchSchema>;

    const search = await prisma.recentSearch.create({ data });

    const body: ApiResponse<RecentSearch> = {
      success: true,
      data: {
        ...search,
        createdAt: search.createdAt.toISOString(),
      },
    };

    res.status(201).json(body);
  } catch (error) {
    next(error);
  }
});

export default router;
