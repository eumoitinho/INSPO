import { GoogleAdsApi, Customer } from 'google-ads-api'
import { IPlatformAdapter, PlatformCampaign } from '@ninetwodash/campaigns'
import { ICredentialRepository } from '@ninetwodash/clients'
import { IEncryptionService } from '@ninetwodash/auth'
import { DateRange } from '@ninetwodash/campaigns'

export class GoogleAdsAdapter implements IPlatformAdapter {
  constructor(
    private credentialRepository: ICredentialRepository,
    private encryptionService: IEncryptionService
  ) {}

  async fetchCampaigns(clientId: string, dateRange?: DateRange): Promise<PlatformCampaign[]> {
    const credentials = await this.getDecryptedCredentials(clientId)
    const client = this.createClient(credentials)
    
    const customer = client.Customer({
      customer_id: credentials.customer_id,
      refresh_token: credentials.refresh_token
    })

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.start_date,
        campaign.end_date,
        campaign_budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE segments.date DURING ${this.formatDateRange(dateRange)}
      ORDER BY campaign.id
    `

    const campaigns = await customer.query(query)
    
    return campaigns.map(this.mapToPlatformCampaign)
  }

  async fetchCampaignDetails(clientId: string, campaignId: string): Promise<PlatformCampaign | null> {
    const credentials = await this.getDecryptedCredentials(clientId)
    const client = this.createClient(credentials)
    
    const customer = client.Customer({
      customer_id: credentials.customer_id,
      refresh_token: credentials.refresh_token
    })

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.start_date,
        campaign.end_date,
        campaign_budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE campaign.id = ${campaignId}
    `

    const result = await customer.query(query)
    
    return result.length > 0 ? this.mapToPlatformCampaign(result[0]) : null
  }

  async updateCampaignStatus(clientId: string, campaignId: string, status: string): Promise<boolean> {
    const credentials = await this.getDecryptedCredentials(clientId)
    const client = this.createClient(credentials)
    
    const customer = client.Customer({
      customer_id: credentials.customer_id,
      refresh_token: credentials.refresh_token
    })

    try {
      await customer.campaigns.update([{
        resource_name: `customers/${credentials.customer_id}/campaigns/${campaignId}`,
        status: this.mapStatus(status)
      }])
      return true
    } catch (error) {
      console.error('Error updating campaign status:', error)
      return false
    }
  }

  async createCampaign(clientId: string, campaignData: any): Promise<string> {
    // Implementation for creating campaigns
    throw new Error('Not implemented')
  }

  private async getDecryptedCredentials(clientId: string) {
    const credential = await this.credentialRepository.find(clientId, 'google_ads')
    if (!credential) {
      throw new Error('Google Ads credentials not found')
    }

    const decrypted: Record<string, string> = {}
    for (const [key, value] of Object.entries(credential.credentials)) {
      decrypted[key] = this.encryptionService.decrypt(value)
    }

    return decrypted
  }

  private createClient(credentials: Record<string, string>) {
    return new GoogleAdsApi({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      developer_token: credentials.developer_token
    })
  }

  private mapToPlatformCampaign(campaign: any): PlatformCampaign {
    return {
      campaignId: campaign.campaign.id.toString(),
      campaignName: campaign.campaign.name,
      status: this.mapCampaignStatus(campaign.campaign.status),
      startDate: new Date(campaign.campaign.start_date),
      endDate: campaign.campaign.end_date ? new Date(campaign.campaign.end_date) : undefined,
      budget: campaign.campaign_budget.amount_micros / 1_000_000,
      metrics: {
        impressions: parseInt(campaign.metrics.impressions || '0'),
        clicks: parseInt(campaign.metrics.clicks || '0'),
        cost: campaign.metrics.cost_micros / 1_000_000,
        conversions: parseFloat(campaign.metrics.conversions || '0'),
        revenue: campaign.metrics.conversions_value || 0
      }
    }
  }

  private mapCampaignStatus(status: string): 'active' | 'paused' | 'completed' | 'draft' {
    switch (status) {
      case 'ENABLED': return 'active'
      case 'PAUSED': return 'paused'
      case 'REMOVED': return 'completed'
      default: return 'draft'
    }
  }

  private mapStatus(status: string): string {
    switch (status) {
      case 'active': return 'ENABLED'
      case 'paused': return 'PAUSED'
      case 'completed': return 'REMOVED'
      default: return 'PAUSED'
    }
  }

  private formatDateRange(dateRange?: DateRange): string {
    if (!dateRange) {
      return 'LAST_30_DAYS'
    }
    
    const start = dateRange.startDate.toISOString().split('T')[0].replace(/-/g, '')
    const end = dateRange.endDate.toISOString().split('T')[0].replace(/-/g, '')
    
    return `${start} AND ${end}`
  }
}