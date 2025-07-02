"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ShoppingCart, Calendar, TrendingDown, Trash2, Edit } from "lucide-react"
import { useFinancial } from "./financial-context"

export function DailyExpenses() {
  const { data, addDailyExpense, deleteDailyExpense, updateDailyExpense } = useFinancial()
  const [isOpen, setIsOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Alimentação",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.description && formData.amount) {
      if (editingExpense) {
        updateDailyExpense({
          id: editingExpense.id,
          description: formData.description,
          amount: Number.parseFloat(formData.amount),
          date: formData.date,
          category: formData.category,
        })
      } else {
        addDailyExpense({
          description: formData.description,
          amount: Number.parseFloat(formData.amount),
          date: formData.date,
          category: formData.category,
        })
      }
      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "Alimentação",
      })
      setIsOpen(false)
      setEditingExpense(null)
    }
  }

  const handleEdit = (expense: any) => {
    setEditingExpense(expense)
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date,
      category: expense.category,
    })
    setIsOpen(true)
  }

  const totalDaily = data.dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const todayExpenses = data.dailyExpenses.filter((e) => e.date === new Date().toISOString().split("T")[0])
  const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const categoryColors: { [key: string]: string } = {
    Alimentação: "bg-green-400/10 text-green-400",
    Transporte: "bg-blue-400/10 text-blue-400",
    Lazer: "bg-purple-400/10 text-purple-400",
    Saúde: "bg-red-400/10 text-red-400",
    Outros: "bg-white/10 text-white",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Gastos Diários</h2>
          <p className="text-white/60">Registre e acompanhe seus gastos variáveis</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4" />
              Novo Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingExpense ? "Editar Gasto" : "Adicionar Novo Gasto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-white">
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Almoço - Restaurante"
                  className="bg-black border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-white">
                  Valor (R$)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                  className="bg-black border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-white">
                  Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-black border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-white">
                  Categoria
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-black border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="Alimentação" className="text-white">
                      Alimentação
                    </SelectItem>
                    <SelectItem value="Transporte" className="text-white">
                      Transporte
                    </SelectItem>
                    <SelectItem value="Lazer" className="text-white">
                      Lazer
                    </SelectItem>
                    <SelectItem value="Saúde" className="text-white">
                      Saúde
                    </SelectItem>
                    <SelectItem value="Outros" className="text-white">
                      Outros
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
                {editingExpense ? "Atualizar Gasto" : "Adicionar Gasto"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total dos Últimos 30 Dias</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {totalDaily.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Gastos de Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {todayTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50">{todayExpenses.length} transações</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Média Diária</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {data.dailyExpenses.length > 0 ? (totalDaily / 30).toFixed(2) : "0,00"}
            </div>
            <p className="text-xs text-white/50">Últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {data.dailyExpenses.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum gasto registrado</h3>
              <p className="text-white/50 mb-4">Comece registrando seus gastos diários</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.dailyExpenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 border border-white/10 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white">{expense.description}</h3>
                        <Badge className={categoryColors[expense.category] || categoryColors["Outros"]}>
                          {expense.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/50 mt-1">{new Date(expense.date).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold text-red-400">
                        - R$ {expense.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                        className="text-white hover:text-white hover:bg-white/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDailyExpense(expense.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
