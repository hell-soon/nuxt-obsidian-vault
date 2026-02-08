<script setup lang="ts">
interface Repo {
  id: number
  full_name: string
  name: string
  private: boolean
  description: string | null
}

const { data: repos, status, error } = await useFetch<Repo[]>('/api/repos')

const selectedRepoFullName = ref<string | null>(null)
const router = useRouter()

async function handleSelect(fullName: string) {
  selectedRepoFullName.value = fullName

  try {
    await $fetch('/api/user/select-repo', {
      method: 'POST',
      body: { repo: fullName },
    })

    await navigateTo('/notes')
  }
  catch (err) {
    console.error('Failed to select repo:', err)
  }
  finally {
    selectedRepoFullName.value = null
  }
}
</script>

<template>
  <div class="repo-selector">
    <h1>Select your Obsidian Vault</h1>
    <p class="subtitle">
      Choose a repository to use as your vault storage.
    </p>

    <div
      v-if="status === 'pending'"
      class="loading"
    >
      Scanning GitHub...
    </div>

    <div
      v-else-if="error"
      class="error"
    >
      Failed to load repositories.
      <button @click="router.go(0)">
        Retry
      </button>
    </div>

    <div
      v-else
      class="repo-grid"
    >
      <button
        v-for="repo in repos"
        :key="repo.name"
        class="repo-card"
        :disabled="!!selectedRepoFullName"
        @click="handleSelect(repo.name)"
      >
        <div class="repo-info">
          <span class="name">{{ repo.name }}</span>
        </div>

        <div class="status-icon">
          <span
            v-if="selectedRepoFullName === repo.full_name"
            class="loader-mini"
          >...</span>
          <span v-else>→</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.repo-selector {
  max-width: 600px;
  margin: 4rem auto;
  padding: 0 1rem;

  h1 {
    color: $accent-primary;
    margin-bottom: 0.5rem;
  }
  .subtitle {
    color: $text-muted;
    margin-bottom: 2rem;
  }
}

.repo-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.repo-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  // background: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover:not(:disabled) {
    border-color: $accent-primary;
    // background: lighten($bg-secondary, 3%);
    transform: translateX(4px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .repo-info {
    display: flex;
    flex-direction: column;
    .name {
      font-weight: 600;
      color: $text-main;
    }
    .full-name {
      font-size: 0.85rem;
      color: $text-muted;
    }
  }
}

.loader-mini {
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
