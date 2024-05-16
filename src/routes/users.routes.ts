import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
// import { z } from 'zod'
import { knex } from '../database'
import { createUserBodySchema } from '../schemas/users.schema'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select('*')
    return { users }
  })

  app.post('/', async (request, reply) => {
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const {
      name,
      totalMeals,
      totalEnabledMeals,
      totalDisabledMeals,
      bestMealsSequence,
    } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      total_meals: totalMeals,
      total_enabled_meals: totalEnabledMeals,
      total_disabled_meals: totalDisabledMeals,
      best_meals_sequence: bestMealsSequence,
    })

    return reply.status(201).send()
  })
}
