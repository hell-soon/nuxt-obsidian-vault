<script setup lang="ts">
import { useCrepe } from '../model/use-crepe'

const model = defineModel<string>()

const editorRef = useTemplateRef<HTMLDivElement>('editor')

useCrepe(editorRef, model)
</script>

<template>
  <div
    ref="editor"
    class="obsidian-style-editor"
  />
</template>

<style lang="scss" scoped>
.obsidian-style-editor {
  :deep(.milkdown) {
    --crepe-color-inline-code: #9673d3;

    --crepe-color-surface: #121212;

    .ProseMirror {
      @include mobile {
        height: 100%;
        padding-inline: calc(0.25rem * 2);
      }
      padding-block: 2rem !important;
    }
  }
}
</style>
