import { z } from 'zod';

export const sessionIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID format')
  })
});

export const fuelConsumptionSchema = z.object({
  body: z.object({
    sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID format')
  })
});

export const totalCostSchema = z.object({
  body: z.object({
    user: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
  })
});

export const startSessionSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    carId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid car ID format')
  })
});

export const carIdSchema = z.object({
  params: z.object({
    carId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid car ID format')
  })
});

export type SessionIdRequest = z.infer<typeof sessionIdSchema>['params'];
export type FuelConsumptionRequest = z.infer<typeof fuelConsumptionSchema>['body'];
export type TotalCostRequest = z.infer<typeof totalCostSchema>['body'];
export type StartSessionRequest = z.infer<typeof startSessionSchema>['body'];
export type CarIdRequest = z.infer<typeof carIdSchema>['params'];
