import crypto from 'crypto'
import bcryptjs from 'bcryptjs'

export interface IEncryptionService {
  hashPassword(password: string): Promise<string>
  comparePassword(password: string, hash: string): Promise<boolean>
  encrypt(text: string): string
  decrypt(text: string): string
}

export class EncryptionService implements IEncryptionService {
  private algorithm = 'aes-256-cbc'
  private key: Buffer
  private iv: Buffer

  constructor(encryptionKey: string) {
    // Ensure key is 32 bytes
    this.key = Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32))
    this.iv = Buffer.alloc(16, 0) // Initialization vector
  }

  async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 10)
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash)
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
  }

  decrypt(text: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}