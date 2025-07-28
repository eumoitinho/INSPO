"use client"

import { useState, useEffect } from "react"
import FinanceiroContent, {
  type FinancialSummary,
  type ClientFinancial,
  type BudgetControl,
  type AgencyRevenue,
} from "../../../components/financeiro-content"
import { DollarSign, TrendingUp, Percent } from "lucide-react"
import PlaceholderContent from "../../../components/PlaceholderContent"

interface FinanceiroData {
  summaryData: FinancialSummary[]
  clientFinancials: ClientFinancial[]
  budgetControl: BudgetControl[]
  agencyRevenue: AgencyRevenue
}

// TODO: Substituir com a chamada de API real
const fetchFinanceiroData = async (): Promise<FinanceiroData> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const summaryData = [
    { title: "Investimento", value: "R$ 89.450", change: "+8.5%", icon: DollarSign },
    { title: "Receita Gen.", value: "R$ 156.240", change: "+15.2%", icon: TrendingUp },
    { title: "Margem", value: "R$ 66.790", change: "+23.1%", icon: DollarSign },
    { title: "ROI", value: "174.6%", change: "+12.3%", icon: Percent },
  ]

  const clientFinancials = [
    {
      id: "1",
      name: "Catalisti Holding",
      investment: "R$ 15.240",
      revenue: "R$ 28.560",
      margin: "R$ 13.320",
      roi: "187%",
      status: "Ótimo",
    },
    {
      id: "2",
      name: "ABC EVO",
      investment: "R$ 8.950",
      revenue: "R$ 14.720",
      margin: "R$ 5.770",
      roi: "164%",
      status: "Bom",
    },
    {
      id: "3",
      name: "Dr. Victor Mauro",
      investment: "R$ 7.200",
      revenue: "R$ 13.680",
      margin: "R$ 6.480",
      roi: "190%",
      status: "Ótimo",
    },
  ]

  const budgetControl = [
    {
      id: "1",
      name: "Catalisti Holding",
      budget: "R$ 18.000",
      spent: "R$ 15.240",
      remaining: "R$ 2.760",
      used: 84.7,
      status: "OK",
    },
    {
      id: "2",
      name: "ABC EVO",
      budget: "R$ 10.000",
      spent: "R$ 8.950",
      remaining: "R$ 1.050",
      used: 89.5,
      status: "Alto",
    },
    {
      id: "3",
      name: "Dr. Victor Mauro",
      budget: "R$ 8.000",
      spent: "R$ 7.200",
      remaining: "R$ 800",
      used: 90.0,
      status: "Alto",
    },
    {
      id: "4",
      name: "CWTremds",
      budget: "R$ 6.000",
      spent: "R$ 5.450",
      remaining: "R$ 550",
      used: 90.8,
      status: "Crítico",
    },
  ]

  const agencyRevenue = {
    managementFee: "R$ 13.417,50",
    performanceBonus: "R$ 8.900",
    totalRevenue: "R$ 22.317,50",
    operationalCosts: "R$ 8.500",
    netProfit: "R$ 13.817,50",
  }

  return { summaryData, clientFinancials, budgetControl, agencyRevenue }
}

export default function FinanceiroPage() {
  const [data, setData] = useState<FinanceiroData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchFinanceiroData()
        setData(fetchedData)
      } catch (error) {
        console.error("Falha ao buscar dados financeiros", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <PlaceholderContent title="Carregando Financeiro..." description="Buscando dados..." />
  }

  if (!data) {
    return (
      <PlaceholderContent title="Erro ao carregar dados" description="Não foi possível buscar os dados financeiros." />
    )
  }

  return (
    <FinanceiroContent
      summaryData={data.summaryData}
      clientFinancials={data.clientFinancials}
      budgetControl={data.budgetControl}
      agencyRevenue={data.agencyRevenue}
    />
  )
}
