"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import ClientCard from "./clients/ClientCard"

// Interface baseada no seu Client Model da API
interface Client {
  _id: string
  name: string
  slug: string
  avatar?: string
  monthlyBudget: number
  googleAds: { connected: boolean }
  facebookAds: { connected: boolean }
  googleAnalytics: { connected: boolean }
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch data from GET /api/admin/clients
    // Exemplo de como a chamada de API seria feita:
    /*
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/admin/clients', {
          headers: { 'Authorization': `Bearer YOUR_JWT_TOKEN` }
        });
        const data = await response.json();
        if (data.success) {
          setClients(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch clients", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
    */

    // Usando dados mockados por enquanto
    const mockData = [
      {
        _id: "catalisti-holding",
        name: "Catalisti Holding",
        slug: "catalisti-holding",
        avatar: "/placeholder.svg?width=64&height=64",
        monthlyBudget: 18000,
        googleAds: { connected: true },
        facebookAds: { connected: true },
        googleAnalytics: { connected: true },
      },
      {
        _id: "abc-evo",
        name: "ABC EVO",
        slug: "abc-evo",
        avatar: "/placeholder.svg?width=64&height=64",
        monthlyBudget: 10000,
        googleAds: { connected: true },
        facebookAds: { connected: true },
        googleAnalytics: { connected: false },
      },
    ]
    setClients(mockData)
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Carregando clientes...</div> // TODO: Usar LoadingSpinner.jsx
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
          <ClientCard key={client._id} client={client} />
        ))}
      </div>
    </div>
  )
}
