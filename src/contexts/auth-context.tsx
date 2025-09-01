'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type UserRole = 'admin' | 'participant' | 'mentor' | 'judge'

interface User {
  id: string
  email: string
  role: UserRole
  name?: string
  fullName?: string
  teamId?: string
  teamName?: string
  isLeader?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      
      // Check if user is authenticated by calling the appropriate endpoint based on role
      // First try participant endpoint
      let response = await fetch('/api/participant/me', {
        credentials: 'include', // Include cookies
      })

      if (response.ok) {
        const participantData = await response.json()
        const userData: User = {
          id: participantData.id,
          email: participantData.email,
          role: 'participant',
          name: participantData.fullName,
          fullName: participantData.fullName,
          teamId: participantData.teamId,
          teamName: participantData.team?.teamName,
          isLeader: participantData.isLeader
        }
        setUser(userData)
        return
      }

      // If participant fails, try mentor endpoint
      response = await fetch('/api/mentor/me', {
        credentials: 'include',
      })

      if (response.ok) {
        const mentorData = await response.json()
        const userData: User = {
          id: mentorData.id,
          email: mentorData.email,
          role: 'mentor',
          name: mentorData.name,
          fullName: mentorData.name
        }
        setUser(userData)
        return
      }

      // If both fail, try admin endpoint
      response = await fetch('/api/admin/me', {
        credentials: 'include',
      })

      if (response.ok) {
        const adminData = await response.json()
        const userData: User = {
          id: adminData.id,
          email: adminData.email,
          role: 'admin',
          name: adminData.name,
          fullName: adminData.name
        }
        setUser(userData)
        return
      }

      // No valid authentication found
      setUser(null)
    } catch (error) {
      console.error('Error checking auth status:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            name: data.user.fullName,
            fullName: data.user.fullName,
            teamId: data.user.teamId,
            teamName: data.user.teamName,
            isLeader: data.user.isLeader
          }
          setUser(userData)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side session/cookies
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      // Redirect to home page
      window.location.href = '/'
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    setUser,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
