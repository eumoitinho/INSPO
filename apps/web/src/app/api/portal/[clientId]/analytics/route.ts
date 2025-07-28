import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleAnalyticsService } from '@/services/google-analytics-service';
import { connectToDatabase, Client } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { clientId } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Verificar se o usuário tem acesso ao cliente
    const userRole = (session.user as any).role;
    const userClientId = (session.user as any).clientId;
    
    if (userRole === 'client' && userClientId !== clientId) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Buscar dados do cliente
    await connectToDatabase();
    const client = await (Client as any).findById(clientId);
    
    if (!client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
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
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Buscar dados do Google Analytics
    const analyticsService = new GoogleAnalyticsService(clientId);
    
    if (!client.googleAnalytics?.connected || !client.googleAnalytics?.propertyId) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Google Analytics não está conectado'
      });
    }

    const [analyticsData, realtimeData] = await Promise.allSettled([
      analyticsService.getAnalyticsData(
        client.googleAnalytics.propertyId,
        startDateStr,
        endDateStr
      ),
      analyticsService.getRealtimeData(client.googleAnalytics.propertyId)
    ]);

    const data = analyticsData.status === 'fulfilled' ? analyticsData.value : null;
    const realtime = realtimeData.status === 'fulfilled' ? realtimeData.value : null;

    return NextResponse.json({
      success: true,
      data: {
        analytics: data,
        realtime,
        period
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro ao buscar dados de analytics:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao buscar dados'
    }, { status: 500 });
  }
}