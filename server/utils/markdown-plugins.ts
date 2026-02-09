import path from 'node:path'
import { visit } from 'unist-util-visit'

/**
 * Remark плагин для обработки Obsidian callouts
 */
export function remarkObsidianCallouts() {
  return (tree: any) => {
    visit(tree, 'blockquote', (node: any, index: any, parent: any) => {
      const firstChild = node.children?.[0]
      if (!firstChild || firstChild.type !== 'paragraph')
        return

      const firstNode = firstChild.children?.[0]
      if (!firstNode || firstNode.type !== 'text')
        return

      const match = firstNode.value.match(/^\[!(tip|info|warning|danger|note|success|question|example|quote)\]\s*(.*)/)
      if (!match)
        return

      const [, type, title] = match

      firstNode.value = firstNode.value.replace(/^\[!.*?\]\s*/, '')

      if (title && firstNode.value === title) {
        firstChild.children.shift()
      }

      const calloutNode = {
        type: 'callout',
        data: {
          hName: 'div',
          hProperties: {
            'className': [`callout`, `callout-${type}`],
            'data-callout': type,
          },
        },
        children: [
          ...(title
            ? [{
              type: 'paragraph',
              data: {
                hName: 'div',
                hProperties: { className: ['callout-title'] },
              },
              children: [{
                type: 'text',
                value: title || type.charAt(0).toUpperCase() + type.slice(1),
              }],
            }]
            : []),
          {
            type: 'div',
            data: {
              hName: 'div',
              hProperties: { className: ['callout-content'] },
            },
            children: node.children,
          },
        ],
      }

      if (parent && typeof index === 'number') {
        parent.children[index] = calloutNode
      }
    })
  }
}

interface WikiLinksOptions {
  currentFilePath?: string
}

/**
 * Remark плагин для обработки WikiLinks [[ссылка]]
 * Преобразует [[VSA]] в полный путь /notes/Projects/RT-Task Frontend/Architecture/VSA
 */
export function remarkWikiLinks(options: WikiLinksOptions = {}) {
  return (tree: any) => {
    visit(tree, 'text', (node: any, index: any, parent: any) => {
      const text = node.value
      const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

      if (!wikiLinkRegex.test(text)) {
        return
      }

      const newChildren: any[] = []
      let lastIndex = 0

      wikiLinkRegex.lastIndex = 0

      let match = wikiLinkRegex.exec(text)
      while (match !== null) {
        const [fullMatch, link, alias] = match
        const startIndex = match.index

        if (startIndex > lastIndex) {
          newChildren.push({
            type: 'text',
            value: text.slice(lastIndex, startIndex),
          })
        }

        const displayText = alias || link

        const cleanLink = link?.replace(/\.md$/, '')

        let href: string
        if (options.currentFilePath) {
          const currentDir = path.dirname(options.currentFilePath)

          if (cleanLink?.includes('/')) {
            const resolvedPath = path.join(currentDir, cleanLink)
            href = `/notes/${resolvedPath}.md`
          }
          else {
            href = `/notes/${currentDir}/${cleanLink}.md`
          }
        }
        else {
          href = `/notes/${cleanLink}.md`
        }

        newChildren.push({
          type: 'link',
          url: href,
          data: {
            hProperties: {
              'className': ['wiki-link'],
              'data-link': cleanLink as string,
            },
          },
          children: [
            {
              type: 'text',
              value: displayText,
            },
          ],
        })

        lastIndex = startIndex + fullMatch.length
        match = wikiLinkRegex.exec(text)
      }

      if (lastIndex < text.length) {
        newChildren.push({
          type: 'text',
          value: text.slice(lastIndex),
        })
      }

      if (newChildren.length > 0 && parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...newChildren)
        return index + newChildren.length
      }
    })
  }
}
