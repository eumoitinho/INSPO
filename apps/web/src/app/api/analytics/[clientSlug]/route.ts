import { NextRequest, NextResponse } from 'next/server'
import { GoogleAnalyticsService } from '../../../../services/google-analytics-service'

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

    const analyticsService = new GoogleAnalyticsService()
    const analyticsData = await analyticsService.getAnalyticsData(clientSlug)

    return NextResponse.json({ data: analyticsData }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao buscar dados de analytics:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}