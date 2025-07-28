import { NextResponse } from 'next/server';
import { connectToDatabase, findClientBySlug, Campaign, AnalyticsData } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { client } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const chartType = searchParams.get('type') || 'all';
    
    // Connect to database
    await connectToDatabase();
    
    // Find client by slug
    const clientData = await findClientBySlug(client);
    if (!clientData) {
      return NextResponse.json(
        { success: false, message: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Check if user has access to this client
    if (session.user.role !== 'admin' && session.user.clientSlug !== client) {
      return NextResponse.json(
        { success: false, message: 'Acesso negado a este cliente' },
        { status: 403 }
      );
    }

    // Get date range for the period
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch chart data based on type
    if (chartType === 'custom') {
      // Get custom charts from database
      const customCharts = clientData.customCharts || [];
      return NextResponse.json({
        success: true,
        data: customCharts
      });
    }

    // Generate chart data from MongoDB
    const chartData = await generateChartData(clientData._id, startDate, chartType);

    return NextResponse.json({
      success: true,
      data: chartData,
      period,
      chartType
    });

  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { client } = await params;
    const chartConfig = await request.json();
    
    // Connect to database
    await connectToDatabase();
    
    // Find client by slug
    const clientData = await findClientBySlug(client);
    if (!clientData) {
      return NextResponse.json(
        { success: false, message: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Check if user has access to this client
    if (session.user.role !== 'admin' && session.user.clientSlug !== client) {
      return NextResponse.json(
        { success: false, message: 'Acesso negado a este cliente' },
        { status: 403 }
      );
    }

    // Add timestamp and ID
    const newChart = {
      ...chartConfig,
      id: chartConfig.id || `chart_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save chart to database
    const { Client } = require('@/lib/mongodb');
    
    if (chartConfig.id && clientData.customCharts.find(c => c.id === chartConfig.id)) {
      // Update existing chart
      await Client.updateOne(
        { slug: client, 'customCharts.id': chartConfig.id },
        { 
          $set: { 
            'customCharts.$': newChart,
            updatedAt: new Date()
          }
        }
      );
    } else {
      // Add new chart
      await Client.updateOne(
        { slug: client },
        { 
          $push: { customCharts: newChart },
          $set: { updatedAt: new Date() }
        }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: newChart,
      message: 'Gráfico salvo com sucesso'
    });

  } catch (error) {
    console.error('Error saving custom chart:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function generateChartData(clientId, startDate, chartType) {
  const data = {};

  // Get campaigns data
  const campaigns = await Campaign.find({
    clientId,
    updatedAt: { $gte: startDate }
  }).sort({ updatedAt: -1 });

  // Get analytics data
  const analyticsData = await AnalyticsData.find({
    clientId,
    date: { $gte: startDate }
  }).sort({ date: 1 });

  if (chartType === 'all' || chartType === 'performance') {
    // Performance charts (impressions, clicks, cost, conversions over time)
    data.performance = generatePerformanceCharts(campaigns);
  }

  if (chartType === 'all' || chartType === 'analytics') {
    // Analytics charts (sessions, users, pageviews over time)
    data.analytics = generateAnalyticsCharts(analyticsData);
  }

  if (chartType === 'all' || chartType === 'comparison') {
    // Comparison charts (platform comparison, device breakdown)
    data.comparison = generateComparisonCharts(campaigns, analyticsData);
  }

  if (chartType === 'all' || chartType === 'funnel') {
    // Funnel charts (impressions -> clicks -> conversions)
    data.funnel = generateFunnelCharts(campaigns);
  }

  return data;
}

function generatePerformanceCharts(campaigns) {
  // Group campaigns by date and aggregate metrics
  const dailyMetrics = {};
  
  campaigns.forEach(campaign => {
    campaign.metrics?.forEach(metric => {
      const date = metric.date.toISOString().split('T')[0];
      if (!dailyMetrics[date]) {
        dailyMetrics[date] = {
          impressions: 0,
          clicks: 0,
          cost: 0,
          conversions: 0
        };
      }
      dailyMetrics[date].impressions += metric.impressions || 0;
      dailyMetrics[date].clicks += metric.clicks || 0;
      dailyMetrics[date].cost += metric.cost || 0;
      dailyMetrics[date].conversions += metric.conversions || 0;
    });
  });

  // Convert to array format for charts
  const chartData = Object.entries(dailyMetrics).map(([date, metrics]) => ({
    date,
    ...metrics,
    ctr: metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0,
    cpc: metrics.clicks > 0 ? metrics.cost / metrics.clicks : 0,
    cpm: metrics.impressions > 0 ? (metrics.cost / metrics.impressions) * 1000 : 0,
    conversionRate: metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0
  })).sort((a, b) => a.date.localeCompare(b.date));

  return {
    dailyMetrics: chartData,
    totalMetrics: chartData.reduce((acc, day) => ({
      impressions: acc.impressions + day.impressions,
      clicks: acc.clicks + day.clicks,
      cost: acc.cost + day.cost,
      conversions: acc.conversions + day.conversions
    }), { impressions: 0, clicks: 0, cost: 0, conversions: 0 })
  };
}

function generateAnalyticsCharts(analyticsData) {
  const chartData = analyticsData.map(day => ({
    date: day.date.toISOString().split('T')[0],
    sessions: day.sessions || 0,
    users: day.users || 0,
    newUsers: day.newUsers || 0,
    pageviews: day.pageviews || 0,
    bounceRate: day.bounceRate || 0,
    sessionDuration: day.sessionDuration || 0
  }));

  return {
    dailyAnalytics: chartData,
    totalAnalytics: chartData.reduce((acc, day) => ({
      sessions: acc.sessions + day.sessions,
      users: acc.users + day.users,
      newUsers: acc.newUsers + day.newUsers,
      pageviews: acc.pageviews + day.pageviews
    }), { sessions: 0, users: 0, newUsers: 0, pageviews: 0 })
  };
}

function generateComparisonCharts(campaigns, analyticsData) {
  // Platform comparison
  const platformMetrics = {};
  
  campaigns.forEach(campaign => {
    const platform = campaign.platform;
    if (!platformMetrics[platform]) {
      platformMetrics[platform] = {
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0
      };
    }
    
    const latestMetric = campaign.metrics?.[campaign.metrics.length - 1];
    if (latestMetric) {
      platformMetrics[platform].impressions += latestMetric.impressions || 0;
      platformMetrics[platform].clicks += latestMetric.clicks || 0;
      platformMetrics[platform].cost += latestMetric.cost || 0;
      platformMetrics[platform].conversions += latestMetric.conversions || 0;
    }
  });

  // Device breakdown from analytics
  const deviceMetrics = {};
  analyticsData.forEach(day => {
    day.deviceData?.forEach(device => {
      if (!deviceMetrics[device.deviceCategory]) {
        deviceMetrics[device.deviceCategory] = {
          sessions: 0,
          users: 0
        };
      }
      deviceMetrics[device.deviceCategory].sessions += device.sessions || 0;
      deviceMetrics[device.deviceCategory].users += device.users || 0;
    });
  });

  return {
    platformComparison: Object.entries(platformMetrics).map(([platform, metrics]) => ({
      platform,
      ...metrics
    })),
    deviceBreakdown: Object.entries(deviceMetrics).map(([device, metrics]) => ({
      device,
      ...metrics
    }))
  };
}

function generateFunnelCharts(campaigns) {
  // Calculate funnel metrics
  const totals = campaigns.reduce((acc, campaign) => {
    const latestMetric = campaign.metrics?.[campaign.metrics.length - 1];
    if (latestMetric) {
      acc.impressions += latestMetric.impressions || 0;
      acc.clicks += latestMetric.clicks || 0;
      acc.conversions += latestMetric.conversions || 0;
    }
    return acc;
  }, { impressions: 0, clicks: 0, conversions: 0 });

  return {
    funnel: [
      { stage: 'Impressões', value: totals.impressions, percentage: 100 },
      { 
        stage: 'Cliques', 
        value: totals.clicks, 
        percentage: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0 
      },
      { 
        stage: 'Conversões', 
        value: totals.conversions, 
        percentage: totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0 
      }
    ]
  };
}