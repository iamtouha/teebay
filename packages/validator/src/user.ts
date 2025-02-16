import { z } from 'zod';

export const registerUserSchema = z
  .object({
    firstName: z.string().trim().min(2).max(255),
    lastName: z.string().trim().min(2).max(255),
    phone: z.string().min(10).max(15),
    email: z.string().email(),
    address: z.string().min(5).max(255),
    password: z.string().min(6).max(255),
    repeatPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });
export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});
export type LoginUserInput = z.infer<typeof loginUserSchema>;
