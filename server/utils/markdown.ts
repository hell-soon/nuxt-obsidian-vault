import type { Highlighter } from 'shiki'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { createHighlighter } from 'shiki'
import { unified } from 'unified'

const THEME = 'vitesse-dark'
const SUPPORTED_LANGS = [
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
  'text',
  'plaintext',
]

let processorPromise: Promise<any> | null = null

/**
 * Трансформер для Shiki.
 * Если язык не найден в загруженных, подменяет его на 'text', чтобы избежать крэша.
 */
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

/**
 * Фабрика процессора. Создает и настраивает unified пайплайн.
 */
async function createProcessor() {
  const highlighter = await createHighlighter({
    themes: [THEME],
    langs: SUPPORTED_LANGS,
  })

  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeShiki, {
      highlighter,
      theme: THEME,
      transformers: [
        fallbackTransformer(highlighter),
      ],
    })
    .use(rehypeStringify)
}

export async function parseMarkdown(markdown: string): Promise<string> {
  if (!processorPromise) {
    processorPromise = createProcessor()
  }

  const processor = await processorPromise
  const file = await processor.process(markdown)

  return String(file)
}
