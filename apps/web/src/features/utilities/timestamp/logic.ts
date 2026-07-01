import { relativeTime } from '@security-studio/utils';

export interface TimestampResult {
  unix: number;
  unixMs: number;
  utc: string;
  local: string;
  iso: string;
  relative: string;
  dayOfWeek: string;
}

export function convertTimestamp(input: string): TimestampResult {
  let date: Date;

  const trimmed = input.trim();

  if (trimmed === 'now' || trimmed === '') {
    date = new Date();
  } else if (/^\d{10}$/.test(trimmed)) {
    // Unix seconds
    date = new Date(parseInt(trimmed, 10) * 1000);
  } else if (/^\d{13}$/.test(trimmed)) {
    // Unix milliseconds
    date = new Date(parseInt(trimmed, 10));
  } else {
    // Try parsing as date string
    date = new Date(trimmed);
  }

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp or date string');
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return {
    unix: Math.floor(date.getTime() / 1000),
    unixMs: date.getTime(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    iso: date.toISOString(),
    relative: relativeTime(date),
    dayOfWeek: days[date.getDay()]!,
  };
}

export function getCurrentTimestamp(): { unix: number; unixMs: number } {
  const now = Date.now();
  return { unix: Math.floor(now / 1000), unixMs: now };
}
