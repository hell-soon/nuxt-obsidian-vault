export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        login: user.login,
        avatar: user.avatar_url,
        name: user.name,
        email: user.email,
        
      },
      secure: {
        githubToken: tokens.access_token,
      },
      repo: null,
    })

    return sendRedirect(event, '/select-repo')
  },
  onError(event, error) {
    console.error('GitHub OAuth Error:', error)
    return sendRedirect(event, '/')
  },
})
