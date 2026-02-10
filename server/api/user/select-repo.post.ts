import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { users } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { repo } = await readValidatedBody(event, z.object({
    repo: z.string().min(1),
  }).parse)

  const session = await getUserSession(event)

  if (!session.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated or Session expired',
    })
  }

  const db = useDb()
  const crypto = useEncryption()

  const encryptedRepo = crypto.encrypt(repo)

  try {
    await db.update(users)
      .set({
        selectedRepo: encryptedRepo,
        updatedAt: new Date(),
      })
      .where(eq(users.githubId, session.user.id))

    await setUserSession(event, {
      ...session,
      repo,
    })

    return {
      success: true,
      message: `Repository ${repo} selected and saved.`,
    }
  }
  catch (error: any) {
    console.error('Failed to save selected repo:', error)
    throw createError({
      statusCode: 500,
      message: 'Database error while saving repository selection.',
    })
  }
})
