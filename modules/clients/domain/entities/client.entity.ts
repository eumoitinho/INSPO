import { z } from 'zod'

export const ClientStatusEnum = z.enum(['active', 'inactive', 'suspended'])
export type ClientStatus = z.infer<typeof ClientStatusEnum>

export const PortalSettingsSchema = z.object({
  primaryColor: z.string().default('#3B82F6'),
  secondaryColor: z.string().default('#8B5CF6'),
  logo: z.string().optional(),
  customDomain: z.string().optional(),
  allowedSections: z.array(z.enum(['dashboard', 'campaigns', 'reports', 'analytics'])).default(['dashboard', 'campaigns', 'reports'])
})

export const IntegrationStatusSchema = z.object({
  connected: z.boolean().default(false),
  lastSync: z.date().optional(),
  error: z.string().optional()
})

export const ClientEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  slug: z.string(),
  status: ClientStatusEnum,
  monthlyBudget: z.number().positive(),
  tags: z.array(z.string()).default([]),
  portalSettings: PortalSettingsSchema,
  googleAds: IntegrationStatusSchema,
  facebookAds: IntegrationStatusSchema,
  googleAnalytics: IntegrationStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional()
})

export type ClientEntity = z.infer<typeof ClientEntitySchema>

export class Client {
  constructor(private props: ClientEntity) {}

  get id() { return this.props.id }
  get name() { return this.props.name }
  get email() { return this.props.email }
  get slug() { return this.props.slug }
  get status() { return this.props.status }
  get monthlyBudget() { return this.props.monthlyBudget }
  get tags() { return this.props.tags }
  get portalSettings() { return this.props.portalSettings }

  isActive(): boolean {
    return this.props.status === 'active'
  }

  hasIntegration(platform: 'googleAds' | 'facebookAds' | 'googleAnalytics'): boolean {
    return this.props[platform].connected
  }

  canAccessSection(section: string): boolean {
    return this.props.portalSettings.allowedSections.includes(section as any)
  }

  updateBudget(newBudget: number): void {
    if (newBudget <= 0) {
      throw new Error('Budget must be positive')
    }
    this.props.monthlyBudget = newBudget
    this.props.updatedAt = new Date()
  }

  suspend(): void {
    this.props.status = 'suspended'
    this.props.updatedAt = new Date()
  }

  activate(): void {
    this.props.status = 'active'
    this.props.updatedAt = new Date()
  }

  toJSON(): ClientEntity {
    return this.props
  }
}