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
import { Plus, CreditCard, Calendar, AlertCircle, Trash2, Edit } from "lucide-react"
import { useFinancial } from "./financial-context"

export function FixedExpenses() {
  const { data, addFixedExpense, deleteFixedExpense, updateFixedExpense } = useFinancial()
  const [isOpen, setIsOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    dueDate: "5",
    category: "Moradia",
    status: "Pendente" as "Pago" | "Pendente",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.description && formData.amount) {
      if (editingExpense) {
        updateFixedExpense({
          id: editingExpense.id,
          description: formData.description,
          amount: Number.parseFloat(formData.amount),
          dueDate: Number.parseInt(formData.dueDate),
          category: formData.category,
          status: formData.status,
        })
      } else {
        addFixedExpense({
          description: formData.description,
          amount: Number.parseFloat(formData.amount),
          dueDate: Number.parseInt(formData.dueDate),
          category: formData.category,
          status: formData.status,
        })
      }

      setFormData({
        description: "",
        amount: "",
        dueDate: "5",
        category: "Moradia",
        status: "Pendente",
      })
      setIsOpen(false)
      setEditingExpense(null)
    }
  }

  const totalFixed = data.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = data.fixedExpenses.filter((e) => e.status === "Pendente")
  const totalPending = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const handleEdit = (expense: any) => {
    setEditingExpense(expense)
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      dueDate: expense.dueDate.toString(),
      category: expense.category,
      status: expense.status,
    })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Gastos Fixos</h2>
          <p className="text-white/60">Controle suas despesas mensais recorrentes</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4" />
              Novo Gasto Fixo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingExpense ? "Editar Gasto Fixo" : "Adicionar Novo Gasto Fixo"}
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
                  placeholder="Ex: Aluguel"
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
                <Label htmlFor="dueDate" className="text-white">
                  Dia do Vencimento
                </Label>
                <Input
                  id="dueDate"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                    <SelectItem value="Moradia" className="text-white">
                      Moradia
                    </SelectItem>
                    <SelectItem value="Cartão" className="text-white">
                      Cartão
                    </SelectItem>
                    <SelectItem value="Utilidades" className="text-white">
                      Utilidades
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
              <div>
                <Label htmlFor="status" className="text-white">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Pago" | "Pendente") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-black border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="Pendente" className="text-white">
                      Pendente
                    </SelectItem>
                    <SelectItem value="Pago" className="text-white">
                      Pago
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
                {editingExpense ? "Salvar Gasto Fixo" : "Adicionar Gasto Fixo"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Mensal</CardTitle>
            <CreditCard className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {totalFixed.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50">{pendingExpenses.length} contas</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Próximo Vencimento</CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">
              {pendingExpenses.length > 0 ? `${pendingExpenses[0].dueDate}/01` : "--"}
            </div>
            <p className="text-xs text-white/50">
              {pendingExpenses.length > 0 ? pendingExpenses[0].description : "Nenhuma conta pendente"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Lista de Gastos Fixos</CardTitle>
        </CardHeader>
        <CardContent>
          {data.fixedExpenses.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum gasto fixo cadastrado</h3>
              <p className="text-white/50 mb-4">Adicione aluguel, financiamentos e contas mensais</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.fixedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border border-white/10 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-white">{expense.description}</h3>
                      <Badge
                        variant={expense.status === "Pago" ? "default" : "destructive"}
                        className={
                          expense.status === "Pago" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                        }
                      >
                        {expense.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/50 mt-1">
                      Vencimento: dia {expense.dueDate} • {expense.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold text-red-400">
                      - R$ {expense.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                      className="text-white hover:text-white/90 hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFixedExpense(expense.id)}
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
