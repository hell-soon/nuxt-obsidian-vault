import { users } from '~~/server/db/schema'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
    scope: ['user:email', 'repo'],
  },
  async onSuccess(event, { user, tokens }) {
    const db = useDb()
    const crypto = useEncryption()

    const [dbUser] = await db.insert(users)
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

    const decryptedRepo = dbUser?.selectedRepo ? crypto.decrypt(dbUser.selectedRepo) : null

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
      repo: decryptedRepo,
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
