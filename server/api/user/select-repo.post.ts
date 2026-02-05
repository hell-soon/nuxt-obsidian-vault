import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { repo } = await readValidatedBody(event, z.object({
    repo: z.string().min(1),
  }).parse)

  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  await setUserSession(event, {
    user: session.user,
    secure: session.secure,
    repo,
  })

  return { success: true }
})
