import { z } from 'zod';
export const schema = z.object({ pattern: z.string(), flags: z.string(), testString: z.string() });
