import type { GitFile, GitHubRepository } from '~~/server/types/repo.type'
import type { GitHubRawNode, GitNode, UpdateFileOptions, UpdateFileResponse } from '../types/git'
import type { GitHubClient } from './client'
import { Buffer } from 'node:buffer'
import { transformGitHubNode } from './transformer'

export class GitService {
  constructor(
    private readonly client: GitHubClient,
    private readonly context?: { owner: string, repo: string },
  ) { }

  private get repoContext() {
    if (!this.context?.owner || !this.context?.repo) {
      throw createError({ statusCode: 400, message: 'Repository context is missing' })
    }
    return this.context
  }

  async getUserRepos(): Promise<GitHubRepository[]> {
    return await this.client.get<GitHubRepository[]>('/user/repos', {
      query: {
        affiliation: 'owner',
        sort: 'updated',
        per_page: 100,
      },
    })
  }

  async getEntries(path: string = ''): Promise<GitFile[]> {
    const currentRepo = this.repoContext
    const entries = await this.client.get<GitFile[]>(`/repos/${currentRepo.repo}/contents/${path}`)

    return entries.filter(e => !e.name.startsWith('.'))
  }

  async getFile(path: string): Promise<GitNode> {
    const currentRepo = this.repoContext
    const data = await this.client.get<GitHubRawNode>(`/repos/${currentRepo.repo}/contents/${path}`)
    if (Array.isArray(data)) {
      throw createError({ statusCode: 400, message: 'Path is a directory, expected a file' })
    }

    return transformGitHubNode(data)
  }

  async updateFile(options: UpdateFileOptions) {
    const { repo } = this.repoContext
    const encodedPath = encodeURIComponent(options.path)

    try {
      const data = await this.client.put<UpdateFileResponse>(`/repos/${repo}/contents/${encodedPath}`, {
        body: {
          message: options.message || `Update ${options.path}`,
          content: Buffer.from(options.content || '').toString('base64'),
          sha: options.sha,
        },
      })

      return {
        newSha: data.content.sha,
        commitSha: data.commit.sha,
      }
    }
    catch (error: any) {
      console.error('GitHub Error Detail:', error.response?._data)
      throw error
    }
  }
}
