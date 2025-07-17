"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Edit, 
  Settings, 
  BarChart3, 
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react"
import { getConnectionStatusIcon, formatLastSync } from "@/lib/connection-status"
import { useRouter } from "next/navigation"

interface Client {
  _id: string
  name: string
  slug: string
  email: string
  avatar?: string
  status: 'active' | 'pending' | 'inactive'
  monthlyBudget: number
  tags?: string[]
  googleAds: { 
    connected: boolean
    lastSync?: string
  }
  facebookAds: { 
    connected: boolean
    lastSync?: string
  }
  googleAnalytics: { 
    connected: boolean
    lastSync?: string
  }
  createdAt: string
  updatedAt: string
}

interface ClientCardProps {
  client: Client
}

const ClientCard = ({ client }: ClientCardProps) => {
  const router = useRouter()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const connectedPlatforms = [
    { name: 'Google Ads', connected: client.googleAds.connected, lastSync: client.googleAds.lastSync },
    { name: 'Facebook Ads', connected: client.facebookAds.connected, lastSync: client.facebookAds.lastSync },
    { name: 'Google Analytics', connected: client.googleAnalytics.connected, lastSync: client.googleAnalytics.lastSync }
  ].filter(platform => platform.connected).length;

  const handleDashboardClick = () => {
    router.push(`/portal/${client.slug}/dashboard`)
  }

  const handleSettingsClick = () => {
    router.push(`/portal/${client.slug}/configuracoes`)
  }

  const handleEditClick = () => {
    router.push(`/admin/clients/${client.slug}`)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">{client.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
          </div>
          <Badge className={getStatusColor(client.status)}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Budget Info */}
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Orçamento: {formatCurrency(client.monthlyBudget)}
          </span>
        </div>

        {/* Connection Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Conexões</span>
            <span className="text-xs text-muted-foreground">
              {connectedPlatforms}/3 conectadas
            </span>
          </div>
          <div className="flex space-x-2">
            {getConnectionStatusIcon(client.googleAds.connected, { size: 'text-sm' })}
            {getConnectionStatusIcon(client.facebookAds.connected, { size: 'text-sm' })}
            {getConnectionStatusIcon(client.googleAnalytics.connected, { size: 'text-sm' })}
          </div>
        </div>

        {/* Last Sync */}
        {connectedPlatforms > 0 && (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Última sincronização: {formatLastSync(client.updatedAt)}
            </span>
          </div>
        )}

        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {client.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {client.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{client.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleDashboardClick}
            title="Dashboard do Cliente"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleSettingsClick}
            title="Configurações"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClientCard 