"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Activity,
  Calendar,
  Settings,
  LogOut
} from "lucide-react"
import { NinetwoLogoWithText } from "@/components/ui/logo"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DashboardData {
  client: {
    name: string
    slug: string
    monthlyBudget: number
    portalSettings: {
      primaryColor: string
      secondaryColor: string
      allowedSections: string[]
    }
  }
  metrics: {
    totalSpend: number
    totalConversions: number
    averageCPC: number
    roas: number
    conversionRate: number
  }
  campaigns: any[]
  chartData: any[]
}

export default function ClientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    if (session.user?.role !== "client") {
      router.push("/login")
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      // Get client slug from session
      const clientSlug = session?.user?.email?.split('@')[0] || 'default'
      
      const response = await fetch(`/api/dashboard/${clientSlug}`)
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const { signOut } = await import("next-auth/react")
    await signOut({ callbackUrl: "/login" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  const mockData = {
    client: {
      name: session?.user?.name || "Cliente",
      slug: session?.user?.email?.split('@')[0] || "cliente",
      monthlyBudget: 15000,
      portalSettings: {
        primaryColor: "#3B82F6",
        secondaryColor: "#8B5CF6",
        allowedSections: ["dashboard", "campanhas", "analytics", "relatorios"]
      }
    },
    metrics: {
      totalSpend: 12450,
      totalConversions: 389,
      averageCPC: 3.20,
      roas: 4.2,
      conversionRate: 3.1
    },
    campaigns: [
      { name: "Campanha Verão", status: "Ativa", budget: 5000, spent: 3200, conversions: 89 },
      { name: "Black Friday", status: "Pausada", budget: 8000, spent: 4800, conversions: 156 },
      { name: "Natal 2024", status: "Ativa", budget: 3000, spent: 2100, conversions: 67 }
    ],
    chartData: [
      { day: "Seg", gasto: 1200, conversoes: 45, receita: 5040 },
      { day: "Ter", gasto: 1800, conversoes: 67, receita: 7560 },
      { day: "Qua", gasto: 1500, conversoes: 52, receita: 6300 },
      { day: "Qui", gasto: 2100, conversoes: 78, receita: 8820 },
      { day: "Sex", gasto: 1900, conversoes: 69, receita: 8190 },
      { day: "Sáb", gasto: 2200, conversoes: 82, receita: 9240 },
      { day: "Dom", gasto: 1750, conversoes: 63, receita: 7350 }
    ]
  }

  const data = dashboardData || mockData

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <NinetwoLogoWithText width={32} height={32} />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-foreground font-serif">
                  {data.client.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Dashboard de Performance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Conta Ativa
              </Badge>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {data.metrics.totalSpend.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversões</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.totalConversions}</div>
              <p className="text-xs text-muted-foreground">
                +8% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPC Médio</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {data.metrics.averageCPC.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                -5% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.roas}x</div>
              <p className="text-xs text-muted-foreground">
                +15% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +2% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Semanal</CardTitle>
                  <CardDescription>
                    Gasto vs Conversões dos últimos 7 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="gasto" stroke="#3b82f6" name="Gasto (R$)" />
                        <Line type="monotone" dataKey="conversoes" stroke="#10b981" name="Conversões" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Campanhas Ativas</CardTitle>
                  <CardDescription>
                    Status das suas campanhas principais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.campaigns.map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            R$ {campaign.spent.toLocaleString()} / R$ {campaign.budget.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={campaign.status === "Ativa" ? "default" : "secondary"}>
                            {campaign.status}
                          </Badge>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {campaign.conversions} conversões
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes das Campanhas</CardTitle>
                <CardDescription>
                  Visualização completa das suas campanhas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Detalhado</CardTitle>
                <CardDescription>
                  Análise aprofundada da performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}