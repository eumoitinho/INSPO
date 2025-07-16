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

// TODO: Substituir com a chamada de API real
const fetchPerformanceData = async (): Promise<PerformanceData> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const goalsData = [
    { name: "Investimento", current: 89450, goal: 95000, unit: "R$" },
    { name: "Leads", current: 1247, goal: 1200, unit: "" },
    { name: "ROAS", current: 2.8, goal: 2.5, unit: "x" },
    { name: "Taxa Conv.", current: 12.3, goal: 10, unit: "%" },
  ]

  const clientPerformanceData = [
    { name: "Catalisti", roas: 3.2 },
    { name: "ABC EVO", roas: 2.8 },
    { name: "Dr.Victor", roas: 3.1 },
    { name: "CWTremds", roas: 2.9 },
    { name: "Global", roas: 2.6 },
    { name: "Favretto", roas: 2.4 },
  ]

  const rankingData = [
    { rank: 1, name: "Catalisti Holding", score: 95 },
    { rank: 2, name: "Dr. Victor Mauro", score: 92 },
    { rank: 3, name: "CWTremds", score: 89 },
    { rank: 4, name: "ABC EVO", score: 85 },
    { rank: 5, name: "Global Best Part", score: 82 },
  ]

  const alertsData = [
    { id: "1", type: "urgent", client: "Dr. Percio", issue: "CPL +45% (48h)" },
    { id: "2", type: "attention", client: "Favretto Mídia", issue: "Budget 80% usado" },
    { id: "3", type: "attention", client: "LJ Santos", issue: "CTR -25% (7d)" },
    { id: "4", type: "success", client: "Naframe", issue: "+25% conversões" },
    { id: "5", type: "success", client: "Motin Films", issue: "Novo recorde ROAS" },
  ]

  return { goalsData, clientPerformanceData, rankingData, alertsData }
}

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchPerformanceData()
        setData(fetchedData)
      } catch (error) {
        console.error("Falha ao buscar dados de performance", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <PlaceholderContent title="Carregando Performance..." description="Buscando dados..." />
  }

  if (!data) {
    return (
      <PlaceholderContent
        title="Erro ao carregar dados"
        description="Não foi possível buscar os dados de performance."
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
