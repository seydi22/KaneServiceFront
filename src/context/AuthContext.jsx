import React, { createContext, useState, useEffect, useContext } from 'react'
import { authService } from '../services/auth'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          // D'abord, restaurer l'état depuis le localStorage pour éviter le flash blanc
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          
          // Ensuite, vérifier si le token est toujours valide avec un timeout
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
          
          const mePromise = authService.getMe()
          const me = await Promise.race([mePromise, timeoutPromise])
          // L'API renvoie { success, user } ; on doit stocker l'objet user
          const userData = me?.user ?? me
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
          // Token invalide ou erreur réseau, nettoyer
          console.warn('Erreur lors de la vérification du token:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        }
      } else {
        // Pas de token, s'assurer que l'état est propre
        setToken(null)
        setUser(null)
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }

  const logout = () => {
    authService.logout()
    setToken(null)
    setUser(null)
    // Rediriger vers login après déconnexion
    window.location.href = '/login'
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isAgent: user?.role === 'agent'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
