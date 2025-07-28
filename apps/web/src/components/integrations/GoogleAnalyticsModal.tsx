"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ExternalLink, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface GoogleAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  clientSlug: string
  onSuccess: () => void
}

export function GoogleAnalyticsModal({ isOpen, onClose, clientId, clientSlug, onSuccess }: GoogleAnalyticsModalProps) {
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    property_id: "",
    client_id: "",
    client_secret: "",
    refresh_token: ""
  })

  const handleOAuthConnect = async () => {
    // Inicia o fluxo OAuth
    const authUrl = `/api/auth/google-analytics?clientSlug=${clientSlug}`
    window.location.href = authUrl
  }

  const handleManualSave = async () => {
    if (!credentials.property_id) {
      toast.error("Property ID é obrigatório")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: "google_analytics",
          credentials
        })
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar credenciais")
      }

      toast.success("Google Analytics configurado com sucesso!")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error("Erro ao salvar credenciais")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configurar Google Analytics</DialogTitle>
          <DialogDescription>
            Conecte sua propriedade do Google Analytics 4 para visualizar métricas de tráfego.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Opção 1: OAuth (Recomendado) */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Opção 1: Conectar com Google (Recomendado)</h3>
            <Button 
              onClick={handleOAuthConnect}
              className="w-full"
              variant="outline"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-4 h-4 mr-2"
              />
              Conectar com Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          {/* Opção 2: Configuração Manual */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Opção 2: Configuração Manual</h3>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Para encontrar o Property ID, acesse{" "}
                <a 
                  href="https://analytics.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center"
                >
                  Google Analytics
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                {" "}→ Administrador → Propriedade → Detalhes da propriedade
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="property_id">Property ID (ex: 123456789)</Label>
                <Input
                  id="property_id"
                  placeholder="123456789"
                  value={credentials.property_id}
                  onChange={(e) => setCredentials({ ...credentials, property_id: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ga_client_id">Client ID (OAuth) - Opcional</Label>
                <Input
                  id="ga_client_id"
                  placeholder="xxxxx.apps.googleusercontent.com"
                  value={credentials.client_id}
                  onChange={(e) => setCredentials({ ...credentials, client_id: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ga_client_secret">Client Secret - Opcional</Label>
                <Input
                  id="ga_client_secret"
                  type="password"
                  placeholder="Seu client secret"
                  value={credentials.client_secret}
                  onChange={(e) => setCredentials({ ...credentials, client_secret: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ga_refresh_token">Refresh Token - Opcional</Label>
                <Input
                  id="ga_refresh_token"
                  type="password"
                  placeholder="Seu refresh token"
                  value={credentials.refresh_token}
                  onChange={(e) => setCredentials({ ...credentials, refresh_token: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleManualSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Configuração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}