"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, TrendingUp, AlertCircle, CheckCircle, CreditCard, ShoppingCart, Target, Shield } from "lucide-react"
import { useFinancial } from "./financial-context"

export function Reports() {
  const { data } = useFinancial()

  const monthlyIncome = data.entries.filter((e) => e.recurring === "Mensal").reduce((sum, e) => sum + e.amount, 0)
  const monthlyExpenses = data.fixedExpenses.reduce((sum, e) => sum + e.amount, 0)
  const dailyExpensesTotal = data.dailyExpenses.reduce((sum, e) => sum + e.amount, 0)
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0

  const insights = [
    {
      id: 1,
      type: "info",
      title: "Bem-vindo ao Economize $!",
      description: "Comece adicionando suas entradas e gastos para receber insights personalizados.",
      impact: "Início",
      suggestion: "Vá para a seção 'Entradas' e cadastre suas fontes de renda.",
    },
    {
      id: 2,
      type: "info",
      title: "Configure seus gastos fixos",
      description: "Adicione aluguel, financiamentos e contas mensais para ter controle total.",
      impact: "Configuração",
      suggestion: "Acesse 'Gastos Fixos' e cadastre suas despesas recorrentes.",
    },
    {
      id: 3,
      type: "info",
      title: "Registre gastos diários",
      description: "Acompanhe seus gastos variáveis para identificar oportunidades de economia.",
      impact: "Controle",
      suggestion: "Use 'Gastos Diários' para registrar compras e despesas do dia a dia.",
    },
  ]

  if (monthlyIncome > 0 && savingsRate > 25) {
    insights.push({
      id: 4,
      type: "success",
      title: "Excelente taxa de economia!",
      description: `Você está economizando ${savingsRate.toFixed(1)}% da sua renda mensal.`,
      impact: "Positivo",
      suggestion: "Continue assim! Considere investir o excedente.",
    })
  }

  const monthlyComparison = []

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange-400" />
      case "info":
        return <TrendingUp className="w-5 h-5 text-blue-400" />
      default:
        return <FileText className="w-5 h-5 text-white/40" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-400/10 border-green-400/20"
      case "warning":
        return "bg-orange-400/10 border-orange-400/20"
      case "info":
        return "bg-blue-400/10 border-blue-400/20"
      default:
        return "bg-white/5 border-white/10"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Relatórios e Insights</h2>
        <p className="text-white/60">Análises inteligentes do seu comportamento financeiro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Score Financeiro</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {monthlyIncome > 0 ? (savingsRate > 25 ? "8.5" : savingsRate > 15 ? "7.0" : "5.5") : "-"}
            </div>
            <p className="text-xs text-white/50">
              {monthlyIncome > 0 ? "Baseado na taxa de economia" : "Adicione dados primeiro"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Taxa de Economia</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {monthlyIncome > 0 ? `${savingsRate.toFixed(1)}%` : "-"}
            </div>
            <p className="text-xs text-white/50">{monthlyIncome > 0 ? "Da renda mensal" : "Adicione dados primeiro"}</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Insights Ativos</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{insights.length}</div>
            <p className="text-xs text-white/50">Recomendações</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Comparativo Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyComparison.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum dado para comparar</h3>
              <p className="text-white/50">Adicione entradas e gastos para ver comparativos mensais</p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyComparison.map((month, index) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between p-4 border border-white/10 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{month.month}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                      <span>Renda: R$ {month.income.toLocaleString("pt-BR")}</span>
                      <span>Gastos: R$ {month.expenses.toLocaleString("pt-BR")}</span>
                      <span>Economia: R$ {month.savings.toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        month.savingsRate > 25 ? "default" : month.savingsRate > 15 ? "secondary" : "destructive"
                      }
                      className="bg-white/10 text-white"
                    >
                      {month.savingsRate.toFixed(1)}%
                    </Badge>
                    {index === 0 && (
                      <div className="flex items-center text-xs text-green-400 mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Mês atual
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Insights Personalizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}>
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-white">{insight.title}</h3>
                      <Badge variant="outline" className="text-xs border-white/20 text-white">
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/80 mb-2">{insight.description}</p>
                    <p className="text-xs text-white/60 font-medium">💡 {insight.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">
                  {monthlyIncome > 0 ? "Pontos Fortes" : "Primeiros Passos"}
                </h4>
                <div className="space-y-2">
                  {monthlyIncome > 0 ? (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white">Renda cadastrada</span>
                      </div>
                      {data.fixedExpenses.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-white">Gastos fixos organizados</span>
                        </div>
                      )}
                      {data.emergencyFund > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-white">Reserva de emergência iniciada</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-white">Cadastre suas fontes de renda</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-blue-400" />
                        <span className="text-white">Adicione gastos fixos mensais</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ShoppingCart className="w-4 h-4 text-blue-400" />
                        <span className="text-white">Registre gastos diários</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Próximos Objetivos</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-white">
                      {monthlyIncome > 0 ? "Manter taxa de economia acima de 25%" : "Definir meta de economia"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white">
                      {data.emergencyFund > 0 ? "Completar reserva de emergência" : "Construir reserva de emergência"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-white">{savingsRate > 25 ? "Começar a investir" : "Otimizar gastos"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
