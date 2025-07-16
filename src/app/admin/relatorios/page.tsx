"use client"

import { useState, useEffect } from "react"
import RelatoriosContent, { type SavedReport, type AutomatedReport } from "../../../components/relatorios-content"
import PlaceholderContent from "../../../components/PlaceholderContent"

interface RelatoriosData {
  quickReports: string[]
  savedReports: SavedReport[]
  metricsToInclude: string[]
  automatedReports: AutomatedReport[]
}

// TODO: Substituir com a chamada de API real
const fetchRelatoriosData = async (): Promise<RelatoriosData> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const quickReports = ["Executivo", "Performance", "ROI", "Conversões", "Mobile", "Geo"]
  const savedReports = [
    { id: "1", name: "Executivo Julho 2025", client: "Catalisti", type: "PDF", date: "15/07" },
    { id: "2", name: "Performance Mensal", client: "ABC EVO", type: "Excel", date: "14/07" },
    { id: "3", name: "ROI Comparativo", client: "Dr. Victor", type: "PDF", date: "13/07" },
  ]
  const metricsToInclude = [
    "Resumo Executivo",
    "Principais KPIs",
    "Gráfico de Performance",
    "Análise por Campanha",
    "Comparação Período",
    "Distribuição Plataforma",
    "Recomendações IA",
    "Próximos Passos",
  ]
  const automatedReports = [
    { id: "1", name: "Relatório Semanal - Todos os Clientes", schedule: "Segundas, 9h" },
    { id: "2", name: "Relatório Mensal - Executivo", schedule: "Dia 1, 8h" },
    { id: "3", name: "Alerta Performance - Diário", schedule: "Campanhas com problemas" },
  ]

  return { quickReports, savedReports, metricsToInclude, automatedReports }
}

export default function RelatoriosPage() {
  const [data, setData] = useState<RelatoriosData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchRelatoriosData()
        setData(fetchedData)
      } catch (error) {
        console.error("Falha ao buscar dados de relatórios", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <PlaceholderContent title="Carregando Relatórios..." description="Buscando dados..." />
  }

  if (!data) {
    return (
      <PlaceholderContent
        title="Erro ao carregar dados"
        description="Não foi possível buscar os dados de relatórios."
      />
    )
  }

  return (
    <RelatoriosContent
      quickReports={data.quickReports}
      savedReports={data.savedReports}
      metricsToInclude={data.metricsToInclude}
      automatedReports={data.automatedReports}
    />
  )
}
