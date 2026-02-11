import type { GitHubRawFile, GitHubRawNode, GitNode } from '../types/git'

/**
 * Декодирует Base64 в UTF-8 строку.
 * Работает в Node, Browser, Edge, Workers.
 */
function decodeBase64(b64: string): string {
  const cleanStr = b64.replace(/\s/g, '')

  try {
    const binaryString = atob(cleanStr)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return new TextDecoder('utf-8').decode(bytes)
  }
  catch (e) {
    console.error('Failed to decode base64 content', e)
    return ''
  }
}

/**
 * Type Guard: проверяет, является ли узел файлом
 */
function isFile(node: GitHubRawNode): node is GitHubRawFile {
  return node.type === 'file'
}

/**
 * Основная функция трансформации
 */
export function transformGitHubNode(node: GitHubRawNode): GitNode {
  const result: GitNode = {
    path: node.path,
    name: node.name,
    type: node.type,
    sha: node.sha,
  }

  if (isFile(node) && node.content && node.encoding === 'base64') {
    result.content = decodeBase64(node.content)
  }

  return result
}
