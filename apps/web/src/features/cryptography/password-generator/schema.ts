import { z } from 'zod';
export const passwordOptionsSchema = z.object({
  length: z.number().min(4).max(128),
  uppercase: z.boolean(),
  lowercase: z.boolean(),
  numbers: z.boolean(),
  symbols: z.boolean(),
  excludeAmbiguous: z.boolean(),
});
