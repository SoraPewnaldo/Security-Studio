export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = 'O0Il1';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  if (options.uppercase) charset += UPPER;
  if (options.lowercase) charset += LOWER;
  if (options.numbers) charset += DIGITS;
  if (options.symbols) charset += SYMBOLS;

  if (!charset) charset = LOWER;

  if (options.excludeAmbiguous) {
    charset = charset.split('').filter((c) => !AMBIGUOUS.includes(c)).join('');
  }

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map((n) => charset[n % charset.length])
    .join('');
}

export function generateMultiple(options: PasswordOptions, count: number): string[] {
  return Array.from({ length: count }, () => generatePassword(options));
}

export function calculateEntropy(options: PasswordOptions): number {
  let poolSize = 0;
  if (options.uppercase) poolSize += 26;
  if (options.lowercase) poolSize += 26;
  if (options.numbers) poolSize += 10;
  if (options.symbols) poolSize += SYMBOLS.length;
  if (poolSize === 0) poolSize = 26;
  if (options.excludeAmbiguous) poolSize -= AMBIGUOUS.length;
  return Math.floor(options.length * Math.log2(Math.max(poolSize, 1)));
}
