"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
  LineChart,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getConnectionStatusIcon, formatLastSync } from "@/lib/connection-status"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

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

interface DashboardData {
  metrics: {
    totalSpend: number
    totalRevenue: number
    totalConversions: number
    totalImpressions: number
    totalClicks: number
    avgCtr: number
    avgCpc: number
    roas: number
    period: string
  }
  channelPerformance: Array<{
    channel: string
    spend: number
    revenue: number
    conversions: number
    impressions: number
    clicks: number
    ctr: number
    cpc: number
    roas: number
  }>
  topCampaigns: Array<{
    name: string
    platform: string
    spend: number
    conversions: number
    roas: number
  }>
  dailyMetrics: Array<{
    date: string
    spend: number
    revenue: number
    conversions: number
  }>
  devicePerformance: Array<{
    device: string
    sessions: number
    conversions: number
    conversionRate: number
  }>
}

export default function ClientPortalDashboard({ clientSlug }: { clientSlug: string }) {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedSources, setSelectedSources] = useState({
    googleAds: true,
    facebookAds: true,
    googleAnalytics: true
  })

  useEffect(() => {
    fetchClientData()
  }, [clientSlug])

  useEffect(() => {
    if (clientData) {
      fetchDashboardData()
    }
  }, [clientData, period, selectedSources])

  const fetchClientData = async () => {
    try {
      const response = await fetch(`/api/clients/${clientSlug}`)
      const data = await response.json()
      if (data.success && data.data) {
        setClientData(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error)
      toast.error('Erro ao carregar informações do cliente')
    }
  }

  const fetchDashboardData = async () => {
    if (!clientData) return
    
    setLoading(true)
    try {
      const sources = Object.entries(selectedSources)
        .filter(([_, enabled]) => enabled)
        .map(([source, _]) => source)
        .join(',')
      
      const response = await fetch(`/api/portal/${clientData._id}/dashboard?period=${period}&sources=${sources}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setDashboardData(data.data)
      } else {
        throw new Error(data.error || 'Erro ao buscar dados')
      }
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
    toast.success('Dados atualizados')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  if (!clientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{clientData.name}</h1>
          <p className="text-muted-foreground">Dashboard de Performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Seletor de Fontes de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Fontes de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="googleAds"
                checked={selectedSources.googleAds}
                onCheckedChange={(checked) => 
                  setSelectedSources(prev => ({ ...prev, googleAds: !!checked }))
                }
                disabled={!clientData.googleAds.connected}
              />
              <label htmlFor="googleAds" className="text-sm font-medium">
                Google Ads
                {!clientData.googleAds.connected && (
                  <Badge variant="secondary" className="ml-2">Desconectado</Badge>
                )}
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="facebookAds"
                checked={selectedSources.facebookAds}
                onCheckedChange={(checked) => 
                  setSelectedSources(prev => ({ ...prev, facebookAds: !!checked }))
                }
                disabled={!clientData.facebookAds.connected}
              />
              <label htmlFor="facebookAds" className="text-sm font-medium">
                Facebook Ads
                {!clientData.facebookAds.connected && (
                  <Badge variant="secondary" className="ml-2">Desconectado</Badge>
                )}
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="googleAnalytics"
                checked={selectedSources.googleAnalytics}
                onCheckedChange={(checked) => 
                  setSelectedSources(prev => ({ ...prev, googleAnalytics: !!checked }))
                }
                disabled={!clientData.googleAnalytics.connected}
              />
              <label htmlFor="googleAnalytics" className="text-sm font-medium">
                Google Analytics
                {!clientData.googleAnalytics.connected && (
                  <Badge variant="secondary" className="ml-2">Desconectado</Badge>
                )}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status das Conexões */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Google Ads</CardTitle>
            {getConnectionStatusIcon(clientData.googleAds.connected)}
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {clientData.googleAds.connected 
                ? formatLastSync(clientData.googleAds.lastSync)
                : 'Não conectado'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facebook Ads</CardTitle>
            {getConnectionStatusIcon(clientData.facebookAds.connected)}
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {clientData.facebookAds.connected 
                ? formatLastSync(clientData.facebookAds.lastSync)
                : 'Não conectado'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Google Analytics</CardTitle>
            {getConnectionStatusIcon(clientData.googleAnalytics.connected)}
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {clientData.googleAnalytics.connected 
                ? formatLastSync(clientData.googleAnalytics.lastSync)
                : 'Não conectado'}
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : dashboardData ? (
        <>
          {/* Métricas Principais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.metrics.totalSpend)}</div>
                <p className="text-xs text-muted-foreground">
                  Orçamento: {formatCurrency(clientData.monthlyBudget)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData.metrics.totalConversions)}</div>
                <p className="text-xs text-muted-foreground">
                  ROAS: {dashboardData.metrics.roas.toFixed(2)}x
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cliques</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData.metrics.totalClicks)}</div>
                <p className="text-xs text-muted-foreground">
                  CTR: {formatPercentage(dashboardData.metrics.avgCtr)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impressões</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData.metrics.totalImpressions)}</div>
                <p className="text-xs text-muted-foreground">
                  CPC: {formatCurrency(dashboardData.metrics.avgCpc)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Performance Diária */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Diária</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={dashboardData.dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="spend" stroke="#8884d8" name="Investimento" />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Receita" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Performance por Canal */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.channelPerformance.map((channel, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{channel.channel}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(channel.spend)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Conv:</span> {channel.conversions}
                        </div>
                        <div>
                          <span className="text-muted-foreground">CTR:</span> {formatPercentage(channel.ctr)}
                        </div>
                        <div>
                          <span className="text-muted-foreground">ROAS:</span> {channel.roas.toFixed(2)}x
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Campanhas */}
            <Card>
              <CardHeader>
                <CardTitle>Top Campanhas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topCampaigns.map((campaign, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">{campaign.platform}</p>
                        </div>
                        <Badge variant={campaign.roas > 2 ? "default" : "secondary"}>
                          {campaign.roas.toFixed(2)}x ROAS
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance por Dispositivo */}
          {dashboardData.devicePerformance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance por Dispositivo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={dashboardData.devicePerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, sessions }) => `${device}: ${formatNumber(sessions)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="sessions"
                    >
                      {dashboardData.devicePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatNumber(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}