// Auth module exports

// Domain
export * from './domain/entities/user.entity'
export * from './domain/services/encryption.service'

// Application
export * from './application/dtos/auth.dto'
export * from './application/use-cases/sign-in.use-case'
export * from './application/ports/user.repository'

// Infrastructure
export { authOptions } from './infrastructure/config/nextauth.config'
export * from './infrastructure/repositories/user.repository'

// Utilities
export { canAccessClient, generateRandomPassword } from './utils/auth.utils'