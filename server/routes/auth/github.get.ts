import { schema } from '@nuxthub/db'
import { users } from '~~/server/db/schema'
import { useDb } from '~~/server/utils/db'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }) {
    const db = useDb()

    const [dbUser] = await db.insert(schema.users)
      .values({
        githubId: user.id,
        avatarUrl: user.avatar_url,
      })
      .onConflictDoUpdate({
        target: users.githubId,
        set: {
          avatarUrl: user.avatar_url,
        },
      })
      .returning()

    await setUserSession(event, {
      user: {
        avatar: user.avatar_url,
        email: user.email,
        name: user.name,
        id: user.id,
        login: user.login,
      },
      secure: {
        githubToken: tokens.access_token,
      },
      repo: dbUser?.selectedRepo || null,
    })

    if (dbUser?.selectedRepo) {
      return sendRedirect(event, '/notes')
    }

    return sendRedirect(event, '/select-repo')
  },
  onError(event, error) {
    console.error('GitHub OAuth Error:', error)
    return sendRedirect(event, '/')
  },
})
