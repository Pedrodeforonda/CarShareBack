import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be less than 50 characters')
      .trim(),
    email: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(6, 'Password must be at least 6 characters long')
      .max(128, 'Password must be less than 128 characters')
  })
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(1, 'Password is required')
  })
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
  })
});

export type RegisterUserRequest = z.infer<typeof registerUserSchema>['body'];
export type LoginUserRequest = z.infer<typeof loginUserSchema>['body'];
export type UserIdRequest = z.infer<typeof userIdSchema>['params'];
