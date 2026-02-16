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
    --crepe-color-inline-code: var(--accent-primary);
    --crepe-color-primary: var(--accent-primary);

    --crepe-color-surface: #121212;

    h2 {
      align-items: center;
      background: linear-gradient(90deg, rgb(from var(--accent-primary) r g b/0.15) 0%, transparent 100%);
      border-left: 4px solid var(--accent-primary);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      display: flex;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-main);
      gap: 10px;
      padding: 0.5rem 1rem;
      margin: 1.5rem 0 1rem;
      line-height: 1.3;
    }

    blockquote {
      border-left: 4px solid var(--accent-primary);
      padding: var(--space-sm) var(--space-md);
      margin: var(--space-lg) 0;
      background-color: rgb(from var(--accent-primary) r g b / 0.08);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
      color: var(--text-bright);
      font-style: italic;

      p {
        margin: 0.5rem 0;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }

      &::before {
        content: none;
      }
    }

    .ProseMirror {
      @include mobile {
        height: 100%;
        padding-inline: calc(0.25rem * 2);
      }
      padding-block: 2rem !important;
      padding: 60px 80px;
    }
  }
}
</style>
