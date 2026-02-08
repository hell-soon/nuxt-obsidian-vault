<script setup lang="ts">
const { loggedIn } = useUserSession()
const userStore = useUserStore()

if (import.meta.client) {
  await callOnce('app-init', async () => {
    if (loggedIn.value) {
      await userStore.fetchProfile()
    }
  })
}
</script>

<template>
  <div
    class="app-container"
  >
    <div class="app-layout">
      <aside>
        <s-user-menu />
      </aside>
      <main class="app-layout__content">
        <nuxt-page />
      </main>
    </div>
  </div>
</template>
