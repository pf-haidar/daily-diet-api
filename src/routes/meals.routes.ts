import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { createMealBodySchema } from '../schemas/meals.schema'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {})

  app.post('/', async (request, reply) => {
    const { description, mealTime, isEnabled, userId } =
      createMealBodySchema.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      description,
      meal_time: mealTime,
      is_enabled: isEnabled,
      user_id: userId,
    })

    return reply.status(201).send()
  })
}
