import { db } from '@nuxthub/db'
import { eq } from 'drizzle-orm'
import { users } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const [dbUser] = await db.select()
    .from(users)
    .where(eq(users.githubId, session.user.id))
    .limit(1)

  if (!dbUser) {
    throw createError({ statusCode: 404, message: 'User not found in database' })
  }

  return dbUser
})
