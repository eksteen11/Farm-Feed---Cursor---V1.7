'use client'

import React, { createContext, useContext } from 'react'

type UserRole = 'buyer' | 'seller' | 'transporter' | null

interface RoleTheme {
  primaryGradient: string
  accentGradient: string
  backgroundImage: string
  overlayGradient: string
  textColor: string
}

const roleThemes: Record<NonNullable<UserRole>, RoleTheme> = {
  buyer: {
    primaryGradient: 'from-blue-500 via-cyan-500 to-blue-600',
    accentGradient: 'from-blue-400 to-cyan-400',
    backgroundImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&q=80',
    overlayGradient: 'from-blue-500/20 via-cyan-500/20 to-blue-600/20',
    textColor: 'text-blue-50'
  },
  seller: {
    primaryGradient: 'from-green-500 via-emerald-500 to-green-600',
    accentGradient: 'from-green-400 to-emerald-400',
    backgroundImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&q=80',
    overlayGradient: 'from-green-500/20 via-emerald-500/20 to-green-600/20',
    textColor: 'text-green-50'
  },
  transporter: {
    primaryGradient: 'from-orange-500 via-red-500 to-orange-600',
    accentGradient: 'from-orange-400 to-red-400',
    backgroundImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&q=80',
    overlayGradient: 'from-orange-500/20 via-red-500/20 to-orange-600/20',
    textColor: 'text-orange-50'
  }
}

interface RoleThemeContextType {
  role: UserRole
  theme: RoleTheme | null
  setRole: (role: UserRole) => void
}

const RoleThemeContext = createContext<RoleThemeContextType>({
  role: null,
  theme: null,
  setRole: () => {}
})

export function RoleThemeProvider({ children, initialRole = null }: { children: React.ReactNode, initialRole?: UserRole }) {
  const [role, setRole] = React.useState<UserRole>(initialRole)
  const theme = role ? roleThemes[role] : null

  return (
    <RoleThemeContext.Provider value={{ role, theme, setRole }}>
      {children}
    </RoleThemeContext.Provider>
  )
}

export function useRoleTheme() {
  return useContext(RoleThemeContext)
}






