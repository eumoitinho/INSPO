"use client"

import { useState, useEffect } from "react"
import OtimizacaoContent, { type Recommendations, type Automation } from "../../../components/otimizacao-content"
import PlaceholderContent from "../../../components/PlaceholderContent"

interface OtimizacaoData {
  recommendations: Recommendations
  automations: Automation[]
}

// TODO: Substituir com a chamada de API real
const fetchOtimizacaoData = async (): Promise<OtimizacaoData> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const recommendations = {
    urgent: [
      { client: "Dr. Percio", action: "Pausar campanha 'Branding Mobile'", economy: "R$ 450/dia", impact: "-45% CPL" },
      { client: "LJ Santos", action: "Ajustar lances em 20%", economy: "R$ 230/dia", impact: "+15% CTR" },
      {
        client: "CWTremds",
        action: "Realocar budget entre campanhas",
        economy: "+R$ 180/dia",
        impact: "+25% conversões",
      },
    ],
    important: [
      "Catalisti - Expandir palavras-chave (+12% impressões)",
      "ABC EVO - Otimizar horários de exibição (+8% CTR)",
      "Global Best - Testar novos criativos (+15% conversões)",
    ],
    opportunities: [
      "Motin Films - Expandir para YouTube (+R$ 300/mês)",
      "Naport - Testar LinkedIn Ads (+R$ 500/mês)",
      "Colaço - Implementar Google Shopping (+R$ 200/mês)",
    ],
  }

  const automations = [
    { id: "1", name: "Auto Pause (CPL > 50)", status: "active", lastAction: "2h atrás", economy: "R$ 127/dia" },
    { id: "2", name: "Bid Optimization", status: "active", lastAction: "15min atrás", economy: "R$ 89/dia" },
    { id: "3", name: "Budget Reallocation", status: "paused", lastAction: "1d atrás", economy: "R$ 156/dia" },
  ]

  return { recommendations, automations }
}

export default function OtimizacaoPage() {
  const [data, setData] = useState<OtimizacaoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchOtimizacaoData()
        setData(fetchedData)
      } catch (error) {
        console.error("Falha ao buscar dados de otimização", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <PlaceholderContent title="Carregando Otimizações..." description="Buscando dados..." />
  }

  if (!data) {
    return (
      <PlaceholderContent
        title="Erro ao carregar dados"
        description="Não foi possível buscar os dados de otimização."
      />
    )
  }

  return <OtimizacaoContent recommendations={data.recommendations} automations={data.automations} />
}
