"use client"

import type React from "react"

import {
  Home,
  Users2,
  TrendingUp,
  BrainCircuit,
  FileText,
  Lightbulb,
  AlertTriangle,
  DollarSign,
  Target,
  Zap,
  History,
  Library,
  BarChart2,
  Users,
  Goal,
  Calculator,
  Plug,
  Wand2,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: any
    children: React.ReactNode
  }) {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
          isActive
            ? "bg-gray-100 dark:bg-[#1F1F23] text-gray-900 dark:text-white font-semibold"
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]",
        )}
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
              fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
              lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
              ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/dashboard"
            className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
          >
            <div className="flex items-center gap-3">
              <Image
                src="https://kokonutui.com/logo.svg"
                alt="Acme"
                width={32}
                height={32}
                className="flex-shrink-0 hidden dark:block"
              />
              <Image
                src="https://kokonutui.com/logo-black.svg"
                alt="Acme"
                width={32}
                height={32}
                className="flex-shrink-0 block dark:hidden"
              />
              <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                KokonutUI
              </span>
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-4">
              {/* Geral */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Geral
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/dashboard" icon={Home}>
                    Início
                  </NavItem>
                  <NavItem href="/admin/clientes" icon={Users2}>
                    Clientes
                  </NavItem>
                </div>
              </div>

              {/* Performance */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Performance
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/performance" icon={TrendingUp}>
                    Visão Geral
                  </NavItem>
                </div>
              </div>

              {/* Análise */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Análise
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/analise/ia" icon={BrainCircuit}>
                    Two IA
                  </NavItem>
                  <NavItem href="/admin/relatorios" icon={FileText}>
                    Relatórios
                  </NavItem>
                </div>
              </div>

              {/* Separator */}
              <div className="pt-2" />

              {/* Otimização */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Otimização
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/otimizacao" icon={Lightbulb}>
                    Recomendações
                  </NavItem>
                  <NavItem href="/admin/alertas" icon={AlertTriangle}>
                    Alertas
                  </NavItem>
                </div>
              </div>

              {/* Financeiro */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Financeiro
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/financeiro" icon={DollarSign}>
                    Investimentos
                  </NavItem>
                  <NavItem href="/admin/roi" icon={Target}>
                    ROI
                  </NavItem>
                </div>
              </div>

              {/* Campanhas */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Campanhas
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/campanhas" icon={Zap}>
                    Ativas
                  </NavItem>
                  <NavItem href="/admin/historico" icon={History}>
                    Histórico
                  </NavItem>
                </div>
              </div>

              {/* Separator */}
              <div className="pt-2" />

              {/* Criativos */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Criativos
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/biblioteca" icon={Library}>
                    Biblioteca
                  </NavItem>
                  <NavItem href="/admin/performance_criativos" icon={BarChart2}>
                    Performance
                  </NavItem>
                </div>
              </div>

              {/* Agência */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Agência
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/equipe" icon={Users}>
                    Equipe
                  </NavItem>
                  <NavItem href="/admin/metas" icon={Goal}>
                    Metas
                  </NavItem>
                </div>
              </div>

              {/* Ferramentas */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Ferramentas
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin/calculadoras" icon={Calculator}>
                    Calculadoras
                  </NavItem>
                  <NavItem href="/admin/integracoes" icon={Plug}>
                    Integrações
                  </NavItem>
                  <NavItem href="/admin/automacoes" icon={Wand2}>
                    Automações
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="/admin/configuracoes" icon={Settings}>
                Configurações
              </NavItem>
              <NavItem href="/admin/help" icon={HelpCircle}>
                Help
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
