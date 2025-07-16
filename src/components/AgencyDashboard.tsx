"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, DollarSign, Target, TrendingUp, Users, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

// Card de estatística simples
const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color?: string }) => (
  <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
      <Icon className={cn("h-4 w-4", color || "text-gray-500 dark:text-gray-400")} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    </CardContent>
  </Card>
)

export default function AgencyDashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/clients');
      const data = await response.json();
      if (response.ok) {
        setClients(data.data || []);
      } else {
        throw new Error(data.message || 'Erro ao carregar clientes');
      }
    } catch (err) {
      setError('Erro ao carregar lista de clientes');
    } finally {
      setIsLoading(false);
    }
  };

  // Estatísticas simples
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const pendingClients = clients.filter(c => c.status === 'pending').length;
  const inactiveClients = clients.filter(c => c.status === 'inactive').length;
  const totalBudget = clients.reduce((sum, c) => sum + (c.monthlyBudget || 0), 0);

  if (isLoading) {
    return <div className="text-center py-10">Carregando dashboards...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo Executivo da Agência</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total de Clientes" value={totalClients} icon={Users} color="text-blue-500" />
          <StatCard title="Clientes Ativos" value={activeClients} icon={CheckCircle2} color="text-emerald-500" />
          <StatCard title="Pendentes" value={pendingClients} icon={AlertTriangle} color="text-amber-500" />
          <StatCard title="Inativos" value={inactiveClients} icon={AlertCircle} color="text-red-500" />
        </div>
      </div>

      {/* Orçamento Total */}
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Orçamento Total dos Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBudget)}</div>
        </CardContent>
      </Card>

      {/* Lista simples dos clientes */}
      <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-2 text-left">Nome</th>
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2 text-left">Orçamento</th>
                  <th className="px-2 py-2 text-left">Slug</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id} className="border-b hover:bg-gray-50 dark:hover:bg-[#18181b]">
                    <td className="px-2 py-2 font-medium">{client.name}</td>
                    <td className="px-2 py-2">
                      {client.status === 'active' && <span className="text-emerald-600">Ativo</span>}
                      {client.status === 'pending' && <span className="text-amber-600">Pendente</span>}
                      {client.status === 'inactive' && <span className="text-red-600">Inativo</span>}
                    </td>
                    <td className="px-2 py-2">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.monthlyBudget || 0)}</td>
                    <td className="px-2 py-2">{client.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
