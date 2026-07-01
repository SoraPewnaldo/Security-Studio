import type { ToolManifest, ToolCategory } from '@security-studio/types';
import type { ComponentType } from 'react';

// ============================================================
// Tool Registration Types
// ============================================================

export interface RegisteredTool {
  manifest: ToolManifest;
  component: ComponentType;
  logic: Record<string, unknown>;
}

// ============================================================
// Tool Registry — singleton store for all registered tools
// ============================================================

class ToolRegistry {
  private tools: Map<string, RegisteredTool> = new Map();

  /**
   * Register a tool with its manifest, component, and logic module.
   * Calling this makes the tool available everywhere: sidebar, search,
   * command palette, dashboard, routing.
   */
  register(
    manifest: ToolManifest,
    component: ComponentType,
    logic: Record<string, unknown> = {}
  ): void {
    if (this.tools.has(manifest.id)) {
      console.warn(`[ToolRegistry] Tool "${manifest.id}" is already registered. Overwriting.`);
    }
    this.tools.set(manifest.id, { manifest, component, logic });
  }

  /** Get a single tool by ID */
  getById(id: string): RegisteredTool | undefined {
    return this.tools.get(id);
  }

  /** Get all registered tools */
  getAll(): RegisteredTool[] {
    return Array.from(this.tools.values());
  }

  /** Get all manifests (lightweight, no components) */
  getAllManifests(): ToolManifest[] {
    return this.getAll().map((t) => t.manifest);
  }

  /** Get tools filtered by category */
  getByCategory(category: ToolCategory): RegisteredTool[] {
    return this.getAll().filter((t) => t.manifest.category === category);
  }

  /** Get all categories that have at least one tool */
  getActiveCategories(): ToolCategory[] {
    const categories = new Set<ToolCategory>();
    for (const tool of this.tools.values()) {
      categories.add(tool.manifest.category);
    }
    return Array.from(categories);
  }

  /** Get category with tool count */
  getCategoryCounts(): Map<ToolCategory, number> {
    const counts = new Map<ToolCategory, number>();
    for (const tool of this.tools.values()) {
      const cat = tool.manifest.category;
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    return counts;
  }

  /** Total number of registered tools */
  get size(): number {
    return this.tools.size;
  }

  /** Check if a tool is registered */
  has(id: string): boolean {
    return this.tools.has(id);
  }
}

/** Singleton tool registry instance */
export const toolRegistry = new ToolRegistry();

/**
 * Convenience function to register a tool.
 * Usage in each tool's manifest.ts:
 *
 * ```ts
 * import { registerTool } from '@security-studio/tool-sdk';
 * import { manifest } from './manifest';
 * import Tool from './Tool';
 * import * as logic from './logic';
 *
 * registerTool(manifest, Tool, logic);
 * ```
 */
export function registerTool(
  manifest: ToolManifest,
  component: ComponentType,
  logic: Record<string, unknown> = {}
): void {
  toolRegistry.register(manifest, component, logic);
}

export { ToolRegistry };
