import { z } from 'zod';

export const hashInputSchema = z.object({
  text: z.string(),
  algorithm: z.enum(['SHA-1', 'SHA-256', 'SHA-512', 'MD5']),
});
