"use client"

import { useState, useEffect } from "react"
import CampanhasContent, { type Campaign, type CampaignSummary } from "../../../components/campanhas-content"
import { Rocket, Pause, BarChart, DollarSign } from "lucide-react"
import PlaceholderContent from "../../../components/PlaceholderContent"

// TODO: Substituir com a chamada de API real
const fetchCampaignsData = async (): Promise<{ summary: CampaignSummary[]; campaigns: Campaign[] }> => {
  // Simula um delay da API
  await new Promise((resolve) => setTimeout(resolve, 500))

  const summaryData = [
    { title: "Ativas", value: "47", change: "+2 vs ontem", icon: Rocket },
    { title: "Pausadas", value: "8", change: "+3 vs ontem", icon: Pause },
    { title: "Total", value: "55", change: "+5 vs ontem", icon: BarChart },
    { title: "Gasto", value: "R$ 89.450", change: "+8.5% vs ant", icon: DollarSign },
  ]

  const campaignsData = [
    {
      id: "1",
      name: "[92] PESQUISA - BRANDING",
      client: "Catalisti",
      platform: "GA",
      status: "active",
      cost: "R$ 21",
      conversions: 1,
    },
    {
      id: "2",
      name: "[M2Z] PESQUISA - SITE",
      client: "Catalisti",
      platform: "GA",
      status: "active",
      cost: "R$ 1.861",
      conversions: 17,
    },
    {
      id: "3",
      name: "ABC EVO - Conversões",
      client: "ABC EVO",
      platform: "GA",
      status: "active",
      cost: "R$ 520",
      conversions: 8,
    },
    {
      id: "4",
      name: "Dr. Victor - Consultas",
      client: "Dr.Victor",
      platform: "GA",
      status: "active",
      cost: "R$ 680",
      conversions: 12,
    },
    {
      id: "5",
      name: "Facebook - Brand",
      client: "Catalisti",
      platform: "FB",
      status: "active",
      cost: "R$ 320",
      conversions: 5,
    },
    {
      id: "6",
      name: "CWTremds - Leads",
      client: "CWTremds",
      platform: "FB",
      status: "paused",
      cost: "R$ 450",
      conversions: 6,
    },
  ]

  return { summary: summaryData, campaigns: campaignsData }
}

export default function CampanhasPage() {
  const [data, setData] = useState<{ summary: CampaignSummary[]; campaigns: Campaign[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchCampaignsData()
        setData(fetchedData)
      } catch (error) {
        console.error("Falha ao buscar dados de campanhas", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <PlaceholderContent title="Carregando Campanhas..." description="Buscando dados..." />
  }

  if (!data) {
    return (
      <PlaceholderContent
        title="Erro ao carregar dados"
        description="Não foi possível buscar os dados das campanhas."
      />
    )
  }

  return <CampanhasContent summaryData={data.summary} campaignsData={data.campaigns} />
}
