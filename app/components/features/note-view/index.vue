<script setup lang="ts">
import { Edit3, Loader2, Save, X } from 'lucide-vue-next'
import NoteEditor from '~/components/features/note-editor/ui/note-editor.vue'
import { useNoteView } from './model/use-note-view'

const {
  filePath,
  note,
  pending,
  error,
  isEditMode,
  isSaving,
  contentContainer,
  handleMainAction,
  addCopyButtonsToCodeBlocks,
} = await useNoteView()

onMounted(() => {
  if (!pending.value)
    addCopyButtonsToCodeBlocks()
})

const pathParts = computed(() => {
  if (!filePath.value)
    return []

  const parts = filePath.value.split('/')
  return parts.map((part, index) => {
    const isLast = index === parts.length - 1
    return {
      name: part,
      isLast,
      isFolder: !isLast,
    }
  })
})
</script>

<template>
  <div class="editor-view-container">
    <header
      v-if="filePath"
      class="editor-header"
    >
      <span class="file-path">
        <template
          v-for="(part, index) in pathParts"
          :key="index"
        >
          <span
            v-if="index > 0"
            class="separator"
          >/</span>
          <span
            class="path-part"
            :class="{
              folder: part.isFolder,
              filename: part.isLast,
            }"
          >{{ part.name }}</span>
        </template>
      </span>

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

<style lang='scss' scoped src="./styles.scss"  />
