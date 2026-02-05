<script setup lang="ts">
import UserMenu from './components/shared/user-menu.vue'
</script>

<template>
  <div class="app-layout">
    <aside>
      <user-menu />
    </aside>
    <main class="app-layout__content">
      <nuxt-page />
    </main>
  </div>
</template>

<style lang="scss">
.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid $border-color;
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: $accent-primary;
  }
}
</style>
