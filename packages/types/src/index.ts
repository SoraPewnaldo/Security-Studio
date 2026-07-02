// ============================================================
// Tool System Types
// ============================================================

export type ToolCategory = string;

export interface ToolExample {
  /** Human-readable label for the example */
  label: string;
  /** Pre-filled input values */
  input: Record<string, unknown>;
  /** Brief description of what this example demonstrates */
  description: string;
}

export interface KeyboardShortcut {
  /** Display label, e.g. "Encode" */
  label: string;
  /** Key combination, e.g. "Ctrl+Enter" */
  keys: string;
  /** Action identifier */
  action: string;
}

export interface ToolManifest {
  /** Unique tool identifier, e.g. "base64" */
  id: string;
  /** Display name, e.g. "Base64 Encoder/Decoder" */
  name: string;
  /** One-line description */
  description: string;
  /** Tool category for sidebar grouping */
  category: ToolCategory;
  /** Searchable tags */
  tags: string[];
  /** Additional search keywords */
  keywords: string[];
  /** Semver version */
  version: string;
  /** Author name */
  author: string;
  /** Lucide icon name */
  icon: string;
  /** Tool-specific keyboard shortcuts */
  shortcuts: KeyboardShortcut[];
  /** Pre-built examples */
  examples: ToolExample[];
}

// ============================================================
// Category Metadata
// ============================================================

export interface CategoryInfo {
  id: ToolCategory;
  label: string;
  icon: string;
  description: string;
}

// (Categories are dynamically computed from manifests)

// ============================================================
// API Types
// ============================================================

export interface Favorite {
  id: number;
  toolId: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: number;
  toolId: string;
  toolName: string;
  action: string;
  inputSummary: string;
  outputSummary: string;
  createdAt: string;
}

export interface Workspace {
  id: number;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  tools?: WorkspaceTool[];
}

export interface WorkspaceTool {
  id: number;
  workspaceId: number;
  toolId: string;
  order: number;
  addedAt: string;
}

export interface Snippet {
  id: number;
  title: string;
  content: string;
  language: string;
  toolId: string | null;
  workspaceId: number | null;
  createdAt: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  updatedAt: string;
}

export interface RecentSearch {
  id: number;
  query: string;
  resultCount: number;
  createdAt: string;
}

export interface PinnedTool {
  id: number;
  toolId: string;
  order: number;
  createdAt: string;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================
// Event Bus Types
// ============================================================

export interface EventMap {
  'tool:run': { toolId: string; toolName: string; action: string };
  'tool:favorite': { toolId: string; favorited: boolean };
  'history:add': { entry: Omit<HistoryEntry, 'id' | 'createdAt'> };
  'snippet:save': { snippet: Omit<Snippet, 'id' | 'createdAt'> };
  'workspace:update': { workspaceId: number };
  'search:query': { query: string; resultCount: number };
  'theme:change': { theme: ThemeName };
  'pinned:update': { toolId: string; pinned: boolean };
}

export type EventName = keyof EventMap;

// ============================================================
// Theme Types
// ============================================================

export type ThemeName = 'dark' | 'light' | 'github-dark' | 'github-light' | 'system';

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    primary: string;
    primaryHover: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    success: string;
    warning: string;
    danger: string;
  };
}

// ============================================================
// Plugin System Types (re-export)
// ============================================================

export type {
  PluginPermission,
  PluginInput,
  PluginOutput,
  PluginManifest,
  PluginLifecycle,
  PluginAPI,
  PluginStatus,
  LoadedPlugin,
  PluginExecutionResult,
  PluginListItem,
} from './plugin-types.js';

export type {
  Playbook,
  PlaybookStep,
  PlaybookSessionData,
  PlaybookReport,
  PlaybookRisk,
  PlaybookBranch,
  PlaybookAutoAnalysis,
} from './playbook-types.js';
