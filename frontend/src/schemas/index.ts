import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a digit'),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  description: z.string().max(1000).optional().default(''),
  price: z.coerce.number().positive('Price must be greater than zero'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  imageUrl: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  categoryId: z.coerce.number().int().positive('Select a category'),
});
export type ProductFormValues = z.infer<typeof productSchema>;
