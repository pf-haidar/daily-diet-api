import { z } from 'zod'

export const createMealBodySchema = z.object({
  description: z.string(),
  mealTime: z.date(),
  isEnabled: z.boolean(),
  userId: z.string(),
})
