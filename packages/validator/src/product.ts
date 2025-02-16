import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10).max(1000),
  price: z.number().min(0),
  rent: z.number().min(0),
});
