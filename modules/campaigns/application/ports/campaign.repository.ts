import { CampaignEntity } from '../../domain/entities/campaign.entity'

export interface ICampaignRepository {
  findById(id: string): Promise<CampaignEntity | null>
  findByCampaignId(clientId: string, campaignId: string, platform: string): Promise<CampaignEntity | null>
  findByClient(clientId: string, filters?: CampaignFilters): Promise<{ campaigns: CampaignEntity[]; total: number }>
  create(data: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CampaignEntity>
  update(id: string, data: Partial<CampaignEntity>): Promise<CampaignEntity | null>
  delete(id: string): Promise<boolean>
  updateSyncStatus(clientId: string, platform: string, lastSync: Date): Promise<void>
  aggregateMetrics(clientId: string, dateRange?: { start: Date; end: Date }): Promise<AggregatedMetrics>
}

export interface CampaignFilters {
  platform?: string
  status?: string
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}

export interface AggregatedMetrics {
  totalCost: number
  totalRevenue: number
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  avgCTR: number
  avgCPC: number
  avgCPA: number
  overallROAS: number
}