"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Settings,
  User,
  Shield,
  Palette,
  Bell,
  Save,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import MasterLayout from "../../../../masterLayout/MasterLayout"

interface ClientSettings {
  _id: string
  name: string
  email: string
  slug: string
  status: 'active' | 'pending' | 'inactive'
  monthlyBudget: number
  avatar?: string
  tags?: string[]
  googleAds: {
    connected: boolean
    customerId?: string
    lastSync?: string
  }
  facebookAds: {
    connected: boolean
    adAccountId?: string
    lastSync?: string
  }
  googleAnalytics: {
    connected: boolean
    propertyId?: string
    lastSync?: string
  }
  portalSettings?: {
    primaryColor?: string
    secondaryColor?: string
    allowedSections?: string[]
    notifications?: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
}

interface ConfiguracoesPageProps {
  params: { client: string }
}

const SettingSection = ({ title, children, icon: Icon }: { 
  title: string
  children: React.ReactNode
  icon: any
}) => (
  <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <CardTitle className="text-gray-900 dark:text-white">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
)

export default function ConfiguracoesPage({ params }: ConfiguracoesPageProps) {
  const [settings, setSettings] = useState<ClientSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [params.client])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/clients/${params.client}`)
      const data = await response.json()
      
      if (response.ok) {
        setSettings(data.data)
      } else {
        throw new Error(data.message || 'Erro ao carregar configurações')
      }
    } catch (err) {
      setError('Erro ao carregar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    
    try {
      setIsSaving(true)
      setSaveSuccess(false)
      
      const response = await fetch(`/api/admin/clients/${params.client}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      
      if (response.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        throw new Error('Erro ao salvar configurações')
      }
    } catch (err) {
      setError('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (path: string, value: any) => {
    if (!settings) return
    
    const keys = path.split('.')
    const newSettings = { ...settings }
    let current: any = newSettings
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setSettings(newSettings)
  }

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
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'pending':
        return 'Pendente'
      case 'inactive':
        return 'Inativo'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <MasterLayout>
        <div className="text-center py-10">Carregando configurações...</div>
      </MasterLayout>
    )
  }

  if (error || !settings) {
    return (
      <MasterLayout>
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Erro ao carregar configurações
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </MasterLayout>
    )
  }

  return (
    <MasterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Configurações - {settings.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gerencie as configurações do seu portal
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Salvo!</span>
              </div>
            )}
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Informações Básicas */}
          <SettingSection title="Informações Básicas" icon={User}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Cliente
                </label>
                <Input
                  value={settings.name}
                  onChange={(e) => updateSetting('name', e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug
                </label>
                <Input
                  value={settings.slug}
                  onChange={(e) => updateSetting('slug', e.target.value)}
                  placeholder="slug-do-cliente"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <Badge className={getStatusColor(settings.status)}>
                  {getStatusLabel(settings.status)}
                </Badge>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Orçamento Mensal
                </label>
                <Input
                  type="number"
                  value={settings.monthlyBudget}
                  onChange={(e) => updateSetting('monthlyBudget', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
          </SettingSection>

          {/* Conexões */}
          <SettingSection title="Conexões" icon={Shield}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Google Ads</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {settings.googleAds.connected ? 'Conectado' : 'Desconectado'}
                  </p>
                </div>
                <Switch
                  checked={settings.googleAds.connected}
                  onCheckedChange={(checked) => updateSetting('googleAds.connected', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Facebook Ads</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {settings.facebookAds.connected ? 'Conectado' : 'Desconectado'}
                  </p>
                </div>
                <Switch
                  checked={settings.facebookAds.connected}
                  onCheckedChange={(checked) => updateSetting('facebookAds.connected', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Google Analytics</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {settings.googleAnalytics.connected ? 'Conectado' : 'Desconectado'}
                  </p>
                </div>
                <Switch
                  checked={settings.googleAnalytics.connected}
                  onCheckedChange={(checked) => updateSetting('googleAnalytics.connected', checked)}
                />
              </div>
            </div>
          </SettingSection>

          {/* Personalização */}
          <SettingSection title="Personalização" icon={Palette}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cor Primária
                </label>
                <Input
                  type="color"
                  value={settings.portalSettings?.primaryColor || '#3B82F6'}
                  onChange={(e) => updateSetting('portalSettings.primaryColor', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cor Secundária
                </label>
                <Input
                  type="color"
                  value={settings.portalSettings?.secondaryColor || '#10B981'}
                  onChange={(e) => updateSetting('portalSettings.secondaryColor', e.target.value)}
                />
              </div>
            </div>
          </SettingSection>

          {/* Notificações */}
          <SettingSection title="Notificações" icon={Bell}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receber notificações por email
                  </p>
                </div>
                <Switch
                  checked={settings.portalSettings?.notifications?.email || false}
                  onCheckedChange={(checked) => updateSetting('portalSettings.notifications.email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Push</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Notificações push no navegador
                  </p>
                </div>
                <Switch
                  checked={settings.portalSettings?.notifications?.push || false}
                  onCheckedChange={(checked) => updateSetting('portalSettings.notifications.push', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">SMS</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Notificações por SMS
                  </p>
                </div>
                <Switch
                  checked={settings.portalSettings?.notifications?.sms || false}
                  onCheckedChange={(checked) => updateSetting('portalSettings.notifications.sms', checked)}
                />
              </div>
            </div>
          </SettingSection>
        </div>
      </div>
    </MasterLayout>
  )
} 