"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, AlertCircle } from "lucide-react"
import ClientCard from "./clients/ClientCard"
import { getConnectionStatusIcon, formatLastSync } from "@/lib/connection-status"

// Interface baseada no seu Client Model da API
interface Client {
  _id: string
  name: string
  slug: string
  avatar?: string
  monthlyBudget: number
  status: 'active' | 'pending' | 'inactive'
  googleAds: { connected: boolean }
  facebookAds: { connected: boolean }
  googleAnalytics: { connected: boolean }
  createdAt: string
  updatedAt: string
}

const ClientList = () => {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/clients');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar clientes');
      }
      
      const data = await response.json();
      setClients(data.data || []);
    } catch (err: unknown) {
      console.error('Erro ao buscar clientes:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: 'active' | 'pending' | 'inactive') => {
    const statusClasses = {
      active: "bg-primary-subtle text-primary",
      pending: "bg-primary-subtle text-primary-700",
      inactive: "bg-primary-subtle text-primary-900"
    };
    return (
      <span className={`badge ${statusClasses[status] || statusClasses.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getConnectionStatus = (connected: boolean) => {
    return getConnectionStatusIcon(connected);
  };

  const formatDate = (dateString: string) => {
    return formatLastSync(dateString);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <div className="spinner-border" style={{color: '#D00054'}} role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <AlertCircle className="text-primary text-4xl mb-3" />
              <h5>Erro ao carregar clientes</h5>
              <p className="text-muted">{error}</p>
              <button 
                className="btn btn-primary" 
                onClick={fetchClients}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e suas conexões.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar cliente..." className="pl-8 w-full sm:w-64" />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div 
            key={client._id} 
            onClick={() => router.push(`/admin/clients/${client.slug}`)}
            className="cursor-pointer"
          >
            <ClientCard client={client} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientList
