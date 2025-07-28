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
import { Loader2, ExternalLink, AlertCircle, Info } from "lucide-react"
import { toast } from "sonner"

interface FacebookPixelModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  onSuccess: () => void
}

export function FacebookPixelModal({ isOpen, onClose, clientId, onSuccess }: FacebookPixelModalProps) {
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    pixel_id: "",
    access_token: "",
    ad_account_id: "",
    app_id: "",
    app_secret: ""
  })

  const handleSave = async () => {
    if (!credentials.pixel_id || !credentials.ad_account_id) {
      toast.error("Pixel ID e Account ID são obrigatórios")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: "facebook_ads",
          credentials
        })
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar credenciais")
      }

      toast.success("Facebook Pixel configurado com sucesso!")
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
          <DialogTitle>Configurar Facebook Pixel</DialogTitle>
          <DialogDescription>
            Configure o Facebook Pixel para rastreamento de conversões.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Para obter essas informações, acesse o{" "}
              <a 
                href="https://business.facebook.com/events_manager" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                Facebook Business Manager
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pixel_id">
                Pixel ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pixel_id"
                placeholder="Ex: 1234567890123456"
                value={credentials.pixel_id}
                onChange={(e) => setCredentials({ ...credentials, pixel_id: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Encontre no Events Manager → Fontes de dados → Seu Pixel
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ad_account_id">
                Account ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ad_account_id"
                placeholder="Ex: 1234567890 (apenas números)"
                value={credentials.ad_account_id}
                onChange={(e) => setCredentials({ ...credentials, ad_account_id: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                ID da sua conta de anúncios (sem o prefixo act_)
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="access_token">
                Access Token (Opcional)
              </Label>
              <Input
                id="access_token"
                type="password"
                placeholder="Token para sincronizar dados de campanhas"
                value={credentials.access_token}
                onChange={(e) => setCredentials({ ...credentials, access_token: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Necessário apenas para importar dados de campanhas
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="app_id">
                App ID (Opcional)
              </Label>
              <Input
                id="app_id"
                placeholder="Ex: 1234567890123456"
                value={credentials.app_id}
                onChange={(e) => setCredentials({ ...credentials, app_id: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                ID do seu aplicativo no Facebook Developers
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="app_secret">
                App Secret (Opcional)
              </Label>
              <Input
                id="app_secret"
                type="password"
                placeholder="Seu app secret"
                value={credentials.app_secret}
                onChange={(e) => setCredentials({ ...credentials, app_secret: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Chave secreta do aplicativo (mantenha segura!)
              </p>
            </div>
          </div>

          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-800">
              <strong>Configuração Simples:</strong> Apenas Pixel ID e Account ID são necessários para rastreamento. 
              O Access Token é opcional e só necessário se você quiser importar dados de campanhas.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Configuração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}