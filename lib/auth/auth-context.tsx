"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("smartquote_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "admin@rcs.com" && password === "admin123") {
      const userData = {
        id: "1",
        name: "Admin RCS",
        email: "admin@rcs.com",
        avatar: "/admin-avatar.png",
      }
      setUser(userData)
      localStorage.setItem("smartquote_user", JSON.stringify(userData))
      setIsLoading(false)
      router.push("/dashboard")
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock registration - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = {
      id: Date.now().toString(),
      name,
      email,
      avatar: "/diverse-user-avatars.png",
    }

    setUser(userData)
    localStorage.setItem("smartquote_user", JSON.stringify(userData))
    setIsLoading(false)
    router.push("/dashboard")
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("smartquote_user")
    router.push("/")
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
