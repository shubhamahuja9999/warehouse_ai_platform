import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// Helper: sync header immediately (not via useEffect)
function setAuthHeader(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

export function AuthProvider({ children }) {
  const [showroom, setShowroom] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialise token and header synchronously so /auth/me can use it immediately
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('wh_token')
    setAuthHeader(stored)   // set header NOW, before any effects run
    return stored
  })

  // Keep header in sync whenever token changes after initial load
  useEffect(() => {
    setAuthHeader(token)
  }, [token])

  // On app load, verify stored token
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await axios.get('/auth/me')
        setShowroom(data)
      } catch {
        // Token expired or invalid → log out
        logout()
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = async (username, password) => {
    const { data } = await axios.post('/auth/login', { username, password })
    const { access_token, showroom_name, showroom_id } = data
    setAuthHeader(access_token)                          // set header immediately
    localStorage.setItem('wh_token', access_token)
    setToken(access_token)
    setShowroom({ id: showroom_id, name: showroom_name, username })
    return data
  }

  const logout = () => {
    localStorage.removeItem('wh_token')
    setToken(null)
    setShowroom(null)
    setAuthHeader(null)
  }

  return (
    <AuthContext.Provider value={{ showroom, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
