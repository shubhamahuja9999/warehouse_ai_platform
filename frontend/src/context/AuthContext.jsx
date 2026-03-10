import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const DEMO_SHOWROOMS = {
  downtown: { id: 1, name: 'Downtown Showroom', username: 'downtown' },
  north: { id: 2, name: 'North Wing', username: 'north' },
  east: { id: 3, name: 'East Branch', username: 'east' },
}

const DEMO_PASSWORD = 'pass123'

const AuthContext = createContext(null)

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

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('wh_token')
    setAuthHeader(stored)
    return stored
  })

  useEffect(() => {
    setAuthHeader(token)
  }, [token])

  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return }
      try {
        const showroomData = JSON.parse(localStorage.getItem('wh_showroom'))
        if (showroomData) setShowroom(showroomData)
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = async (username, password) => {
    if (password !== DEMO_PASSWORD) {
      throw new Error('Invalid credentials')
    }
    const showroomData = DEMO_SHOWROOMS[username.toLowerCase()]
    if (!showroomData) {
      throw new Error('Invalid credentials')
    }
    const fakeToken = btoa(JSON.stringify(showroomData))
    setAuthHeader(fakeToken)
    localStorage.setItem('wh_token', fakeToken)
    localStorage.setItem('wh_showroom', JSON.stringify(showroomData))
    setToken(fakeToken)
    setShowroom(showroomData)
    return { access_token: fakeToken, showroom_name: showroomData.name, showroom_id: showroomData.id }
  }

  const logout = () => {
    localStorage.removeItem('wh_token')
    localStorage.removeItem('wh_showroom')
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
