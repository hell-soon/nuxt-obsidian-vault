<script setup lang="ts">
const { x, y } = useMouse({ type: 'client' })
</script>

<template>
  <div
    class="app-container"
    :style="{ '--mouse-x': `${x}px`, '--mouse-y': `${y}px` }"
  >
    <!-- <cursor-effect /> -->
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
