import React from 'react';
import { registerTool } from '@security-studio/tool-sdk';
import { searchIndex } from '@security-studio/core';
import { toolRegistry } from '@security-studio/tool-sdk';
import type { ToolManifest } from '@security-studio/types';

// Use Vite's glob import to automatically find all manifests and Tool components
const manifests = import.meta.glob<{ manifest: ToolManifest }>('./**/*/manifest.ts', { eager: true });
const tools = import.meta.glob<{ default: React.ComponentType<any> }>('./**/*/Tool.tsx', { eager: false });

// Register discovered tools
for (const [path, module] of Object.entries(manifests)) {
  const dir = path.replace('/manifest.ts', '');
  const toolPath = `${dir}/Tool.tsx`;
  
  if (module.manifest && tools[toolPath]) {
    const lazyComponent = React.lazy(tools[toolPath]);
    registerTool(module.manifest, lazyComponent);
  } else {
    console.warn(`[Tool Registry] Incomplete tool found at ${dir}`);
  }
}

// Build the search index
searchIndex.build(toolRegistry.getAllManifests());
