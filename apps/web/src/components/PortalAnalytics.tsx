"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  MousePointer,
  Target,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  sessions: number
  users: number
  pageviews: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{
    page: string
    pageviews: number
    uniquePageviews: number
  }>
  deviceData: Array<{
    deviceCategory: string
    sessions: number
    users: number
  }>
  dateRange: {
    start: string
    end: string
  }
}

interface PortalAnalyticsProps {
  clientSlug: string
}

const StatCard = ({ title, value, icon: Icon, color, subtitle }: { 
  title: string
  value: string | number
  icon: any
  color?: string
  subtitle?: string
}) => (
  <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
      <Icon className={cn("h-4 w-4", color || "text-gray-500 dark:text-gray-400")} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </CardContent>
  </Card>
)

export default function PortalAnalytics({ clientSlug }: PortalAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [clientSlug])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Buscar dados de analytics do cliente
      const response = await fetch(`/api/analytics/${clientSlug}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalyticsData(data.data)
      } else {
        setError(data.error || 'Erro ao carregar dados de analytics')
      }
    } catch (err) {
      setError('Erro ao carregar dados de analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">Carregando analytics...</div>
    )
  }

  if (error || !analyticsData) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Erro ao carregar analytics
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {error || 'Não foi possível carregar os dados de analytics'}
        </p>
        <button 
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics - {clientSlug}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Dados de {new Date(analyticsData.dateRange.start).toLocaleDateString('pt-BR')} a {new Date(analyticsData.dateRange.end).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Sessões" 
          value={formatNumber(analyticsData.sessions)} 
          icon={BarChart3} 
          color="text-blue-500"
        />
        <StatCard 
          title="Usuários" 
          value={formatNumber(analyticsData.users)} 
          icon={Users} 
          color="text-green-500"
        />
        <StatCard 
          title="Pageviews" 
          value={formatNumber(analyticsData.pageviews)} 
          icon={Eye} 
          color="text-purple-500"
        />
        <StatCard 
          title="Taxa de Rejeição" 
          value={`${analyticsData.bounceRate.toFixed(1)}%`} 
          icon={MousePointer} 
          color="text-red-500"
        />
      </div>

      {/* Duração da Sessão */}
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Duração Média da Sessão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatDuration(analyticsData.avgSessionDuration)}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Tempo médio que os usuários passam no site
          </p>
        </CardContent>
      </Card>

      {/* Top Pages e Device Data */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Páginas Mais Visitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {page.page}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatNumber(page.pageviews)} views
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatNumber(page.uniquePageviews)} únicos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Data */}
        <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {device.deviceCategory}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatNumber(device.sessions)} sessões
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatNumber(device.users)} usuários
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}