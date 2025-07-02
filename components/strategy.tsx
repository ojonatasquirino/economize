"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, AlertTriangle, Target, Calendar } from "lucide-react"
import { useFinancial } from "./financial-context"

export function Strategy() {
  const { data } = useFinancial()

  const monthlyIncome = data.entries.filter((e) => e.recurring === "Mensal").reduce((sum, e) => sum + e.amount, 0)
  const monthlyGoal = monthlyIncome * 0.3 // 30% de economia
  const daysInMonth = 30
  const daysPassed = new Date().getDate()
  const dailyGoalRemaining = monthlyGoal > 0 ? monthlyGoal / (daysInMonth - daysPassed) : 0

  const dailyExpensesThisMonth = data.dailyExpenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date)
      const now = new Date()
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const currentDailySpending = dailyExpensesThisMonth / daysPassed
  const projectedBalance =
    data.currentBalance + (monthlyIncome - data.fixedExpenses.reduce((sum, e) => sum + e.amount, 0)) * 2

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Economia Diária Necessária</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {dailyGoalRemaining.toFixed(2)}</div>
            <p className="text-xs text-white/50">
              {monthlyIncome === 0 ? "Defina sua meta de renda primeiro" : "Para atingir meta de 30%"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Gasto Médio Diário</CardTitle>
            <Calendar className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {currentDailySpending.toFixed(2)}</div>
            <p className="text-xs text-white/50">
              {dailyExpensesThisMonth === 0 ? "Comece registrando gastos" : `Baseado em ${daysPassed} dias`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Projeção 2 Meses</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {projectedBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50">
              {monthlyIncome === 0 ? "Adicione dados para projeção" : "Mantendo padrão atual"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {currentDailySpending > dailyGoalRemaining + 50 && monthlyIncome > 0 && (
          <Alert className="bg-orange-400/10 border-orange-400/20">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-white">
              <strong>Atenção:</strong> Você está gastando R$ {(currentDailySpending - dailyGoalRemaining).toFixed(2)}
              acima da média diária recomendada. Considere revisar seus gastos variáveis.
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-black border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Insights Financeiros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyIncome === 0 ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-white">Comece definindo sua renda mensal</p>
                    <p className="text-xs text-white/50">Adicione suas fontes de renda na seção "Entradas"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-white">Registre seus gastos fixos</p>
                    <p className="text-xs text-white/50">Aluguel, financiamentos e contas mensais</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-white">Acompanhe gastos diários</p>
                    <p className="text-xs text-white/50">Registre compras e gastos variáveis para ter controle total</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-white">Renda cadastrada com sucesso</p>
                    <p className="text-xs text-white/50">
                      Renda mensal: R$ {monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-white">Continue registrando gastos</p>
                    <p className="text-xs text-white/50">Quanto mais dados, melhores insights você receberá</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-white">Construa sua reserva de emergência</p>
                    <p className="text-xs text-white/50">Meta: 6 meses de gastos essenciais</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
