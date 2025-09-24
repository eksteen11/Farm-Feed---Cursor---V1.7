'use client'

import { useEffect, useRef } from 'react'
import { useSupabaseStore } from '@/store/useSupabaseStore'

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const { initializeSession, isAuthenticated, currentUser } = useSupabaseStore()
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Only initialize session once when the app loads
    if (!hasInitialized.current) {
      console.log('🔄 SessionProvider: Initializing session...')
      initializeSession()
      hasInitialized.current = true
    }
  }, [initializeSession])

  // Optional: Listen for auth state changes
  useEffect(() => {
    console.log('🔄 SessionProvider: Auth state changed:', { 
      isAuthenticated, 
      userEmail: currentUser?.email 
    })
  }, [isAuthenticated, currentUser])

  return <>{children}</>
}
