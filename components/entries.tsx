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
import { Plus, TrendingUp, Calendar, RefreshCw, Trash2, Edit } from "lucide-react"
import { useFinancial } from "./financial-context"

export function Entries() {
  const { data, addEntry, deleteEntry, updateEntry } = useFinancial()
  const [isOpen, setIsOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    recurring: "Mensal" as "Mensal" | "Eventual",
    category: "Salário",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.description && formData.amount) {
      if (editingEntry) {
        updateEntry(editingEntry, {
          description: formData.description,
          amount: Number.parseFloat(formData.amount),
          date: formData.date,
          recurring: formData.recurring,
          category: formData.category,
        })
        setEditingEntry(null)
      } else {
        addEntry({
          description: formData.description,
          amount: Number.parseFloat(formData.amount),
          date: formData.date,
          recurring: formData.recurring,
          category: formData.category,
        })
      }
      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        recurring: "Mensal",
        category: "Salário",
      })
      setIsOpen(false)
    }
  }

  const handleEdit = (entry: any) => {
    setEditingEntry(entry.id)
    setFormData({
      description: entry.description,
      amount: entry.amount.toString(),
      date: entry.date,
      recurring: entry.recurring,
      category: entry.category,
    })
    setIsOpen(true)
  }

  const handleCancel = () => {
    setEditingEntry(null)
    setFormData({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      recurring: "Mensal",
      category: "Salário",
    })
    setIsOpen(false)
  }

  const totalEntries = data.entries.reduce((sum, entry) => sum + entry.amount, 0)
  const monthlyEntries = data.entries.filter((e) => e.recurring === "Mensal")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Entradas</h2>
          <p className="text-white/60">Gerencie suas fontes de renda</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4" />
              Nova Entrada
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingEntry ? "Editar Entrada" : "Adicionar Nova Entrada"}
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
                  placeholder="Ex: Salário Principal"
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
                <Label htmlFor="recurring" className="text-white">
                  Recorrência
                </Label>
                <Select
                  value={formData.recurring}
                  onValueChange={(value: "Mensal" | "Eventual") => setFormData({ ...formData, recurring: value })}
                >
                  <SelectTrigger className="bg-black border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="Mensal" className="text-white">
                      Mensal
                    </SelectItem>
                    <SelectItem value="Eventual" className="text-white">
                      Eventual
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="Salário" className="text-white">
                      Salário
                    </SelectItem>
                    <SelectItem value="Extra" className="text-white">
                      Extra
                    </SelectItem>
                    <SelectItem value="Investimentos" className="text-white">
                      Investimentos
                    </SelectItem>
                    <SelectItem value="Outros" className="text-white">
                      Outros
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-white/10 text-white hover:bg-white/10 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-white text-black hover:bg-white/90">
                  {editingEntry ? "Salvar Alterações" : "Adicionar Entrada"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {totalEntries.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Entradas Recorrentes</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{monthlyEntries.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Próxima Entrada</CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">{monthlyEntries.length > 0 ? "05/02" : "--"}</div>
            <p className="text-xs text-white/50">
              {monthlyEntries.length > 0 ? monthlyEntries[0]?.description : "Nenhuma entrada recorrente"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Lista de Entradas</CardTitle>
        </CardHeader>
        <CardContent>
          {data.entries.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma entrada cadastrada</h3>
              <p className="text-white/50 mb-4">Comece adicionando suas fontes de renda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-white">{entry.description}</h3>
                      <Badge
                        variant={entry.recurring === "Mensal" ? "default" : "secondary"}
                        className="bg-white/10 text-white"
                      >
                        {entry.recurring}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/50 mt-1">
                      {new Date(entry.date).toLocaleDateString("pt-BR")} • {entry.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold text-green-400">
                      + R$ {entry.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(entry)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
