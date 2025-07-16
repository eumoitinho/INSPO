"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Target,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  Users,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Activity,
  PieChart,
  LineChart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getConnectionStatusIcon, formatLastSync } from "@/lib/connection-status"

interface ClientData {
  _id: string
  name: string
  slug: string
  email: string
  status: 'active' | 'pending' | 'inactive'
  monthlyBudget: number
  avatar?: string
  tags?: string[]
  googleAds: {
    connected: boolean
    customerId?: string
    lastSync?: string
  }
  facebookAds: {
    connected: boolean
    adAccountId?: string
    lastSync?: string
  }
  googleAnalytics: {
    connected: boolean
    propertyId?: string
    lastSync?: string
  }
}

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
}

interface CampaignData {
  _id: string
  name: string
  platform: 'google' | 'facebook' | 'instagram'
  status: 'active' | 'paused' | 'completed' | 'draft'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  roas: number
}

interface ClientPortalDashboardProps {
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

// Componente de gráfico de barras simples
const SimpleBarChart = ({ data, height = 200, title }: { 
  data: { labels: string[], values: number[], colors?: string[] }
  height?: number
  title: string
}) => {
  const maxValue = Math.max(...data.values)
  
  return (
    <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2" style={{ height }}>
          {data.labels.map((label, index) => {
            const value = data.values[index]
            const percentage = (value / maxValue) * 100
            const color = data.colors?.[index] || '#3B82F6'
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-20 text-sm text-gray-600 dark:text-gray-400 truncate">
                  {label}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div 
                      className="h-6 rounded"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                      {value}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente de gráfico de pizza simples
const SimplePieChart = ({ data, title }: { 
  data: { labels: string[], values: number[], colors?: string[] }
  title: string
}) => {
  const total = data.values.reduce((sum, value) => sum + value, 0)
  
  return (
    <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.labels.map((label, index) => {
            const value = data.values[index]
            const percentage = (value / total) * 100
            const color = data.colors?.[index] || '#3B82F6'
            
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                </div>
                <div className="text-sm font-medium">
                  {value} ({percentage.toFixed(1)}%)
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente de gráfico de linha simples
const SimpleLineChart = ({ data, height = 200, title }: { 
  data: { labels: string[], values: number[] }
  height?: number
  title: string
}) => {
  const maxValue = Math.max(...data.values)
  const minValue = Math.min(...data.values)
  const range = maxValue - minValue
  
  return (
    <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={data.values.map((value, index) => {
                const x = (index / (data.values.length - 1)) * 100
                const y = 100 - ((value - minValue) / range) * 100
                return `${x},${y}`
              }).join(' ')}
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
            {data.labels.map((label, index) => (
              <span key={index} className="transform -rotate-45 origin-left">
                {label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClientPortalDashboard({ clientSlug }: ClientPortalDashboardProps) {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [campaignsData, setCampaignsData] = useState<CampaignData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [clientSlug])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Buscar dados do cliente
      const clientResponse = await fetch(`/api/admin/clients/${clientSlug}`)
      const clientData = await clientResponse.json()
      
      if (!clientResponse.ok) {
        throw new Error(clientData.message || 'Erro ao carregar dados do cliente')
      }
      
      setClientData(clientData.data)

      // Buscar dados de analytics
      try {
        const analyticsResponse = await fetch(`/api/analytics/${clientSlug}`)
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json()
          setAnalyticsData(analyticsData.data)
        }
      } catch (err) {
        console.log('Analytics não disponível')
      }

      // Buscar dados de campanhas
      try {
        const campaignsResponse = await fetch(`/api/campaigns/${clientSlug}`)
        if (campaignsResponse.ok) {
          const campaignsData = await campaignsResponse.json()
          setCampaignsData(campaignsData.data || [])
        }
      } catch (err) {
        console.log('Campanhas não disponível')
      }

    } catch (err) {
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'pending':
        return 'Pendente'
      case 'inactive':
        return 'Inativo'
      default:
        return status
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Carregando dashboard...</div>
  }

  if (error || !clientData) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Erro ao carregar dashboard
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  // Calcular estatísticas
  const connectedPlatforms = [
    clientData.googleAds.connected,
    clientData.facebookAds.connected,
    clientData.googleAnalytics.connected
  ].filter(Boolean).length

  const totalBudget = clientData.monthlyBudget || 0
  const totalSpent = campaignsData.reduce((sum, campaign) => sum + campaign.spent, 0)
  const totalImpressions = campaignsData.reduce((sum, campaign) => sum + campaign.impressions, 0)
  const totalClicks = campaignsData.reduce((sum, campaign) => sum + campaign.clicks, 0)
  const avgRoas = campaignsData.length > 0 ? campaignsData.reduce((sum, c) => sum + c.roas, 0) / campaignsData.length : 0

  // Dados para gráficos
  const performanceData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    values: [65, 78, 82, 75, 90, 85]
  }

  const trafficData = {
    labels: ['Orgânico', 'Pago', 'Social', 'Direto'],
    values: [45, 25, 15, 15],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  }

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    values: [60, 35, 5],
    colors: ['#3B82F6', '#10B981', '#F59E0B']
  }

  const campaignPerformanceData = {
    labels: campaignsData.slice(0, 5).map(c => c.name),
    values: campaignsData.slice(0, 5).map(c => c.roas)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard - {clientData.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Visão geral completa do seu negócio
          </p>
        </div>
        <Badge className={getStatusColor(clientData.status)}>
          {getStatusLabel(clientData.status)}
        </Badge>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Orçamento Mensal" 
          value={formatCurrency(totalBudget)} 
          icon={DollarSign} 
          color="text-green-500"
        />
        <StatCard 
          title="Gasto Total" 
          value={formatCurrency(totalSpent)} 
          icon={TrendingUp} 
          color="text-blue-500"
        />
        <StatCard 
          title="Impressões" 
          value={formatNumber(totalImpressions)} 
          icon={Eye} 
          color="text-purple-500"
        />
        <StatCard 
          title="ROAS Médio" 
          value={`${avgRoas.toFixed(2)}x`} 
          icon={Target} 
          color="text-orange-500"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SimpleLineChart 
          data={performanceData} 
          title="Performance ao Longo do Tempo"
        />
        <SimplePieChart 
          data={trafficData} 
          title="Distribuição de Tráfego"
        />
      </div>

      {/* Métricas de Analytics */}
      {analyticsData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Sessões" 
            value={formatNumber(analyticsData.sessions)} 
            icon={Activity} 
            color="text-indigo-500"
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
            color="text-blue-500"
          />
          <StatCard 
            title="Taxa de Rejeição" 
            value={`${analyticsData.bounceRate.toFixed(1)}%`} 
            icon={MousePointer} 
            color="text-red-500"
          />
        </div>
      )}

      {/* Gráficos Secundários */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SimplePieChart 
          data={deviceData} 
          title="Dispositivos"
        />
        {campaignsData.length > 0 && (
          <SimpleBarChart 
            data={campaignPerformanceData} 
            title="Performance das Campanhas"
          />
        )}
      </div>

      {/* Status das Conexões */}
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Status das Conexões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              {getConnectionStatusIcon(clientData.googleAds.connected, { size: 'text-lg' })}
              <div>
                <p className="font-medium">Google Ads</p>
                <p className="text-sm text-gray-500">
                  {clientData.googleAds.connected ? 'Conectado' : 'Desconectado'}
                </p>
                {clientData.googleAds.lastSync && (
                  <p className="text-xs text-gray-400">
                    Última sync: {formatLastSync(clientData.googleAds.lastSync)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              {getConnectionStatusIcon(clientData.facebookAds.connected, { size: 'text-lg' })}
              <div>
                <p className="font-medium">Facebook Ads</p>
                <p className="text-sm text-gray-500">
                  {clientData.facebookAds.connected ? 'Conectado' : 'Desconectado'}
                </p>
                {clientData.facebookAds.lastSync && (
                  <p className="text-xs text-gray-400">
                    Última sync: {formatLastSync(clientData.facebookAds.lastSync)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              {getConnectionStatusIcon(clientData.googleAnalytics.connected, { size: 'text-lg' })}
              <div>
                <p className="font-medium">Google Analytics</p>
                <p className="text-sm text-gray-500">
                  {clientData.googleAnalytics.connected ? 'Conectado' : 'Desconectado'}
                </p>
                {clientData.googleAnalytics.lastSync && (
                  <p className="text-xs text-gray-400">
                    Última sync: {formatLastSync(clientData.googleAnalytics.lastSync)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campanhas Ativas */}
      {campaignsData.length > 0 && (
        <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Campanhas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-2 py-2 text-left">Campanha</th>
                    <th className="px-2 py-2 text-left">Plataforma</th>
                    <th className="px-2 py-2 text-left">Status</th>
                    <th className="px-2 py-2 text-left">Gasto</th>
                    <th className="px-2 py-2 text-left">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignsData.slice(0, 5).map((campaign) => (
                    <tr key={campaign._id} className="border-b hover:bg-gray-50 dark:hover:bg-[#18181b]">
                      <td className="px-2 py-2 font-medium">{campaign.name}</td>
                      <td className="px-2 py-2 capitalize">{campaign.platform}</td>
                      <td className="px-2 py-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {getStatusLabel(campaign.status)}
                        </Badge>
                      </td>
                      <td className="px-2 py-2">{formatCurrency(campaign.spent)}</td>
                      <td className="px-2 py-2">{campaign.roas.toFixed(2)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 