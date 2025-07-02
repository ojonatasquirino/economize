"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Entry {
  id: string
  description: string
  amount: number
  date: string
  recurring: "Mensal" | "Eventual"
  category: string
}

interface FixedExpense {
  id: string
  description: string
  amount: number
  dueDate: number
  category: string
  status: "Pago" | "Pendente"
}

interface DailyExpense {
  id: string
  description: string
  amount: number
  date: string
  category: string
}

interface EmergencyWithdrawal {
  id: string
  amount: number
  reason: string
  date: string
}

interface FinancialData {
  entries: Entry[]
  fixedExpenses: FixedExpense[]
  dailyExpenses: DailyExpense[]
  emergencyFund: number
  emergencyWithdrawals: EmergencyWithdrawal[]
  currentBalance: number
}

interface FinancialContextType {
  data: FinancialData
  addEntry: (entry: Omit<Entry, "id">) => void
  addFixedExpense: (expense: Omit<FixedExpense, "id">) => void
  addDailyExpense: (expense: Omit<DailyExpense, "id">) => void
  addToEmergencyFund: (amount: number) => void
  withdrawFromEmergencyFund: (amount: number, reason: string) => void
  updateBalance: (amount: number) => void
  deleteEntry: (id: string) => void
  deleteFixedExpense: (id: string) => void
  deleteDailyExpense: (id: string) => void
  updateEntry: (id: string, entry: Omit<Entry, "id">) => void
  updateFixedExpense: (id: string, expense: Omit<FixedExpense, "id">) => void
  updateDailyExpense: (id: string, expense: Omit<DailyExpense, "id">) => void
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FinancialData>({
    entries: [],
    fixedExpenses: [],
    dailyExpenses: [],
    emergencyFund: 0,
    emergencyWithdrawals: [],
    currentBalance: 0,
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("financial-data")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setData({
        ...parsedData,
        emergencyWithdrawals: parsedData.emergencyWithdrawals || [],
      })
    }
  }, [])

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("financial-data", JSON.stringify(data))
  }, [data])

  const addEntry = (entry: Omit<Entry, "id">) => {
    const newEntry = { ...entry, id: Date.now().toString() }
    setData((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry],
      currentBalance: prev.currentBalance + entry.amount,
    }))
  }

  const updateEntry = (id: string, entry: Omit<Entry, "id">) => {
    setData((prev) => {
      const oldEntry = prev.entries.find((e) => e.id === id)
      const updatedEntries = prev.entries.map((e) => (e.id === id ? { ...entry, id } : e))
      const balanceDiff = oldEntry ? entry.amount - oldEntry.amount : 0
      return {
        ...prev,
        entries: updatedEntries,
        currentBalance: prev.currentBalance + balanceDiff,
      }
    })
  }

  const addFixedExpense = (expense: Omit<FixedExpense, "id">) => {
    const newExpense = { ...expense, id: Date.now().toString() }
    setData((prev) => ({
      ...prev,
      fixedExpenses: [...prev.fixedExpenses, newExpense],
    }))
  }

  const updateFixedExpense = (id: string, expense: Omit<FixedExpense, "id">) => {
    setData((prev) => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.map((e) => (e.id === id ? { ...expense, id } : e)),
    }))
  }

  const addDailyExpense = (expense: Omit<DailyExpense, "id">) => {
    const newExpense = { ...expense, id: Date.now().toString() }
    setData((prev) => ({
      ...prev,
      dailyExpenses: [...prev.dailyExpenses, newExpense],
      currentBalance: prev.currentBalance - expense.amount,
    }))
  }

  const updateDailyExpense = (id: string, expense: Omit<DailyExpense, "id">) => {
    setData((prev) => {
      const oldExpense = prev.dailyExpenses.find((e) => e.id === id)
      const updatedExpenses = prev.dailyExpenses.map((e) => (e.id === id ? { ...expense, id } : e))
      const balanceDiff = oldExpense ? oldExpense.amount - expense.amount : 0
      return {
        ...prev,
        dailyExpenses: updatedExpenses,
        currentBalance: prev.currentBalance + balanceDiff,
      }
    })
  }

  const addToEmergencyFund = (amount: number) => {
    setData((prev) => ({
      ...prev,
      emergencyFund: prev.emergencyFund + amount,
      currentBalance: prev.currentBalance - amount,
    }))
  }

  const withdrawFromEmergencyFund = (amount: number, reason: string) => {
    const withdrawal: EmergencyWithdrawal = {
      id: Date.now().toString(),
      amount,
      reason,
      date: new Date().toISOString(),
    }

    setData((prev) => ({
      ...prev,
      emergencyFund: prev.emergencyFund - amount,
      emergencyWithdrawals: [...prev.emergencyWithdrawals, withdrawal],
      currentBalance: prev.currentBalance + amount,
    }))
  }

  const updateBalance = (amount: number) => {
    setData((prev) => ({
      ...prev,
      currentBalance: prev.currentBalance + amount,
    }))
  }

  const deleteEntry = (id: string) => {
    setData((prev) => {
      const entry = prev.entries.find((e) => e.id === id)
      return {
        ...prev,
        entries: prev.entries.filter((e) => e.id !== id),
        currentBalance: entry ? prev.currentBalance - entry.amount : prev.currentBalance,
      }
    })
  }

  const deleteFixedExpense = (id: string) => {
    setData((prev) => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.filter((e) => e.id !== id),
    }))
  }

  const deleteDailyExpense = (id: string) => {
    setData((prev) => {
      const expense = prev.dailyExpenses.find((e) => e.id === id)
      return {
        ...prev,
        dailyExpenses: prev.dailyExpenses.filter((e) => e.id !== id),
        currentBalance: expense ? prev.currentBalance + expense.amount : prev.currentBalance,
      }
    })
  }

  return (
    <FinancialContext.Provider
      value={{
        data,
        addEntry,
        addFixedExpense,
        addDailyExpense,
        addToEmergencyFund,
        withdrawFromEmergencyFund,
        updateBalance,
        deleteEntry,
        deleteFixedExpense,
        deleteDailyExpense,
        updateEntry,
        updateFixedExpense,
        updateDailyExpense,
      }}
    >
      {children}
    </FinancialContext.Provider>
  )
}

export function useFinancial() {
  const context = useContext(FinancialContext)
  if (context === undefined) {
    throw new Error("useFinancial must be used within a FinancialProvider")
  }
  return context
}
