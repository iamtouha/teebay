import { z } from 'zod';

export enum Category {
  ELECTRONICS = 'ELECTRONICS',
  FURNITURE = 'FURNITURE',
  HOME_APPLIANCES = 'HOME_APPLIANCES',
  SPORTING_GOODS = 'SPORTING_GOODS',
  OUTDOOR = 'OUTDOOR',
  TOYS = 'TOYS',
}

export const createProductSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10).max(1000),
  price: z.number().min(0.1),
  rent: z.number().min(0.1),
  categories: z.array(z.nativeEnum(Category)).min(1),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.extend({ id: z.number().positive() });
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const deleteProductSchema = z.object({ id: z.number().positive() });
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;

export const getProductSchema = z.object({ id: z.number().positive() });
export type GetProductInput = z.infer<typeof getProductSchema>;

export const listProductsSchema = z.object({
  search: z.string().trim().optional(),
  offset: z.number().positive().default(0),
  limit: z.number().positive().default(10),
});
export type ListProductsInput = z.infer<typeof listProductsSchema>;
