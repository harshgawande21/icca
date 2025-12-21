import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('icca_token')
      const userData = localStorage.getItem('icca_user')
      
      if (token && userData) {
        // Verify token is still valid
        const response = await authAPI.getProfile()
        if (response.success) {
          setUser(response.data)
          setIsAuthenticated(true)
        } else {
          // Token is invalid, clear storage
          logout()
        }
      }
    } catch (error) {
      // Token is invalid or expired
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      if (response.success) {
        localStorage.setItem('icca_token', response.data.token)
        localStorage.setItem('icca_user', JSON.stringify(response.data.user))
        setUser(response.data.user)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      return { success: false, error: error.error || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      if (response.success) {
        localStorage.setItem('icca_token', response.data.token)
        localStorage.setItem('icca_user', JSON.stringify(response.data.user))
        setUser(response.data.user)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      return { success: false, error: error.error || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('icca_token')
    localStorage.removeItem('icca_user')
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData)
      if (response.success) {
        setUser(response.data)
        localStorage.setItem('icca_user', JSON.stringify(response.data))
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      return { success: false, error: error.error || 'Profile update failed' }
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext