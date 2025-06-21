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

export type SessionIdRequest = z.infer<typeof sessionIdSchema>['params'];
export type FuelConsumptionRequest = z.infer<typeof fuelConsumptionSchema>['body'];
export type TotalCostRequest = z.infer<typeof totalCostSchema>['body'];
