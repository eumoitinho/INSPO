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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Facebook, Loader2, CheckCircle2, Info } from "lucide-react"
import { toast } from "sonner"

interface FacebookOAuthModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  clientSlug: string
  onSuccess: () => void
}

export function FacebookOAuthModal({ isOpen, onClose, clientId, clientSlug, onSuccess }: FacebookOAuthModalProps) {
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      // Chamar a rota de OAuth do Facebook
      const response = await fetch(`/api/auth/facebook-ads?clientSlug=${clientSlug}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao conectar com Facebook")
      }

      // Redirecionar para o Facebook OAuth
      if (data.authUrl) {
        window.location.href = data.authUrl
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao conectar com Facebook")
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Conectar com Facebook</DialogTitle>
          <DialogDescription>
            Conecte sua conta do Facebook Business para sincronizar dados automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!connected ? (
            <>
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-blue-100 p-4">
                  <Facebook className="h-12 w-12 text-blue-600" />
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ao conectar, você autoriza o acesso aos seguintes dados:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Pixel ID e eventos de conversão</li>
                    <li>• Dados de campanhas e anúncios</li>
                    <li>• Métricas de performance</li>
                    <li>• Informações da conta de anúncios</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  A conexão é segura e você pode revogá-la a qualquer momento nas configurações do Facebook Business.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Conectado com sucesso!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sua conta do Facebook foi conectada. Os dados serão sincronizados automaticamente.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!connected ? (
            <>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleConnect} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Facebook className="mr-2 h-4 w-4" />
                    Conectar com Facebook
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}