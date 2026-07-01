import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse, PinnedTool } from '@security-studio/types';

const router = Router();

const addPinnedSchema = z.object({
  toolId: z.string().min(1, 'toolId is required'),
  order: z.number().int().min(0).default(0),
});

const updatePinnedSchema = z.object({
  order: z.number().int().min(0),
});

function serializePinned(p: { id: number; toolId: string; order: number; createdAt: Date }): PinnedTool {
  return {
    id: p.id,
    toolId: p.toolId,
    order: p.order,
    createdAt: p.createdAt.toISOString(),
  };
}

// GET /api/pinned — list all pinned tools ordered
router.get('/', async (_req, res, next) => {
  try {
    const pinned = await prisma.pinnedTool.findMany({
      orderBy: { order: 'asc' },
    });

    const body: ApiResponse<PinnedTool[]> = {
      success: true,
      data: pinned.map(serializePinned),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// POST /api/pinned — add a pinned tool
router.post('/', validate(addPinnedSchema), async (req, res, next) => {
  try {
    const { toolId, order } = req.body as z.infer<typeof addPinnedSchema>;

    const pinned = await prisma.pinnedTool.upsert({
      where: { toolId },
      update: { order },
      create: { toolId, order },
    });

    const body: ApiResponse<PinnedTool> = {
      success: true,
      data: serializePinned(pinned),
    };

    res.status(201).json(body);
  } catch (error) {
    next(error);
  }
});

// PUT /api/pinned/:toolId — update order
router.put('/:toolId', validate(updatePinnedSchema), async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const { order } = req.body as z.infer<typeof updatePinnedSchema>;

    const existing = await prisma.pinnedTool.findUnique({ where: { toolId } });

    if (!existing) {
      res.status(404).json({ success: false, error: 'Pinned tool not found' });
      return;
    }

    const pinned = await prisma.pinnedTool.update({
      where: { toolId },
      data: { order },
    });

    const body: ApiResponse<PinnedTool> = {
      success: true,
      data: serializePinned(pinned),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/pinned/:toolId — remove a pinned tool
router.delete('/:toolId', async (req, res, next) => {
  try {
    const { toolId } = req.params;

    await prisma.pinnedTool.deleteMany({
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
