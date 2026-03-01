import type { TransportRequest, AutoTransportQuote } from '@/types'

interface QuoteCalculationParams {
  distance: number // km
  quantity: number // tons
  fuelPricePerLiter: number // R/liter
  fuelConsumptionPer100km: number // liters/100km
  baseRatePerKm: number // R/km
  tollFees?: number
  laborCost?: number
}

export class AutoQuoteService {
  // Standard rates (can be configurable)
  private static readonly STANDARD_RATES = {
    baseRatePerKm: 2.80,
    fuelPricePerLiter: 25.00,
    fuelConsumptionPer100km: 35,
    laborCostPerDay: 1500,
    overheadPercent: 15,
    marginPercent: 20
  }

  /**
   * Generate automatic transport quote
   */
  static generateAutoQuote(
    request: TransportRequest,
    customRates?: Partial<QuoteCalculationParams>
  ): AutoTransportQuote {
    const rates = { ...this.STANDARD_RATES, ...customRates }
    
    // Calculate distance if not provided
    const distance = request.deliveryLocationDetails && request.pickupLocationDetails
      ? this.calculateDistance(
          request.pickupLocationDetails.coordinates,
          request.deliveryLocationDetails.coordinates
        )
      : 500 // Default estimate

    // Calculate costs
    const fuelCost = (distance / 100) * rates.fuelConsumptionPer100km * rates.fuelPricePerLiter
    const basePrice = distance * rates.baseRatePerKm
    const laborCost = rates.laborCostPerDay * Math.ceil(distance / 600) // Assume 600km/day
    const tollFees = rates.tollFees || (distance * 0.10) // Estimate R0.10/km for tolls
    const overhead = (basePrice + fuelCost + laborCost) * (rates.overheadPercent / 100)
    const subtotal = basePrice + fuelCost + laborCost + tollFees + overhead
    const margin = subtotal * (rates.marginPercent / 100)
    const total = subtotal + margin

    // Estimate days (600km per day average)
    const estimatedDays = Math.ceil(distance / 600)

    return {
      id: `auto-${Date.now()}`,
      transportRequestId: request.id,
      transporterId: undefined, // Auto-generated
      price: Math.round(total),
      estimatedDays,
      status: 'auto_generated',
      breakdown: {
        basePrice: Math.round(basePrice),
        fuelCost: Math.round(fuelCost),
        tollFees: Math.round(tollFees),
        laborCost: Math.round(laborCost),
        overhead: Math.round(overhead),
        total: Math.round(total)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private static calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(coord2.lat - coord1.lat)
    const dLon = this.toRad(coord2.lng - coord1.lng)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.lat)) *
        Math.cos(this.toRad(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * Approve auto-quote (transporter accepts as-is)
   */
  static approveAutoQuote(
    autoQuote: AutoTransportQuote,
    transporterId: string
  ): AutoTransportQuote {
    return {
      ...autoQuote,
      transporterId,
      status: 'approved',
      updatedAt: new Date()
    }
  }

  /**
   * Modify auto-quote (transporter adjusts price)
   */
  static modifyAutoQuote(
    autoQuote: AutoTransportQuote,
    transporterId: string,
    newPrice: number,
    reason?: string
  ): AutoTransportQuote {
    const priceAdjustment = newPrice - autoQuote.price

    return {
      ...autoQuote,
      transporterId,
      price: newPrice,
      status: 'modified',
      originalAutoQuote: {
        price: autoQuote.price,
        breakdown: autoQuote.breakdown
      },
      modifications: {
        priceAdjustment,
        reason,
        modifiedAt: new Date()
      },
      breakdown: {
        ...autoQuote.breakdown,
        margin: (autoQuote.breakdown.margin || 0) + priceAdjustment,
        total: newPrice
      },
      updatedAt: new Date()
    }
  }
}

