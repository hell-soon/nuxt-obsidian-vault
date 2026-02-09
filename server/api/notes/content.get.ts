interface NoteData {
  path: string
  content: string
  sha: string
}

export default defineEventHandler(async (event): Promise<NoteData> => {
  const { path } = getQuery(event) as { path: string | undefined }

  if (!path) {
    throw createError({ statusCode: 400, message: 'Missing file path query parameter.' })
  }

  const git = await useGitProvider(event)

  try {
    const file = await git.getFile(path)

    const htmlContent = await parseMarkdown(file.content || '', {
      currentFilePath: path,
    })

    return {
      path: file.path,
      content: htmlContent,
      sha: file.sha,
    }
  }
  catch (e: any) {
    if (e.message.includes('Shiki')) {
      console.error('Shiki Initialization Error:', e.message)
      throw createError({
        statusCode: 500,
        message: 'Markdown parser failed to initialize or load a language.',
        statusMessage: 'Shiki Initialization Error',
      })
    }
    throw createError({
      statusCode: e.statusCode || 500,
      message: e.message || `Failed to retrieve content for ${path}.`,
      statusMessage: e.statusMessage || 'Internal Server Error',
    })
  }
})
