"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Bell,
  Home,
  Users2,
  TrendingUp,
  BrainCircuit,
  FileText,
  Lightbulb,
  DollarSign,
  Zap,
  Settings,
  Search,
  AlertTriangle,
  Target,
  History,
  Library,
  BarChart2,
  Users,
  Goal,
  Calculator,
  Plug,
  Wand2,
  HelpCircle,
} from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Profile01 from "../components/auth/Profile01"
import { ThemeToggle } from "../helper/ThemeToggleButton"

const pageConfig: { [key: string]: { title: string; icon: React.ElementType } } = {
  "/admin/dashboard": { title: "INÍCIO", icon: Home },
  "/admin/clients": { title: "CLIENTES", icon: Users2 },
  "/admin/performance": { title: "PERFORMANCE - VISÃO GERAL", icon: TrendingUp },
  "/admin/analise/ia": { title: "TWO IA", icon: BrainCircuit },
  "/admin/relatorios": { title: "RELATÓRIOS", icon: FileText },
  "/admin/otimizacao": { title: "OTIMIZAÇÃO - RECOMENDAÇÕES", icon: Lightbulb },
  "/admin/alertas": { title: "OTIMIZAÇÃO - ALERTAS", icon: AlertTriangle },
  "/admin/financeiro": { title: "FINANCEIRO - INVESTIMENTOS", icon: DollarSign },
  "/admin/roi": { title: "FINANCEIRO - ROI", icon: Target },
  "/admin/campanhas": { title: "CAMPANHAS - ATIVAS", icon: Zap },
  "/admin/historico": { title: "CAMPANHAS - HISTÓRICO", icon: History },
  "/admin/biblioteca": { title: "CRIATIVOS - BIBLIOTECA", icon: Library },
  "/admin/performance_criativos": { title: "CRIATIVOS - PERFORMANCE", icon: BarChart2 },
  "/admin/equipe": { title: "AGÊNCIA - EQUIPE", icon: Users },
  "/admin/metas": { title: "AGÊNCIA - METAS", icon: Goal },
  "/admin/calculadoras": { title: "FERRAMENTAS - CALCULADORAS", icon: Calculator },
  "/admin/integracoes": { title: "FERRAMENTAS - INTEGRAÇÕES", icon: Plug },
  "/admin/automacoes": { title: "FERRAMENTAS - AUTOMAÇÕES", icon: Wand2 },
  "/admin/configuracoes": { title: "CONFIGURAÇÕES", icon: Settings },
  "/admin/help": { title: "HELP", icon: HelpCircle },
}

export default function TopNav() {
  const pathname = usePathname()
  let currentConfig = pageConfig[pathname] || { title: "NINETWODASH", icon: Home }

  if (pathname.startsWith("/portal/")) {
    // TODO: Fetch client name dynamically
    const clientName = pathname.split("/")[2].replace(/-/g, " ").toUpperCase()
    currentConfig = { title: clientName, icon: Users2 }
  }

  const PageIcon = currentConfig.icon

  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23] h-full">
      <div className="font-medium text-sm hidden sm:flex items-center space-x-1 truncate max-w-[400px]">
        <div className="flex items-center gap-2">
          <PageIcon className="h-4 w-4 text-gray-900 dark:text-gray-100" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">{currentConfig.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-8 sm:w-[200px] lg:w-[300px] bg-gray-50 dark:bg-[#1F1F23]"
          />
        </div>
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
        </button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
              alt="User avatar"
              width={28}
              height={28}
              className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-8 sm:h-8 cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-background border-border rounded-lg shadow-lg"
          >
            <Profile01 avatar="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
