"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Download as DownloadIcon,
  Eye,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import MasterLayout from "../../../../masterLayout/MasterLayout"

interface Report {
  _id: string
  name: string
  type: 'performance' | 'analytics' | 'campaigns' | 'custom'
  status: 'completed' | 'processing' | 'failed'
  createdAt: string
  updatedAt: string
  size?: string
  format: 'pdf' | 'csv' | 'xlsx'
  dateRange: {
    start: string
    end: string
  }
  metrics: string[]
}

interface RelatoriosPageProps {
  params: { client: string }
}

const ReportCard = ({ report, onDownload, onView }: { 
  report: Report
  onDownload: (report: Report) => void
  onView: (report: Report) => void
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído'
      case 'processing':
        return 'Processando'
      case 'failed':
        return 'Falhou'
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="h-4 w-4" />
      case 'analytics':
        return <BarChart3 className="h-4 w-4" />
      case 'campaigns':
        return <BarChart3 className="h-4 w-4" />
      case 'custom':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon(report.type)}
            <CardTitle className="text-gray-900 dark:text-white">{report.name}</CardTitle>
          </div>
          <Badge className={getStatusColor(report.status)}>
            {getStatusLabel(report.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Tipo:</span>
            <span className="font-medium capitalize">{report.type}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Formato:</span>
            <span className="font-medium uppercase">{report.format}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Período:</span>
            <span className="font-medium">
              {new Date(report.dateRange.start).toLocaleDateString('pt-BR')} - {new Date(report.dateRange.end).toLocaleDateString('pt-BR')}
            </span>
          </div>
          
          {report.size && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Tamanho:</span>
              <span className="font-medium">{report.size}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Criado em:</span>
            <span className="font-medium">
              {new Date(report.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onView(report)}
              disabled={report.status !== 'completed'}
            >
              <Eye className="mr-1 h-3 w-3" />
              Visualizar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDownload(report)}
              disabled={report.status !== 'completed'}
            >
              <DownloadIcon className="mr-1 h-3 w-3" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RelatoriosPage({ params }: RelatoriosPageProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    fetchReports()
  }, [params.client])

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/reports/${params.client}`)
      
      if (response.ok) {
        const data = await response.json()
        setReports(data.data || [])
      } else {
        // Dados simulados
        const mockReports: Report[] = [
          {
            _id: '1',
            name: 'Relatório de Performance - Outubro 2024',
            type: 'performance',
            status: 'completed',
            createdAt: '2024-10-01T00:00:00Z',
            updatedAt: '2024-10-31T23:59:59Z',
            size: '2.5 MB',
            format: 'pdf',
            dateRange: {
              start: '2024-10-01',
              end: '2024-10-31'
            },
            metrics: ['ROAS', 'CTR', 'CPC', 'Conversões']
          },
          {
            _id: '2',
            name: 'Analytics - Tráfego e Conversões',
            type: 'analytics',
            status: 'completed',
            createdAt: '2024-10-15T00:00:00Z',
            updatedAt: '2024-10-15T12:00:00Z',
            size: '1.8 MB',
            format: 'xlsx',
            dateRange: {
              start: '2024-09-01',
              end: '2024-10-15'
            },
            metrics: ['Sessões', 'Usuários', 'Pageviews', 'Taxa de Rejeição']
          },
          {
            _id: '3',
            name: 'Campanhas Ativas - Q4 2024',
            type: 'campaigns',
            status: 'processing',
            createdAt: '2024-11-01T00:00:00Z',
            updatedAt: '2024-11-01T10:30:00Z',
            format: 'csv',
            dateRange: {
              start: '2024-10-01',
              end: '2024-12-31'
            },
            metrics: ['Gasto', 'Impressões', 'Cliques', 'ROAS']
          },
          {
            _id: '4',
            name: 'Relatório Customizado - Métricas Avançadas',
            type: 'custom',
            status: 'completed',
            createdAt: '2024-09-20T00:00:00Z',
            updatedAt: '2024-09-20T15:45:00Z',
            size: '3.2 MB',
            format: 'pdf',
            dateRange: {
              start: '2024-08-01',
              end: '2024-09-30'
            },
            metrics: ['LTV', 'CAC', 'Churn Rate', 'Engagement']
          }
        ]
        setReports(mockReports)
      }
    } catch (err) {
      setError('Erro ao carregar relatórios')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (report: Report) => {
    // Simular download
    console.log('Downloading report:', report.name)
    // Aqui você implementaria a lógica real de download
  }

  const handleView = (report: Report) => {
    // Simular visualização
    console.log('Viewing report:', report.name)
    // Aqui você implementaria a lógica real de visualização
  }

  const filteredReports = reports.filter(report => {
    const typeMatch = selectedType === 'all' || report.type === selectedType
    const statusMatch = selectedStatus === 'all' || report.status === selectedStatus
    return typeMatch && statusMatch
  })

  const getReportStats = () => {
    const total = reports.length
    const completed = reports.filter(r => r.status === 'completed').length
    const processing = reports.filter(r => r.status === 'processing').length
    const failed = reports.filter(r => r.status === 'failed').length
    
    return { total, completed, processing, failed }
  }

  const stats = getReportStats()

  if (isLoading) {
    return (
      <MasterLayout>
        <div className="text-center py-10">Carregando relatórios...</div>
      </MasterLayout>
    )
  }

  if (error) {
    return (
      <MasterLayout>
        <div className="text-center py-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Erro ao carregar relatórios
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchReports}
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
              Relatórios - {params.client}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gerencie e visualize seus relatórios
            </p>
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Novo Relatório
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Concluídos</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Processando</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Falharam</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <CardTitle className="text-gray-900 dark:text-white">Filtros</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="performance">Performance</option>
                  <option value="analytics">Analytics</option>
                  <option value="campaigns">Campanhas</option>
                  <option value="custom">Customizado</option>
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
                  <option value="completed">Concluído</option>
                  <option value="processing">Processando</option>
                  <option value="failed">Falhou</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Relatórios */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onDownload={handleDownload}
              onView={handleView}
            />
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-10">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Não há relatórios que correspondam aos filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </MasterLayout>
  )
} 