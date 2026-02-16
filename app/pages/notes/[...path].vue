<script setup lang="ts">
import { Edit3, Loader2, Save, X } from 'lucide-vue-next'
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

onMounted(() => {
  if (!pending.value)
    addCopyButtonsToCodeBlocks()
})

watch(() => note.value?.content, () => {
  if (!isEditMode.value) {
    nextTick(addCopyButtonsToCodeBlocks)
  }
})

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
</script>

<template>
  <div class="editor-view-container">
    <header
      v-if="filePath"
      class="editor-header"
    >
      <span class="file-path">{{ filePath }}</span>

      <div class="toolbar">
        <button
          class="toolbar-btn"
          :class="{ primary: isEditMode }"
          :disabled="isSaving"
          @click="handleMainAction"
        >
          <loader2
            v-if="isSaving"
            class="icon-spin"
            :size="16"
          />

          <span
            v-else
            class="btn-content"
          >
            <template v-if="isEditMode">
              <save :size="16" /> Save & Close
            </template>
            <template v-else>
              <edit3 :size="16" /> Edit
            </template>
          </span>
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
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-sm $space-md;
  border-bottom: 1px solid $border-color;
  background-color: $bg-main;
  flex-shrink: 0;

  .file-path {
    font-size: 0.85rem;
    color: $text-muted;
    font-weight: 500;
    font-family: monospace;
  }
}

.toolbar {
  display: flex;
  gap: $space-sm;
}

.toolbar-btn {
  @include reset-button;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  color: $text-muted;
  border-radius: $radius-sm;
  transition: all $transition-base;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid transparent;

  &:hover:not(:disabled) {
    background-color: $bg-item-hover;
    color: $text-bright;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.primary {
    background-color: $accent-primary;
    color: $text-inverse;

    &:hover:not(:disabled) {
      background-color: $accent-hover;
    }
  }

  .btn-content {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

.content-area {
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
}

.content-state {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: $text-muted;
  gap: $space-sm;
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
