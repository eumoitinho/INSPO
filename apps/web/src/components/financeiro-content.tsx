"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// --- TIPOS DE DADOS ---
export interface FinancialSummary {
  title: string
  value: string
  change: string
  icon: LucideIcon
}

export interface ClientFinancial {
  id: string
  name: string
  investment: string
  revenue: string
  margin: string
  roi: string
  status: "Ótimo" | "Bom" | "Atenção"
}

export interface BudgetControl {
  id: string
  name: string
  budget: string
  spent: string
  remaining: string
  used: number
  status: "OK" | "Alto" | "Crítico"
}

export interface AgencyRevenue {
  managementFee: string
  performanceBonus: string
  totalRevenue: string
  operationalCosts: string
  netProfit: string
}

// --- PROPS DO COMPONENTE ---
interface FinanceiroContentProps {
  summaryData: FinancialSummary[]
  clientFinancials: ClientFinancial[]
  budgetControl: BudgetControl[]
  agencyRevenue: AgencyRevenue
}

const StatCard = ({ title, value, change, icon: Icon }: FinancialSummary) => (
  <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <p className="text-xs text-emerald-500">{change} vs anterior</p>
    </CardContent>
  </Card>
)

export default function FinanceiroContent({
  summaryData,
  clientFinancials,
  budgetControl,
  agencyRevenue,
}: FinanceiroContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((data) => (
          <StatCard key={data.title} {...data} />
        ))}
      </div>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Performance Financeira por Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Investimento</TableHead>
                <TableHead>Receita</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientFinancials.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.investment}</TableCell>
                  <TableCell>{client.revenue}</TableCell>
                  <TableCell>{client.margin}</TableCell>
                  <TableCell>{client.roi}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === "Ótimo" ? "default" : "secondary"}>{client.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Controle de Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Orçamento</TableHead>
                <TableHead>Gasto</TableHead>
                <TableHead>Restante</TableHead>
                <TableHead>% Usado</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetControl.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.budget}</TableCell>
                  <TableCell>{client.spent}</TableCell>
                  <TableCell>{client.remaining}</TableCell>
                  <TableCell>{client.used}%</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        client.status === "Crítico" ? "destructive" : client.status === "Alto" ? "secondary" : "default"
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Faturamento da Agência</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>
            <span className="font-semibold">Taxa de Gestão (15%):</span> {agencyRevenue.managementFee}
          </p>
          <p>
            <span className="font-semibold">Bônus Performance:</span> {agencyRevenue.performanceBonus}
          </p>
          <p className="font-bold pt-2 border-t mt-2">Faturamento Total: {agencyRevenue.totalRevenue}</p>
          <p>
            <span className="font-semibold">Custos Operacionais:</span> {agencyRevenue.operationalCosts}
          </p>
          <p className="font-bold text-emerald-500">Lucro Líquido: {agencyRevenue.netProfit}</p>
        </CardContent>
      </Card>
    </div>
  )
}
