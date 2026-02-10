<script setup lang="ts">
import { Github } from 'lucide-vue-next'

const title = 'Welcome to Nuxt Obsidian'

const { displayText, scramble } = useTextScramble()

onMounted(() => {
  scramble(title)
})

definePageMeta({
  layout: 'no-aside',
})
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <h1
        class="scramble-text"
        v-html="displayText || title"
      />

      <div class="actions">
        <a
          href="/auth/github"
          class="btn-github"
        >
          <github />
          Login with GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: $bg-main;
  color: $text-bright;
}

.login-container {
  text-align: center;
}

.scramble-text {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  min-height: 3.5rem;
  letter-spacing: -1px;
}

:deep(.scramble-char) {
  color: $accent-primary;
  opacity: 0.7;
}

.btn-github {
  @include reset-button;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: white;
  color: black;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all $transition-base;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    background: #f0f0f0;
    box-shadow: 0 8px 25px rgba($accent-primary, 0.3);
  }
}
</style>
