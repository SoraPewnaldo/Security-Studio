export interface RotNConfig {
  shift: number;
}

export function rotN(text: string, config: RotNConfig = { shift: 13 }): string {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string.');
  }
  
  if (typeof config.shift !== 'number' || !Number.isInteger(config.shift)) {
    throw new Error('Shift value must be an integer.');
  }

  const shift = config.shift % 26;
  const sNormalized = shift < 0 ? shift + 26 : shift;

  return text.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const base = code >= 65 && code <= 90 ? 65 : 97;
    return String.fromCharCode(((code - base + sNormalized) % 26) + base);
  });
}
