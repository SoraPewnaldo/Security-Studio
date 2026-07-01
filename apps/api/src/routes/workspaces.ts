import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse, Workspace, WorkspaceTool } from '@security-studio/types';

const router = Router();

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'name is required').max(100),
  description: z.string().max(500).default(''),
  icon: z.string().max(50).default('folder'),
});

const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
});

const addToolSchema = z.object({
  toolId: z.string().min(1, 'toolId is required'),
  order: z.number().int().min(0).default(0),
});

function serializeWorkspace(
  w: { id: number; name: string; description: string; icon: string; createdAt: Date; updatedAt: Date; tools?: Array<{ id: number; workspaceId: number; toolId: string; order: number; addedAt: Date }> }
): Workspace {
  return {
    id: w.id,
    name: w.name,
    description: w.description,
    icon: w.icon,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
    tools: w.tools?.map((t) => ({
      id: t.id,
      workspaceId: t.workspaceId,
      toolId: t.toolId,
      order: t.order,
      addedAt: t.addedAt.toISOString(),
    })),
  };
}

// GET /api/workspaces — list all workspaces with tools
router.get('/', async (_req, res, next) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: { tools: { orderBy: { order: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });

    const body: ApiResponse<Workspace[]> = {
      success: true,
      data: workspaces.map(serializeWorkspace),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// GET /api/workspaces/:id — get one workspace with tools
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params['id'] ?? '', 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid id' });
      return;
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: { tools: { orderBy: { order: 'asc' } } },
    });

    if (!workspace) {
      res.status(404).json({ success: false, error: 'Workspace not found' });
      return;
    }

    const body: ApiResponse<Workspace> = {
      success: true,
      data: serializeWorkspace(workspace),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// POST /api/workspaces — create a workspace
router.post('/', validate(createWorkspaceSchema), async (req, res, next) => {
  try {
    const data = req.body as z.infer<typeof createWorkspaceSchema>;

    const workspace = await prisma.workspace.create({
      data,
      include: { tools: true },
    });

    const body: ApiResponse<Workspace> = {
      success: true,
      data: serializeWorkspace(workspace),
    };

    res.status(201).json(body);
  } catch (error) {
    next(error);
  }
});

// PUT /api/workspaces/:id — update a workspace
router.put('/:id', validate(updateWorkspaceSchema), async (req, res, next) => {
  try {
    const id = parseInt(req.params['id'] ?? '', 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid id' });
      return;
    }

    const data = req.body as z.infer<typeof updateWorkspaceSchema>;

    const workspace = await prisma.workspace.update({
      where: { id },
      data,
      include: { tools: { orderBy: { order: 'asc' } } },
    });

    const body: ApiResponse<Workspace> = {
      success: true,
      data: serializeWorkspace(workspace),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/workspaces/:id — delete a workspace (cascades tools)
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params['id'] ?? '', 10);

    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid id' });
      return;
    }

    await prisma.workspace.delete({ where: { id } });

    const body: ApiResponse<null> = {
      success: true,
      data: null,
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// POST /api/workspaces/:id/tools — add a tool to a workspace
router.post('/:id/tools', validate(addToolSchema), async (req, res, next) => {
  try {
    const workspaceId = parseInt(req.params['id'] ?? '', 10);

    if (isNaN(workspaceId)) {
      res.status(400).json({ success: false, error: 'Invalid workspace id' });
      return;
    }

    const { toolId, order } = req.body as z.infer<typeof addToolSchema>;

    const tool = await prisma.workspaceTool.upsert({
      where: { workspaceId_toolId: { workspaceId, toolId } },
      update: { order },
      create: { workspaceId, toolId, order },
    });

    const body: ApiResponse<WorkspaceTool> = {
      success: true,
      data: {
        id: tool.id,
        workspaceId: tool.workspaceId,
        toolId: tool.toolId,
        order: tool.order,
        addedAt: tool.addedAt.toISOString(),
      },
    };

    res.status(201).json(body);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/workspaces/:id/tools/:toolId — remove a tool from a workspace
router.delete('/:id/tools/:toolId', async (req, res, next) => {
  try {
    const workspaceId = parseInt(req.params['id'] ?? '', 10);
    const toolId = req.params['toolId'];

    if (isNaN(workspaceId) || !toolId) {
      res.status(400).json({ success: false, error: 'Invalid parameters' });
      return;
    }

    await prisma.workspaceTool.deleteMany({
      where: { workspaceId, toolId },
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
