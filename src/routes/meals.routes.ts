import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import {
  createMealBodySchema,
  updateMealBodySchema,
} from '../schemas/meals.schema'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { name, description, mealTime, isEnabled, userId } =
        createMealBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        meal_time: mealTime.getTime(),
        is_enabled: isEnabled,
        user_id: userId,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({
          user_id: request.user?.id,
        })
        .orderBy('created_at', 'desc')

      reply.send({ meals })
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ id: z.string().uuid() })

      const { id } = paramsSchema.parse(request.params)

      const meal = await knex('meals').where({ id }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      return reply.send({ meal })
    },
  )

  app.put(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ id: z.string().uuid() })

      const { id } = paramsSchema.parse(request.params)

      const { name, description, isEnabled, mealTime } =
        updateMealBodySchema.parse(request.body)

      const meal = await knex('meals').where({ id }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals').where({ id }).update({
        name,
        description,
        is_enabled: isEnabled,
        meal_time: mealTime,
      })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ id: z.string().uuid() })

      const { id } = paramsSchema.parse(request.params)

      const meal = await knex('meals').where({ id }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals').where({ id }).delete()

      return reply.status(204).send()
    },
  )

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const totalMealsEnabled = await knex('meals')
        .where({
          user_id: request.user?.id,
          is_enabled: true,
        })
        .count('id', { as: 'total' })
        .first()

      const totalMealsDisabled = await knex('meals')
        .where({
          user_id: request.user?.id,
          is_enabled: false,
        })
        .count('id', { as: 'total' })
        .first()

      const totalMeals = await knex('meals')
        .where({
          user_id: request.user?.id,
        })
        .orderBy('mealTime', 'desc')

      return reply.send({
        totalMeals: totalMeals.length,
        totalMealsEnabled: totalMealsEnabled?.total,
        totalMealsDisabled: totalMealsDisabled?.total,
      })
    },
  )
}
