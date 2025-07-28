import { NextRequest, NextResponse } from 'next/server'
import { DashboardService } from '../../../../services/dashboard-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  try {
    const resolvedParams = await params
    const { clientSlug } = resolvedParams

    if (!clientSlug) {
      return NextResponse.json(
        { error: 'Client slug é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar dados do dashboard que contém as informações de charts
    const dashboardService = new DashboardService()
    const dashboardData = await dashboardService.getDashboardData(clientSlug, {
      googleAds: true,
      facebookAds: true,
      googleAnalytics: true
    })

    // Extrair e formatar dados para charts
    const chartsData = {
      performance: {
        labels: dashboardData.dailyMetrics.map((metric: any) => 
          new Date(metric.date).toLocaleDateString('pt-BR', { 
            month: 'short', 
            day: 'numeric' 
          })
        ),
        datasets: [{
          label: 'ROAS',
          data: dashboardData.dailyMetrics.map((metric: any) => 
            metric.revenue > 0 ? (metric.revenue / metric.spend).toFixed(2) : 0
          ),
          backgroundColor: ['#3B82F6']
        }]
      },
      traffic: {
        labels: dashboardData.channelPerformance.map((channel: any) => channel.channel),
        datasets: [{
          label: 'Impressões',
          data: dashboardData.channelPerformance.map((channel: any) => channel.impressions),
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        }]
      },
      conversions: {
        labels: dashboardData.dailyMetrics.map((metric: any) => 
          new Date(metric.date).toLocaleDateString('pt-BR', { 
            month: 'short', 
            day: 'numeric' 
          })
        ),
        datasets: [{
          label: 'Conversões',
          data: dashboardData.dailyMetrics.map((metric: any) => metric.conversions),
          backgroundColor: ['#10B981']
        }]
      },
      devices: {
        labels: dashboardData.devicePerformance.map((device: any) => device.device),
        datasets: [{
          label: 'Sessões',
          data: dashboardData.devicePerformance.map((device: any) => device.sessions),
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B']
        }]
      }
    }

    return NextResponse.json({ data: chartsData }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao buscar dados de charts:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}