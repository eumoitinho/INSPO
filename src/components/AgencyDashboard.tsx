"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, DollarSign, Target, TrendingUp, Users, AlertTriangle } from "lucide-react"
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// --- DADOS MOCKADOS ---

const executiveSummaryData = [
  {
    title: "Investimento",
    value: "R$ 89.450",
    change: "+15%",
    changeType: "increase",
    icon: DollarSign,
  },
  {
    title: "Total Leads",
    value: "1.247",
    change: "+8%",
    changeType: "increase",
    icon: Users,
  },
  {
    title: "ROAS Médio",
    value: "2.8x",
    change: "+0.3x",
    changeType: "increase",
    icon: TrendingUp,
  },
  {
    title: "Taxa Conv.",
    value: "12.3%",
    change: "+2.1%",
    changeType: "increase",
    icon: Target,
  },
]

const performanceChartData = [
  { day: 1, investment: 2000, revenue: 3000, leads: 30 },
  { day: 5, investment: 3500, revenue: 5000, leads: 55 },
  { day: 10, investment: 4000, revenue: 6200, leads: 60 },
  { day: 15, investment: 5500, revenue: 8000, leads: 85 },
  { day: 20, investment: 6000, revenue: 9500, leads: 90 },
  { day: 25, investment: 7200, revenue: 11000, leads: 110 },
  { day: 30, investment: 8000, revenue: 12500, leads: 120 },
]

const topClientsData = [
  { rank: 1, name: "Catalisti Holding", investment: "R$ 15.240", leads: 248, roas: "3.2x" },
  { rank: 2, name: "ABC EVO", investment: "R$ 8.950", leads: 124, roas: "2.8x" },
  { rank: 3, name: "Dr. Victor Mauro", investment: "R$ 7.200", leads: 98, roas: "3.1x" },
  { rank: 4, name: "Global Best Part", investment: "R$ 6.800", leads: 89, roas: "2.6x" },
  { rank: 5, name: "CWTremds", investment: "R$ 5.450", leads: 76, roas: "2.9x" },
]

const platformData = [
  { name: "Google Ads", value: 60, color: "#4285F4" },
  { name: "Facebook Ads", value: 35, color: "#1877F2" },
  { name: "Outros", value: 5, color: "#A9A9A9" },
]

const alertsData = [
  {
    type: "urgent",
    message: "Dr. Percio - CPL aumentou 45% nas últimas 48h",
    icon: AlertTriangle,
  },
  {
    type: "attention",
    message: "Favretto Mídia - Budget 80% consumido",
    icon: AlertCircle,
  },
  {
    type: "success",
    message: "Naframe - Nova campanha com 25% mais conversões",
    icon: CheckCircle2,
  },
]

// --- COMPONENTES ---

const StatCard = ({ title, value, change, changeType, icon: Icon }: (typeof executiveSummaryData)[0]) => (
  <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <p className={`text-xs ${changeType === "increase" ? "text-emerald-500" : "text-red-500"}`}>
        {change} vs mês ant.
      </p>
    </CardContent>
  </Card>
)

export default function InicioContent() {
  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo Executivo da Agência</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {executiveSummaryData.map((data) => (
            <StatCard key={data.title} {...data} />
          ))}
        </div>
      </div>

      {/* Performance Geral */}
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Performance Geral dos Últimos 30 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              investment: { label: "Investimento", color: "hsl(var(--chart-1))" },
              revenue: { label: "Receita", color: "hsl(var(--chart-2))" },
              leads: { label: "Leads", color: "hsl(var(--chart-3))" },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer>
              <LineChart data={performanceChartData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-[#1F1F23]"
                />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="investment"
                  stroke="var(--color-investment)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="leads" stroke="var(--color-leads)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Clientes e Distribuição */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Top 5 Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClientsData.map((client) => (
                <div key={client.rank} className="flex items-center">
                  <div className="text-lg font-bold text-gray-500 dark:text-gray-400 w-8">{client.rank}.</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{client.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {client.investment} | {client.leads} leads | {client.roas} ROAS
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Distribuição por Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[200px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={platformData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Alertas e Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertsData.map((alert, index) => (
              <div
                key={index}
                className={cn("flex items-center p-3 rounded-lg", {
                  "bg-red-500/10 text-red-500": alert.type === "urgent",
                  "bg-amber-500/10 text-amber-500": alert.type === "attention",
                  "bg-emerald-500/10 text-emerald-500": alert.type === "success",
                })}
              >
                <alert.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
