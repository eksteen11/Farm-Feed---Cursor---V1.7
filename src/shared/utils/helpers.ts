// Helper function to generate stable IDs for mock data
let idCounter = 0
export const generateId = (prefix: string): string => {
  // Use a simple counter-based approach for stable IDs
  idCounter++
  return `${prefix}-${idCounter}`
}

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'ZAR'): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

// Helper function to format dates
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Helper function to format relative time
export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(date)
}

// Helper function to calculate distance between locations (simplified)
export const calculateDistance = (from: string, to: string): number => {
  // This is a simplified calculation - in real app, use proper geocoding
  const locations = {
    'Free State': { lat: -28.4556, lng: 26.8124 },
    'Johannesburg': { lat: -26.2041, lng: 28.0473 },
    'Cape Town': { lat: -33.9249, lng: 18.4241 },
    'Durban': { lat: -29.8587, lng: 31.0218 },
    'Pretoria': { lat: -25.7479, lng: 28.2293 }
  }
  
  const fromCoords = locations[from as keyof typeof locations]
  const toCoords = locations[to as keyof typeof locations]
  
  if (!fromCoords || !toCoords) return 0
  
  // Simple distance calculation (not accurate but good for mock data)
  const latDiff = Math.abs(fromCoords.lat - toCoords.lat)
  const lngDiff = Math.abs(fromCoords.lng - toCoords.lng)
  
  return Math.round((latDiff + lngDiff) * 111) // Rough conversion to km
}

// Helper function to generate transport quote estimates
export const generateTransportQuote = (distance: number, productType: string): {
  lowEstimate: number
  mediumEstimate: number
  highEstimate: number
  calculation: {
    distance: number
    fuelCost: number
    laborCost: number
    overhead: number
  }
} => {
  const fuelCostPerKm = 3.0 // R3 per km for fuel
  const laborCostPerKm = 2.0 // R2 per km for labor
  const overheadPerKm = 3.0 // R3 per km for overhead
  
  const baseFuelCost = distance * fuelCostPerKm
  const baseLaborCost = distance * laborCostPerKm
  const baseOverhead = distance * overheadPerKm
  
  const baseTotal = baseFuelCost + baseLaborCost + baseOverhead
  
  return {
    lowEstimate: Math.round(baseTotal * 0.9), // 10% discount
    mediumEstimate: Math.round(baseTotal), // Base price
    highEstimate: Math.round(baseTotal * 1.2), // 20% premium
    calculation: {
      distance,
      fuelCost: baseFuelCost,
      laborCost: baseLaborCost,
      overhead: baseOverhead
    }
  }
}

// Helper function to validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Helper function to validate phone number format (South African)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/
  return phoneRegex.test(phone)
}

// Helper function to generate random number within range
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper function to shuffle array
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
