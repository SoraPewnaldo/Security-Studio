export function textToUnicode(text: string): string {
  if (!text) return '';
  return Array.from(text)
    .map((char) => {
      const codePoint = char.codePointAt(0)!;
      if (codePoint > 0xffff) {
        return `\\u{${codePoint.toString(16).toUpperCase()}}`;
      }
      return `\\u${codePoint.toString(16).padStart(4, '0').toUpperCase()}`;
    })
    .join('');
}

export function unicodeToText(escaped: string): string {
  if (!escaped) return '';
  try {
    // Handle \u{XXXXX} (code points > U+FFFF)
    let result = escaped.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => {
      const codePoint = parseInt(hex, 16);
      if (codePoint > 0x10ffff) throw new Error(`Invalid code point: U+${hex.toUpperCase()}`);
      return String.fromCodePoint(codePoint);
    });
    // Handle \uXXXX
    result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    // Handle \xXX
    result = result.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    return result;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to decode unicode escapes');
  }
}

export function textToCodePoints(text: string): string {
  if (!text) return '';
  return Array.from(text)
    .map((char) => {
      const cp = char.codePointAt(0)!;
      return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
    })
    .join(' ');
}
