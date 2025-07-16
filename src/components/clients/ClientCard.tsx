"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, Chrome, Facebook, Settings, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface ClientCardProps {
  client: Client
}

export default function ClientCard({ client }: ClientCardProps) {
  return (
    <Dialog>
      <Card className="flex flex-col bg-card">
        <CardHeader className="flex flex-row items-center gap-4">
          <Image
            src={client.avatar || "/placeholder.svg?width=48&height=48"}
            alt={client.name}
            width={48}
            height={48}
            className="rounded-lg"
          />
          <div>
            <CardTitle className="text-lg text-card-foreground">{client.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Orçamento:{" "}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(client.monthlyBudget)}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <p className="text-sm font-medium text-card-foreground">Conexões</p>
            <div className="flex items-center gap-3">
              <Facebook
                className={cn("h-5 w-5", client.facebookAds.connected ? "text-blue-600" : "text-muted-foreground/50")}
              />
              <Chrome
                className={cn("h-5 w-5", client.googleAds.connected ? "text-green-600" : "text-muted-foreground/50")}
              />
              <BarChart3
                className={cn(
                  "h-5 w-5",
                  client.googleAnalytics.connected ? "text-amber-500" : "text-muted-foreground/50",
                )}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Settings className="mr-2 h-4 w-4" />
              Gerenciar
            </Button>
          </DialogTrigger>
          <Link href={`/portal/${client.slug}/dashboard`} passHref>
            <Button asChild>
              <a>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </a>
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <DialogContent
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground"
        data-vaul-no-drag
      >
        <DialogHeader>
          <DialogTitle>Gerenciar {client.name}</DialogTitle>
          <DialogDescription>Edite o perfil e configure as integrações do seu cliente.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="conexoes">Conexões</TabsTrigger>
          </TabsList>
          <TabsContent value="perfil">
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-name" className="block">
                  Nome do Cliente
                </Label>
                <Input id="client-name" defaultValue={client.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-budget" className="block">
                  Orçamento Mensal (R$)
                </Label>
                <Input id="client-budget" type="number" defaultValue={client.monthlyBudget} />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button>Salvar Perfil</Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="conexoes">
            <div className="py-4 space-y-6">
              {/* Meta */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Meta (Facebook/Instagram)</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-ad-account" className="block">
                      ID da Conta de Anúncios
                    </Label>
                    <Input id="meta-ad-account" placeholder="Ex: 123456789012345" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-pixel" className="block">
                      ID do Pixel
                    </Label>
                    <Input id="meta-pixel" placeholder="Ex: 987654321098765" />
                  </div>
                </div>
              </div>
              {/* Google Ads */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Chrome className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold">Google Ads</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gads-id" className="block">
                    ID da Conta Google Ads (MCC ou Cliente)
                  </Label>
                  <Input id="gads-id" placeholder="Ex: 123-456-7890" />
                </div>
              </div>
              {/* Google Analytics */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                  <h4 className="font-semibold">Google Analytics</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ga-id" className="block">
                    ID da Propriedade (GA4)
                  </Label>
                  <Input id="ga-id" placeholder="Ex: G-XXXXXXXXXX" />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button>Salvar Conexões</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
