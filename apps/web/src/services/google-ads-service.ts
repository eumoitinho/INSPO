import { createGoogleAdsClient, getDateRange } from '@/lib/google-ads';
import { getGoogleAdsCredentials } from '@/lib/client-credentials';
import { connectToDatabase, Client } from '@/lib/mongodb';

interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
}

interface AccountMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalCost: number;
  totalConversions: number;
  averageCtr: number;
  averageCpc: number;
  campaigns: CampaignMetrics[];
}

export class GoogleAdsService {
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  /**
   * Busca métricas de campanhas do Google Ads
   */
  async getCampaignMetrics(startDate: string, endDate: string): Promise<AccountMetrics> {
    try {
      await connectToDatabase();
      const clientData = await Client.findById(this.clientId);
      
      if (!clientData?.googleAds?.connected || !clientData?.googleAds?.customerId) {
        throw new Error('Google Ads não conectado para este cliente');
      }

      // Criar cliente Google Ads com as credenciais do cliente
      const googleAdsClient = createGoogleAdsClient(
        clientData.googleAds.customerId,
        {
          developerId: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          clientId: process.env.GOOGLE_ADS_CLIENT_ID,
          clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
          refreshToken: clientData.googleAds.refreshToken
        }
      );

      // Buscar métricas resumidas
      const summaryMetrics = await googleAdsClient.getSummaryMetrics(startDate, endDate);
      
      // Buscar dados de campanhas
      const campaigns = await googleAdsClient.getCampaignData(startDate, endDate);
      
      // Agrupar campanhas e calcular métricas
      const campaignMap = new Map<string, CampaignMetrics>();
      
      campaigns.forEach(campaign => {
        const existing = campaignMap.get(campaign.campaignId) || {
          campaignId: campaign.campaignId,
          campaignName: campaign.campaignName,
          impressions: 0,
          clicks: 0,
          cost: 0,
          conversions: 0,
          ctr: 0,
          cpc: 0,
          conversionRate: 0
        };
        
        existing.impressions += campaign.metrics.impressions;
        existing.clicks += campaign.metrics.clicks;
        existing.cost += campaign.metrics.cost;
        existing.conversions += campaign.metrics.conversions;
        
        campaignMap.set(campaign.campaignId, existing);
      });
      
      // Calcular métricas derivadas para cada campanha
      const campaignMetrics: CampaignMetrics[] = Array.from(campaignMap.values()).map(campaign => ({
        ...campaign,
        ctr: campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0,
        cpc: campaign.clicks > 0 ? campaign.cost / campaign.clicks : 0,
        conversionRate: campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0
      }));

      return {
        totalImpressions: summaryMetrics.impressions,
        totalClicks: summaryMetrics.clicks,
        totalCost: summaryMetrics.cost,
        totalConversions: summaryMetrics.conversions,
        averageCtr: summaryMetrics.ctr,
        averageCpc: summaryMetrics.cpc,
        campaigns: campaignMetrics
      };
    } catch (error) {
      console.error('Erro ao buscar métricas do Google Ads:', error);
      throw error;
    }
  }

  /**
   * Busca dados de desempenho por período
   */
  async getPerformanceData(period: '7d' | '30d' | '90d') {
    const { from, to } = getDateRange(period);
    return this.getCampaignMetrics(from, to);
  }

  /**
   * Busca palavras-chave com melhor desempenho
   */
  async getTopKeywords(limit: number = 10) {
    try {
      await connectToDatabase();
      const clientData = await Client.findById(this.clientId);
      
      if (!clientData?.googleAds?.connected || !clientData?.googleAds?.customerId) {
        throw new Error('Google Ads não conectado para este cliente');
      }

      const googleAdsClient = createGoogleAdsClient(
        clientData.googleAds.customerId,
        {
          developerId: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          clientId: process.env.GOOGLE_ADS_CLIENT_ID,
          clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
          refreshToken: clientData.googleAds.refreshToken
        }
      );

      // Query para buscar keywords
      const { from, to } = getDateRange('30d');
      const query = `
        SELECT 
          ad_group_criterion.keyword.text,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions
        FROM keyword_view 
        WHERE segments.date BETWEEN '${from}' AND '${to}'
        AND metrics.clicks > 0
        ORDER BY metrics.clicks DESC
        LIMIT ${limit}
      `;

      const response = await googleAdsClient['makeRequest'](
        `customers/${clientData.googleAds.customerId}/googleAds:searchStream`,
        { query }
      );

      if (!response.results) return [];

      return response.results.map((result: any) => ({
        keyword: result.adGroupCriterion.keyword.text,
        clicks: Number(result.metrics.clicks) || 0,
        cost: Number(result.metrics.costMicros) / 1000000 || 0,
        conversions: Number(result.metrics.conversions) || 0
      }));
    } catch (error) {
      console.error('Erro ao buscar palavras-chave:', error);
      // Retornar array vazio em caso de erro
      return [];
    }
  }

  /**
   * Busca dados de dispositivos
   */
  async getDevicePerformance() {
    try {
      await connectToDatabase();
      const clientData = await Client.findById(this.clientId);
      
      if (!clientData?.googleAds?.connected || !clientData?.googleAds?.customerId) {
        throw new Error('Google Ads não conectado para este cliente');
      }

      const googleAdsClient = createGoogleAdsClient(
        clientData.googleAds.customerId,
        {
          developerId: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          clientId: process.env.GOOGLE_ADS_CLIENT_ID,
          clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
          refreshToken: clientData.googleAds.refreshToken
        }
      );

      // Query para buscar dados por dispositivo
      const { from, to } = getDateRange('30d');
      const query = `
        SELECT 
          segments.device,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions
        FROM campaign 
        WHERE segments.date BETWEEN '${from}' AND '${to}'
        AND campaign.status = 'ENABLED'
      `;

      const response = await googleAdsClient['makeRequest'](
        `customers/${clientData.googleAds.customerId}/googleAds:searchStream`,
        { query }
      );

      const deviceData = {
        desktop: { impressions: 0, clicks: 0, conversions: 0 },
        mobile: { impressions: 0, clicks: 0, conversions: 0 },
        tablet: { impressions: 0, clicks: 0, conversions: 0 }
      };

      if (response.results) {
        response.results.forEach((result: any) => {
          const device = result.segments.device.toLowerCase();
          if (device in deviceData) {
            deviceData[device as keyof typeof deviceData].impressions += Number(result.metrics.impressions) || 0;
            deviceData[device as keyof typeof deviceData].clicks += Number(result.metrics.clicks) || 0;
            deviceData[device as keyof typeof deviceData].conversions += Number(result.metrics.conversions) || 0;
          }
        });
      }

      return deviceData;
    } catch (error) {
      console.error('Erro ao buscar dados de dispositivos:', error);
      // Retornar dados zerados em caso de erro
      return {
        desktop: { impressions: 0, clicks: 0, conversions: 0 },
        mobile: { impressions: 0, clicks: 0, conversions: 0 },
        tablet: { impressions: 0, clicks: 0, conversions: 0 }
      };
    }
  }
}