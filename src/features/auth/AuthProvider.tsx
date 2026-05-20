"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { TUser, TLoginCredentials, TRegisterData } from './types'
import { api } from '@services'

type AuthContextType = {
  user: TUser | null
  token: string | null
  loading: boolean
  login: (credentials: TLoginCredentials) => Promise<void>
  logout: () => void
  register?: (data: TRegisterData) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('studyhub:token')
    return null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && !user) {
      ;(async () => {
        try {
          const profile = await api.get<TUser>('/auth/me')
          setUser(profile)
        } catch {
          // ignore if profile cannot be fetched
        }
      })()
    }
  }, [token, user])

  const login = async (credentials: TLoginCredentials) => {
    setLoading(true)
    try {
      // Expecting backend response: { accessToken: string, user: TUser }
      const res = await api.post<{ accessToken: string; user: TUser }>('/auth/login', credentials)
      setToken(res.accessToken)
      localStorage.setItem('studyhub:token', res.accessToken)
      setUser(res.user)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== 'undefined') localStorage.removeItem('studyhub:token')
  }

  const value = { user, token, loading, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthProvider
