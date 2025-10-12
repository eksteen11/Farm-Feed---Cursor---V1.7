'use client'

import { useEffect, useRef } from 'react'
import { useSupabaseStore } from '@/store/useSupabaseStore'

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const { initializeSession } = useSupabaseStore()
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Only initialize session once when the app loads
    if (!hasInitialized.current) {
      initializeSession()
      hasInitialized.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}
