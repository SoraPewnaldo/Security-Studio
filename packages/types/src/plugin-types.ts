// ============================================================
// Plugin System Types
// ============================================================

import type { ToolCategory } from './index.js';

// ---------------------------------------------------------------------------
// Plugin Permissions
// ---------------------------------------------------------------------------

/**
 * Permissions a plugin can request. The Plugin Manager only exposes
 * APIs matching the declared permissions.
 */
export type PluginPermission =
  | 'logger'       // Access to console logger
  | 'storage'      // Read/write plugin-scoped persistent storage
  | 'clipboard'    // Access clipboard (via the frontend)
  | 'network'      // Future: outbound HTTP requests
  | 'filesystem'   // Future: read files from disk
  | 'workspace'    // Access workspace data
  | 'history'      // Read/write history entries
  | 'settings'     // Read app settings
  | 'shell'        // Dangerous: Run shell commands
  | 'process'      // Dangerous: Spawn child processes
  | 'system';      // Dangerous: Access system APIs

// ---------------------------------------------------------------------------
// Plugin Manifest
// ---------------------------------------------------------------------------

export interface PluginInput {
  /** Field name (used as key in the inputs object) */
  name: string;
  /** Input type for UI rendering */
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'file';
  /** Human-readable label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Default value */
  default?: unknown;
  /** Whether the field is required */
  required?: boolean;
  /** Options for select inputs */
  options?: { label: string; value: string }[];
}

export interface PluginOutput {
  /** Output name (used as key in the outputs object) */
  name: string;
  /** Output rendering type */
  type: 'text' | 'code' | 'json' | 'table' | 'html';
  /** Human-readable label */
  label: string;
}

export interface PluginManifest {
  /** Unique plugin identifier, e.g. "jwt-pro" */
  id: string;
  /** Display name */
  name: string;
  /** Semver version string */
  version: string;
  /** One-line description */
  description: string;
  /** Author name */
  author: string;
  /** Tool category for grouping */
  category: ToolCategory;
  /** Lucide icon name */
  icon: string;
  /** Searchable tags */
  tags: string[];

  /** Form inputs the plugin accepts */
  inputs: PluginInput[];
  /** Output panels the plugin produces */
  outputs: PluginOutput[];

  /** Permissions the plugin requires */
  permissions: PluginPermission[];

  /** App version compatibility range, e.g. ">=1.0.0 <2.0.0" */
  engine?: string;

  /** Homepage URL */
  homepage?: string;
  /** License identifier */
  license?: string;
}

// ---------------------------------------------------------------------------
// Plugin Lifecycle
// ---------------------------------------------------------------------------

/**
 * Lifecycle hooks a plugin can implement.
 * Even if not used in v1, defining them now avoids breaking changes.
 */
export interface PluginLifecycle {
  /** Called when the plugin is first loaded */
  onLoad?: () => void | Promise<void>;
  /** Called when the plugin is enabled */
  onEnable?: () => void | Promise<void>;
  /** Called when the plugin is disabled */
  onDisable?: () => void | Promise<void>;
  /** Called when the plugin is unloaded (server shutdown / reload) */
  onUnload?: () => void | Promise<void>;
}

// ---------------------------------------------------------------------------
// Plugin API (exposed to plugins inside the sandbox)
// ---------------------------------------------------------------------------

/**
 * The API surface exposed to plugin code. Plugins do NOT get raw fs,
 * child_process, or database access. Only these controlled interfaces.
 */
export interface PluginAPI {
  /** Log messages (proxied through the app logger) */
  logger: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };

  /** Plugin-scoped key-value storage */
  storage: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
    delete: (key: string) => Promise<void>;
    keys: () => Promise<string[]>;
  };

  /** Read-only access to app settings */
  settings: {
    get: (key: string) => Promise<string | null>;
  };
}

// ---------------------------------------------------------------------------
// Loaded Plugin Runtime Types
// ---------------------------------------------------------------------------

export type PluginStatus = 'loaded' | 'error' | 'disabled';

export interface LoadedPlugin {
  manifest: PluginManifest;
  status: PluginStatus;
  error?: string;
  /** Directory path on disk */
  path: string;
}

export interface PluginExecutionResult {
  success: boolean;
  outputs: Record<string, unknown>;
  error?: string;
  executionTimeMs: number;
}

export interface PluginListItem {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: ToolCategory;
  icon: string;
  status: PluginStatus;
  error?: string;
  permissions: PluginPermission[];
}
