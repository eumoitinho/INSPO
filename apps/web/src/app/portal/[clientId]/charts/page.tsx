"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  PieChart,
  LineChart,
  Activity,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import MasterLayout from "../../../../masterLayout/MasterLayout"

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    borderWidth?: number
  }>
}

interface ChartsPageProps {
  params: Promise<{ clientId: string }>
}

const ChartCard = ({ title, children, className }: { 
  title: string
  children: React.ReactNode
  className?: string
}) => (
  <Card className={cn("bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]", className)}>
    <CardHeader>
      <CardTitle className="text-gray-900 dark:text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
)

// Componente de gráfico de barras simples
const SimpleBarChart = ({ data, height = 200 }: { data: ChartData, height?: number }) => {
  const maxValue = Math.max(...data.datasets[0].data)
  
  return (
    <div className="space-y-2" style={{ height }}>
      {data.labels.map((label, index) => {
        const value = data.datasets[0].data[index]
        const percentage = (value / maxValue) * 100
        
        return (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 dark:text-gray-400 truncate">
              {label}
            </div>
            <div className="flex-1">
              <div className="relative">
                <div 
                  className="bg-blue-500 h-6 rounded"
                  style={{ width: `${percentage}%` }}
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
  )
}

// Componente de gráfico de pizza simples
const SimplePieChart = ({ data }: { data: ChartData }) => {
  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0)
  
  return (
    <div className="space-y-2">
      {data.labels.map((label, index) => {
        const value = data.datasets[0].data[index]
        const percentage = (value / total) * 100
        const color = data.datasets[0].backgroundColor?.[index] || '#3B82F6'
        
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
  )
}

// Componente de gráfico de linha simples
const SimpleLineChart = ({ data, height = 200 }: { data: ChartData, height?: number }) => {
  const maxValue = Math.max(...data.datasets[0].data)
  const minValue = Math.min(...data.datasets[0].data)
  const range = maxValue - minValue
  
  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={data.datasets[0].data.map((value, index) => {
            const x = (index / (data.datasets[0].data.length - 1)) * 100
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
  )
}

export default async function ChartsPage({ params }: ChartsPageProps) {
  const resolvedParams = await params
  const [chartsData, setChartsData] = useState<{
    performance: ChartData
    traffic: ChartData
    conversions: ChartData
    devices: ChartData
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChartsData()
  }, [resolvedParams.clientId])

  const fetchChartsData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Buscar dados de charts do cliente
      const response = await fetch(`/api/charts/${resolvedParams.clientId}`)
      
      if (response.ok) {
        const data = await response.json()
        setChartsData(data.data)
      } else {
        // Dados simulados
        const mockData = {
          performance: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
              label: 'Performance',
              data: [65, 78, 82, 75, 90, 85],
              backgroundColor: ['#3B82F6']
            }]
          },
          traffic: {
            labels: ['Orgânico', 'Pago', 'Social', 'Direto', 'Referral'],
            datasets: [{
              label: 'Tráfego',
              data: [45, 25, 15, 10, 5],
              backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
            }]
          },
          conversions: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
              label: 'Conversões',
              data: [12, 19, 15, 25, 22, 30],
              backgroundColor: ['#10B981']
            }]
          },
          devices: {
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: [{
              label: 'Dispositivos',
              data: [60, 35, 5],
              backgroundColor: ['#3B82F6', '#10B981', '#F59E0B']
            }]
          }
        }
        setChartsData(mockData)
      }
    } catch (err) {
      setError('Erro ao carregar dados dos gráficos')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <MasterLayout>
        <div className="text-center py-10">Carregando gráficos...</div>
      </MasterLayout>
    )
  }

  if (error || !chartsData) {
    return (
      <MasterLayout>
        <div className="text-center py-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Erro ao carregar gráficos
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchChartsData}
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gráficos - {resolvedParams.clientId}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Visualize seus dados em gráficos interativos
          </p>
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance ao longo do tempo */}
          <ChartCard title="Performance ao Longo do Tempo">
            <SimpleLineChart data={chartsData.performance} />
          </ChartCard>

          {/* Distribuição de Tráfego */}
          <ChartCard title="Distribuição de Tráfego">
            <SimplePieChart data={chartsData.traffic} />
          </ChartCard>

          {/* Conversões */}
          <ChartCard title="Conversões">
            <SimpleBarChart data={chartsData.conversions} />
          </ChartCard>

          {/* Dispositivos */}
          <ChartCard title="Dispositivos">
            <SimplePieChart data={chartsData.devices} />
          </ChartCard>
        </div>

        {/* Informações dos Gráficos */}
        <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Informações dos Gráficos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <BarChart3 className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Performance</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Métricas de performance ao longo do tempo
                </p>
              </div>
              <div className="text-center">
                <PieChart className="mx-auto h-8 w-8 text-green-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Tráfego</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Distribuição das fontes de tráfego
                </p>
              </div>
              <div className="text-center">
                <Target className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Conversões</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Taxa de conversão mensal
                </p>
              </div>
              <div className="text-center">
                <Activity className="mx-auto h-8 w-8 text-orange-500 mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Dispositivos</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uso por tipo de dispositivo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MasterLayout>
  )
} 