"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"
import { useFinancial } from "./financial-context"

export function Overview() {
  const { data } = useFinancial()

  const monthlyIncome = data.entries
    .filter((entry) => entry.recurring === "Mensal")
    .reduce((sum, entry) => sum + entry.amount, 0)

  const monthlyExpenses = data.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const dailyExpensesThisMonth = data.dailyExpenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date)
      const now = new Date()
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const totalMonthlyExpenses = monthlyExpenses + dailyExpensesThisMonth
  const savedAmount = monthlyIncome - totalMonthlyExpenses
  const savedPercentage = monthlyIncome > 0 ? (savedAmount / monthlyIncome) * 100 : 0
  const savingsGoal = 30

  const balanceChange = savedAmount
  const isPositive = balanceChange > 0

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6">Visão Geral</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-white/40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {data.currentBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {isPositive ? "+" : ""}R$ {balanceChange.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} este mês
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Entradas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50">
              {monthlyIncome === 0 ? "Adicione suas primeiras entradas" : "Salário + rendas extras"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Saídas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {totalMonthlyExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50">
              {totalMonthlyExpenses === 0 ? "Registre seus gastos" : "Gastos fixos + variáveis"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Meta de Economia</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{savedPercentage.toFixed(1)}%</div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((savedPercentage / savingsGoal) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-white/50 mt-1">
              {monthlyIncome === 0 ? "Comece adicionando suas rendas" : `Meta: ${savingsGoal}%`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
