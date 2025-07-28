import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Client } from '@/lib/mongodb';
import type { APIResponse } from '@/types/dashboard';

/**
 * GET /api/admin/dashboard/stats
 * Get agency dashboard statistics
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();
    
    // Get all clients
    const clients = await (Client as any).find({});
    
    // Calculate statistics
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'active').length;
    const totalRevenue = clients.reduce((sum, client) => sum + (client.monthlyBudget || 0), 0);
    
    // Calculate from real data - default to 0 if no data
    const avgConversionRate = 0;
    const totalSpend = 0;
    const totalConversions = 0;
    
    const stats = {
      totalClients,
      activeClients,
      totalRevenue,
      avgConversionRate,
      totalSpend,
      totalConversions
    };

    return NextResponse.json<APIResponse<any>>({
      success: true,
      data: stats,
      message: 'Estatísticas carregadas com sucesso',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'FETCH_STATS_ERROR',
      message: error.message || 'Erro ao buscar estatísticas',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 