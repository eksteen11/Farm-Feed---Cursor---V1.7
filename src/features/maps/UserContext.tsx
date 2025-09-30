'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserType = 'buyer' | 'seller' | 'transporter' | 'guest'

interface UserContextType {
  userType: UserType
  setUserType: (type: UserType) => void
  userLocation: { lat: number; lng: number } | null
  setUserLocation: (location: { lat: number; lng: number } | null) => void
  searchRadius: number
  setSearchRadius: (radius: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<UserType>('guest')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchRadius, setSearchRadius] = useState<number>(50) // km

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Geolocation error:', error)
          // Default to South Africa center if geolocation fails
          setUserLocation({ lat: -30.5595, lng: 22.9375 })
        }
      )
    } else {
      // Default to South Africa center
      setUserLocation({ lat: -30.5595, lng: 22.9375 })
    }
  }, [])

  return (
    <UserContext.Provider value={{
      userType,
      setUserType,
      userLocation,
      setUserLocation,
      searchRadius,
      setSearchRadius
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}








