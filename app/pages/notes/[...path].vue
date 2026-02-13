<script setup lang="ts">
import { Loader2, X } from 'lucide-vue-next'
import { createApp } from 'vue'
import NoteEditor from '~/components/features/note-editor/ui/note-editor.vue'
import CodeCopyButton from '~/components/shared/code-copy-btn/index.vue'

interface NoteData {
  path: string
  content: string
  markdown: string
  sha: string
}

const route = useRoute()
const isEditMode = ref(false)
const editableContent = ref('')

const filePath = computed(() => {
  const pathArray = Array.isArray(route.params.path) ? route.params.path : [route.params.path]
  const pathString = pathArray.join('/')
  return pathString || null
})

const { data: note, pending, error } = await useFetch<NoteData>('/api/notes/content', {
  query: { path: filePath },
  key: computed(() => `note-${filePath.value}`),
  immediate: !!filePath.value,
})

async function save() {
  if (!note.value)
    return

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
  }
  catch (err: any) {
    const message = err.data?.message || err.statusText || 'Unknown error'
    const statusCode = err.status

    console.error(`Error ${statusCode}: ${message}`)
  }
}

const contentContainer = ref<HTMLDivElement>()

watch(note, (newNote) => {
  if (newNote?.markdown) {
    editableContent.value = newNote.markdown
    isEditMode.value = false
  }
}, { immediate: true })

onMounted(() => {
  addCopyButtonsToCodeBlocks()
})

watch(() => note.value?.content, () => {
  nextTick(() => {
    addCopyButtonsToCodeBlocks()
  })
})

function addCopyButtonsToCodeBlocks() {
  if (!contentContainer.value)
    return

  const codeBlocks = contentContainer.value.querySelectorAll('pre')

  codeBlocks.forEach((pre) => {
    if (pre.querySelector('.code-copy-button'))
      return

    const codeElement = pre.querySelector('code')
    if (!codeElement)
      return

    const code = codeElement.textContent || ''

    if (!pre.classList.contains('code-block-wrapper')) {
      pre.style.position = 'relative'
      pre.classList.add('code-block-wrapper')
    }

    const buttonContainer = document.createElement('div')
    pre.appendChild(buttonContainer)

    const app = createApp(CodeCopyButton, { code })
    app.mount(buttonContainer)
  })
}
</script>

<template>
  <div class="editor-view-container">
    <header
      v-if="filePath"
      class="editor-header"
    >
      <span class="file-path">{{ filePath }}</span>
      <button @click="save">
        Save
      </button>
      <div class="toolbar">
        <button
          class="toolbar-btn"
          :class="{ primary: isEditMode }"
          @click="isEditMode = !isEditMode"
        >
          {{ isEditMode ? 'Save & Close' : 'Edit' }}
        </button>
      </div>
    </header>

    <div
      v-if="pending"
      class="content-state loading"
    >
      <loader2 class="icon-spin" /> Loading {{ filePath }}...
    </div>
    <div
      v-else-if="error"
      class="content-state error"
    >
      <x /> Error: {{ error.message }}
    </div>
    <div
      v-else-if="!filePath"
      class="content-state empty"
    >
      <p>Select a file from the sidebar to start editing.</p>
    </div>

    <div
      v-else
      ref="contentContainer"
      class="content-area"
    >
      <template v-if="note">
        <div
          v-if="!isEditMode"
          key="view"
          class="markdown-content"
          v-html="note.content"
        />

        <note-editor
          v-else
          :key="note.path"
          v-model="note.markdown"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" src="@/assets/scss/_markdown.scss" />

<style lang='scss' scoped>
 .editor-view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-sm $space-md;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;

  .file-path {
    font-size: 0.85rem;
    color: $text-muted;
    font-weight: 500;
  }
}

.toolbar {
  display: flex;
  gap: $space-sm;
}

.toolbar-btn {
  @include reset-button;
  padding: $space-xs $space-sm;
  color: $text-muted;
  border-radius: $radius-sm;
  transition: all $transition-base;

  &:hover:not(:disabled) {
    background-color: $bg-item-hover;
    color: $text-bright;
  }

  &.primary {
    background-color: $accent-primary;
    color: $text-inverse;
    &:hover {
      background-color: $accent-hover;
    }
  }
}

.content-area {
  flex-grow: 1;
  overflow-y: auto;
}

.content-state {
  @extend .content-area;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: $text-muted;
}

.markdown-editor {
  width: 100%;
  height: 100%;
  border: none;
  background-color: $bg-main;
  color: $text-bright;
  resize: none;
  font-family: monospace;
  line-height: 1.6;
  padding: 0;
  outline: none;
}

.icon-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
