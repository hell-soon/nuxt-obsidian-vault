import { Buffer } from 'node:buffer'
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-cbc'

export function useEncryption() {
  const config = useRuntimeConfig()
  const key = config.dbEncryptionKey

  if (!key || key.length !== 32) {
    throw new Error('Encryption key must be 32 characters long')
  }

  return {
    encrypt(text: string) {
      const iv = randomBytes(16)
      const cipher = createCipheriv(ALGORITHM, Buffer.from(key), iv)
      let encrypted = cipher.update(text)
      encrypted = Buffer.concat([encrypted, cipher.final()])
      return `${iv.toString('hex')}:${encrypted.toString('hex')}`
    },

    decrypt(text: string) {
      const [ivPart, encryptedPart] = text.split(':')
      if (!ivPart || !encryptedPart)
        return text

      const iv = Buffer.from(ivPart, 'hex')
      const encryptedText = Buffer.from(encryptedPart, 'hex')
      const decipher = createDecipheriv(ALGORITHM, Buffer.from(key), iv)
      let decrypted = decipher.update(encryptedText)
      decrypted = Buffer.concat([decrypted, decipher.final()])
      return decrypted.toString()
    },
  }
}
