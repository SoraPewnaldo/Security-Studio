import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  PluginManifest,
  LoadedPlugin,
  PluginExecutionResult,
  PluginListItem,
} from '@security-studio/types';
import { validateManifest, semverSatisfies } from './plugin-validator.js';
import { executePluginInSandbox, runLifecycleHook } from './plugin-sandbox.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../../../');
const PLUGINS_DIR = path.join(PROJECT_ROOT, 'plugins');

/** Current app version — used for engine compatibility checks */
const APP_VERSION = '1.0.0';

// ---------------------------------------------------------------------------
// In-memory plugin registry
// ---------------------------------------------------------------------------

const plugins = new Map<string, LoadedPlugin>();

// ---------------------------------------------------------------------------
// Discovery & Loading
// ---------------------------------------------------------------------------

/**
 * Scans the `plugins/` directory, validates each manifest, and loads plugins.
 * Returns a summary of what was loaded for logging.
 */
export async function loadPlugins(): Promise<{
  loaded: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}> {
  const summary = { loaded: 0, failed: 0, errors: [] as Array<{ id: string; error: string }> };

  // Ensure plugins directory exists
  if (!fs.existsSync(PLUGINS_DIR)) {
    fs.mkdirSync(PLUGINS_DIR, { recursive: true });
    console.log('[Plugins] Created plugins/ directory');
    return summary;
  }

  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    // Skip non-directories, hidden dirs, and files like README.md
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.')) continue;

    const pluginDir = path.join(PLUGINS_DIR, entry.name);
    const manifestPath = path.join(pluginDir, 'manifest.json');
    const disablePath = path.join(pluginDir, '.disable');

    // Check if plugin is disabled
    if (fs.existsSync(disablePath)) {
      // Try to read manifest so we can show it in UI with name/version
      let rawManifest = { id: entry.name, name: entry.name };
      if (fs.existsSync(manifestPath)) {
        try {
          rawManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        } catch (e) {}
      }
      plugins.set(entry.name, {
        manifest: rawManifest as PluginManifest,
        status: 'disabled',
        path: pluginDir,
      });
      summary.loaded++;
      continue;
    }

    // Check manifest exists
    if (!fs.existsSync(manifestPath)) {
      const error = `No manifest.json found in ${entry.name}/`;
      console.warn(`[Plugins] ${error}`);
      summary.failed++;
      summary.errors.push({ id: entry.name, error });
      continue;
    }

    try {
      // Read and parse manifest
      const rawManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as unknown;

      // Validate manifest
      const validation = validateManifest(rawManifest);
      if (!validation.valid || !validation.manifest) {
        const errorMessages = validation.errors?.map((e) => `${e.field}: ${e.message}`).join('; ');
        const error = `Invalid manifest: ${errorMessages}`;
        console.warn(`[Plugins] ${entry.name}: ${error}`);
        plugins.set(entry.name, {
          manifest: rawManifest as PluginManifest,
          status: 'error',
          error,
          path: pluginDir,
        });
        summary.failed++;
        summary.errors.push({ id: entry.name, error });
        continue;
      }

      const manifest = validation.manifest;

      // Check engine compatibility
      if (manifest.engine) {
        if (!semverSatisfies(APP_VERSION, manifest.engine)) {
          const error = `Engine incompatible: requires ${manifest.engine}, app is ${APP_VERSION}`;
          console.warn(`[Plugins] ${manifest.id}: ${error}`);
          plugins.set(manifest.id, {
            manifest,
            status: 'error',
            error,
            path: pluginDir,
          });
          summary.failed++;
          summary.errors.push({ id: manifest.id, error });
          continue;
        }
      }

      // Check index.js exists
      const indexPath = path.join(pluginDir, 'index.js');
      if (!fs.existsSync(indexPath)) {
        const error = 'Plugin entry file index.js not found';
        console.warn(`[Plugins] ${manifest.id}: ${error}`);
        plugins.set(manifest.id, {
          manifest,
          status: 'error',
          error,
          path: pluginDir,
        });
        summary.failed++;
        summary.errors.push({ id: manifest.id, error });
        continue;
      }

      // Register plugin
      plugins.set(manifest.id, {
        manifest,
        status: 'loaded',
        path: pluginDir,
      });

      // Run onLoad lifecycle hook
      await runLifecycleHook(manifest, pluginDir, 'onLoad');

      console.log(`[Plugins] Loaded: ${manifest.name} v${manifest.version} (${manifest.id})`);
      summary.loaded++;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error during loading';
      console.error(`[Plugins] Failed to load ${entry.name}: ${error}`);
      plugins.set(entry.name, {
        manifest: { id: entry.name, name: entry.name } as PluginManifest,
        status: 'error',
        error,
        path: pluginDir,
      });
      summary.failed++;
      summary.errors.push({ id: entry.name, error });
    }
  }

  return summary;
}

// ---------------------------------------------------------------------------
// Querying
// ---------------------------------------------------------------------------

/** Returns a loaded plugin by id, or undefined if not found */
export function getPlugin(id: string): LoadedPlugin | undefined {
  return plugins.get(id);
}

/** Returns all loaded plugins */
export function getAllPlugins(): LoadedPlugin[] {
  return Array.from(plugins.values());
}

/** Returns all plugin manifests */
export function getPluginManifests(): PluginManifest[] {
  return Array.from(plugins.values())
    .filter((p) => p.status === 'loaded')
    .map((p) => p.manifest);
}

/** Returns a summary list suitable for the API */
export function getPluginList(): PluginListItem[] {
  return Array.from(plugins.values()).map((p) => ({
    id: p.manifest.id,
    name: p.manifest.name,
    version: p.manifest.version,
    description: p.manifest.description,
    author: p.manifest.author,
    category: p.manifest.category,
    icon: p.manifest.icon,
    status: p.status,
    error: p.error,
    permissions: p.manifest.permissions ?? [],
  }));
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

/** Executes a plugin with the given inputs */
export async function executePlugin(
  id: string,
  inputs: Record<string, unknown>
): Promise<PluginExecutionResult> {
  const plugin = plugins.get(id);

  if (!plugin) {
    return {
      success: false,
      outputs: {},
      error: `Plugin "${id}" not found`,
      executionTimeMs: 0,
    };
  }

  if (plugin.status !== 'loaded') {
    return {
      success: false,
      outputs: {},
      error: `Plugin "${id}" is not in a loaded state (status: ${plugin.status})`,
      executionTimeMs: 0,
    };
  }

  return executePluginInSandbox(plugin.manifest, plugin.path, inputs);
}

// ---------------------------------------------------------------------------
// Reload & Management
// ---------------------------------------------------------------------------

/** Unloads all plugins (calling onUnload hooks), then reloads from disk */
export async function reloadPlugins(): Promise<{
  loaded: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}> {
  // Call onUnload for all loaded plugins
  for (const plugin of plugins.values()) {
    if (plugin.status === 'loaded') {
      await runLifecycleHook(plugin.manifest, plugin.path, 'onUnload');
    }
  }

  // Clear registry
  plugins.clear();
  console.log('[Plugins] All plugins unloaded — reloading...');

  // Reload
  return loadPlugins();
}

/** Reloads a single plugin by id */
export async function reloadSinglePlugin(id: string): Promise<boolean> {
  const plugin = plugins.get(id);
  if (plugin && plugin.status === 'loaded') {
    await runLifecycleHook(plugin.manifest, plugin.path, 'onUnload');
  }
  
  // To keep it simple, we just reload all plugins instead of writing single-load logic.
  // In a robust implementation, we'd unload one and run loadPlugins for just one folder.
  await reloadPlugins();
  return true;
}

/** Disables a plugin by writing a .disable file */
export async function disablePlugin(id: string): Promise<boolean> {
  const plugin = plugins.get(id);
  if (!plugin) throw new Error(`Plugin "${id}" not found`);
  
  if (plugin.status === 'loaded') {
    await runLifecycleHook(plugin.manifest, plugin.path, 'onUnload');
  }

  const disableFilePath = path.join(plugin.path, '.disable');
  fs.writeFileSync(disableFilePath, '');
  
  plugin.status = 'disabled';
  return true;
}

/** Enables a plugin by removing the .disable file and reloading */
export async function enablePlugin(id: string): Promise<boolean> {
  const plugin = plugins.get(id);
  if (!plugin) throw new Error(`Plugin "${id}" not found`);
  
  const disableFilePath = path.join(plugin.path, '.disable');
  if (fs.existsSync(disableFilePath)) {
    fs.unlinkSync(disableFilePath);
  }
  
  await reloadPlugins();
  return true;
}

/** Uninstalls a plugin by deleting its folder */
export async function uninstallPlugin(id: string): Promise<boolean> {
  const plugin = plugins.get(id);
  if (!plugin) throw new Error(`Plugin "${id}" not found`);
  
  if (plugin.status === 'loaded') {
    await runLifecycleHook(plugin.manifest, plugin.path, 'onUnload');
  }

  fs.rmSync(plugin.path, { recursive: true, force: true });
  plugins.delete(id);
  
  return true;
}
