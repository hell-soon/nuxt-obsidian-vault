<script setup lang="ts">
import NoteView from '~/components/features/note-view/index.vue'

const route = useRoute()

const filePath = computed(() => {
  const pathArray = Array.isArray(route.params.path) ? route.params.path : [route.params.path]
  return pathArray.join('/') || null
})

useSeoMeta({
  title: computed(() => filePath.value ? `${filePath.value} - Nuxt Obsidian Vault` : 'Notes - Nuxt Obsidian Vault'),
  description: computed(() => filePath.value ? `View and edit ${filePath.value} in your Obsidian vault` : 'Browse and edit your Obsidian vault notes'),
  ogTitle: computed(() => filePath.value ? `${filePath.value} - Nuxt Obsidian Vault` : 'Notes - Nuxt Obsidian Vault'),
  ogDescription: computed(() => filePath.value ? `View and edit ${filePath.value} in your Obsidian vault` : 'Browse and edit your Obsidian vault notes'),
  ogImage: '/preview.png',
})
</script>

<template>
  <note-view />
</template>
