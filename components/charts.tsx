"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Bar,
} from "recharts"
import { useFinancial } from "./financial-context"

export function Charts() {
  const { data } = useFinancial()

  // Calculate monthly data with more realistic progression
  const monthlyIncome = data.entries.filter((e) => e.recurring === "Mensal").reduce((sum, e) => sum + e.amount, 0)
  const monthlyFixedExpenses = data.fixedExpenses.reduce((sum, e) => sum + e.amount, 0)

  // Create more dynamic data with curves and trends
  const monthlyData = [
    {
      month: "Jan",
      entradas: monthlyIncome * 0.8,
      saidas: monthlyFixedExpenses * 0.9,
      saldo: data.currentBalance * 0.6,
    },
    {
      month: "Fev",
      entradas: monthlyIncome * 0.85,
      saidas: monthlyFixedExpenses * 0.95,
      saldo: data.currentBalance * 0.7,
    },
    {
      month: "Mar",
      entradas: monthlyIncome * 0.9,
      saidas: monthlyFixedExpenses * 1.1,
      saldo: data.currentBalance * 0.8,
    },
    {
      month: "Abr",
      entradas: monthlyIncome * 0.95,
      saidas: monthlyFixedExpenses * 1.05,
      saldo: data.currentBalance * 0.9,
    },
    {
      month: "Mai",
      entradas: monthlyIncome,
      saidas: monthlyFixedExpenses,
      saldo: data.currentBalance,
    },
    {
      month: "Jun",
      entradas: monthlyIncome * 1.05,
      saidas: monthlyFixedExpenses * 0.98,
      saldo: data.currentBalance * 1.1,
    },
  ]

  // Balance evolution with emergency fund correlation
  const balanceEvolution = [
    {
      month: "Jan",
      saldo: data.currentBalance * 0.5,
      reserva: data.emergencyFund * 0.3,
      projecao: data.currentBalance * 0.6,
    },
    {
      month: "Fev",
      saldo: data.currentBalance * 0.65,
      reserva: data.emergencyFund * 0.5,
      projecao: data.currentBalance * 0.75,
    },
    {
      month: "Mar",
      saldo: data.currentBalance * 0.75,
      reserva: data.emergencyFund * 0.7,
      projecao: data.currentBalance * 0.85,
    },
    {
      month: "Abr",
      saldo: data.currentBalance * 0.85,
      reserva: data.emergencyFund * 0.85,
      projecao: data.currentBalance * 0.95,
    },
    {
      month: "Mai",
      saldo: data.currentBalance,
      reserva: data.emergencyFund,
      projecao: data.currentBalance,
    },
    {
      month: "Jun",
      saldo: data.currentBalance * 1.15,
      reserva: data.emergencyFund * 1.2,
      projecao: data.currentBalance * 1.25,
    },
  ]

  // Performance metrics over time
  const performanceData = [
    {
      month: "Jan",
      economia: (monthlyIncome - monthlyFixedExpenses) * 0.6,
      meta: monthlyIncome * 0.25,
      eficiencia: 65,
    },
    {
      month: "Fev",
      economia: (monthlyIncome - monthlyFixedExpenses) * 0.7,
      meta: monthlyIncome * 0.25,
      eficiencia: 72,
    },
    {
      month: "Mar",
      economia: (monthlyIncome - monthlyFixedExpenses) * 0.8,
      meta: monthlyIncome * 0.25,
      eficiencia: 78,
    },
    {
      month: "Abr",
      economia: (monthlyIncome - monthlyFixedExpenses) * 0.9,
      meta: monthlyIncome * 0.25,
      eficiencia: 85,
    },
    {
      month: "Mai",
      economia: monthlyIncome - monthlyFixedExpenses,
      meta: monthlyIncome * 0.25,
      eficiencia: 92,
    },
    {
      month: "Jun",
      economia: (monthlyIncome - monthlyFixedExpenses) * 1.1,
      meta: monthlyIncome * 0.25,
      eficiencia: 95,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fluxo de Caixa com Área */}
        <Card className="bg-black border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Fluxo de Caixa</CardTitle>
            <p className="text-sm text-white/60">Entradas vs Saídas com tendência</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip
                  formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`}
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff20", color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="entradas"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#colorEntradas)"
                  name="Entradas"
                />
                <Area
                  type="monotone"
                  dataKey="saidas"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#colorSaidas)"
                  name="Saídas"
                />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="Saldo Líquido"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance e Eficiência */}
        <Card className="bg-black border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Performance Financeira</CardTitle>
            <p className="text-sm text-white/60">Economia vs Meta com eficiência</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={performanceData}>
                <defs>
                  <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff70" />
                <YAxis yAxisId="left" stroke="#ffffff70" />
                <YAxis yAxisId="right" orientation="right" stroke="#ffffff70" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Eficiência") return [`${value}%`, name]
                    return [`R$ ${Number(value).toLocaleString("pt-BR")}`, name]
                  }}
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff20", color: "#fff" }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="economia"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill="url(#colorEconomia)"
                  name="Economia Real"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="meta"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  name="Meta"
                />
                <Bar yAxisId="right" dataKey="eficiencia" fill="#06D6A0" fillOpacity={0.6} name="Eficiência" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Evolução Patrimonial Completa */}
      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Evolução Patrimonial</CardTitle>
          <p className="text-sm text-white/60">Saldo, reserva e projeções futuras</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={balanceEvolution}>
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorReserva" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff70" />
              <YAxis stroke="#ffffff70" />
              <Tooltip
                formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`}
                contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff20", color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="saldo"
                stackId="1"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorSaldo)"
                name="Saldo Atual"
              />
              <Area
                type="monotone"
                dataKey="reserva"
                stackId="2"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorReserva)"
                name="Reserva de Emergência"
              />
              <Line
                type="monotone"
                dataKey="projecao"
                stroke="#F59E0B"
                strokeWidth={3}
                strokeDasharray="10 5"
                name="Projeção"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
