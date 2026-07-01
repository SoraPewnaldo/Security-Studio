const ENCODE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#96;',
};

export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>"'`/]/g, (char) => ENCODE_MAP[char] ?? char);
}

export function decodeHtmlEntities(input: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = input;
  return textarea.value;
}
