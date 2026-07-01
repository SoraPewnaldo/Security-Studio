import { z } from 'zod';
export const schema = z.object({ cidr: z.string().min(1) });
