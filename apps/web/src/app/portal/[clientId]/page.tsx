"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Target,
  Calendar,
  DollarSign,
  Settings,
  FileText,
  PieChart,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

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

interface PortalPageProps {
  params: { clientId: string }
}

const QuickActionCard = ({ title, description, icon: Icon, href, color }: {
  title: string
  description: string
  icon: any
  href: string
  color?: string
}) => (
  <Link href={href}>
    <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23] hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className={cn("h-6 w-6", color || "text-gray-500 dark:text-gray-400")} />
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  </Link>
)

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

export default function PortalPage({ params }: PortalPageProps) {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClientData()
  }, [params.clientId])

  const fetchClientData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/clients/${params.clientId}`)
      const data = await response.json()
      
      if (response.ok) {
        setClientData(data.data)
      } else {
        throw new Error(data.message || 'Erro ao carregar dados do cliente')
      }
    } catch (err) {
      setError('Erro ao carregar dados do cliente')
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
    return <div className="text-center py-10">Carregando portal...</div>
  }

  if (error || !clientData) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Erro ao carregar portal
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button 
          onClick={fetchClientData}
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

  const lastSync = clientData.googleAds.lastSync || clientData.facebookAds.lastSync || clientData.googleAnalytics.lastSync

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo, {clientData.name}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Portal de gerenciamento e análise de dados
          </p>
        </div>
        <Badge className={getStatusColor(clientData.status)}>
          {getStatusLabel(clientData.status)}
        </Badge>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Orçamento Mensal" 
          value={formatCurrency(clientData.monthlyBudget)} 
          icon={DollarSign} 
          color="text-green-500"
        />
        <StatCard 
          title="Plataformas Conectadas" 
          value={`${connectedPlatforms}/3`} 
          icon={BarChart3} 
          color="text-blue-500"
          subtitle={`${Math.round((connectedPlatforms / 3) * 100)}% conectado`}
        />
        <StatCard 
          title="Status" 
          value={getStatusLabel(clientData.status)} 
          icon={CheckCircle} 
          color={clientData.status === 'active' ? 'text-green-500' : 'text-amber-500'}
        />
        <StatCard 
          title="Última Sincronização" 
          value={lastSync ? new Date(lastSync).toLocaleDateString('pt-BR') : 'Nunca'} 
          icon={Calendar} 
          color="text-purple-500"
        />
      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            title="Dashboard"
            description="Visualize métricas e performance"
            icon={BarChart3}
            href={`/portal/${params.clientId}/dashboard`}
            color="text-blue-500"
          />
          <QuickActionCard
            title="Analytics"
            description="Análise detalhada de dados"
            icon={TrendingUp}
            href={`/portal/${params.clientId}/analytics`}
            color="text-green-500"
          />
          <QuickActionCard
            title="Campanhas"
            description="Gerencie suas campanhas"
            icon={Target}
            href={`/portal/${params.clientId}/campanhas`}
            color="text-purple-500"
          />
          <QuickActionCard
            title="Gráficos"
            description="Visualizações interativas"
            icon={PieChart}
            href={`/portal/${params.clientId}/charts`}
            color="text-orange-500"
          />
        </div>
      </div>

      {/* Ferramentas */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Ferramentas
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Relatórios"
            description="Gere e visualize relatórios"
            icon={FileText}
            href={`/portal/${params.clientId}/relatorios`}
            color="text-indigo-500"
          />
          <QuickActionCard
            title="Configurações"
            description="Configure seu portal"
            icon={Settings}
            href={`/portal/${params.clientId}/configuracoes`}
            color="text-gray-500"
          />
        </div>
      </div>

      {/* Status das Conexões */}
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Status das Conexões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              {clientData.googleAds.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">Google Ads</p>
                <p className="text-sm text-gray-500">
                  {clientData.googleAds.connected ? 'Conectado' : 'Desconectado'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              {clientData.facebookAds.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">Facebook Ads</p>
                <p className="text-sm text-gray-500">
                  {clientData.facebookAds.connected ? 'Conectado' : 'Desconectado'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              {clientData.googleAnalytics.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">Google Analytics</p>
                <p className="text-sm text-gray-500">
                  {clientData.googleAnalytics.connected ? 'Conectado' : 'Desconectado'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 