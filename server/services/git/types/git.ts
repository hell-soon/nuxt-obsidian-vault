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

export interface UpdateFileOptions {
  path: string
  content: string
  sha: string
  message: string
  author: { name: string, email: string }
}

export interface UpdateFileResponse {
  content: {
    name: string
    path: string
    sha: string
    size: number
    url: string
    html_url: string
    git_url: string
    download_url: string
    type: string
    _links: {
      self: string
      git: string
      html: string
    }
  }
  commit: {
    sha: string
    url: string
    html_url: string
    author: {
      name: string
      email: string
      date: string
    }
    committer: {
      name: string
      email: string
      date: string
    }
    tree: {
      sha: string
      url: string
    }
    message: string
    parents: {
      sha: string
      url: string
      html_url: string
    }[]
    verification: {
      verified: boolean
      reason: string
      signature: string
      payload: string
    }
  }
}
