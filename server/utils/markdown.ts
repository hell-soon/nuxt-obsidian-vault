import type { BundledLanguage, Highlighter } from 'shiki'
import rehypeShiki from '@shikijs/rehype'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { createHighlighter } from 'shiki'
import { unified } from 'unified'
import { remarkObsidianCallouts, remarkWikiLinks } from './markdown-plugins'

const THEME = 'vitesse-dark'
const SUPPORTED_LANGS: BundledLanguage[] = [
  'javascript',
  'js',
  'typescript',
  'ts',
  'vue',
  'bash',
  'sh',
  'markdown',
  'md',
  'css',
  'scss',
  'json',
  'yaml',
  'html',
  'sql',
  'xml',
  'python',
  'go',
  'rust',
  'java',
  'php',
  'ruby',
  'c',
  'cpp',
  'csharp',
]

let highlighterInstance: Highlighter | null = null

function fallbackTransformer(highlighter: Highlighter) {
  return {
    name: 'fallback-safe',
    preprocess(code: string, options: any) {
      const lang = options.lang?.trim().toLowerCase() || 'text'
      const loaded = highlighter.getLoadedLanguages()
      if (!loaded.includes(lang)) {
        console.warn(`[Shiki] Language '${lang}' not loaded. Fallback to text.`)
        options.lang = 'text'
      }
    },
  }
}

async function getHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: [THEME],
      langs: SUPPORTED_LANGS,
    })
  }
  return highlighterInstance
}

interface ParseMarkdownOptions {
  currentFilePath?: string
}

export async function parseMarkdown(
  markdown: string,
  options: ParseMarkdownOptions = {},
): Promise<string> {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  try {
    const highlighter = await getHighlighter()

    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(remarkWikiLinks, { currentFilePath: options.currentFilePath })
      .use(remarkObsidianCallouts)
      .use(remarkRehype, {
        allowDangerousHtml: false,
      })
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          className: ['heading-link'],
        },
      })
      .use(rehypeShiki, {
        highlighter,
        theme: THEME,
        transformers: [fallbackTransformer(highlighter)],
      })
      .use(rehypeStringify, {
        allowDangerousHtml: false,
      })

    const file = await processor.process(markdown)
    return String(file)
  }
  catch (error) {
    console.error('[parseMarkdown] Error processing markdown:', error)
    return `<pre>${markdown}</pre>`
  }
}

export function resetMarkdownProcessor() {
  highlighterInstance = null
}
