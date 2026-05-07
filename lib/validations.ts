import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(1, 'Username is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type RegisterFormData = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// Writer schema
export const writerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  status: z.enum(['active', 'inactive']),
})

export type WriterFormData = z.infer<typeof writerSchema>

// Order schema
export const createOrderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  discipline: z.string().min(1, 'Discipline is required'),
  totalPrice: z.coerce.number().positive('Total price must be greater than 0'),
  price_per_page: z.coerce.number().positive('Price per page must be greater than 0'),
  total_pages: z.coerce.number().int('Total pages must be a number').positive('Total pages must be greater than 0'),
  files: z.array(z.any()).min(1, 'At least one file is required'),
  deadline: z.string().min(1, 'Deadline is required'),
})

export type CreateOrderFormData = z.infer<typeof createOrderSchema>

// Comment schema
export const commentSchema = z.object({
  comment: z.string().min(1, 'Comment is required'),
})

export type CommentFormData = z.infer<typeof commentSchema>
