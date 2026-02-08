interface UserProfile {
  id: number
  githubId: number 
  selectedRepo: string | null
  avatarUrl: string | null
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const currentRepo = computed(() => profile.value?.selectedRepo)

  async function fetchProfile() {
    if (profile.value)
      return

    isLoading.value = true

    try {
      const data = await $fetch('/api/user/profile')
      profile.value = data as UserProfile
    }
    catch (e: any) {
      error.value = e.statusMessage || e.message || 'Unknown error'

      if (e.statusCode === 401) {
        profile.value = null
      }

      console.error('Profile fetch failed:', error.value)
    }
    finally {
      isLoading.value = false
    }
  }

  async function setSelectedRepo(repoFullName: string) {
    try {
      await $fetch('/api/user/select-repo', {
        method: 'POST',
        body: { repoFullName },
      })

      if (profile.value) {
        profile.value.selectedRepo = repoFullName
      }

      const { fetch: refreshSession } = useUserSession()
      await refreshSession()
    }
    catch (e) {
      console.error('Failed to update repo:', e)
      throw e
    }
  }

  function clearProfile() {
    profile.value = null
  }

  return {
    profile,
    isLoading,
    currentRepo,
    fetchProfile,
    setSelectedRepo,
    clearProfile,
  }
})
