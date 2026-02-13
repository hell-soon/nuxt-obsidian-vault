import type { UpdateFileOptions } from '~~/server/services/git/types/git'
import { getGitProvider } from '~~/server/services/git'

export default defineEventHandler(async (event) => {
  const body = await readBody<UpdateFileOptions>(event)
  const git = await getGitProvider(event)

  try {
    const { newSha, commitSha } = await git.updateFile({
      path: body.path,
      content: body.content,
      sha: body.sha,
      message: body.message || `Update ${body.path}`,
      author: body.author,
    })

    const htmlContent = await parseMarkdown(body.content, {
      currentFilePath: body.path,
    })

    return {
      success: true,
      sha: newSha,
      commitSha,
      content: htmlContent,
    }
  }
  catch (e) {
    console.error(e)
  }
})
