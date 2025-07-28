"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Pause, BarChart, DollarSign, Settings, LinkIcon, Play, Trash } from "lucide-react"

// --- TIPOS DE DADOS ---
export interface CampaignSummary {
  title: string
  value: string
  change: string
  icon: LucideIcon
}

export interface Campaign {
  id: string
  name: string
  client: string
  platform: "GA" | "FB"
  status: "active" | "paused"
  cost: string
  conversions: number
}

// --- PROPS DO COMPONENTE ---
interface CampanhasContentProps {
  summaryData: CampaignSummary[]
  campaignsData: Campaign[]
}

const StatCard = ({ title, value, change, icon: Icon }: CampaignSummary) => (
  <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <p className="text-xs text-emerald-500">{change}</p>
    </CardContent>
  </Card>
)

export default function CampanhasContent({ summaryData, campaignsData }: CampanhasContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((data) => (
          <StatCard key={data.title} {...data} />
        ))}
      </div>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Cliente: Todos" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Plataforma: Todas" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Status: Ativas" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tipo: Todos" />
            </SelectTrigger>
          </Select>
          <Input placeholder="Buscar..." />
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Lista de Campanhas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox />
                </TableHead>
                <TableHead>Campanha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Plat.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gasto</TableHead>
                <TableHead>Conv.</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignsData.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.client}</TableCell>
                  <TableCell>{campaign.platform}</TableCell>
                  <TableCell>{campaign.status === "active" ? "🟢 Ativa" : "🟡 Pausa"}</TableCell>
                  <TableCell>{campaign.cost}</TableCell>
                  <TableCell>{campaign.conversions}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Ações em Massa</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 items-center">
          <p className="text-sm font-medium">5 campanhas selecionadas</p>
          <Button size="sm">
            <Play className="mr-2 h-4 w-4" />
            Ativar
          </Button>
          <Button size="sm" variant="outline">
            <Pause className="mr-2 h-4 w-4" />
            Pausar
          </Button>
          <Button size="sm" variant="outline">
            <BarChart className="mr-2 h-4 w-4" />
            Relatório
          </Button>
          <Button size="sm" variant="outline">
            <DollarSign className="mr-2 h-4 w-4" />
            Ajustar Budget
          </Button>
          <Button size="sm" variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
