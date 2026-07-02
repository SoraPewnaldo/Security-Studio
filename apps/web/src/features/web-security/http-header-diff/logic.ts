import { diffLines, type Change } from 'diff';

export interface DiffResult {
  changes: Change[];
}

function normalizeHeaders(headers: string): string {
  if (!headers) return '';
  // Split into lines, trim, ignore empty
  const lines = headers.split(/\r?\n/).map(l => l.trim()).filter(l => l);
  
  const parsed = lines.map(line => {
    // If it's a request/response line (e.g. GET / HTTP/1.1)
    if (!line.includes(':') && (line.startsWith('HTTP') || line.includes('HTTP'))) {
      return { key: '=== Status ===', value: line, original: line };
    }
    const idx = line.indexOf(':');
    if (idx === -1) return { key: line, value: '', original: line };
    
    // Normalize header keys to lowercase for comparison
    return {
      key: line.substring(0, idx).trim().toLowerCase(),
      value: line.substring(idx + 1).trim(),
      original: `${line.substring(0, idx).trim()}: ${line.substring(idx + 1).trim()}`
    };
  });

  // Sort by key to make diffing robust against header reordering
  parsed.sort((a, b) => a.key.localeCompare(b.key));
  
  return parsed.map(p => p.original).join('\n') + '\n';
}

export function computeHeaderDiff(headers1: string, headers2: string): DiffResult {
  if (!headers1.trim() && !headers2.trim()) return { changes: [] };

  const norm1 = normalizeHeaders(headers1);
  const norm2 = normalizeHeaders(headers2);

  const changes = diffLines(norm1, norm2);
  return { changes };
}
