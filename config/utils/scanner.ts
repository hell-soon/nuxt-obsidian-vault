import { readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import process from 'node:process'

const PREFIX_MAP: Record<string, string> = {
  ui: 'U',
  shared: 'S',
}

export function findComponentDirs(startPath: string): any[] {
  const basePath = join(process.cwd(), startPath)
  const results: any[] = []

  function recurse(currentPath: string) {
    let entries
    try {
      entries = readdirSync(currentPath, { withFileTypes: true })
    }
    catch { return }

    const hasIndex = entries.some(entry =>
      entry.isFile() && (entry.name === 'index.vue' || entry.name === 'index.ts'),
    )

    if (hasIndex) {
      const relPath = relative(basePath, currentPath)
      const segments = relPath.split(sep).filter(Boolean)

      let finalPrefix = ''

      if (segments.length > 0) {
        const layer = segments[0]
        const remaining = segments.slice(1)

        const layerPrefix = PREFIX_MAP[layer] || layer

        const namePart = remaining
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('')

        finalPrefix = layerPrefix + namePart
      }

      results.push({
        path: currentPath,
        prefix: finalPrefix,
        pathPrefix: false,
        pattern: 'index.{vue,ts}',
        extensions: ['vue', 'ts'],
        global: false,
      })

      return
    }

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        recurse(join(currentPath, entry.name))
      }
    }
  }

  recurse(basePath)
  return results
}
