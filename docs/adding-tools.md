# Adding a Custom Tool

Security Studio is built on a **manifest-driven auto-discovery architecture**. You do not need to edit any routing, registry, or menu files to add a new tool. Simply drop a folder with the correct manifest and UI components under `apps/web/src/features/`, and Vite will register it at build time.

---

## Folder Structure

To add a tool, create a new subfolder in `apps/web/src/features/<category>/<tool-id>/` containing:

```text
my-tool/
├── manifest.ts    # Tool metadata (id, name, tags, example inputs)
├── Tool.tsx       # React component for the tool UI
├── logic.ts       # Cryptographic or parsing logic functions (optional)
└── README.md      # Tool documentation (rendered inside the documentation tab)
```

---

## Step 1: Create the manifest (`manifest.ts`)

The manifest contains metadata used for search indexing, category matching, and pre-loading input examples.

```typescript
import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'my-custom-tool',
  name: 'My Custom Tool',
  description: 'Explain what your tool does in a single sentence.',
  category: 'utilities', // authentication | cryptography | encoding | networking | utilities | web-security
  tags: ['search-keyword-1', 'search-keyword-2'],
  examples: [
    {
      label: 'Default Example',
      input: {
        payload: 'Demo input data'
      }
    }
  ]
};
```

---

## Step 2: Implement the Component (`Tool.tsx`)

Each tool is wrapped in a standard `ToolLayout` containing three panels: **Tool (interactive panel)**, **Examples**, and **Documentation**.

```tsx
import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { manifest } from './manifest';
import readme from './README.md?raw'; // Load Markdown as a string

export default function Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // Handle loading pre-configured inputs from the Examples tab
  const handleLoadExample = (example: typeof manifest.examples[0]) => {
    setInput(example.input.payload || '');
  };

  const handleProcess = () => {
    // Process input data
    setOutput(input.toUpperCase());
  };

  return (
    <ToolLayout
      manifest={manifest}
      readme={readme}
      onLoadExample={handleLoadExample}
    >
      <div className="space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-text-muted font-medium">Input Panel</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg p-3 text-sm text-text focus:outline-none"
            rows={5}
          />
        </div>

        <button
          onClick={handleProcess}
          className="px-4 py-2 bg-primary text-bg font-medium rounded-md hover:bg-primary-hover transition-colors"
        >
          Process Data
        </button>

        {output && (
          <div>
            <label className="text-[11px] uppercase tracking-wider text-text-muted font-medium">Output Panel</label>
            <pre className="bg-bg border border-border rounded-lg p-3 text-sm text-text overflow-x-auto">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
```

---

## Step 3: Write Documentation (`README.md`)

Write standard Markdown. It is loaded inside the **Documentation** tab of the `ToolLayout`.

```markdown
# My Custom Tool

A detailed description of the tool's usage, algorithms, or technical implementation.

## How it works

Explain the math, encoding scheme, or backend proxying logic:
- Step 1: User enters payload
- Step 2: Payload gets converted

## Security Consideration

Since Security Studio is offline-first, your inputs are processed client-side. No remote API calls are dispatched.
```

---

## Discovery Check

Once your files are saved, boot up the project:
```bash
npm run dev
```
The dynamic tool resolver in `register-tools.ts` will:
1. Locate your files
2. Insert the tool into the **Search Index**
3. Create the route `/tools/my-custom-tool` automatically
4. Append the tool under the **Utilities** sidebar dropdown category
