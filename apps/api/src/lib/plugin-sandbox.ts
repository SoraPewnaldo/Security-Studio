import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  PluginManifest,
  PluginPermission,
  PluginAPI,
  PluginExecutionResult,
} from '@security-studio/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum execution time in milliseconds */
const EXECUTION_TIMEOUT_MS = 5_000;

/** Root directory for plugin-scoped storage files */
const PROJECT_ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '../../../../'
);
const STORAGE_DIR = path.join(PROJECT_ROOT, 'data', 'plugin-storage');

// ---------------------------------------------------------------------------
// Plugin Storage (JSON file per plugin)
// ---------------------------------------------------------------------------

function getStoragePath(pluginId: string): string {
  return path.join(STORAGE_DIR, `${pluginId}.json`);
}

function readStorage(pluginId: string): Record<string, string> {
  const filePath = getStoragePath(pluginId);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as Record<string, string>;
    }
  } catch {
    // Corrupted file — start fresh
  }
  return {};
}

function writeStorage(pluginId: string, data: Record<string, string>): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
  fs.writeFileSync(getStoragePath(pluginId), JSON.stringify(data, null, 2), 'utf-8');
}

// ---------------------------------------------------------------------------
// In-Memory Logs Store
// ---------------------------------------------------------------------------

const MAX_LOGS_PER_PLUGIN = 100;
const pluginLogs = new Map<string, Array<{ level: string; message: string; timestamp: string }>>();

export function getPluginLogs(pluginId: string) {
  return pluginLogs.get(pluginId) || [];
}

function addLog(pluginId: string, level: string, message: string) {
  let logs = pluginLogs.get(pluginId);
  if (!logs) {
    logs = [];
    pluginLogs.set(pluginId, logs);
  }
  logs.push({ level, message, timestamp: new Date().toISOString() });
  if (logs.length > MAX_LOGS_PER_PLUGIN) {
    logs.shift();
  }
}

// ---------------------------------------------------------------------------
// Plugin API Factory
// ---------------------------------------------------------------------------

/**
 * Builds the PluginAPI object for a plugin, only exposing surfaces the
 * plugin has declared permissions for.
 *
 * NOTE: The vm sandbox runs synchronous code. Storage/settings APIs are
 * technically async (return Promises), but we resolve them synchronously
 * under the hood since we use local JSON files.
 */
function createPluginAPI(manifest: PluginManifest): PluginAPI {
  const permissions = new Set<PluginPermission>(manifest.permissions);
  const pluginId = manifest.id;

  // Logger — always available
  const logger: PluginAPI['logger'] = {
    info: (message: string) => {
      console.log(`[Plugin:${pluginId}] ${message}`);
      addLog(pluginId, 'info', message);
    },
    warn: (message: string) => {
      console.warn(`[Plugin:${pluginId}] ${message}`);
      addLog(pluginId, 'warn', message);
    },
    error: (message: string) => {
      console.error(`[Plugin:${pluginId}] ${message}`);
      addLog(pluginId, 'error', message);
    },
  };

  // Storage — requires 'storage' permission
  const storage: PluginAPI['storage'] = {
    get: async (key: string): Promise<string | null> => {
      if (!permissions.has('storage')) {
        throw new Error('Plugin does not have "storage" permission');
      }
      const data = readStorage(pluginId);
      return data[key] ?? null;
    },
    set: async (key: string, value: string): Promise<void> => {
      if (!permissions.has('storage')) {
        throw new Error('Plugin does not have "storage" permission');
      }
      const data = readStorage(pluginId);
      data[key] = value;
      writeStorage(pluginId, data);
    },
    delete: async (key: string): Promise<void> => {
      if (!permissions.has('storage')) {
        throw new Error('Plugin does not have "storage" permission');
      }
      const data = readStorage(pluginId);
      delete data[key];
      writeStorage(pluginId, data);
    },
    keys: async (): Promise<string[]> => {
      if (!permissions.has('storage')) {
        throw new Error('Plugin does not have "storage" permission');
      }
      return Object.keys(readStorage(pluginId));
    },
  };

  // Settings — requires 'settings' permission
  const settings: PluginAPI['settings'] = {
    get: async (key: string): Promise<string | null> => {
      if (!permissions.has('settings')) {
        throw new Error('Plugin does not have "settings" permission');
      }
      try {
        const settingsPath = path.join(PROJECT_ROOT, 'config', 'settings.json');
        if (fs.existsSync(settingsPath)) {
          const raw = fs.readFileSync(settingsPath, 'utf-8');
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          const value = parsed[key];
          return value != null ? String(value) : null;
        }
      } catch {
        // Settings file read failed
      }
      return null;
    },
  };

  return { logger, storage, settings };
}

// ---------------------------------------------------------------------------
// Sandbox Context Factory
// ---------------------------------------------------------------------------

/**
 * Creates a V8 VM context with limited globals.
 *
 * ⚠️ SECURITY NOTE: This sandbox uses Node's `vm` module which provides
 * isolation against *accidental* interference between plugins and the host.
 * It does NOT provide security-grade isolation against malicious code.
 * Plugins are trusted local extensions installed by the user.
 */
function createSandboxContext(api: PluginAPI): vm.Context {
  const sandbox: Record<string, unknown> = {
    // Console proxied through plugin logger
    console: {
      log: api.logger.info,
      info: api.logger.info,
      warn: api.logger.warn,
      error: api.logger.error,
    },

    // Safe built-in globals
    Buffer,
    TextEncoder,
    TextDecoder,
    setTimeout,
    clearTimeout,
    JSON,
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    RegExp,
    Map,
    Set,
    Promise,
    Error,
    TypeError,
    RangeError,
    URIError,
    SyntaxError,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURIComponent,
    decodeURIComponent,
    encodeURI,
    decodeURI,
    atob: globalThis.atob,
    btoa: globalThis.btoa,

    // Crypto from node:crypto
    crypto: {
      createHash: crypto.createHash,
      createHmac: crypto.createHmac,
      randomBytes: crypto.randomBytes,
      randomUUID: crypto.randomUUID,
    },

    // Plugin API
    plugin: api,

    // Module exports — plugin code will assign to this
    module: { exports: {} },
    exports: {},
  };

  return vm.createContext(sandbox, {
    name: 'PluginSandbox',
  });
}

// ---------------------------------------------------------------------------
// Public: Execute Plugin
// ---------------------------------------------------------------------------

/**
 * Executes a plugin's `process(inputs)` function inside a sandboxed VM context.
 *
 * @param manifest - The plugin's validated manifest
 * @param pluginDir - Absolute path to the plugin's directory
 * @param inputs - The inputs from the user
 * @returns PluginExecutionResult with outputs or error
 */
export async function executePluginInSandbox(
  manifest: PluginManifest,
  pluginDir: string,
  inputs: Record<string, unknown>
): Promise<PluginExecutionResult> {
  const startTime = performance.now();

  try {
    // Read the plugin source
    const entryFile = path.join(pluginDir, 'index.js');
    if (!fs.existsSync(entryFile)) {
      return {
        success: false,
        outputs: {},
        error: `Plugin entry file not found: index.js`,
        executionTimeMs: performance.now() - startTime,
      };
    }

    const source = fs.readFileSync(entryFile, 'utf-8');

    // Build sandbox
    const api = createPluginAPI(manifest);
    const context = createSandboxContext(api);

    // Compile and run the plugin module code
    const moduleScript = new vm.Script(
      `(function(module, exports, plugin) {\n${source}\n})(module, module.exports, plugin);`,
      {
        filename: `plugin:${manifest.id}/index.js`,
      }
    );
    moduleScript.runInContext(context, { timeout: EXECUTION_TIMEOUT_MS });

    // Extract the module.exports
    const moduleExports = (context as Record<string, unknown>)['module'] as {
      exports: Record<string, unknown>;
    };
    const pluginModule = moduleExports.exports;

    // Validate process function
    if (typeof pluginModule.process !== 'function') {
      return {
        success: false,
        outputs: {},
        error: 'Plugin does not export a process(inputs) function',
        executionTimeMs: performance.now() - startTime,
      };
    }

    // Execute the process function
    const processResult = pluginModule.process(inputs);

    // Handle both sync and async results
    let outputs: Record<string, unknown>;
    if (processResult && typeof (processResult as Promise<unknown>).then === 'function') {
      // Async — wrap in a timeout race
      outputs = (await Promise.race([
        processResult,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Plugin execution timed out')), EXECUTION_TIMEOUT_MS)
        ),
      ])) as Record<string, unknown>;
    } else {
      outputs = processResult as Record<string, unknown>;
    }

    const executionTimeMs = performance.now() - startTime;

    return {
      success: true,
      outputs: outputs ?? {},
      executionTimeMs,
    };
  } catch (err) {
    const executionTimeMs = performance.now() - startTime;
    const message = err instanceof Error ? err.message : 'Unknown plugin execution error';

    return {
      success: false,
      outputs: {},
      error: message,
      executionTimeMs,
    };
  }
}

// ---------------------------------------------------------------------------
// Public: Run Lifecycle Hook
// ---------------------------------------------------------------------------

/**
 * Runs a lifecycle hook (onLoad, onEnable, onDisable, onUnload) if defined.
 * Errors are caught and logged but never thrown.
 */
export async function runLifecycleHook(
  manifest: PluginManifest,
  pluginDir: string,
  hook: 'onLoad' | 'onEnable' | 'onDisable' | 'onUnload'
): Promise<void> {
  try {
    const entryFile = path.join(pluginDir, 'index.js');
    if (!fs.existsSync(entryFile)) return;

    const source = fs.readFileSync(entryFile, 'utf-8');
    const api = createPluginAPI(manifest);
    const context = createSandboxContext(api);

    const moduleScript = new vm.Script(
      `(function(module, exports, plugin) {\n${source}\n})(module, module.exports, plugin);`,
      { filename: `plugin:${manifest.id}/index.js` }
    );
    moduleScript.runInContext(context, { timeout: EXECUTION_TIMEOUT_MS });

    const moduleExports = (context as Record<string, unknown>)['module'] as {
      exports: Record<string, unknown>;
    };
    const pluginModule = moduleExports.exports;

    if (typeof pluginModule[hook] === 'function') {
      const result = (pluginModule[hook] as () => void | Promise<void>)();
      if (result && typeof (result as Promise<void>).then === 'function') {
        await result;
      }
      console.log(`[Plugin:${manifest.id}] Lifecycle hook '${hook}' executed`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Plugin:${manifest.id}] Lifecycle hook '${hook}' failed: ${message}`);
  }
}
