import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse, Favorite } from '@security-studio/types';

const router = Router();

const addFavoriteSchema = z.object({
  toolId: z.string().min(1, 'toolId is required'),
});

// GET /api/favorites — list all favorites
router.get('/', async (_req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const body: ApiResponse<Favorite[]> = {
      success: true,
      data: favorites.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
      })),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// POST /api/favorites — add a favorite
router.post('/', validate(addFavoriteSchema), async (req, res, next) => {
  try {
    const { toolId } = req.body as z.infer<typeof addFavoriteSchema>;

    const favorite = await prisma.favorite.upsert({
      where: { toolId },
      update: {},
      create: { toolId },
    });

    const body: ApiResponse<Favorite> = {
      success: true,
      data: {
        ...favorite,
        createdAt: favorite.createdAt.toISOString(),
      },
    };

    res.status(201).json(body);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/favorites/:toolId — remove a favorite
router.delete('/:toolId', async (req, res, next) => {
  try {
    const { toolId } = req.params;

    await prisma.favorite.deleteMany({
      where: { toolId },
    });

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
