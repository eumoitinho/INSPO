import { ICampaignRepository } from '../ports/campaign.repository'
import { IPlatformAdapter } from '../ports/platform.adapter'
import { Campaign, CampaignEntity } from '../../domain/entities/campaign.entity'
import { DateRange } from '../../domain/value-objects/date-range.vo'

export interface ISyncCampaignsUseCase {
  execute(clientId: string, platform: string, dateRange?: DateRange): Promise<SyncResult>
}

export type SyncResult = 
  | { success: true; campaignsUpdated: number; newCampaigns: number }
  | { success: false; error: string }

export class SyncCampaignsUseCase implements ISyncCampaignsUseCase {
  constructor(
    private campaignRepository: ICampaignRepository,
    private platformAdapters: Map<string, IPlatformAdapter>
  ) {}

  async execute(
    clientId: string, 
    platform: string, 
    dateRange?: DateRange
  ): Promise<SyncResult> {
    try {
      // Get platform adapter
      const adapter = this.platformAdapters.get(platform)
      if (!adapter) {
        return { success: false, error: `Platform ${platform} not supported` }
      }

      // Fetch campaigns from platform
      const platformCampaigns = await adapter.fetchCampaigns(clientId, dateRange)
      
      let campaignsUpdated = 0
      let newCampaigns = 0

      for (const platformData of platformCampaigns) {
        // Check if campaign exists
        const existingCampaign = await this.campaignRepository.findByCampaignId(
          clientId,
          platformData.campaignId,
          platform
        )

        if (existingCampaign) {
          // Update existing campaign
          const campaign = new Campaign(existingCampaign)
          campaign.updateMetrics(platformData.metrics)
          
          await this.campaignRepository.update(campaign.id, campaign.toJSON())
          campaignsUpdated++
        } else {
          // Create new campaign
          const campaignData: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'> = {
            clientId,
            campaignId: platformData.campaignId,
            campaignName: platformData.campaignName,
            platform: platform as any,
            status: platformData.status,
            startDate: platformData.startDate,
            endDate: platformData.endDate,
            budget: platformData.budget,
            metrics: platformData.metrics,
            lastSync: new Date()
          }
          
          await this.campaignRepository.create(campaignData)
          newCampaigns++
        }
      }

      // Update client sync status
      await this.campaignRepository.updateSyncStatus(clientId, platform, new Date())

      return {
        success: true,
        campaignsUpdated,
        newCampaigns
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message }
      }
      return { success: false, error: 'Failed to sync campaigns' }
    }
  }
}