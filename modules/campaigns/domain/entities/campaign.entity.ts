import { z } from 'zod'

export const PlatformEnum = z.enum(['google_ads', 'facebook_ads'])
export type Platform = z.infer<typeof PlatformEnum>

export const CampaignStatusEnum = z.enum(['active', 'paused', 'completed', 'draft'])
export type CampaignStatus = z.infer<typeof CampaignStatusEnum>

export const MetricsSchema = z.object({
  impressions: z.number().default(0),
  clicks: z.number().default(0),
  cost: z.number().default(0),
  conversions: z.number().default(0),
  revenue: z.number().default(0),
  ctr: z.number().optional(), // Click-through rate
  cpc: z.number().optional(), // Cost per click
  cpa: z.number().optional(), // Cost per acquisition
  roas: z.number().optional(), // Return on ad spend
  conversionRate: z.number().optional()
})

export type Metrics = z.infer<typeof MetricsSchema>

export const CampaignEntitySchema = z.object({
  id: z.string(),
  clientId: z.string(),
  campaignId: z.string(), // ID na plataforma
  campaignName: z.string(),
  platform: PlatformEnum,
  status: CampaignStatusEnum,
  startDate: z.date(),
  endDate: z.date().optional(),
  budget: z.number().positive(),
  metrics: MetricsSchema,
  lastSync: z.date(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type CampaignEntity = z.infer<typeof CampaignEntitySchema>

export class Campaign {
  constructor(private props: CampaignEntity) {}

  get id() { return this.props.id }
  get clientId() { return this.props.clientId }
  get campaignName() { return this.props.campaignName }
  get platform() { return this.props.platform }
  get status() { return this.props.status }
  get metrics() { return this.props.metrics }

  isActive(): boolean {
    return this.props.status === 'active'
  }

  isProfitable(): boolean {
    return (this.props.metrics.roas || 0) > 1
  }

  calculateCTR(): number {
    if (this.props.metrics.impressions === 0) return 0
    return (this.props.metrics.clicks / this.props.metrics.impressions) * 100
  }

  calculateCPC(): number {
    if (this.props.metrics.clicks === 0) return 0
    return this.props.metrics.cost / this.props.metrics.clicks
  }

  calculateCPA(): number {
    if (this.props.metrics.conversions === 0) return 0
    return this.props.metrics.cost / this.props.metrics.conversions
  }

  calculateROAS(): number {
    if (this.props.metrics.cost === 0) return 0
    return this.props.metrics.revenue / this.props.metrics.cost
  }

  calculateConversionRate(): number {
    if (this.props.metrics.clicks === 0) return 0
    return (this.props.metrics.conversions / this.props.metrics.clicks) * 100
  }

  updateMetrics(metrics: Partial<Metrics>): void {
    this.props.metrics = { ...this.props.metrics, ...metrics }
    
    // Recalcula métricas derivadas
    this.props.metrics.ctr = this.calculateCTR()
    this.props.metrics.cpc = this.calculateCPC()
    this.props.metrics.cpa = this.calculateCPA()
    this.props.metrics.roas = this.calculateROAS()
    this.props.metrics.conversionRate = this.calculateConversionRate()
    
    this.props.updatedAt = new Date()
  }

  toJSON(): CampaignEntity {
    return this.props
  }
}