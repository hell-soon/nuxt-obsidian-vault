import type { FetchOptions } from 'ofetch'

type RequestMethod = <T>(url: string, opts?: Omit<FetchOptions, 'method'>) => Promise<T>

export interface GitHubClient {
  get: RequestMethod
  post: RequestMethod
  put: RequestMethod
  delete: RequestMethod
  patch: RequestMethod
}

export function createGitHubClient(token: string): GitHubClient {
  if (!token)
    throw new Error('No token provided')

  const fetchGit = $fetch.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  const methods = ['get', 'post', 'put', 'delete', 'patch'] as const

  const client = methods.reduce((acc, method) => {
    acc[method] = (url, opts) => fetchGit(url, { ...opts, method })
    return acc
  }, {} as GitHubClient)

  return client
}
