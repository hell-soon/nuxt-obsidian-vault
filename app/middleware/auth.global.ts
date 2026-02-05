export default defineNuxtRouteMiddleware((to, _from) => {
  const { loggedIn, session } = useUserSession()

  const publicRoutes = ['/login', '/auth/github']
  const isPublicRoute = publicRoutes.includes(to.path)

  if (!loggedIn.value) {
    if (isPublicRoute)
      return

    return navigateTo('/login')
  }

  if (to.path === '/') {
    if (session.value?.repo) {
      return navigateTo('/notes')
    }
    return navigateTo('/select-repo')
  }

  if (!session.value?.repo && to.path !== '/select-repo') {
    return navigateTo('/select-repo')
  }
})
