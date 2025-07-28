// Clients module exports

// Domain
export * from './domain/entities/client.entity'
export * from './domain/value-objects/budget.vo'
export * from './domain/services/slug.service'

// Application
export * from './application/dtos/client.dto'
export * from './application/use-cases/create-client.use-case'
export * from './application/use-cases/update-credentials.use-case'
export * from './application/ports/client.repository'
export * from './application/ports/credential.repository'

// Infrastructure
export * from './infrastructure/repositories/client.repository'
export * from './infrastructure/repositories/credential.repository'