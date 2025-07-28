import { createFacebookAdsClient, getFacebookDateRange } from '@/lib/facebook-ads';
import { connectToDatabase, Client } from '@/lib/mongodb';

interface AdSetMetrics {
  adSetId: string;
  adSetName: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
}

interface CampaignData {
  campaignId: string;
  campaignName: string;
  status: string;
  objective: string;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  adSets: AdSetMetrics[];
}

interface AccountInsights {
  accountId: string;
  accountName: string;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  reach: number;
  frequency: number;
  campaigns: CampaignData[];
}

export class FacebookAdsService {
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  /**
   * Busca insights da conta do Facebook Ads
   */
  async getAccountInsights(startDate: string, endDate: string): Promise<AccountInsights> {
    try {
      await connectToDatabase();
      const clientData = await Client.findById(this.clientId);
      
      if (!clientData?.facebookAds?.connected || !clientData?.facebookAds?.adAccountId) {
        throw new Error('Facebook Ads não conectado para este cliente');
      }

      const facebookClient = createFacebookAdsClient(
        clientData.facebookAds.adAccountId,
        clientData.facebookAds.pixelId,
        {
          appId: process.env.FACEBOOK_APP_ID,
          appSecret: process.env.FACEBOOK_APP_SECRET,
          accessToken: clientData.facebookAds.accessToken
        }
      );

      // Buscar métricas resumidas
      const summaryMetrics = await facebookClient.getSummaryMetrics(startDate, endDate);
      
      // Buscar insights detalhados
      const accountInsights = await facebookClient.getAdAccountInsights(startDate, endDate);
      
      // Buscar campanhas
      const campaignsData = await facebookClient.getCampaignData(startDate, endDate);
      
      // Agrupar campanhas e buscar adsets
      const campaignMap = new Map<string, CampaignData>();
      
      for (const campaign of campaignsData) {
        if (!campaignMap.has(campaign.campaignId)) {
          // Buscar adsets desta campanha
          const adSetsResponse = await facebookClient['makeRequest'](
            `${campaign.campaignId}/adsets`,
            {
              fields: 'id,name,insights{impressions,clicks,spend,actions,ctr,cpc,cpm}',
              time_range: JSON.stringify({ since: startDate, until: endDate })
            }
          );
          
          const adSets = (adSetsResponse.data || []).map((adSet: any) => {
            const insights = adSet.insights?.data?.[0] || {};
            const conversions = insights.actions?.filter((a: any) => 
              ['purchase', 'lead', 'complete_registration'].includes(a.action_type)
            ).reduce((sum: number, action: any) => sum + (parseInt(action.value) || 0), 0) || 0;
            
            return {
              adSetId: adSet.id,
              adSetName: adSet.name,
              impressions: parseInt(insights.impressions) || 0,
              clicks: parseInt(insights.clicks) || 0,
              spend: parseFloat(insights.spend) || 0,
              conversions,
              ctr: parseFloat(insights.ctr) || 0,
              cpc: parseFloat(insights.cpc) || 0,
              cpm: parseFloat(insights.cpm) || 0
            };
          });
          
          campaignMap.set(campaign.campaignId, {
            campaignId: campaign.campaignId,
            campaignName: campaign.campaignName,
            status: campaign.status.toUpperCase(),
            objective: 'CONVERSIONS', // Default, pode ser melhorado
            totalSpend: campaign.metrics.cost,
            totalImpressions: campaign.metrics.impressions,
            totalClicks: campaign.metrics.clicks,
            totalConversions: campaign.metrics.conversions,
            adSets
          });
        }
      }
      
      // Calcular reach e frequency dos insights
      let totalReach = 0;
      let totalFrequency = 0;
      let dataPoints = 0;
      
      if (accountInsights && Array.isArray(accountInsights)) {
        accountInsights.forEach((insight: any) => {
          totalReach += parseInt(insight.reach) || 0;
          totalFrequency += parseFloat(insight.frequency) || 0;
          dataPoints++;
        });
      }

      return {
        accountId: clientData.facebookAds.adAccountId,
        accountName: clientData.name + ' - Facebook Ads',
        totalSpend: summaryMetrics.cost,
        totalImpressions: summaryMetrics.impressions,
        totalClicks: summaryMetrics.clicks,
        totalConversions: summaryMetrics.conversions,
        reach: totalReach,
        frequency: dataPoints > 0 ? totalFrequency / dataPoints : 0,
        campaigns: Array.from(campaignMap.values())
      };
    } catch (error) {
      console.error('Erro ao buscar insights do Facebook Ads:', error);
      throw error;
    }
  }

  /**
   * Busca métricas de anúncios
   */
  async getAdPerformance(campaignId?: string) {
    try {
      await connectToDatabase();
      const clientData = await Client.findById(this.clientId);
      
      if (!clientData?.facebookAds?.connected || !clientData?.facebookAds?.adAccountId) {
        throw new Error('Facebook Ads não conectado para este cliente');
      }

      const facebookClient = createFacebookAdsClient(
        clientData.facebookAds.adAccountId,
        clientData.facebookAds.pixelId,
        {
          appId: process.env.FACEBOOK_APP_ID,
          appSecret: process.env.FACEBOOK_APP_SECRET,
          accessToken: clientData.facebookAds.accessToken
        }
      );

      const { from, to } = getFacebookDateRange('30d');
      const creatives = await facebookClient.getAdCreativesData(from, to);
      
      return creatives.map((ad: any) => {
        const insights = ad.insights?.data?.[0] || {};
        const conversions = insights.actions?.filter((a: any) => 
          ['purchase', 'lead', 'complete_registration'].includes(a.action_type)
        ).reduce((sum: number, action: any) => sum + (parseInt(action.value) || 0), 0) || 0;
        
        return {
          adId: ad.id,
          adName: ad.name,
          status: ad.status || 'ACTIVE',
          impressions: parseInt(insights.impressions) || 0,
          clicks: parseInt(insights.clicks) || 0,
          spend: parseFloat(insights.spend) || 0,
          conversions,
          ctr: parseFloat(insights.ctr) || 0,
          relevanceScore: 0 // Facebook removeu relevance score
        };
      });
    } catch (error) {
      console.error('Erro ao buscar performance de anúncios:', error);
      return [];
    }
  }

  /**
   * Busca dados demográficos do público
   */
  async getAudienceInsights() {
    try {
      await connectToDatabase();
      const clientData = await Client.findById(this.clientId);
      
      if (!clientData?.facebookAds?.connected || !clientData?.facebookAds?.adAccountId) {
        throw new Error('Facebook Ads não conectado para este cliente');
      }

      const facebookClient = createFacebookAdsClient(
        clientData.facebookAds.adAccountId,
        clientData.facebookAds.pixelId,
        {
          appId: process.env.FACEBOOK_APP_ID,
          appSecret: process.env.FACEBOOK_APP_SECRET,
          accessToken: clientData.facebookAds.accessToken
        }
      );

      const { from, to } = getFacebookDateRange('30d');
      
      // Buscar insights por idade e gênero
      const demographicsResponse = await facebookClient['makeRequest'](
        `act_${clientData.facebookAds.adAccountId}/insights`,
        {
          fields: 'impressions',
          time_range: JSON.stringify({ since: from, until: to }),
          breakdowns: 'age,gender',
          limit: 100
        }
      );
      
      // Buscar insights por localização
      const locationResponse = await facebookClient['makeRequest'](
        `act_${clientData.facebookAds.adAccountId}/insights`,
        {
          fields: 'impressions',
          time_range: JSON.stringify({ since: from, until: to }),
          breakdowns: 'region',
          limit: 20
        }
      );
      
      // Processar dados demográficos
      const genderData = { male: 0, female: 0 };
      const ageData: Record<string, number> = {};
      let totalImpressions = 0;
      
      (demographicsResponse.data || []).forEach((item: any) => {
        const impressions = parseInt(item.impressions) || 0;
        totalImpressions += impressions;
        
        if (item.gender === 'male') genderData.male += impressions;
        else if (item.gender === 'female') genderData.female += impressions;
        
        const age = item.age || 'unknown';
        ageData[age] = (ageData[age] || 0) + impressions;
      });
      
      // Converter para percentuais
      const gender = {
        male: totalImpressions > 0 ? Math.round((genderData.male / totalImpressions) * 100) : 0,
        female: totalImpressions > 0 ? Math.round((genderData.female / totalImpressions) * 100) : 0
      };
      
      // Agrupar idades
      const ageRange = {
        '18-24': 0,
        '25-34': 0,
        '35-44': 0,
        '45-54': 0,
        '55+': 0
      };
      
      Object.entries(ageData).forEach(([age, impressions]) => {
        if (age.includes('18-24')) ageRange['18-24'] += impressions;
        else if (age.includes('25-34')) ageRange['25-34'] += impressions;
        else if (age.includes('35-44')) ageRange['35-44'] += impressions;
        else if (age.includes('45-54')) ageRange['45-54'] += impressions;
        else if (age.includes('55-64') || age.includes('65+')) ageRange['55+'] += impressions;
      });
      
      // Converter para percentuais
      Object.keys(ageRange).forEach(key => {
        ageRange[key as keyof typeof ageRange] = totalImpressions > 0 
          ? Math.round((ageRange[key as keyof typeof ageRange] / totalImpressions) * 100) 
          : 0;
      });
      
      // Processar localizações
      const topLocations = (locationResponse.data || [])
        .map((item: any) => ({
          location: item.region || 'Desconhecido',
          impressions: parseInt(item.impressions) || 0
        }))
        .sort((a: any, b: any) => b.impressions - a.impressions)
        .slice(0, 5)
        .map((item: any) => ({
          location: item.location,
          percentage: totalImpressions > 0 
            ? Math.round((item.impressions / totalImpressions) * 100) 
            : 0
        }));

      return {
        gender,
        ageRange,
        topLocations
      };
    } catch (error) {
      console.error('Erro ao buscar insights de audiência:', error);
      return {
        gender: { male: 0, female: 0 },
        ageRange: {
          '18-24': 0,
          '25-34': 0,
          '35-44': 0,
          '45-54': 0,
          '55+': 0
        },
        topLocations: []
      };
    }
  }

  /**
   * Busca dados do Pixel do Facebook
   */
  async getPixelEvents(pixelId?: string) {
    try {
      await connectToDatabase();
      const clientData = await Client.findById(this.clientId);
      
      const actualPixelId = pixelId || clientData?.facebookAds?.pixelId;
      if (!actualPixelId) {
        return null;
      }

      const facebookClient = createFacebookAdsClient(
        clientData.facebookAds.adAccountId,
        actualPixelId,
        {
          appId: process.env.FACEBOOK_APP_ID,
          appSecret: process.env.FACEBOOK_APP_SECRET,
          accessToken: clientData.facebookAds.accessToken
        }
      );

      const { from, to } = getFacebookDateRange('7d');
      const pixelData = await facebookClient.getPixelData(from, to);
      
      if (!pixelData) {
        return null;
      }
      
      // Processar eventos do pixel
      const events: Record<string, number> = {};
      let totalEvents = 0;
      let conversionValue = 0;
      
      (pixelData || []).forEach((event: any) => {
        const eventName = event.event_name || 'Unknown';
        const count = parseInt(event.count) || 0;
        events[eventName] = (events[eventName] || 0) + count;
        totalEvents += count;
        
        if (event.value) {
          conversionValue += parseFloat(event.value) || 0;
        }
      });

      return {
        pixelId: actualPixelId,
        totalEvents,
        events,
        conversionValue
      };
    } catch (error) {
      console.error('Erro ao buscar eventos do pixel:', error);
      return null;
    }
  }
}