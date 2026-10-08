import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import api from './api'

const TOKEN_KEY = 'gc_token'
const USER_KEY = 'gc_user'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(readStoredUser)

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    if (!data?.token) throw new Error('No token returned by server')
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    const nextUser = { email }
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return data
  }, [])

  const signup = useCallback(async (payload) => {
    const { data } = await api.post('/api/auth/signup', payload)
    if (!data?.token) throw new Error('No token returned by server')
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    const nextUser = { email: payload.email, companyName: payload.companyName }
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ token, user, isAuthed: Boolean(token), login, signup, logout }),
    [token, user, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
