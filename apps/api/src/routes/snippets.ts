import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse, Snippet } from '@security-studio/types';

const router = Router();

const createSnippetSchema = z.object({
  title: z.string().min(1, 'title is required').max(200),
  content: z.string().min(1, 'content is required'),
  language: z.string().max(50).default('text'),
  toolId: z.string().nullable().default(null),
  workspaceId: z.number().int().nullable().default(null),
});

function serializeSnippet(s: { id: number; title: string; content: string; language: string; toolId: string | null; workspaceId: number | null; createdAt: Date }): Snippet {
  return {
    id: s.id,
    title: s.title,
    content: s.content,
    language: s.language,
    toolId: s.toolId,
    workspaceId: s.workspaceId,
    createdAt: s.createdAt.toISOString(),
  };
}

// GET /api/snippets — list snippets with optional filters
router.get('/', async (req, res, next) => {
  try {
    const toolId = req.query['toolId'] as string | undefined;
    const workspaceIdParam = req.query['workspaceId'] as string | undefined;
    const workspaceId = workspaceIdParam ? parseInt(workspaceIdParam, 10) : undefined;

    const where: Record<string, unknown> = {};
    if (toolId) where['toolId'] = toolId;
    if (workspaceId !== undefined && !isNaN(workspaceId)) where['workspaceId'] = workspaceId;

    const snippets = await prisma.snippet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const body: ApiResponse<Snippet[]> = {
      success: true,
      data: snippets.map(serializeSnippet),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// POST /api/snippets — create a snippet
router.post('/', validate(createSnippetSchema), async (req, res, next) => {
  try {
    const data = req.body as z.infer<typeof createSnippetSchema>;

    const snippet = await prisma.snippet.create({ data });

    const body: ApiResponse<Snippet> = {
      success: true,
      data: serializeSnippet(snippet),
    };

    res.status(201).json(body);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/snippets/:id — delete a snippet
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params['id'] ?? '', 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid id' });
      return;
    }

    await prisma.snippet.deleteMany({ where: { id } });

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
