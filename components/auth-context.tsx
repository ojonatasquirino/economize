"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email?: string
}

interface AuthContextType {
  user: User | null
  login: (name: string, password: string) => Promise<boolean>
  register: (name: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem("economize-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (name: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get stored users
    const users = JSON.parse(localStorage.getItem("economize-users") || "[]")
    const existingUser = users.find((u: any) => u.name === name && u.password === password)

    if (existingUser) {
      const userData = { id: existingUser.id, name: existingUser.name }
      setUser(userData)
      localStorage.setItem("economize-user", JSON.stringify(userData))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (name: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get stored users
    const users = JSON.parse(localStorage.getItem("economize-users") || "[]")
    const existingUser = users.find((u: any) => u.name === name)

    if (existingUser) {
      setIsLoading(false)
      return false // User already exists
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      password,
    }

    users.push(newUser)
    localStorage.setItem("economize-users", JSON.stringify(users))

    const userData = { id: newUser.id, name: newUser.name }
    setUser(userData)
    localStorage.setItem("economize-user", JSON.stringify(userData))

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("economize-user")
    localStorage.removeItem("financial-data")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
