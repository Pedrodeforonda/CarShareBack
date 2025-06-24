import { z } from 'zod';

export const registerCarSchema = z.object({
  body: z.object({
    model: z.string()
      .min(1, 'Model is required')
      .max(50, 'Model must be less than 50 characters')
      .trim(),
    brand: z.string()
      .min(1, 'Brand is required')
      .max(50, 'Brand must be less than 50 characters')
      .trim(),
    year: z.number()
      .int('Year must be an integer')
      .min(1900, 'Year must be 1900 or later')
      .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
    fuelEfficiency: z.number()
      .min(1, 'Fuel efficiency must be at least 1 km/liter')
      .max(50, 'Fuel efficiency cannot exceed 50 km/liter')
      .default(11.5),
    admin: z.string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid admin ID format'),
    users: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'))
      .optional()
      .default([])
  })
});

export const carIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid car ID format')
  })
});

export const adminIdSchema = z.object({
  params: z.object({
    adminId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid admin ID format')
  })
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
  })
});

export const deleteCarSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid car ID format')
  }),
  body: z.object({
    adminId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid admin ID format')
  })
});

export type RegisterCarRequest = z.infer<typeof registerCarSchema>['body'];
export type CarIdRequest = z.infer<typeof carIdSchema>['params'];
export type AdminIdRequest = z.infer<typeof adminIdSchema>['params'];
export type UserIdParamRequest = z.infer<typeof userIdParamSchema>['params'];
export type DeleteCarRequest = z.infer<typeof deleteCarSchema>;
