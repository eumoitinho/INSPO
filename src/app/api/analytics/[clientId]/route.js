import { NextResponse } from 'next/server';
import { connectToDatabase, findClientBySlug, AnalyticsData } from '@/lib/mongodb';
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
    
    // Fetch analytics data from MongoDB
    const analyticsData = await AnalyticsData.find({
      clientId: clientData._id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    // If no data found, try to fetch from Google Analytics API
    if (analyticsData.length === 0 && clientData.googleAnalytics?.connected) {
      try {
        const freshData = await fetchGoogleAnalyticsData(clientData, period, startDate);
        return NextResponse.json({
          success: true,
          data: freshData,
          lastUpdated: new Date().toISOString(),
          source: 'google_analytics_api'
        });
      } catch (error) {
        console.error('Error fetching Google Analytics data:', error);
        // Return empty data structure instead of error
        return NextResponse.json({
          success: true,
          data: getEmptyAnalyticsData(),
          lastUpdated: new Date().toISOString(),
          source: 'empty',
          message: 'Dados do Google Analytics não disponíveis'
        });
      }
    }

    // Process and aggregate MongoDB data
    const processedData = processAnalyticsData(analyticsData);
    
    return NextResponse.json({
      success: true,
      data: processedData,
      lastUpdated: new Date().toISOString(),
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function fetchGoogleAnalyticsData(clientData, period, startDate) {
  // Try to integrate with Google Analytics 4 Data API
  // For now, return structured empty data
  
  if (!clientData.googleAnalytics?.encryptedCredentials) {
    throw new Error('Google Analytics credentials not configured');
  }

  // TODO: Implement real Google Analytics 4 Data API integration
  // This would involve:
  // 1. Decrypt credentials from clientData.googleAnalytics.encryptedCredentials
  // 2. Initialize Google Analytics Data API client
  // 3. Fetch data for the specified period
  // 4. Save data to MongoDB for caching
  
  // For now, return empty structure
  return getEmptyAnalyticsData();
}

function processAnalyticsData(analyticsData) {
  if (!analyticsData || analyticsData.length === 0) {
    return getEmptyAnalyticsData();
  }

  // Calculate totals and averages
  const totals = analyticsData.reduce((acc, day) => ({
    sessions: acc.sessions + day.sessions,
    users: acc.users + day.users,
    newUsers: acc.newUsers + day.newUsers,
    pageviews: acc.pageviews + day.pageviews,
    totalBounceRate: acc.totalBounceRate + day.bounceRate,
    totalSessionDuration: acc.totalSessionDuration + day.sessionDuration,
  }), {
    sessions: 0,
    users: 0,
    newUsers: 0,
    pageviews: 0,
    totalBounceRate: 0,
    totalSessionDuration: 0,
  });

  const averages = {
    bounceRate: totals.totalBounceRate / analyticsData.length,
    sessionDuration: totals.totalSessionDuration / analyticsData.length,
  };

  // Process daily data for charts
  const dailyData = analyticsData.map(day => ({
    date: day.date.toISOString().split('T')[0],
    sessions: day.sessions,
    users: day.users,
    newUsers: day.newUsers,
    pageviews: day.pageviews,
    bounceRate: day.bounceRate,
    sessionDuration: day.sessionDuration,
  }));

  // Aggregate traffic sources
  const trafficSources = aggregateTrafficSources(analyticsData);
  
  // Aggregate device data
  const deviceData = aggregateDeviceData(analyticsData);
  
  // Aggregate top pages
  const topPages = aggregateTopPages(analyticsData);

  return {
    summary: {
      ...totals,
      averageBounceRate: averages.bounceRate,
      averageSessionDuration: averages.sessionDuration,
    },
    dailyData,
    trafficSources,
    deviceData,
    topPages,
  };
}

function aggregateTrafficSources(analyticsData) {
  const sourcesMap = new Map();
  
  analyticsData.forEach(day => {
    day.trafficSources?.forEach(source => {
      const key = `${source.source}|${source.medium}`;
      if (sourcesMap.has(key)) {
        const existing = sourcesMap.get(key);
        existing.sessions += source.sessions;
        existing.users += source.users;
        existing.bounceRate = (existing.bounceRate + source.bounceRate) / 2;
      } else {
        sourcesMap.set(key, { ...source });
      }
    });
  });

  return Array.from(sourcesMap.values())
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10);
}

function aggregateDeviceData(analyticsData) {
  const devicesMap = new Map();
  
  analyticsData.forEach(day => {
    day.deviceData?.forEach(device => {
      if (devicesMap.has(device.deviceCategory)) {
        const existing = devicesMap.get(device.deviceCategory);
        existing.sessions += device.sessions;
        existing.users += device.users;
        existing.bounceRate = (existing.bounceRate + device.bounceRate) / 2;
      } else {
        devicesMap.set(device.deviceCategory, { ...device });
      }
    });
  });

  return Array.from(devicesMap.values())
    .sort((a, b) => b.sessions - a.sessions);
}

function aggregateTopPages(analyticsData) {
  const pagesMap = new Map();
  
  analyticsData.forEach(day => {
    day.topPages?.forEach(page => {
      if (pagesMap.has(page.page)) {
        const existing = pagesMap.get(page.page);
        existing.pageviews += page.pageviews;
        existing.uniquePageviews += page.uniquePageviews;
        existing.bounceRate = (existing.bounceRate + page.bounceRate) / 2;
        existing.avgTimeOnPage = (existing.avgTimeOnPage + page.avgTimeOnPage) / 2;
      } else {
        pagesMap.set(page.page, { ...page });
      }
    });
  });

  return Array.from(pagesMap.values())
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, 10);
}

function getEmptyAnalyticsData() {
  return {
    summary: {
      sessions: 0,
      users: 0,
      newUsers: 0,
      pageviews: 0,
      averageBounceRate: 0,
      averageSessionDuration: 0,
    },
    dailyData: [],
    trafficSources: [],
    deviceData: [],
    topPages: [],
  };
}