import type { NuxtConfig } from 'nuxt/schema'

export const modulesConfig: NuxtConfig['modules'] = [
  '@pinia/nuxt',
  'reka-ui/nuxt',
  'nuxt-auth-utils',
  '@vueuse/nuxt',
]
