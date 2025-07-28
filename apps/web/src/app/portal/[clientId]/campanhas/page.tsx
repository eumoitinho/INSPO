"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Target,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import MasterLayout from "../../../../masterLayout/MasterLayout"

interface Campaign {
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
  startDate: string
  endDate?: string
  targetAudience: string
  objective: string
}

interface CampaignsPageProps {
  params: { client: string }
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Ativa'
    case 'paused':
      return 'Pausada'
    case 'completed':
      return 'Concluída'
    case 'draft':
      return 'Rascunho'
    default:
      return status
  }
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'google':
      return '🔍'
    case 'facebook':
      return '📘'
    case 'instagram':
      return '📷'
    default:
      return '📊'
  }
}

export default function CampaignsPage({ params }: CampaignsPageProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    fetchCampaigns()
  }, [params.client])

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Buscar campanhas do cliente
      const response = await fetch(`/api/campaigns/${params.client}`)
      
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.data || [])
      } else {
        // Se não há dados reais, usar dados simulados
        const mockCampaigns: Campaign[] = [
          {
            _id: '1',
            name: 'Campanha de Conversão Q4',
            platform: 'google',
            status: 'active',
            budget: 5000,
            spent: 3200,
            impressions: 45000,
            clicks: 1200,
            conversions: 45,
            ctr: 2.67,
            cpc: 2.67,
            roas: 3.2,
            startDate: '2024-10-01',
            targetAudience: 'Interesse em produtos',
            objective: 'Conversões'
          },
          {
            _id: '2',
            name: 'Awareness Facebook',
            platform: 'facebook',
            status: 'active',
            budget: 3000,
            spent: 1800,
            impressions: 25000,
            clicks: 800,
            conversions: 25,
            ctr: 3.2,
            cpc: 2.25,
            roas: 2.8,
            startDate: '2024-10-15',
            targetAudience: 'Demográfica 25-45',
            objective: 'Reconhecimento'
          },
          {
            _id: '3',
            name: 'Instagram Stories',
            platform: 'instagram',
            status: 'paused',
            budget: 2000,
            spent: 1200,
            impressions: 18000,
            clicks: 600,
            conversions: 18,
            ctr: 3.33,
            cpc: 2.0,
            roas: 2.5,
            startDate: '2024-09-20',
            targetAudience: 'Jovens adultos',
            objective: 'Engajamento'
          }
        ]
        setCampaigns(mockCampaigns)
      }
    } catch (err) {
      setError('Erro ao carregar campanhas')
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

  // Calcular estatísticas
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0)
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0)
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const avgRoas = campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length : 0

  const filteredCampaigns = campaigns.filter(campaign => {
    const typeMatch = selectedType === 'all' || campaign.platform === selectedType
    const statusMatch = selectedStatus === 'all' || campaign.status === selectedStatus
    return typeMatch && statusMatch
  })

  if (isLoading) {
    return (
      <MasterLayout>
        <div className="text-center py-10">Carregando campanhas...</div>
      </MasterLayout>
    )
  }

  if (error) {
    return (
      <MasterLayout>
        <div className="text-center py-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Erro ao carregar campanhas
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchCampaigns}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </MasterLayout>
    )
  }

  return (
    <MasterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Campanhas - {params.client}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gerencie suas campanhas publicitárias
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Orçamento Total" 
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
            title="Campanhas Ativas" 
            value={activeCampaigns} 
            icon={Target} 
            color="text-purple-500"
          />
          <StatCard 
            title="ROAS Médio" 
            value={`${avgRoas.toFixed(2)}x`} 
            icon={BarChart3} 
            color="text-orange-500"
          />
        </div>

        {/* Métricas de Performance */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Impressões" 
            value={formatNumber(totalImpressions)} 
            icon={Eye} 
            color="text-indigo-500"
          />
          <StatCard 
            title="Cliques" 
            value={formatNumber(totalClicks)} 
            icon={MousePointer} 
            color="text-pink-500"
          />
          <StatCard 
            title="CTR Médio" 
            value={`${((totalClicks / totalImpressions) * 100).toFixed(2)}%`} 
            icon={BarChart3} 
            color="text-teal-500"
          />
        </div>

        {/* Filtros */}
        <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plataforma
                </label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Todas as plataformas</option>
                  <option value="google">Google Ads</option>
                  <option value="facebook">Facebook Ads</option>
                  <option value="instagram">Instagram Ads</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativa</option>
                  <option value="paused">Pausada</option>
                  <option value="completed">Concluída</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Campanhas */}
        <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-2 py-2 text-left">Campanha</th>
                    <th className="px-2 py-2 text-left">Plataforma</th>
                    <th className="px-2 py-2 text-left">Status</th>
                    <th className="px-2 py-2 text-left">Orçamento</th>
                    <th className="px-2 py-2 text-left">Gasto</th>
                    <th className="px-2 py-2 text-left">ROAS</th>
                    <th className="px-2 py-2 text-left">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign._id} className="border-b hover:bg-gray-50 dark:hover:bg-[#18181b]">
                      <td className="px-2 py-2 font-medium">{campaign.name}</td>
                      <td className="px-2 py-2">
                        <span className="mr-2">{getPlatformIcon(campaign.platform)}</span>
                        {campaign.platform.charAt(0).toUpperCase() + campaign.platform.slice(1)}
                      </td>
                      <td className="px-2 py-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {getStatusLabel(campaign.status)}
                        </Badge>
                      </td>
                      <td className="px-2 py-2">{formatCurrency(campaign.budget)}</td>
                      <td className="px-2 py-2">{formatCurrency(campaign.spent)}</td>
                      <td className="px-2 py-2">{campaign.roas.toFixed(2)}x</td>
                      <td className="px-2 py-2">{campaign.ctr.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MasterLayout>
  )
} 