import 'vue-router'

declare module 'vue-router' {
  interface RouteParams {
    path?: string | string[]
  }
}
