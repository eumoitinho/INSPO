import { DateRange } from '../../domain/value-objects/date-range.vo'
import { Metrics } from '../../domain/entities/campaign.entity'

export interface PlatformCampaign {
  campaignId: string
  campaignName: string
  status: 'active' | 'paused' | 'completed' | 'draft'
  startDate: Date
  endDate?: Date
  budget: number
  metrics: Metrics
}

export interface IPlatformAdapter {
  fetchCampaigns(clientId: string, dateRange?: DateRange): Promise<PlatformCampaign[]>
  fetchCampaignDetails(clientId: string, campaignId: string): Promise<PlatformCampaign | null>
  updateCampaignStatus(clientId: string, campaignId: string, status: string): Promise<boolean>
  createCampaign(clientId: string, campaignData: any): Promise<string>
}