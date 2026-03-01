/**
 * Deal State Machine Service
 * Implements the canonical deal state machine (Section 6 of Master Plan V1.2)
 * 
 * Valid state transitions:
 * - pending_payment → payment_uploaded → payment_confirmed → goods_ready → [delivered/in_transit] → completed
 * - pending_payment → payment_disputed → pending_payment (after resolution) or cancelled
 */

import type { Deal } from '@/types'

export type DealStatus = Deal['status']

export interface StateTransition {
  from: DealStatus
  to: DealStatus
  condition?: (deal: Deal) => boolean
  description: string
}

// Valid state transitions according to canonical plan
const VALID_TRANSITIONS: StateTransition[] = [
  // Payment flow
  {
    from: 'pending_payment',
    to: 'payment_uploaded',
    condition: (deal) => !!deal.proofOfPayment,
    description: 'Buyer uploaded proof of payment'
  },
  {
    from: 'payment_uploaded',
    to: 'payment_confirmed',
    description: 'Seller confirmed payment received'
  },
  {
    from: 'payment_uploaded',
    to: 'payment_disputed',
    description: 'Seller disputed payment'
  },
  {
    from: 'payment_disputed',
    to: 'pending_payment',
    description: 'Payment dispute resolved, back to pending'
  },
  {
    from: 'payment_disputed',
    to: 'cancelled',
    description: 'Payment dispute unresolved, deal cancelled'
  },
  // Fulfillment flow
  {
    from: 'payment_confirmed',
    to: 'goods_ready',
    description: 'Seller prepared goods'
  },
  // Transport flow (if delivered)
  {
    from: 'goods_ready',
    to: 'transport_assigned',
    condition: (deal) => deal.deliveryType === 'delivered',
    description: 'Transport quote accepted, transporter assigned'
  },
  {
    from: 'goods_ready',
    to: 'delivered',
    condition: (deal) => deal.deliveryType === 'ex-farm',
    description: 'Ex-farm delivery, buyer picked up'
  },
  {
    from: 'transport_assigned',
    to: 'in_transit',
    description: 'Transporter picked up goods, in transit'
  },
  {
    from: 'in_transit',
    to: 'delivered',
    description: 'Goods delivered to buyer'
  },
  // Completion
  {
    from: 'delivered',
    to: 'completed',
    description: 'Buyer confirmed delivery, deal complete'
  },
  // Cancellation (from any state except completed)
  {
    from: 'pending_payment',
    to: 'cancelled',
    description: 'Deal cancelled'
  },
  {
    from: 'payment_uploaded',
    to: 'cancelled',
    description: 'Deal cancelled'
  },
  {
    from: 'payment_confirmed',
    to: 'cancelled',
    description: 'Deal cancelled'
  },
  {
    from: 'goods_ready',
    to: 'cancelled',
    description: 'Deal cancelled'
  }
]

export class DealStateMachine {
  /**
   * Check if a state transition is valid
   */
  static canTransition(from: DealStatus, to: DealStatus, deal?: Deal): boolean {
    const transition = VALID_TRANSITIONS.find(t => t.from === from && t.to === to)
    if (!transition) return false
    
    // Check condition if present
    if (transition.condition && deal) {
      return transition.condition(deal)
    }
    
    return true
  }

  /**
   * Get all valid next states for a given current state
   */
  static getValidNextStates(currentStatus: DealStatus, deal?: Deal): DealStatus[] {
    return VALID_TRANSITIONS
      .filter(t => t.from === currentStatus)
      .filter(t => !t.condition || (deal && t.condition(deal)))
      .map(t => t.to)
  }

  /**
   * Get transition description
   */
  static getTransitionDescription(from: DealStatus, to: DealStatus): string {
    const transition = VALID_TRANSITIONS.find(t => t.from === from && t.to === to)
    return transition?.description || 'Invalid transition'
  }

  /**
   * Validate and apply state transition
   */
  static transition(
    deal: Deal,
    newStatus: DealStatus,
    userId: string,
    notes?: string
  ): { success: boolean; error?: string; updatedDeal?: Deal } {
    // Check if transition is valid
    if (!this.canTransition(deal.status, newStatus, deal)) {
      return {
        success: false,
        error: `Invalid transition from ${deal.status} to ${newStatus}`
      }
    }

    // Create updated deal with state history
    const updatedDeal: Deal = {
      ...deal,
      status: newStatus,
      updatedAt: new Date(),
      stateHistory: [
        ...(deal.stateHistory || []),
        {
          status: newStatus,
          timestamp: new Date(),
          userId,
          notes
        }
      ]
    }

    // Auto-update payment status based on deal status
    if (newStatus === 'payment_uploaded') {
      updatedDeal.paymentStatus = 'payment_uploaded'
    } else if (newStatus === 'payment_confirmed') {
      updatedDeal.paymentStatus = 'payment_confirmed'
    } else if (newStatus === 'payment_disputed') {
      updatedDeal.paymentStatus = 'payment_disputed'
    }

    return {
      success: true,
      updatedDeal
    }
  }

  /**
   * Get human-readable status label
   */
  static getStatusLabel(status: DealStatus): string {
    const labels: Record<DealStatus, string> = {
      pending_payment: 'Awaiting Payment (Off-Platform)',
      payment_uploaded: 'Payment Proof Uploaded',
      payment_confirmed: 'Payment Confirmed',
      payment_disputed: 'Payment Disputed',
      goods_ready: 'Goods Ready',
      transport_assigned: 'Transport Assigned',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
    return labels[status] || status
  }

  /**
   * Get status color for UI
   */
  static getStatusColor(status: DealStatus): string {
    const colors: Record<DealStatus, string> = {
      pending_payment: 'yellow', // Warning
      payment_uploaded: 'blue', // Info
      payment_confirmed: 'green', // Success
      payment_disputed: 'red', // Error
      goods_ready: 'blue', // Info
      transport_assigned: 'blue', // Info
      in_transit: 'blue', // Info
      delivered: 'green', // Success
      completed: 'green', // Success
      cancelled: 'gray' // Neutral
    }
    return colors[status] || 'gray'
  }
}

