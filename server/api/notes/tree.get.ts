import { defineEventHandler, getQuery } from 'h3'
import { useGitProvider } from '../../utils/git'

export interface FileTreeItem {
  id: string
  name: string
  type: 'file' | 'dir'
  sha: string
  leaf: boolean
}

export default defineEventHandler(async (event): Promise<FileTreeItem[]> => {
  const git = await useGitProvider(event)
  const { path } = getQuery(event)

  const entries = await git.getEntries(path as string || '')

  return entries.map(entry => ({
    id: entry.path,
    name: entry.type === 'file' ? entry.name.replace(/\.md$/, '') : entry.name,
    type: entry.type,
    sha: entry.sha,
    leaf: entry.type === 'file',
  }))
})
