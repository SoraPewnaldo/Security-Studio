import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import {
  getPlugin,
  getPluginList,
  executePlugin,
  reloadPlugins,
} from '../lib/plugin-loader.js';
import type {
  ApiResponse,
  PluginListItem,
  PluginManifest,
  LoadedPlugin,
  PluginExecutionResult,
} from '@security-studio/types';

const router = Router();

// ---------------------------------------------------------------------------
// GET / — List all plugins (manifests + status)
// ---------------------------------------------------------------------------

router.get('/', (_req, res, next) => {
  try {
    const list = getPluginList();

    const body: ApiResponse<PluginListItem[]> = {
      success: true,
      data: list,
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// POST /reload — Re-scan and reload all plugins
// ---------------------------------------------------------------------------

router.post('/reload', async (_req, res, next) => {
  try {
    const result = await reloadPlugins();

    const body: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// GET /:id — Single plugin details
// ---------------------------------------------------------------------------

router.get('/:id', (req, res, next) => {
  try {
    const id = req.params['id'] as string;
    const plugin = getPlugin(id);

    if (!plugin) {
      const body: ApiResponse<null> = { success: false as boolean, data: null };
      res.status(404).json({ ...body, error: `Plugin "${id}" not found` });
      return;
    }

    const body: ApiResponse<LoadedPlugin> = {
      success: true,
      data: plugin,
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// GET /:id/manifest — Raw manifest
// ---------------------------------------------------------------------------

router.get('/:id/manifest', (req, res, next) => {
  try {
    const id = req.params['id'] as string;
    const plugin = getPlugin(id);

    if (!plugin) {
      res.status(404).json({ success: false, error: `Plugin "${id}" not found` });
      return;
    }

    const body: ApiResponse<PluginManifest> = {
      success: true,
      data: plugin.manifest,
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// GET /:id/logs — Get captured logs for the plugin
// ---------------------------------------------------------------------------

router.get('/:id/logs', async (req, res, next) => {
  try {
    const id = req.params['id'] as string;
    const { getPluginLogs } = await import('../lib/plugin-sandbox.js');
    const logs = getPluginLogs(id);
    
    const body: ApiResponse<any> = {
      success: true,
      data: logs,
    };

    res.json(body);
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// POST /:id/execute — Execute plugin with inputs
// ---------------------------------------------------------------------------

const executeSchema = z.object({
  inputs: z.record(z.unknown()).default({}),
});

router.post('/:id/execute', validate(executeSchema), async (req, res, next) => {
  try {
    const id = req.params['id'] as string;
    const { inputs } = req.body as z.infer<typeof executeSchema>;

    const result: PluginExecutionResult = await executePlugin(id, inputs);

    const body: ApiResponse<PluginExecutionResult> = {
      success: true,
      data: result,
    };

    // Always return 200 if the sandbox executed and returned a result, 
    // so the frontend can gracefully render the PluginExecutionResult error state.
    res.status(200).json(body);
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// POST /:id/reload — Reload a single plugin
// ---------------------------------------------------------------------------

router.post('/:id/reload', async (req, res, next) => {
  try {
    const id = req.params['id'] as string;
    const { reloadSinglePlugin } = await import('../lib/plugin-loader.js');
    await reloadSinglePlugin(id);

    const body: ApiResponse<null> = { success: true, data: null };
    res.json(body);
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// POST /:id/disable — Disable a plugin
// ---------------------------------------------------------------------------

router.post('/:id/disable', async (req, res, next) => {
  try {
    const id = req.params['id'] as string;
    const { disablePlugin } = await import('../lib/plugin-loader.js');
    await disablePlugin(id);

    const body: ApiResponse<null> = { success: true, data: null };
    res.json(body);
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// POST /:id/enable — Enable a plugin
// ---------------------------------------------------------------------------

router.post('/:id/enable', async (req, res, next) => {
  try {
    const id = req.params['id'] as string;
    const { enablePlugin } = await import('../lib/plugin-loader.js');
    await enablePlugin(id);

    const body: ApiResponse<null> = { success: true, data: null };
    res.json(body);
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// DELETE /:id — Uninstall a plugin
// ---------------------------------------------------------------------------

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params['id'] as string;
    const { uninstallPlugin } = await import('../lib/plugin-loader.js');
    await uninstallPlugin(id);

    const body: ApiResponse<null> = { success: true, data: null };
    res.json(body);
  } catch (error) {
    next(error);
  }
});

export default router;
