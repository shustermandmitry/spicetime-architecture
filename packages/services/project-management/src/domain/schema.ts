import { z } from 'zod';

/**
 * Base schema for all project management entities
 */
export const baseEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date()
});
