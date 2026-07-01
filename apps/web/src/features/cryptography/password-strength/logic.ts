export interface StrengthResult {
  score: number;        // 0-4
  label: string;        // Weak, Fair, Good, Strong, Very Strong
  entropy: number;      // bits
  crackTime: string;    // human-readable
  charAnalysis: {
    length: number;
    uppercase: number;
    lowercase: number;
    numbers: number;
    symbols: number;
    spaces: number;
  };
  suggestions: string[];
}

const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine', 'letmein',
  'password1', 'admin', 'welcome', 'shadow', 'ashley', 'michael',
];

export function analyzePassword(password: string): StrengthResult {
  const analysis = {
    length: password.length,
    uppercase: (password.match(/[A-Z]/g) || []).length,
    lowercase: (password.match(/[a-z]/g) || []).length,
    numbers: (password.match(/[0-9]/g) || []).length,
    symbols: (password.match(/[^A-Za-z0-9\s]/g) || []).length,
    spaces: (password.match(/\s/g) || []).length,
  };

  // Calculate pool size
  let poolSize = 0;
  if (analysis.uppercase > 0) poolSize += 26;
  if (analysis.lowercase > 0) poolSize += 26;
  if (analysis.numbers > 0) poolSize += 10;
  if (analysis.symbols > 0) poolSize += 32;
  if (analysis.spaces > 0) poolSize += 1;
  if (poolSize === 0) poolSize = 1;

  const entropy = Math.floor(password.length * Math.log2(poolSize));
  const combinations = Math.pow(2, entropy);

  // Assume 10 billion guesses/sec (modern GPU)
  const GUESSES_PER_SEC = 10_000_000_000;
  const seconds = combinations / GUESSES_PER_SEC;
  const crackTime = formatCrackTime(seconds);

  // Score
  let score = 0;
  if (entropy >= 28) score = 1;
  if (entropy >= 36) score = 2;
  if (entropy >= 60) score = 3;
  if (entropy >= 80) score = 4;

  // Penalize common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    score = 0;
  }

  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  // Suggestions
  const suggestions: string[] = [];
  if (password.length < 12) suggestions.push('Use at least 12 characters');
  if (analysis.uppercase === 0) suggestions.push('Add uppercase letters');
  if (analysis.lowercase === 0) suggestions.push('Add lowercase letters');
  if (analysis.numbers === 0) suggestions.push('Add numbers');
  if (analysis.symbols === 0) suggestions.push('Add special characters');
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    suggestions.push('Avoid common passwords');
  }
  if (/(.)\1{2,}/.test(password)) suggestions.push('Avoid repeated characters');

  return {
    score,
    label: labels[score] ?? 'Weak',
    entropy,
    crackTime,
    charAnalysis: analysis,
    suggestions,
  };
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
  if (seconds < 31536000 * 1000) return `${Math.floor(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1e6) return `${Math.floor(seconds / (31536000 * 1000))} thousand years`;
  if (seconds < 31536000 * 1e9) return `${Math.floor(seconds / (31536000 * 1e6))} million years`;
  return `${(seconds / (31536000 * 1e9)).toExponential(1)} billion years`;
}
