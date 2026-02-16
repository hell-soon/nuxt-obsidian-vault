<script setup lang="ts">
import { Menu as MenuIcon, X } from 'lucide-vue-next'
import fileTree from '../components/file-tree.vue'

const { session, loggedIn } = useUserSession()

const userStore = useUserStore()
const route = useRoute()

const isSidebarOpen = ref(false)

watch(() => route.fullPath, () => {
  isSidebarOpen.value = false
})

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
    :class="{ 'sidebar-visible': isSidebarOpen }"
  >
    <button
      v-if="!isSidebarOpen"
      class="mobile-nav-toggle"
      @click="isSidebarOpen = !isSidebarOpen"
    >
      <menu-icon
        :size="24"
      />
    </button>

    <div
      class="sidebar-overlay"
      @click="isSidebarOpen = false"
    />

    <div
      class="app-layout"
      :class="{ 'has-sidebar': session?.repo }"
    >
      <aside class="app-layout__sidebar">
        <div class="sidebar-top">
          <s-user-menu />
        </div>

        <div class="sidebar-scrollable">
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
        </div>
      </aside>

      <main class="app-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$sidebar-width: 300px;

.app-container {
  position: relative;
  height: 100dvh;
  width: 100%;
}

.app-layout {
  height: 100dvh;
  display: flex;

  &.has-sidebar {
    @media (min-width: 769px) {
      display: grid;
      grid-template-columns: $sidebar-width 1fr;
    }
  }

  &__sidebar {
    background-color: var(--bg-sidebar);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    z-index: var(--z-sidebar);

    @include mobile {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      transform: translateX(-100%);
      transition: transform var(--transition-base);
      box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-md);
    position: relative;
    z-index: 10;

    @include mobile {
      padding: var(--space-sm);
      padding-top: 60px;
    }
  }
}

.sidebar-visible {
  .app-layout__sidebar {
    @include mobile {
      transform: translateX(0);
    }
  }
  .sidebar-overlay {
    @include mobile {
      opacity: 1;
      pointer-events: auto;
    }
  }
}

.sidebar-overlay {
  display: none;
  @include mobile {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: #{var(--z-sidebar) - 1};
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-base);
  }
}

.mobile-nav-toggle {
  display: none;
  @include mobile {
    display: flex;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: #{var(--z-sidebar) + 1};
    background: var(--bg-sidebar);
    border: 1px solid var(--border-color);
    padding: 8px;
    border-radius: var(--radius-md);
    color: var(--text-bright);
  }
}

.sidebar-scrollable {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
}
</style>
