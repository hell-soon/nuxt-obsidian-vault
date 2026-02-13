<script setup lang="ts">
const model = defineModel<string>({ required: true })

const editor = defineAsyncComponent({
  loader: () => import('./ui/note-editor.vue'),
})
</script>

<template>
  <client-only>
    <editor v-model="model" />
  </client-only>
</template>
