import { z } from 'zod';
export const schema = z.object({ headers: z.string().min(1) });
