import { z } from 'zod'

export const createUserBodySchema = z.object({
  name: z.string(),
  totalMeals: z.number().int(),
  totalEnabledMeals: z.number().int(),
  totalDisabledMeals: z.number().int(),
  bestMealsSequence: z.number().int(),
})
