"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Shield, Target, TrendingUp, Calendar, Minus, History } from "lucide-react"
import { useFinancial } from "./financial-context"

export function EmergencyFund() {
  const { data, addToEmergencyFund, withdrawFromEmergencyFund } = useFinancial()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [addAmount, setAddAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawReason, setWithdrawReason] = useState("")

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (addAmount && Number.parseFloat(addAmount) > 0) {
      addToEmergencyFund(Number.parseFloat(addAmount))
      setAddAmount("")
      setIsAddOpen(false)
    }
  }

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(withdrawAmount)
    if (amount > 0 && amount <= data.emergencyFund && withdrawReason.trim()) {
      withdrawFromEmergencyFund(amount, withdrawReason.trim())
      setWithdrawAmount("")
      setWithdrawReason("")
      setIsWithdrawOpen(false)
    }
  }

  const monthlyExpenses = data.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const targetMonths = 6
  const targetAmount = monthlyExpenses * targetMonths
  const progressPercentage = targetAmount > 0 ? (data.emergencyFund / targetAmount) * 100 : 0
  const remainingAmount = Math.max(0, targetAmount - data.emergencyFund)
  const monthlyContribution = 800.0
  const monthsToTarget = monthlyContribution > 0 ? Math.ceil(remainingAmount / monthlyContribution) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Reserva de Emergência</h2>
          <p className="text-white/60">Construa sua segurança financeira</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white text-black hover:bg-white/90">
                <TrendingUp className="w-4 h-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar à Reserva de Emergência</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="add-amount" className="text-white">
                    Valor (R$)
                  </Label>
                  <Input
                    id="add-amount"
                    type="number"
                    step="0.01"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="0,00"
                    className="bg-black border-white/10 text-white"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
                  Adicionar à Reserva
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10 bg-transparent">
                <Minus className="w-4 h-4" />
                Resgatar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Resgatar da Reserva de Emergência</DialogTitle>
                <p className="text-white/60 text-sm">
                  Disponível: R$ {data.emergencyFund.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </DialogHeader>
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-amount" className="text-white">
                    Valor a Resgatar (R$)
                  </Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    step="0.01"
                    max={data.emergencyFund}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0,00"
                    className="bg-black border-white/10 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="withdraw-reason" className="text-white">
                    Motivo do Resgate *
                  </Label>
                  <Textarea
                    id="withdraw-reason"
                    value={withdrawReason}
                    onChange={(e) => setWithdrawReason(e.target.value)}
                    placeholder="Ex: Emergência médica, perda de emprego, reparo urgente..."
                    className="bg-black border-white/10 text-white placeholder:text-white/40"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setWithdrawAmount(data.emergencyFund.toString())}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    Resgatar Tudo
                  </Button>
                  <Button type="submit" className="flex-1 bg-red-600 text-white hover:bg-red-700">
                    Confirmar Resgate
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Valor Atual</CardTitle>
            <Shield className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {data.emergencyFund.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Meta (6 meses)</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {targetAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50">
              {monthlyExpenses === 0 ? "Cadastre gastos para calcular" : "Baseado nos gastos fixos"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Faltam</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {remainingAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Tempo Restante</CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{monthsToTarget} meses</div>
            <p className="text-xs text-white/50">Com R$ 800/mês</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Progresso da Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Progresso atual</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-medium text-white mb-3">Simulação de Crescimento</h4>
              <div className="space-y-2 text-sm">
                {monthlyExpenses > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-white/70">Em 3 meses:</span>
                      <span className="font-medium text-white">
                        R$ {(data.emergencyFund + monthlyContribution * 3).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Em 6 meses:</span>
                      <span className="font-medium text-white">
                        R$ {(data.emergencyFund + monthlyContribution * 6).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Em 1 ano:</span>
                      <span className="font-medium text-white">
                        R$ {(data.emergencyFund + monthlyContribution * 12).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-white/70">Cadastre seus gastos mensais</span>
                    <span className="font-medium text-white/40">para ver simulações</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3">Equivalência em Meses</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Valor atual cobre:</span>
                  <span className="font-medium text-white">
                    {monthlyExpenses > 0 ? (data.emergencyFund / monthlyExpenses).toFixed(1) : "0"} meses
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Meta desejada:</span>
                  <span className="font-medium text-white">{targetMonths} meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Proteção atual:</span>
                  <span className="font-medium text-green-400">
                    {progressPercentage > 100 ? "Completa" : `${progressPercentage.toFixed(0)}%`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Resgates */}
      {data.emergencyWithdrawals.length > 0 && (
        <Card className="bg-black border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Resgates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.emergencyWithdrawals
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((withdrawal) => (
                  <div key={withdrawal.id} className="p-4 border border-white/10 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive" className="bg-red-400/10 text-red-400">
                            Resgate
                          </Badge>
                          <span className="text-sm text-white/60">
                            {new Date(withdrawal.date).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-white text-sm mb-1">{withdrawal.reason}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-red-400">
                          - R$ {withdrawal.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Dicas para Acelerar sua Reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Automatize sua poupança</p>
                <p className="text-xs text-white/50">Configure uma transferência automática no dia do salário</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Use rendas extras</p>
                <p className="text-xs text-white/50">Direcione 100% dos freelances para a reserva</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Revise gastos desnecessários</p>
                <p className="text-xs text-white/50">Cada R$ 50 economizados aceleram sua meta em 2 semanas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
