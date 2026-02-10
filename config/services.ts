import type { NuxtConfig } from 'nuxt/schema'
import process from 'node:process'

export const servicesConfig: NuxtConfig = {
  runtimeConfig: {
    databaseUrl: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  },
}
