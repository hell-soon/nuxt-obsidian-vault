import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '~~/server/db/schema'

let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDb() {
  if (db)
    return db

  const config = useRuntimeConfig()

  const url = config.databaseUrl

  if (!url) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Database URL is not configured.',
    })
  }

  const sql = neon(url)

  db = drizzle(sql, { schema })

  return db
}
