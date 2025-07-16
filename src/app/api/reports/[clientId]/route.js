import { NextResponse } from 'next/server';
import { connectToDatabase, findClientBySlug, Report, Campaign, AnalyticsData } from '@/lib/mongodb';
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
    const type = searchParams.get('type') || 'all';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 20;
    
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

    // Build query
    const query = { clientId: clientData._id };
    if (type !== 'all') {
      query.type = type;
    }
    
    // Get reports from database
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('generatedBy', 'name email');

    // Transform reports for frontend
    const transformedReports = reports.map(report => ({
      id: report._id.toString(),
      title: report.title,
      type: report.type,
      period: report.period,
      summary: report.summary,
      platforms: report.platforms,
      charts: report.charts,
      generatedBy: report.generatedBy,
      isShared: report.isShared,
      createdAt: report.createdAt,
      downloadUrl: `/api/reports/${client}/${report._id}`,
    }));

    return NextResponse.json({
      success: true,
      data: transformedReports,
      totalCount: transformedReports.length,
      filters: { type, limit }
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
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
    const { type, period, title, customFilters } = await request.json();
    
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

    // Generate new report
    const newReport = await generateReport(clientData, type, period, title, customFilters, session.user.id);

    return NextResponse.json({
      success: true,
      data: newReport,
      message: 'Relatório gerado com sucesso'
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function generateReport(clientData, type, period, title, customFilters, userId) {
  const now = new Date();
  const startDate = new Date(now);
  
  // Calculate period dates
  if (period?.days) {
    startDate.setDate(now.getDate() - period.days);
  } else if (period?.from && period?.to) {
    startDate.setTime(new Date(period.from).getTime());
    now.setTime(new Date(period.to).getTime());
  }

  // Fetch data from MongoDB
  const [campaigns, analyticsData] = await Promise.all([
    Campaign.find({
      clientId: clientData._id,
      updatedAt: { $gte: startDate, $lte: now }
    }).sort({ updatedAt: -1 }),
    AnalyticsData.find({
      clientId: clientData._id,
      date: { $gte: startDate, $lte: now }
    }).sort({ date: 1 })
  ]);

  // Generate report summary
  const summary = generateReportSummary(campaigns, analyticsData);
  
  // Generate platform breakdown
  const platforms = generatePlatformBreakdown(campaigns);
  
  // Generate charts data
  const charts = generateReportCharts(campaigns, analyticsData);

  // Create report object
  const reportData = {
    clientId: clientData._id,
    title: title || `Relatório ${getReportTypeName(type)} - ${now.toLocaleDateString('pt-BR')}`,
    type: type,
    period: {
      from: startDate,
      to: now
    },
    summary,
    platforms,
    charts,
    generatedBy: userId,
    isShared: false
  };

  // Save report to database
  const savedReport = await Report.create(reportData);

  return {
    id: savedReport._id.toString(),
    title: savedReport.title,
    type: savedReport.type,
    period: savedReport.period,
    summary: savedReport.summary,
    platforms: savedReport.platforms,
    charts: savedReport.charts,
    createdAt: savedReport.createdAt,
    downloadUrl: `/api/reports/${clientData.slug}/${savedReport._id}`
  };
}

function generateReportSummary(campaigns, analyticsData) {
  // Calculate totals from campaigns
  const campaignTotals = campaigns.reduce((acc, campaign) => {
    const latestMetrics = campaign.metrics?.[campaign.metrics.length - 1];
    if (latestMetrics) {
      acc.totalImpressions += latestMetrics.impressions || 0;
      acc.totalClicks += latestMetrics.clicks || 0;
      acc.totalCost += latestMetrics.cost || 0;
      acc.totalConversions += latestMetrics.conversions || 0;
    }
    return acc;
  }, { totalImpressions: 0, totalClicks: 0, totalCost: 0, totalConversions: 0 });

  // Calculate totals from analytics
  const analyticsTotals = analyticsData.reduce((acc, day) => {
    acc.totalSessions += day.sessions || 0;
    acc.totalUsers += day.users || 0;
    acc.totalPageviews += day.pageviews || 0;
    return acc;
  }, { totalSessions: 0, totalUsers: 0, totalPageviews: 0 });

  // Calculate averages
  const averageCTR = campaignTotals.totalImpressions > 0 ? 
    (campaignTotals.totalClicks / campaignTotals.totalImpressions) * 100 : 0;
  const averageCPC = campaignTotals.totalClicks > 0 ? 
    campaignTotals.totalCost / campaignTotals.totalClicks : 0;
  const averageCPM = campaignTotals.totalImpressions > 0 ? 
    (campaignTotals.totalCost / campaignTotals.totalImpressions) * 1000 : 0;
  const averageConversionRate = campaignTotals.totalClicks > 0 ? 
    (campaignTotals.totalConversions / campaignTotals.totalClicks) * 100 : 0;
  const totalROAS = campaignTotals.totalCost > 0 ? 
    campaignTotals.totalConversions / campaignTotals.totalCost : 0;

  return {
    ...campaignTotals,
    ...analyticsTotals,
    averageCTR,
    averageCPC,
    averageCPM,
    averageConversionRate,
    totalROAS
  };
}

function generatePlatformBreakdown(campaigns) {
  const platformMetrics = {};
  
  campaigns.forEach(campaign => {
    const platform = campaign.platform;
    if (!platformMetrics[platform]) {
      platformMetrics[platform] = {
        platform,
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0
      };
    }
    
    const latestMetrics = campaign.metrics?.[campaign.metrics.length - 1];
    if (latestMetrics) {
      platformMetrics[platform].impressions += latestMetrics.impressions || 0;
      platformMetrics[platform].clicks += latestMetrics.clicks || 0;
      platformMetrics[platform].cost += latestMetrics.cost || 0;
      platformMetrics[platform].conversions += latestMetrics.conversions || 0;
    }
  });

  // Calculate metrics for each platform
  return Object.values(platformMetrics).map(platform => ({
    ...platform,
    ctr: platform.impressions > 0 ? (platform.clicks / platform.impressions) * 100 : 0,
    cpc: platform.clicks > 0 ? platform.cost / platform.clicks : 0,
    cpm: platform.impressions > 0 ? (platform.cost / platform.impressions) * 1000 : 0,
    conversionRate: platform.clicks > 0 ? (platform.conversions / platform.clicks) * 100 : 0,
    roas: platform.cost > 0 ? platform.conversions / platform.cost : 0
  }));
}

function generateReportCharts(campaigns, analyticsData) {
  // Daily metrics for line charts
  const dailyMetrics = [];
  const dailyAnalytics = analyticsData.map(day => ({
    date: day.date.toISOString().split('T')[0],
    sessions: day.sessions || 0,
    users: day.users || 0,
    pageviews: day.pageviews || 0,
    bounceRate: day.bounceRate || 0
  }));

  // Platform distribution for pie charts
  const platformDistribution = [];
  const platformTotals = {};
  
  campaigns.forEach(campaign => {
    const platform = campaign.platform;
    if (!platformTotals[platform]) {
      platformTotals[platform] = 0;
    }
    const latestMetrics = campaign.metrics?.[campaign.metrics.length - 1];
    if (latestMetrics) {
      platformTotals[platform] += latestMetrics.cost || 0;
    }
  });

  const totalCost = Object.values(platformTotals).reduce((sum, cost) => sum + cost, 0);
  Object.entries(platformTotals).forEach(([platform, cost]) => {
    platformDistribution.push({
      platform,
      value: cost,
      percentage: totalCost > 0 ? (cost / totalCost) * 100 : 0
    });
  });

  // Device breakdown from analytics
  const deviceBreakdown = [];
  const deviceTotals = {};
  
  analyticsData.forEach(day => {
    day.deviceData?.forEach(device => {
      if (!deviceTotals[device.deviceCategory]) {
        deviceTotals[device.deviceCategory] = 0;
      }
      deviceTotals[device.deviceCategory] += device.sessions || 0;
    });
  });

  const totalSessions = Object.values(deviceTotals).reduce((sum, sessions) => sum + sessions, 0);
  Object.entries(deviceTotals).forEach(([device, sessions]) => {
    deviceBreakdown.push({
      device,
      sessions,
      percentage: totalSessions > 0 ? (sessions / totalSessions) * 100 : 0
    });
  });

  return {
    dailyMetrics,
    dailyAnalytics,
    platformDistribution,
    deviceBreakdown
  };
}

function getReportTypeName(type) {
  const types = {
    weekly: 'Semanal',
    monthly: 'Mensal',
    campaign: 'de Campanha',
    custom: 'Personalizado'
  };
  return types[type] || 'Personalizado';
}

