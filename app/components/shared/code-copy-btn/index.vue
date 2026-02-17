<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'

interface Props {
  code: string
}

const { code } = defineProps<Props>()
const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true

    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (error) {
    console.error('Failed to copy:', error)
  }
}
</script>

<template>
  <button
    class="code-copy-button"
    :class="{ copied }"
    :title="copied ? 'Copied!' : 'Copy code'"
    @click="copyCode"
  >
    <check
      v-if="copied"
      :size="16"
    />
    <copy
      v-else
      :size="16"
    />
  </button>
</template>

<style lang="scss" scoped>
.code-copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    color: var(--text-bright);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &.copied {
    color: #50c878;
    border-color: #50c878;
    opacity: 1;
  }
}

pre:hover .code-copy-button {
  opacity: 1;
}
</style>
