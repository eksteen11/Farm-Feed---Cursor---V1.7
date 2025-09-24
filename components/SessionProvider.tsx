'use client'

import { useEffect } from 'react'
import { useSupabaseStore } from '@/store/useSupabaseStore'

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const initializeSession = useSupabaseStore(state => state.initializeSession)

  useEffect(() => {
    // Initialize session when the app loads
    initializeSession()
  }, [initializeSession])

  return <>{children}</>
}
