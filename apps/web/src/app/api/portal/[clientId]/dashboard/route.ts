import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DashboardService } from '@/services/dashboard-service';

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
    const period = searchParams.get('period') as '7d' | '30d' | '90d' || '30d';

    // Verificar se o usuário tem acesso ao cliente
    const userRole = (session.user as any).role;
    const userClientId = (session.user as any).clientId;
    
    if (userRole === 'client' && userClientId !== clientId) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Buscar dados do dashboard
    const dashboardService = new DashboardService(clientId);
    const data = await dashboardService.getDashboardData(period);

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao buscar dados'
    }, { status: 500 });
  }
}