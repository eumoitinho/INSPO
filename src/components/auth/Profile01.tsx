"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings } from "lucide-react"

interface ProfileProps {
  avatar: string
}

export default function Profile01({ avatar }: ProfileProps) {
  return (
    <div className="p-2">
      <div className="flex items-center gap-3 p-2 mb-2">
        <Image src={avatar || "/placeholder.svg"} alt="User avatar" width={40} height={40} className="rounded-full" />
        <div>
          <p className="font-semibold text-sm text-foreground">Lucas Favoretto</p>
          <p className="text-xs text-muted-foreground">lucas@ninetwodigital.com.br</p>
        </div>
      </div>
      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start font-normal">
          <User className="mr-2 h-4 w-4" />
          Minha Conta
        </Button>
        <Button variant="ghost" className="w-full justify-start font-normal">
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
