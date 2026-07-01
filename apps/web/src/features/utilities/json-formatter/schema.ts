import { z } from 'zod';
export const schema = z.object({ json: z.string().min(1) });
