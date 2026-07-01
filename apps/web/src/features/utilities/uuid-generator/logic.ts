export function generateUuid(): string {
  return crypto.randomUUID();
}

export function generateBulk(count: number): string[] {
  return Array.from({ length: Math.min(count, 100) }, () => generateUuid());
}

export function formatUuid(uuid: string, uppercase: boolean, hyphens: boolean): string {
  let formatted = uppercase ? uuid.toUpperCase() : uuid.toLowerCase();
  if (!hyphens) formatted = formatted.replace(/-/g, '');
  return formatted;
}
