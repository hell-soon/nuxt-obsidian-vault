import type { H3Event } from 'h3'
import { createGitHubClient } from './core/client'
import { GitService } from './core/service'

export async function getGitProvider(event: H3Event) {
  const session = await getUserSession(event)

  const token = session.secure?.githubToken

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No GitHub token found',
    })
  }

  const client = createGitHubClient(token)

  let context: { owner: string, repo: string } | undefined

  if (session.repo) {
    context = {
      owner: session.user?.login || '',
      repo: session.repo,
    }
  }

  return new GitService(client, context)
}
