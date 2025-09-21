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
      
      // Try to get the stored role from localStorage to determine which endpoint to call
      const storedUser = localStorage.getItem('user')
      let userRole: UserRole | null = null
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser && parsedUser.role) {
            userRole = parsedUser.role as UserRole
            console.log('📋 Auth Context - Found stored user role:', userRole)
          }
        } catch (e) {
          console.error('Error parsing stored user:', e)
        }
      }
      
      // If we have a stored role, only call the appropriate endpoint
      if (userRole) {
        console.log(`🔍 Auth Context - Checking auth for role: ${userRole}`)
        
        if (userRole === 'participant') {
          const response = await fetch('/api/participant/me', {
            credentials: 'include',
          })
          
          if (response.ok) {
            const participantData = await response.json()
            console.log('🔍 Auth Context - Participant data received:', participantData)
            
            // Ensure we have a role field, even if the API doesn't return one
            const role = participantData.role || 'participant'
            
            const userData: User = {
              id: participantData.id,
              email: participantData.email,
              role: role,
              name: participantData.fullName,
              fullName: participantData.fullName,
              teamId: participantData.teamId,
              teamName: participantData.team?.teamName,
              isLeader: participantData.isLeader
            }
            setUser(userData)
            localStorage.setItem('user', JSON.stringify({ role: role }))
            return
          }
        } 
        else if (userRole === 'mentor') {
          const response = await fetch('/api/mentor/me', {
            credentials: 'include',
          })
          
          if (response.ok) {
            const mentorData = await response.json()
            console.log('🔍 Auth Context - Mentor data received:', mentorData)
            
            if (mentorData.success && mentorData.role === 'mentor') {
              const userData: User = {
                id: mentorData.id,
                email: mentorData.email,
                role: 'mentor',
                name: mentorData.name,
                fullName: mentorData.name
              }
              console.log('✅ Auth Context - Setting mentor user:', userData)
              setUser(userData)
              localStorage.setItem('user', JSON.stringify({ role: 'mentor' }))
              return
            }
          }
        }
        else if (userRole === 'admin') {
          const response = await fetch('/api/admin/me', {
            credentials: 'include',
          })
          
          if (response.ok) {
            const adminData = await response.json()
            console.log('🔍 Auth Context - Admin data received:', adminData)
            
            if (adminData.success && adminData.role === 'admin') {
              const userData: User = {
                id: adminData.id,
                email: adminData.email || adminData.username,
                role: 'admin',
                name: adminData.name || adminData.username,
                fullName: adminData.name || adminData.username
              }
              console.log('✅ Auth Context - Setting admin user:', userData)
              setUser(userData)
              localStorage.setItem('user', JSON.stringify({ role: 'admin' }))
              return
            }
          }
        }
      } 
      // If no stored role or stored role check failed, try all endpoints sequentially
      else {
        console.log('🔍 Auth Context - No stored role, checking all endpoints')
        
        // Try participant endpoint
        let response = await fetch('/api/participant/me', {
          credentials: 'include',
        })
        
        if (response.ok) {
          const participantData = await response.json()
          console.log('🔍 Auth Context - Participant data received:', participantData)
          
          // Ensure we have a role field, even if the API doesn't return one
          const role = participantData.role || 'participant'
          
          const userData: User = {
            id: participantData.id,
            email: participantData.email,
            role: role,
            name: participantData.fullName,
            fullName: participantData.fullName,
            teamId: participantData.teamId,
            teamName: participantData.team?.teamName,
            isLeader: participantData.isLeader
          }
          setUser(userData)
          localStorage.setItem('user', JSON.stringify({ role: role }))
          return
        }
        
        // If participant fails, try mentor endpoint
        response = await fetch('/api/mentor/me', {
          credentials: 'include',
        })
        
        if (response.ok) {
          const mentorData = await response.json()
          console.log('🔍 Auth Context - Mentor data received:', mentorData)
          
          if (mentorData.success && mentorData.role === 'mentor') {
            const userData: User = {
              id: mentorData.id,
              email: mentorData.email,
              role: 'mentor',
              name: mentorData.name,
              fullName: mentorData.name
            }
            console.log('✅ Auth Context - Setting mentor user:', userData)
            setUser(userData)
            localStorage.setItem('user', JSON.stringify({ role: 'mentor' }))
            return
          }
        }
        
        // If both fail, try admin endpoint
        response = await fetch('/api/admin/me', {
          credentials: 'include',
        })
        
        if (response.ok) {
          const adminData = await response.json()
          console.log('🔍 Auth Context - Admin data received:', adminData)
          
          if (adminData.success && adminData.role === 'admin') {
            const userData: User = {
              id: adminData.id,
              email: adminData.email || adminData.username,
              role: 'admin',
              name: adminData.name || adminData.username,
              fullName: adminData.name || adminData.username
            }
            console.log('✅ Auth Context - Setting admin user:', userData)
            setUser(userData)
            localStorage.setItem('user', JSON.stringify({ role: 'admin' }))
            return
          }
        }
      }
      
      // No valid authentication found
      localStorage.removeItem('user')
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
          
          // Store the user role in localStorage to optimize future auth checks
          localStorage.setItem('user', JSON.stringify({ role: data.user.role }))
          
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
      
      // Clear the stored user role
      localStorage.removeItem('user')
      
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
