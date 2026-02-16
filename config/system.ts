import type { NuxtConfig } from 'nuxt/schema'

export const systemConfig: NuxtConfig = {
  future: {
    compatibilityVersion: 5,
  },

  devtools: {
    enabled: true,
    timeline: { enabled: true },
  },

  experimental: {
    componentIslands: true,
    // typedPages: true,
    viteEnvironmentApi: true,
    nitroAutoImports: true,
  },

  css: [
    '~/assets/scss/main.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/_setup.scss" as *;
          `,
        },
      },
    },
  },
}
