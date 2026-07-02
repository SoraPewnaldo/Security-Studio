import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '@security-studio/types';

const router = Router();

const createSessionSchema = z.object({
  playbookId: z.string().min(1, 'playbookId is required'),
  workspaceId: z.number().int().optional(),
});

const updateSessionSchema = z.object({
  currentStep: z.number().int().min(0),
  stepData: z.string(), // Serialized JSON string
  completed: z.boolean().default(false),
});

const saveReportSchema = z.object({
  sessionId: z.number().int(),
  workspaceId: z.number().int().optional(),
  title: z.string().min(1, 'title is required'),
  reportText: z.string().min(1, 'reportText is required'),
  riskLevel: z.enum(['Low', 'Medium', 'High']),
});

// GET /api/playbooks/sessions — List all active playbook sessions
router.get('/sessions', async (req, res, next) => {
  try {
    const workspaceIdQuery = req.query['workspaceId'];
    const where: any = {};
    if (workspaceIdQuery) {
      where.workspaceId = parseInt(workspaceIdQuery as string, 10);
    }

    const sessions = await prisma.playbookSession.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: { workspace: true }
    });

    const body: ApiResponse<any[]> = {
      success: true,
      data: sessions.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// GET /api/playbooks/sessions/:id — Get one playbook session
router.get('/sessions/:id', async (req, res, next) => {
  try {
    const id = parseInt(String(req.params['id'] ?? ''), 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid id' });
      return;
    }

    const session = await prisma.playbookSession.findUnique({
      where: { id },
      include: { workspace: true }
    });

    if (!session) {
      res.status(404).json({ success: false, error: 'Playbook session not found' });
      return;
    }

    const body: ApiResponse<any> = {
      success: true,
      data: {
        ...session,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      },
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// POST /api/playbooks/sessions — Create a new playbook session
router.post('/sessions', validate(createSessionSchema), async (req, res, next) => {
  try {
    const { playbookId, workspaceId } = req.body as z.infer<typeof createSessionSchema>;

    const session = await prisma.playbookSession.create({
      data: {
        playbookId,
        workspaceId: workspaceId || null,
        currentStep: 0,
        stepData: '{}',
        completed: false,
      },
    });

    const body: ApiResponse<any> = {
      success: true,
      data: {
        ...session,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      },
    };

    res.status(201).json(body);
  } catch (error) {
    next(error);
  }
});

// PUT /api/playbooks/sessions/:id — Update a session (save progress)
router.put('/sessions/:id', validate(updateSessionSchema), async (req, res, next) => {
  try {
    const id = parseInt(String(req.params['id'] ?? ''), 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid id' });
      return;
    }

    const { currentStep, stepData, completed } = req.body as z.infer<typeof updateSessionSchema>;

    const session = await prisma.playbookSession.update({
      where: { id },
      data: {
        currentStep,
        stepData,
        completed,
      },
    });

    const body: ApiResponse<any> = {
      success: true,
      data: {
        ...session,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      },
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/playbooks/sessions/:id — Delete a session
router.delete('/sessions/:id', async (req, res, next) => {
  try {
    const id = parseInt(String(req.params['id'] ?? ''), 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid id' });
      return;
    }

    await prisma.playbookSession.delete({
      where: { id },
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

// GET /api/playbooks/reports — List all reports
router.get('/reports', async (req, res, next) => {
  try {
    const workspaceIdQuery = req.query['workspaceId'];
    const where: any = {};
    if (workspaceIdQuery) {
      where.workspaceId = parseInt(workspaceIdQuery as string, 10);
    }

    const reports = await prisma.playbookReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { workspace: true }
    });

    const body: ApiResponse<any[]> = {
      success: true,
      data: reports.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// GET /api/playbooks/reports/:sessionId — Get report for a specific session
router.get('/reports/:sessionId', async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params['sessionId'] ?? '', 10);
    if (isNaN(sessionId)) {
      res.status(400).json({ success: false, error: 'Invalid sessionId' });
      return;
    }

    const report = await prisma.playbookReport.findUnique({
      where: { sessionId },
    });

    if (!report) {
      res.status(404).json({ success: false, error: 'Playbook report not found' });
      return;
    }

    const body: ApiResponse<any> = {
      success: true,
      data: {
        ...report,
        createdAt: report.createdAt.toISOString(),
      },
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// POST /api/playbooks/reports — Create or update a playbook report
router.post('/reports', validate(saveReportSchema), async (req, res, next) => {
  try {
    const { sessionId, workspaceId, title, reportText, riskLevel } = req.body as z.infer<typeof saveReportSchema>;

    const report = await prisma.playbookReport.upsert({
      where: { sessionId },
      update: {
        title,
        reportText,
        riskLevel,
      },
      create: {
        sessionId,
        workspaceId: workspaceId || null,
        title,
        reportText,
        riskLevel,
      },
    });

    const body: ApiResponse<any> = {
      success: true,
      data: {
        ...report,
        createdAt: report.createdAt.toISOString(),
      },
    };

    res.status(201).json(body);
  } catch (error) {
    next(error);
  }
});

export default router;
