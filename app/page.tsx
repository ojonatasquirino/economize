"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Overview } from "@/components/overview"
import { Charts } from "@/components/charts"
import { Strategy } from "@/components/strategy"
import { Entries } from "@/components/entries"
import { FixedExpenses } from "@/components/fixed-expenses"
import { DailyExpenses } from "@/components/daily-expenses"
import { EmergencyFund } from "@/components/emergency-fund"
import { Reports } from "@/components/reports"
import { CollapsibleSection } from "@/components/collapsible-section"
import { FinancialProvider } from "@/components/financial-context"
import { AuthProvider, useAuth } from "@/components/auth-context"
import { LoginForm } from "@/components/login-form"
import { BarChart3, Target, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

function DashboardContent() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  if (!user) {
    return <LoginForm />
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <Overview />

            {isMobile ? (
              <>
                <CollapsibleSection
                  title="Análise Financeira Dinâmica"
                  icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                  defaultExpanded={false}
                >
                  <Charts />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Estratégia e Previsibilidade"
                  icon={<Target className="w-5 h-5 text-green-400" />}
                  defaultExpanded={false}
                >
                  <Strategy />
                </CollapsibleSection>
              </>
            ) : (
              <>
                <Charts />
                <Strategy />
              </>
            )}
          </div>
        )
      case "entries":
        return <Entries />
      case "fixed-expenses":
        return <FixedExpenses />
      case "daily-expenses":
        return <DailyExpenses />
      case "emergency-fund":
        return <EmergencyFund />
      case "reports":
        return <Reports />
      default:
        return (
          <div className="space-y-6">
            <Overview />

            {isMobile ? (
              <>
                <CollapsibleSection
                  title="Análise Financeira Dinâmica"
                  icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                  defaultExpanded={false}
                >
                  <Charts />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Estratégia e Previsibilidade"
                  icon={<Target className="w-5 h-5 text-green-400" />}
                  defaultExpanded={false}
                >
                  <Strategy />
                </CollapsibleSection>
              </>
            ) : (
              <>
                <Charts />
                <Strategy />
              </>
            )}
          </div>
        )
    }
  }

  return (
    <FinancialProvider>
      <div className="flex min-h-screen bg-black">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        )}

        {/* Sidebar */}
        <div
          className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out" : "relative"}
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
        `}
        >
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className={`flex-1 p-4 lg:p-8 ${isMobile ? "ml-0" : ""}`}>
          <div className={`max-w-7xl mx-auto ${isMobile ? "mt-16" : ""}`}>{renderContent()}</div>
        </main>
      </div>
    </FinancialProvider>
  )
}

export default function Dashboard() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}
