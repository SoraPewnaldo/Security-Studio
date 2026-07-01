export function formatJson(input: string, indent = 2): string {
  return JSON.stringify(JSON.parse(input), null, indent);
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

export function validateJson(input: string): { valid: boolean; error: string | null; lineCount: number; size: number } {
  try {
    JSON.parse(input);
    const lines = input.split('\n').length;
    return { valid: true, error: null, lineCount: lines, size: new Blob([input]).size };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : 'Invalid JSON', lineCount: 0, size: 0 };
  }
}
