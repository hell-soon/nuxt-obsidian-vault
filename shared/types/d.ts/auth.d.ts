declare module '#auth-utils' {
  interface UserSession {
    repo?: string | null
  }

  interface SecureSessionData {
    githubToken: string
  }

  interface User {
    id: number
    login: string
    avatar: string
    name: string
    email: string | null
  }

}

export { }
