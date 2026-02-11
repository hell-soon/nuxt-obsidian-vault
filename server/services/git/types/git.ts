export interface GitHubRawFile {
  type: 'file'
  encoding: string // обычно 'base64'
  size: number
  name: string
  path: string
  content?: string
  sha: string
  url: string
  download_url: string | null
}

export interface GitHubRawDirEntry {
  type: 'dir'
  name: string
  path: string
  sha: string
  size: number
  url: string
  download_url: string | null
}

export type GitHubRawNode = GitHubRawFile | GitHubRawDirEntry

export interface GitNode {
  path: string
  name: string
  type: 'file' | 'dir'
  sha: string
  content?: string
}
