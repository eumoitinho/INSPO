"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileText, LinkIcon, RefreshCw, Upload, Palette, Search, Save, Mail } from "lucide-react"

// --- TIPOS DE DADOS ---
export interface SavedReport {
  id: string
  name: string
  client: string
  type: "PDF" | "Excel"
  date: string
}

export interface AutomatedReport {
  id: string
  name: string
  schedule: string
}

// --- PROPS DO COMPONENTE ---
interface RelatoriosContentProps {
  quickReports: string[]
  savedReports: SavedReport[]
  metricsToInclude: string[]
  automatedReports: AutomatedReport[]
}

export default function RelatoriosContent({
  quickReports,
  savedReports,
  metricsToInclude,
  automatedReports,
}: RelatoriosContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Gerar Novo
        </Button>
      </div>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Relatórios Rápidos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {quickReports.map((report) => (
            <Button key={report} variant="outline">
              {report}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Relatórios Salvos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.client}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
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
          <CardTitle>Criador de Relatórios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuração */}
          <div className="space-y-2 p-4 border rounded-lg">
            <h3 className="font-semibold">Configuração</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Cliente: Catalisti Holding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="catalisti">Catalisti Holding</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Período: Últimos 30 dias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Formato: PDF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Métricas */}
          <div className="space-y-2 p-4 border rounded-lg">
            <h3 className="font-semibold">Métricas a Incluir</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metricsToInclude.map((metric) => (
                <div key={metric} className="flex items-center space-x-2">
                  <Checkbox id={metric} defaultChecked />
                  <label htmlFor={metric} className="text-sm font-medium leading-none">
                    {metric}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Personalização */}
          <div className="space-y-2 p-4 border rounded-lg">
            <h3 className="font-semibold">Personalização</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Logo
              </Button>
              <Button variant="outline">
                <Palette className="mr-2 h-4 w-4" />
                Cores
              </Button>
              <Input placeholder="Comentários..." className="flex-1 min-w-[200px]" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Prévia
            </Button>
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Salvar Template
            </Button>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Email
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle>Relatórios Automáticos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {automatedReports.map((report) => (
            <div key={report.id} className="flex justify-between items-center p-3 border rounded-lg">
              <p className="font-medium">{report.name}</p>
              <p className="text-sm text-gray-500">{report.schedule}</p>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button>Novo Automático</Button>
            <Button variant="outline">Configurar</Button>
            <Button variant="outline">Executar Agora</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
