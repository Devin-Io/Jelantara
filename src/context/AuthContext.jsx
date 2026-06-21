import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const roleHome = {
  operator: '/operator',
  logistics: '/logistik',
  processing: '/pengolahan',
  admin: '/admin',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jelantara-user')) || null
    } catch {
      return null
    }
  })

  const login = ({ email, role }) => {
    const next = {
      email,
      role,
      name:
        role === 'operator'
          ? 'Operator SPPG Banjarbaru'
          : role === 'logistics'
            ? 'Tim Logistik Borneo'
            : role === 'processing'
              ? 'Mitra Pengolahan SAF'
              : 'Administrator JELANTARA',
    }
    localStorage.setItem('jelantara-user', JSON.stringify(next))
    setUser(next)
    return roleHome[role]
  }

  const logout = () => {
    localStorage.removeItem('jelantara-user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout, roleHome }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
