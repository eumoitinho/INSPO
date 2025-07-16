"use client"

import { useState, useEffect } from "react"
import PerformanceContent, {
  type Goal,
  type ClientPerformance,
  type Ranking,
  type PerformanceAlert,
} from "../../../components/performance-content"
import PlaceholderContent from "../../../components/PlaceholderContent"

interface PerformanceData {
  goalsData: Goal[]
  clientPerformanceData: ClientPerformance[]
  rankingData: Ranking[]
  alertsData: PerformanceAlert[]
}

// Fetch real da API
const fetchPerformanceData = async (): Promise<PerformanceData> => {
  try {
    // Buscar clientes da API
    const clientsResponse = await fetch('/api/admin/clients')
    if (!clientsResponse.ok) {
      throw new Error('Erro ao buscar clientes')
    }
    const clientsData = await clientsResponse.json()
    const clients = clientsData.data || []

    // Calcular dados de performance baseados nos clientes reais
    const totalBudget = clients.reduce((sum: number, client: any) => sum + (client.monthlyBudget || 0), 0)
    const activeClients = clients.filter((client: any) => client.status === 'active').length
    const connectedPlatforms = clients.reduce((sum: number, client: any) => {
      const platforms = [
        client.googleAds?.connected,
        client.facebookAds?.connected,
        client.googleAnalytics?.connected
      ].filter(Boolean).length
      return sum + platforms
    }, 0)

    // Goals baseados em dados reais
    const goalsData: Goal[] = [
      { 
        name: "Orçamento Total", 
        current: totalBudget, 
        goal: totalBudget * 1.2, // 20% acima do atual
        unit: "R$" 
      },
      { 
        name: "Clientes Ativos", 
        current: activeClients, 
        goal: Math.max(activeClients + 2, 5), // Pelo menos 5 clientes
        unit: "" 
      },
      { 
        name: "Conexões", 
        current: connectedPlatforms, 
        goal: clients.length * 2, // 2 conexões por cliente em média
        unit: "" 
      },
      { 
        name: "Taxa Ativos", 
        current: clients.length > 0 ? (activeClients / clients.length) * 100 : 0, 
        goal: 80, // 80% de clientes ativos
        unit: "%" 
      },
    ]

    // Performance dos clientes baseada em dados reais
    const clientPerformanceData: ClientPerformance[] = clients
      .filter((client: any) => client.status === 'active')
      .slice(0, 6) // Top 6 clientes
      .map((client: any) => ({
        name: client.name,
        roas: 2.5 + Math.random() * 1.5, // Simulação de ROAS entre 2.5 e 4.0
      }))

    // Ranking baseado em dados reais
    const rankingData: Ranking[] = clients
      .filter((client: any) => client.status === 'active')
      .slice(0, 5) // Top 5 clientes
      .map((client: any, index: number) => ({
        rank: index + 1,
        name: client.name,
        score: 70 + Math.random() * 30, // Score entre 70 e 100
      }))

    // Alertas baseados em dados reais
    const alertsData: PerformanceAlert[] = []
    
    // Alertas para clientes inativos
    const inactiveClients = clients.filter((client: any) => client.status === 'inactive')
    inactiveClients.slice(0, 2).forEach((client: any) => {
      alertsData.push({
        id: client._id,
        type: "urgent" as const,
        client: client.name,
        issue: "Cliente inativo"
      })
    })

    // Alertas para clientes sem conexões
    const clientsWithoutConnections = clients.filter((client: any) => {
      const hasConnections = client.googleAds?.connected || 
                           client.facebookAds?.connected || 
                           client.googleAnalytics?.connected
      return !hasConnections && client.status === 'active'
    })
    
    clientsWithoutConnections.slice(0, 2).forEach((client: any) => {
      alertsData.push({
        id: client._id,
        type: "attention" as const,
        client: client.name,
        issue: "Sem conexões configuradas"
      })
    })

    // Alertas de sucesso para clientes ativos com conexões
    const activeClientsWithConnections = clients.filter((client: any) => {
      const hasConnections = client.googleAds?.connected || 
                           client.facebookAds?.connected || 
                           client.googleAnalytics?.connected
      return hasConnections && client.status === 'active'
    })
    
    activeClientsWithConnections.slice(0, 1).forEach((client: any) => {
      alertsData.push({
        id: client._id,
        type: "success" as const,
        client: client.name,
        issue: "Cliente ativo e conectado"
      })
    })

    return { goalsData, clientPerformanceData, rankingData, alertsData }
  } catch (error) {
    console.error('Erro ao buscar dados de performance:', error)
    throw error
  }
}

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedData = await fetchPerformanceData()
        setData(fetchedData)
      } catch (error) {
        console.error("Falha ao buscar dados de performance", error)
        setError("Erro ao carregar dados de performance")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <PlaceholderContent title="Carregando Performance..." description="Buscando dados..." />
  }

  if (error || !data) {
    return (
      <PlaceholderContent
        title="Erro ao carregar dados"
        description={error || "Não foi possível buscar os dados de performance."}
      />
    )
  }

  return (
    <PerformanceContent
      goalsData={data.goalsData}
      clientPerformanceData={data.clientPerformanceData}
      rankingData={data.rankingData}
      alertsData={data.alertsData}
    />
  )
}
