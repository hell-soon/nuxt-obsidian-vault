import { componentsHook } from './config/components'
import { modulesConfig } from './config/modules'
import { servicesConfig } from './config/services'
import { systemConfig } from './config/system'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  ...systemConfig,
  modules: modulesConfig,
  ...servicesConfig,

  hooks: {
    'components:dirs': componentsHook,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Nuxt Obsidian Vault',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Access your Obsidian vault through GitHub integration' },
        { name: 'theme-color', content: '#1a1a2e' },
        { property: 'og:site_name', content: 'Nuxt Obsidian Vault' },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
})
