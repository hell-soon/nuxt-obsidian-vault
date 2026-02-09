<script setup lang="ts">
import { Edit, Eye, Loader2, Save, X } from 'lucide-vue-next'

definePageMeta({
  layout: 'notes',
})

interface NoteData {
  path: string
  content: string
  markdown: string
  sha: string
}

const route = useRoute()
const isEditMode = ref(false)

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

const editableContent = ref('')

watch(note, (newNote) => {
  if (newNote?.markdown) {
    editableContent.value = newNote.markdown
    isEditMode.value = false
  }
}, { immediate: true })
</script>

<template>
  <div class="editor-view-container">
    <header
      v-if="filePath"
      class="editor-header"
    >
      <span class="file-path">{{ filePath }}</span>
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
      class="content-area"
    >
      <div
        v-if="note"
        class="markdown-content"
        v-html="note.content"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped src="../../assets/scss/_markdown.scss">
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
  padding: $space-lg;
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
