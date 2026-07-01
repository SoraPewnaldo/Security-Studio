import { z } from 'zod';
export const schema = z.object({ ip: z.string().min(1) });
