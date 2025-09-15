"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface User {
  id: string
  name: string
  phone: string
  location: string
  crops: string[]
  history?: string
}

interface AuthContextType {
  user: User | null
  login: (userData: Omit<User, "id">) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("krishi-mitra-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(), // Simple ID generation
    }
    setUser(newUser)
    localStorage.setItem("krishi-mitra-user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("krishi-mitra-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
