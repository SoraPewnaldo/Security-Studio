import { z } from 'zod';
export const schema = z.record(z.array(z.string()));
