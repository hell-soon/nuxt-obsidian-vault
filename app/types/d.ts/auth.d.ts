declare module '#auth-utils' {
  interface User {
    login: string
    avatar: string
    name?: string
    email?: string
  }

  interface UserSession {
    repo?: string | null
  }
}

export { }
