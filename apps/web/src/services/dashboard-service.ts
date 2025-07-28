import { GoogleAdsService } from './google-ads-service';
import { FacebookAdsService } from './facebook-ads-service';
import { GoogleAnalyticsService } from './google-analytics-service';
import { connectToDatabase, Client } from '@/lib/mongodb';

interface DashboardMetrics {
  totalSpend: number;
  totalRevenue: number;
  totalConversions: number;
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  avgCpc: number;
  roas: number;
  period: string;
}

interface ChannelPerformance {
  channel: string;
  spend: number;
  revenue: number;
  conversions: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  roas: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  channelPerformance: ChannelPerformance[];
  topCampaigns: Array<{
    name: string;
    platform: string;
    spend: number;
    conversions: number;
    roas: number;
  }>;
  dailyMetrics: Array<{
    date: string;
    spend: number;
    revenue: number;
    conversions: number;
  }>;
  devicePerformance: Array<{
    device: string;
    sessions: number;
    conversions: number;
    conversionRate: number;
  }>;
}

export class DashboardService {
  private clientId: string;
  private googleAdsService: GoogleAdsService;
  private facebookAdsService: FacebookAdsService;
  private googleAnalyticsService: GoogleAnalyticsService;

  constructor(clientId: string) {
    this.clientId = clientId;
    this.googleAdsService = new GoogleAdsService(clientId);
    this.facebookAdsService = new FacebookAdsService(clientId);
    this.googleAnalyticsService = new GoogleAnalyticsService(clientId);
  }

  /**
   * Busca dados consolidados do dashboard
   */
  async getDashboardData(period: '7d' | '30d' | '90d' = '30d', enabledSources: string[] = ['googleAds', 'facebookAds', 'googleAnalytics']): Promise<DashboardData> {
    try {
      await connectToDatabase();
      
      // Buscar dados do cliente
      const client = await (Client as any).findById(this.clientId);
      if (!client) {
        throw new Error('Cliente não encontrado');
      }

      // Definir período
      const endDate = new Date();
      const startDate = new Date();
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Buscar dados de cada plataforma em paralelo (apenas das fontes habilitadas)
      const [googleAdsData, facebookAdsData, analyticsData] = await Promise.allSettled([
        client.googleAds?.connected && enabledSources.includes('googleAds')
          ? this.googleAdsService.getCampaignMetrics(startDateStr, endDateStr)
          : Promise.resolve(null),
        client.facebookAds?.connected && enabledSources.includes('facebookAds')
          ? this.facebookAdsService.getAccountInsights(startDateStr, endDateStr)
          : Promise.resolve(null),
        client.googleAnalytics?.connected && enabledSources.includes('googleAnalytics')
          ? this.googleAnalyticsService.getAnalyticsData(client.googleAnalytics.propertyId, startDateStr, endDateStr)
          : Promise.resolve(null)
      ]);

      // Processar dados
      const gAds = googleAdsData.status === 'fulfilled' ? googleAdsData.value : null;
      const fbAds = facebookAdsData.status === 'fulfilled' ? facebookAdsData.value : null;
      const analytics = analyticsData.status === 'fulfilled' ? analyticsData.value : null;

      // Calcular métricas totais
      const totalSpend = (gAds?.totalCost || 0) + (fbAds?.totalSpend || 0);
      const totalConversions = (gAds?.totalConversions || 0) + (fbAds?.totalConversions || 0);
      const totalImpressions = (gAds?.totalImpressions || 0) + (fbAds?.totalImpressions || 0);
      const totalClicks = (gAds?.totalClicks || 0) + (fbAds?.totalClicks || 0);
      const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
      const totalRevenue = totalConversions * 100; // Assumindo valor médio de R$ 100 por conversão
      const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

      // Montar dados do dashboard
      const dashboardData: DashboardData = {
        metrics: {
          totalSpend,
          totalRevenue,
          totalConversions,
          totalImpressions,
          totalClicks,
          avgCtr,
          avgCpc,
          roas,
          period
        },
        channelPerformance: this.buildChannelPerformance(gAds, fbAds),
        topCampaigns: this.buildTopCampaigns(gAds, fbAds),
        dailyMetrics: this.buildDailyMetrics(startDateStr, endDateStr, googleAds, facebookAds, analytics),
        devicePerformance: this.buildDevicePerformance(analytics)
      };

      return dashboardData;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  }

  /**
   * Constrói dados de performance por canal
   */
  private buildChannelPerformance(gAds: any, fbAds: any): ChannelPerformance[] {
    const channels: ChannelPerformance[] = [];

    if (gAds) {
      channels.push({
        channel: 'Google Ads',
        spend: gAds.totalCost,
        revenue: gAds.totalConversions * 100,
        conversions: gAds.totalConversions,
        impressions: gAds.totalImpressions,
        clicks: gAds.totalClicks,
        ctr: gAds.averageCtr,
        cpc: gAds.averageCpc,
        roas: gAds.totalCost > 0 ? (gAds.totalConversions * 100) / gAds.totalCost : 0
      });
    }

    if (fbAds) {
      channels.push({
        channel: 'Facebook Ads',
        spend: fbAds.totalSpend,
        revenue: fbAds.totalConversions * 100,
        conversions: fbAds.totalConversions,
        impressions: fbAds.totalImpressions,
        clicks: fbAds.totalClicks,
        ctr: fbAds.totalImpressions > 0 ? (fbAds.totalClicks / fbAds.totalImpressions) * 100 : 0,
        cpc: fbAds.totalClicks > 0 ? fbAds.totalSpend / fbAds.totalClicks : 0,
        roas: fbAds.totalSpend > 0 ? (fbAds.totalConversions * 100) / fbAds.totalSpend : 0
      });
    }

    return channels;
  }

  /**
   * Constrói lista de campanhas top
   */
  private buildTopCampaigns(gAds: any, fbAds: any): any[] {
    const campaigns = [];

    if (gAds?.campaigns) {
      campaigns.push(...gAds.campaigns.map((c: any) => ({
        name: c.campaignName,
        platform: 'Google Ads',
        spend: c.cost,
        conversions: c.conversions,
        roas: c.cost > 0 ? (c.conversions * 100) / c.cost : 0
      })));
    }

    if (fbAds?.campaigns) {
      campaigns.push(...fbAds.campaigns.map((c: any) => ({
        name: c.campaignName,
        platform: 'Facebook Ads',
        spend: c.totalSpend,
        conversions: c.totalConversions,
        roas: c.totalSpend > 0 ? (c.totalConversions * 100) / c.totalSpend : 0
      })));
    }

    // Ordenar por ROAS e pegar top 5
    return campaigns.sort((a, b) => b.roas - a.roas).slice(0, 5);
  }

  /**
   * Constrói métricas diárias baseadas nos dados reais das APIs
   */
  private buildDailyMetrics(
    startDate: string, 
    endDate: string,
    googleAds?: any,
    facebookAds?: any,
    analytics?: any
  ): any[] {
    const metrics = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Obter dados históricos reais das APIs
    const googleAdsDaily = googleAds?.dailyStats || [];
    const facebookDaily = facebookAds?.dailyStats || [];
    const analyticsDaily = analytics?.dailyStats || [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      // Buscar dados reais para a data específica
      const googleData = googleAdsDaily.find((item: any) => item.date === dateStr);
      const facebookData = facebookDaily.find((item: any) => item.date === dateStr);
      const analyticsData = analyticsDaily.find((item: any) => item.date === dateStr);

      const spend = (googleData?.spend || 0) + (facebookData?.spend || 0);
      const revenue = analyticsData?.revenue || googleData?.revenue || facebookData?.revenue || 0;
      const conversions = (googleData?.conversions || 0) + (facebookData?.conversions || 0);

      metrics.push({
        date: dateStr,
        spend,
        revenue,
        conversions
      });
    }

    return metrics;
  }

  /**
   * Constrói dados de performance por dispositivo
   */
  private buildDevicePerformance(analytics: any): any[] {
    if (!analytics?.deviceCategories) {
      return [];
    }

    return analytics.deviceCategories.map((device: any) => ({
      device: device.device,
      sessions: device.sessions,
      conversions: device.conversions,
      conversionRate: device.sessions > 0 ? (device.conversions / device.sessions) * 100 : 0
    }));
  }
}