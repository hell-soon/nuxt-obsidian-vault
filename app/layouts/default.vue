<script setup lang="ts">
import fileTree from '../components/file-tree.vue'

// const userStore = useUserStore()

// if (import.meta.client) {
//   await callOnce('app-init', async () => {
//     if (loggedIn.value) {
//       await userStore.fetchProfile()
//     }
//   })
// }
</script>

<template>
  <div
    class="app-container"
  >
    <div class="app-layout sidebar">
      <aside
        class="app-layout__sidebar"
      >
        <s-user-menu />
        <file-tree />
      </aside>
      <main class="app-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>
