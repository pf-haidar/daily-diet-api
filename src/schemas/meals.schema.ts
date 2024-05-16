import { z } from 'zod'

export const createMealBodySchema = z.object({
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  mealTime: z.coerce.date(),
  isEnabled: z.boolean(),
})

export const updateMealBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  mealTime: z.coerce.date(),
  isEnabled: z.boolean(),
})
