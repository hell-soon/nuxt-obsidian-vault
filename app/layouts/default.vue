<script setup lang="ts">
import fileTree from '../components/file-tree.vue'

const { session } = useUserSession()

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

        <file-tree
          v-if="session?.repo"
          :key="session?.repo"
        />
        <div
          v-else
          class="sidebar-empty"
        >
          Please select a vault
        </div>
      </aside>
      <main class="app-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>
