<script setup lang="ts">
import fileTree from './components/file-tree.vue'

const { loggedIn } = useUserSession()
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
    <div class="app-layout">
      <aside
        v-if="loggedIn"
        class="app-layout__sidebar"
      >
        <s-user-menu />
        <file-tree />
      </aside>
      <main class="app-layout__content">
        <nuxt-page />
      </main>
    </div>
  </div>
</template>
