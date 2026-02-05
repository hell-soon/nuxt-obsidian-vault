import type { H3Event } from 'h3'
import type { GitHubRepository } from '../types/repo.type'
import { Buffer } from 'node:buffer'
import { getUserSession } from '#imports'
import { createError } from 'h3'

export interface GitFile {
  name: string
  path: string
  sha: string
  type: 'file' | 'dir'
  content?: string
}

export async function useGitProvider(event: H3Event) {
  const session = await getUserSession(event)

  const token = session.secure?.githubToken
  const repo = session.repo

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized: No GitHub token' })
  }

  const ensureRepo = () => {
    if (!repo)
      throw createError({ statusCode: 400, message: 'No repository selected' })
    return repo
  }

  const fetchGit = $fetch.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  return {
    async getUserRepos(): Promise<GitHubRepository[]> {
      return await fetchGit<GitHubRepository[]>('/user/repos', {
        query: { sort: 'updated', per_page: 100 },
      })
    },

    async getEntries(path: string = ''): Promise<GitFile[]> {
      const currentRepo = ensureRepo()
      const entries = await fetchGit<any[]>(`/repos/${currentRepo}/contents/${path}`)

      return entries.filter(e => !e.name.startsWith('.'))
    },

    async getFile(path: string): Promise<GitFile> {
      const currentRepo = ensureRepo()
      const data = await fetchGit<any>(`/repos/${currentRepo}/contents/${path}`)
      return {
        name: data.name,
        path: data.path,
        sha: data.sha,
        type: 'file',
        content: Buffer.from(data.content, 'base64').toString('utf-8'),
      }
    },

    async commitFile(path: string, content: string, sha: string, message: string) {
      const currentRepo = ensureRepo()

      return await fetchGit(`/repos/${currentRepo}/contents/${path}`, {
        method: 'PUT',
        body: {
          message,
          content: Buffer.from(content).toString('base64'),
          sha,
        },
      })
    },
  }
}
