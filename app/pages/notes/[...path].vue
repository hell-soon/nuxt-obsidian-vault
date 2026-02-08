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
const isSaving = ref(false)

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

async function handleSave() {
  if (!note.value || !editableContent.value || isSaving.value)
    return
  isSaving.value = true

  isEditMode.value = false
  isSaving.value = false
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
          v-if="isEditMode"
          title="View Mode"
          class="toolbar-btn"
          @click="isEditMode = false"
        >
          <eye />
        </button>
        <button
          v-else
          title="Edit Mode"
          class="toolbar-btn"
          @click="isEditMode = true"
        >
          <edit />
        </button>

        <button
          v-if="isEditMode"
          :disabled="isSaving"
          class="toolbar-btn primary"
          @click="handleSave"
        >
          <loader2
            v-if="isSaving"
            class="icon-spin"
          />
          <save v-else />
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
      class="content-area"
    >
      <div
        v-if="!isEditMode && note"
        class="markdown-content"
        v-html="note.content"
      />

      <textarea
        v-else-if="isEditMode"
        v-model="editableContent"
        class="markdown-editor"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.markdown-content {
  padding: $space-lg;
  line-height: 1.7;

  :deep(blockquote) {
    border-left: 4px solid $accent-primary;
    padding: $space-sm $space-md;
    margin: $space-lg 0;
    background-color: rgba($accent-primary, 0.1);
    border-radius: $radius-md;
    color: $text-bright;

    :deep(p) {
      margin-bottom: 0;
    }
  }

  :deep(pre) {
    background-color: $bg-sidebar;
    padding: $space-md;
    margin: $space-lg 0;
    overflow-x: auto;
    border-radius: $radius-md;
    font-size: 0.9rem;
    line-height: 1.4;

    code {
      background: none !important;
      color: inherit !important;
      padding: 0;
      line-height: inherit;
    }
  }

  :deep(code) {
    background: rgba($accent-primary, 0.15);
    color: $text-bright;
    padding: 2px 4px;
    border-radius: $radius-sm;
    font-family: monospace;
    font-size: 0.95em;
  }

  :deep(ul) {
    padding-left: $space-md;
  }

  :deep(input[type='checkbox']:checked + label) {
    color: $text-muted;
    text-decoration: line-through;
  }
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
