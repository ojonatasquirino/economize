"use client"

import { DollarSign, TrendingUp, CreditCard, ShoppingCart, Shield, FileText, Home, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const menuItems = [
  { id: "overview", label: "Visão Geral", icon: Home },
  { id: "entries", label: "Entradas", icon: TrendingUp },
  { id: "fixed-expenses", label: "Gastos Fixos", icon: CreditCard },
  { id: "daily-expenses", label: "Gastos Diários", icon: ShoppingCart },
  { id: "emergency-fund", label: "Reserva", icon: Shield },
  { id: "reports", label: "Relatórios", icon: FileText },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <div className="w-64 bg-black border-r border-white/10 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <DollarSign className="w-8 h-8 text-white" />
        <div>
          <h1 className="text-lg font-semibold text-white">Economize $</h1>
          <p className="text-xs text-white/60">Gestão financeira completa</p>
        </div>
      </div>

      {user && (
        <div className="mb-6 p-3 bg-white/5 rounded-lg">
          <p className="text-sm text-white/60">Bem-vindo,</p>
          <p className="text-white font-medium">{user.name}</p>
        </div>
      )}

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeSection === item.id ? "bg-white text-black" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  )
}
