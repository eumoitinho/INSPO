"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

// --- TIPOS DE DADOS ---
export interface Goal {
  name: string
  current: number
  goal: number
  unit: "R$" | "%" | "x" | ""
}

export interface ClientPerformance {
  name: string
  roas: number
}

export interface Ranking {
  rank: number
  name: string
  score: number
}

export interface PerformanceAlert {
  id: string
  type: "urgent" | "attention" | "success"
  client: string
  issue: string
}

// --- PROPS DO COMPONENTE ---
interface PerformanceContentProps {
  goalsData: Goal[]
  clientPerformanceData: ClientPerformance[]
  rankingData: Ranking[]
  alertsData: PerformanceAlert[]
}

export default function PerformanceContent({
  goalsData,
  clientPerformanceData,
  rankingData,
  alertsData,
}: PerformanceContentProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Metas vs Realizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goalsData.map((goal) => {
            const progress = (goal.current / goal.goal) * 100
            return (
              <div key={goal.name}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span>{`${goal.unit}${goal.current} / ${goal.unit}${goal.goal} (${Math.round(progress)}%)`}</span>
                </div>
                <Progress value={progress > 100 ? 100 : progress} />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Performance por Cliente (ROAS)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ roas: { label: "ROAS", color: "hsl(var(--chart-1))" } }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer>
              <BarChart data={clientPerformanceData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  dataKey="roas"
                  tickFormatter={(value) => `${value}x`}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="roas" fill="var(--color-roas)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle>Ranking de Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rankingData.map((client) => (
              <div key={client.name} className="flex items-center justify-between">
                <p>
                  <span className="font-bold">{client.rank}.</span> {client.name}
                </p>
                <p className="font-semibold">Score: {client.score}/100</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle>Alertas de Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertsData.map((alert) => (
              <div key={alert.id} className="flex items-center">
                <span
                  className={`h-2 w-2 rounded-full mr-2 ${alert.type === "urgent" ? "bg-red-500" : alert.type === "attention" ? "bg-amber-500" : "bg-emerald-500"}`}
                ></span>
                <p>
                  <span className="font-semibold">{alert.client}:</span> {alert.issue}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Tendências (30 Dias)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-emerald-500 font-semibold">Melhores Performers:</span> Catalisti (+15%), Dr. Victor
            (+12%)
          </p>
          <p>
            <span className="text-amber-500 font-semibold">Crescimento Médio:</span> ABC EVO (+5%), CWTremds (+3%)
          </p>
          <p>
            <span className="text-red-500 font-semibold">Quedas:</span> Dr. Percio (-18%), LJ Santos (-12%)
          </p>
          <p className="pt-2 border-t mt-2">
            <span className="font-semibold">Tendência Geral:</span> +8.5% leads, +12.3% ROAS, -2.1% CPC
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
