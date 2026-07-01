import { z } from 'zod';
export const schema = z.object({ count: z.number().min(1).max(100) });
