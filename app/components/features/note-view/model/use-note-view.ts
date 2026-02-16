import { createApp } from 'vue'
import CodeCopyButton from '~/components/shared/code-copy-btn/index.vue'

interface NoteData {
  path: string
  content: string
  markdown: string
  sha: string
}

export async function useNoteView() {
  const route = useRoute()

  const isEditMode = ref(false)
  const isSaving = ref(false)
  const contentContainer = ref<HTMLDivElement>()

  const filePath = computed(() => {
    const pathArray = Array.isArray(route.params.path) ? route.params.path : [route.params.path]
    return pathArray.join('/') || null
  })

  const { data: note, pending, error } = await useFetch<NoteData>('/api/notes/content', {
    query: { path: filePath },
    key: computed(() => `note-${filePath.value}`),
    immediate: !!filePath.value,
  })

  async function handleMainAction() {
    if (!isEditMode.value) {
      isEditMode.value = true
      return
    }

    if (!note.value)
      return

    isSaving.value = true

    try {
      const response = await $fetch<{ sha: string, content: string }>('/api/notes/content', {
        method: 'PATCH',
        body: {
          path: filePath.value,
          content: note.value.markdown,
          sha: note.value.sha,
        },
      })

      note.value.sha = response.sha
      note.value.content = response.content

      isEditMode.value = false

      nextTick(() => {
        addCopyButtonsToCodeBlocks()
      })
    }
    catch (err: any) {
      const message = err.data?.message || err.statusText || 'Unknown error'
      console.error(`Save failed: ${message}`)
    }
    finally {
      isSaving.value = false
    }
  }

  function addCopyButtonsToCodeBlocks() {
    if (!contentContainer.value)
      return
    const codeBlocks = contentContainer.value.querySelectorAll('pre')

    codeBlocks.forEach((pre) => {
      const existingBtn = pre.querySelector('.code-copy-btn-container')
      if (existingBtn)
        existingBtn.remove()
    })

    codeBlocks.forEach((pre) => {
      const codeElement = pre.querySelector('code')
      if (!codeElement)
        return
      const code = codeElement.textContent || ''

      if (!pre.classList.contains('code-block-wrapper')) {
        pre.style.position = 'relative'
        pre.classList.add('code-block-wrapper')
      }

      const buttonContainer = document.createElement('div')
      buttonContainer.className = 'code-copy-btn-container'
      pre.appendChild(buttonContainer)

      const app = createApp(CodeCopyButton, { code })
      app.mount(buttonContainer)
    })
  }


  watch(() => note.value?.content, () => {
    if (!isEditMode.value) {
      nextTick(addCopyButtonsToCodeBlocks)
    }
  })

  return {
    filePath,
    note,
    pending,
    error,
    isEditMode,
    isSaving,
    contentContainer,
    handleMainAction,
    addCopyButtonsToCodeBlocks,
  }
}
