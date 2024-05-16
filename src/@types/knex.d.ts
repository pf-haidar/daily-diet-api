// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      total_meals: number
      total_enabled_meals: number
      total_disabled_meals: number
      best_meals_sequence: number
      created_at: string
      session_id?: string
    }
    meals: {
      id: string
      description: string
      meal_time: date
      is_enabled: boolean
      created_at: string
      user_id: string
    }
  }
}
