declare module '#auth-utils' {
  interface UserSession {
    repo?: string | null
  }

  interface SecureSessionData {
    githubToken: string
  }
}

export { }
