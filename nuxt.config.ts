import process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', 'reka-ui/nuxt', 'nuxt-auth-utils'],

  future: {
    compatibilityVersion: 5,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/_variables.scss" as *;`,
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  },
})
