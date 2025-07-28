"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  ExternalLink, 
  Edit2, 
  Trash2,
  DollarSign,
  Mail,
  Globe,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings
} from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { GoogleAdsModal } from "@/components/integrations/GoogleAdsModal"
import { GoogleAnalyticsModal } from "@/components/integrations/GoogleAnalyticsModal"
import { FacebookPixelModal } from "@/components/integrations/FacebookPixelModal"
import { FacebookOAuthModal } from "@/components/integrations/FacebookOAuthModal"

interface ClientData {
  _id: string
  name: string
  email: string
  slug: string
  status: 'active' | 'inactive' | 'suspended'
  monthlyBudget: number
  tags: string[]
  portalSettings?: {
    primaryColor?: string
    secondaryColor?: string
    logo?: string
  }
  googleAds?: {
    connected: boolean
    lastSync?: string
  }
  facebookAds?: {
    connected: boolean
    lastSync?: string
  }
  googleAnalytics?: {
    connected: boolean
    lastSync?: string
  }
  createdAt: string
  updatedAt: string
}

export default function ClientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.clientId as string
  
  const [client, setClient] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [testingConnection, setTestingConnection] = useState<string | null>(null)
  
  // Estados para os modais
  const [googleAdsModalOpen, setGoogleAdsModalOpen] = useState(false)
  const [googleAnalyticsModalOpen, setGoogleAnalyticsModalOpen] = useState(false)
  const [facebookPixelModalOpen, setFacebookPixelModalOpen] = useState(false)
  const [facebookOAuthModalOpen, setFacebookOAuthModalOpen] = useState(false)

  useEffect(() => {
    fetchClientDetails()
  }, [clientId])

  const fetchClientDetails = async () => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar cliente')
      }
      
      setClient(data.data)
    } catch (error) {
      toast.error('Erro ao carregar detalhes do cliente')
      router.push('/admin/clients')
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async (platform: string) => {
    setTestingConnection(platform)
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/test-connections`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.results[platform]?.success) {
        toast.success(`${platform} conectado com sucesso!`)
      } else {
        toast.error(data.results[platform]?.error || `Erro ao conectar ${platform}`)
      }
      
      // Recarregar dados
      fetchClientDetails()
    } catch (error) {
      toast.error('Erro ao testar conexão')
    } finally {
      setTestingConnection(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!client) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'suspended': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getConnectionIcon = (connected: boolean) => {
    return connected ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-400" />
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/clients')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
          <Badge className={getStatusColor(client.status)}>
            {client.status}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/portal/${client.slug}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Portal
          </Button>
          <Button variant="outline">
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" className="text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orçamento Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(client.monthlyBudget)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">{client.email}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portal</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono">/portal/{client.slug}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Criado em</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          </div>

          {client.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Google Ads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Google Ads</span>
                  {getConnectionIcon(client.googleAds?.connected || false)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {client.googleAds?.connected ? (
                    <>
                      Última sincronização:{' '}
                      {client.googleAds.lastSync
                        ? new Date(client.googleAds.lastSync).toLocaleString('pt-BR')
                        : 'Nunca'}
                    </>
                  ) : (
                    'Não conectado'
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setGoogleAdsModalOpen(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  {client.googleAds?.connected && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection('google_ads')}
                      disabled={testingConnection === 'google_ads'}
                    >
                      {testingConnection === 'google_ads' ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Facebook Ads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Facebook Ads</span>
                  {getConnectionIcon(client.facebookAds?.connected || false)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {client.facebookAds?.connected ? (
                    <>
                      Última sincronização:{' '}
                      {client.facebookAds.lastSync
                        ? new Date(client.facebookAds.lastSync).toLocaleString('pt-BR')
                        : 'Nunca'}
                    </>
                  ) : (
                    'Não conectado'
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setFacebookOAuthModalOpen(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Conectar
                  </Button>
                  {client.facebookAds?.connected && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection('facebook_ads')}
                      disabled={testingConnection === 'facebook_ads'}
                    >
                      {testingConnection === 'facebook_ads' ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Google Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Google Analytics</span>
                  {getConnectionIcon(client.googleAnalytics?.connected || false)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {client.googleAnalytics?.connected ? (
                    <>
                      Última sincronização:{' '}
                      {client.googleAnalytics.lastSync
                        ? new Date(client.googleAnalytics.lastSync).toLocaleString('pt-BR')
                        : 'Nunca'}
                    </>
                  ) : (
                    'Não conectado'
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setGoogleAnalyticsModalOpen(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  {client.googleAnalytics?.connected && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection('google_analytics')}
                      disabled={testingConnection === 'google_analytics'}
                    >
                      {testingConnection === 'google_analytics' ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Cor Primária</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: client.portalSettings?.primaryColor || '#3B82F6' }}
                    />
                    <span className="text-sm font-mono">
                      {client.portalSettings?.primaryColor || '#3B82F6'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Cor Secundária</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: client.portalSettings?.secondaryColor || '#8B5CF6' }}
                    />
                    <span className="text-sm font-mono">
                      {client.portalSettings?.secondaryColor || '#8B5CF6'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nenhuma atividade registrada ainda.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals de Configuração */}
      <GoogleAdsModal
        isOpen={googleAdsModalOpen}
        onClose={() => setGoogleAdsModalOpen(false)}
        clientId={clientId}
        clientSlug={client.slug}
        onSuccess={fetchClientDetails}
      />

      <GoogleAnalyticsModal
        isOpen={googleAnalyticsModalOpen}
        onClose={() => setGoogleAnalyticsModalOpen(false)}
        clientId={clientId}
        clientSlug={client.slug}
        onSuccess={fetchClientDetails}
      />

      <FacebookPixelModal
        isOpen={facebookPixelModalOpen}
        onClose={() => setFacebookPixelModalOpen(false)}
        clientId={clientId}
        onSuccess={fetchClientDetails}
      />

      <FacebookOAuthModal
        isOpen={facebookOAuthModalOpen}
        onClose={() => setFacebookOAuthModalOpen(false)}
        clientId={clientId}
        clientSlug={client.slug}
        onSuccess={fetchClientDetails}
      />
    </div>
  )
}