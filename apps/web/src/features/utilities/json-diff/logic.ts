import { diffLines, Change } from 'diff';

export interface DiffResult {
  changes: Change[];
  error?: string;
}

export function computeJsonDiff(json1: string, json2: string): DiffResult {
  if (!json1.trim() && !json2.trim()) {
    return { changes: [] };
  }

  let formatted1 = '';
  let formatted2 = '';

  try {
    const obj1 = json1.trim() ? JSON.parse(json1) : null;
    formatted1 = obj1 !== null ? JSON.stringify(obj1, null, 2) : '';
  } catch (e: any) {
    return { changes: [], error: `Invalid JSON in Original: ${e.message}` };
  }

  try {
    const obj2 = json2.trim() ? JSON.parse(json2) : null;
    formatted2 = obj2 !== null ? JSON.stringify(obj2, null, 2) : '';
  } catch (e: any) {
    return { changes: [], error: `Invalid JSON in Modified: ${e.message}` };
  }

  // Ensure trailing newline for correct diff line handling
  if (formatted1) formatted1 += '\n';
  if (formatted2) formatted2 += '\n';

  const changes = diffLines(formatted1, formatted2);
  return { changes };
}
