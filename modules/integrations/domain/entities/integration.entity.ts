import { z } from 'zod'

export const IntegrationPlatformEnum = z.enum(['google_ads', 'facebook_ads', 'google_analytics'])
export type IntegrationPlatform = z.infer<typeof IntegrationPlatformEnum>

export const ConnectionStatusEnum = z.enum(['connected', 'disconnected', 'error', 'refreshing'])
export type ConnectionStatus = z.infer<typeof ConnectionStatusEnum>

export const IntegrationEntitySchema = z.object({
  id: z.string(),
  clientId: z.string(),
  platform: IntegrationPlatformEnum,
  status: ConnectionStatusEnum,
  credentials: z.record(z.string()), // Encrypted
  lastSync: z.date().optional(),
  lastError: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.date().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type IntegrationEntity = z.infer<typeof IntegrationEntitySchema>

export class Integration {
  constructor(private props: IntegrationEntity) {}

  get id() { return this.props.id }
  get clientId() { return this.props.clientId }
  get platform() { return this.props.platform }
  get status() { return this.props.status }
  get lastSync() { return this.props.lastSync }

  isConnected(): boolean {
    return this.props.status === 'connected'
  }

  needsTokenRefresh(): boolean {
    if (!this.props.tokenExpiresAt) return false
    const now = new Date()
    const expiresAt = new Date(this.props.tokenExpiresAt)
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)
    return expiresAt <= fiveMinutesFromNow
  }

  markAsConnected(): void {
    this.props.status = 'connected'
    this.props.lastError = undefined
    this.props.updatedAt = new Date()
  }

  markAsError(error: string): void {
    this.props.status = 'error'
    this.props.lastError = error
    this.props.updatedAt = new Date()
  }

  updateTokens(refreshToken: string, expiresAt: Date): void {
    this.props.refreshToken = refreshToken
    this.props.tokenExpiresAt = expiresAt
    this.props.updatedAt = new Date()
  }

  updateLastSync(): void {
    this.props.lastSync = new Date()
    this.props.updatedAt = new Date()
  }

  toJSON(): IntegrationEntity {
    return this.props
  }
}