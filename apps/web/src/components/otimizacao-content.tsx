"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, BarChart, Rocket, Calendar } from "lucide-react"

// --- TIPOS DE DADOS ---
export interface Recommendation {
  client: string
  action: string
  economy: string
  impact: string
}

export interface Recommendations {
  urgent: Recommendation[]
  important: string[]
  opportunities: string[]
}

export interface Automation {
  id: string
  name: string
  status: "active" | "paused"
  lastAction: string
  economy: string
}

// --- PROPS DO COMPONENTE ---
interface OtimizacaoContentProps {
  recommendations: Recommendations
  automations: Automation[]
}

export default function OtimizacaoContent({ recommendations, automations }: OtimizacaoContentProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Recomendações Prioritárias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Urgente */}
          <div>
            <h3 className="font-semibold mb-2">
              <Badge variant="destructive">URGENTE ({recommendations.urgent.length})</Badge>
            </h3>
            <div className="space-y-4">
              {recommendations.urgent.map((rec) => (
                <div key={rec.client} className="p-3 border rounded-lg space-y-2">
                  <p className="font-medium">
                    {rec.client} - {rec.action}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span>Economia: {rec.economy}</span>
                    <span>Impacto: {rec.impact}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Aplicar
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="mr-2 h-4 w-4" />
                      Agendar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Importante */}
          <div>
            <h3 className="font-semibold mb-2">
              <Badge variant="secondary" className="bg-amber-500 text-white">
                IMPORTANTE ({recommendations.important.length})
              </Badge>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {recommendations.important.map((rec) => (
                <li key={rec}>{rec}</li>
              ))}
            </ul>
          </div>
          {/* Oportunidades */}
          <div>
            <h3 className="font-semibold mb-2">
              <Badge variant="secondary" className="bg-emerald-500 text-white">
                OPORTUNIDADES ({recommendations.opportunities.length})
              </Badge>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {recommendations.opportunities.map((rec) => (
                <li key={rec}>{rec}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Impacto Projetado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Se aplicar TODAS as recomendações:</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
            <p>Economia: R$ 2.450/mês</p>
            <p>Aumento ROAS: +18%</p>
            <p>Mais leads: +156</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button>
              <Rocket className="mr-2 h-4 w-4" />
              Aplicar Todas
            </Button>
            <Button variant="outline">
              <BarChart className="mr-2 h-4 w-4" />
              Ver Simulação
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Implementação
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Automações Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Ação</TableHead>
                <TableHead>Economia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automations.map((auto) => (
                <TableRow key={auto.id}>
                  <TableCell className="font-medium">{auto.name}</TableCell>
                  <TableCell>
                    <Badge variant={auto.status === "active" ? "default" : "secondary"}>{auto.status}</Badge>
                  </TableCell>
                  <TableCell>{auto.lastAction}</TableCell>
                  <TableCell>{auto.economy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
