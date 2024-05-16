/*
  Utilizado para definir um tipo de usuário ao receber
  um request do plugin fastify
*/

import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: {
      id: string
      session_id?: string
      name: string
      created_at: string
    }
  }
}
