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

})
