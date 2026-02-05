import type { NuxtHooks } from 'nuxt/schema'
import { findComponentDirs } from './utils/scanner'

export const componentsHook: NuxtHooks['components:dirs'] = (dirs) => {
  dirs.length = 0

  const customDirs = findComponentDirs('app/components')

  dirs.push(...customDirs)
}
