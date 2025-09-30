import { Subscription, User, UserRole } from '@/types'
import { mockSubscriptions, mockUsers } from './mockData'
import { generateId } from './helpers'

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'ZAR',
    features: {
      listings: 1, // limited to 1 listing
      offers: 3, // limited to 3 offers per month
      transportRequests: 1, // limited to 1 transport request
      transportQuotes: 2, // limited to 2 transport quotes
      chatAccess: false,
      analytics: false,
      prioritySupport: false,
      documentGeneration: false,
      advancedRouting: false,
      backloadMatching: false
    }
  },
  basic: {
    name: 'Basic',
    price: 10,
    currency: 'ZAR',
    features: {
      listings: -1, // unlimited
      offers: -1, // unlimited
      transportRequests: -1, // unlimited
      transportQuotes: -1, // unlimited
      chatAccess: true,
      analytics: false,
      prioritySupport: false,
      documentGeneration: false,
      advancedRouting: false,
      backloadMatching: false
    }
  },
  premium: {
    name: 'Premium',
    price: 25,
    currency: 'ZAR',
    features: {
      listings: -1, // unlimited
      offers: -1, // unlimited
      transportRequests: -1, // unlimited
      transportQuotes: -1, // unlimited
      chatAccess: true,
      analytics: true,
      prioritySupport: true,
      documentGeneration: true,
      advancedRouting: false,
      backloadMatching: false
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 50,
    currency: 'ZAR',
    features: {
      listings: -1, // unlimited
      offers: -1, // unlimited
      transportRequests: -1, // unlimited
      transportQuotes: -1, // unlimited
      chatAccess: true,
      analytics: true,
      prioritySupport: true,
      documentGeneration: true,
      advancedRouting: true,
      backloadMatching: true
    }
  }
}

export class SubscriptionService {
  // Get all subscriptions
  static async getAllSubscriptions(): Promise<Subscription[]> {
    return mockSubscriptions
  }

  // Get subscription by user ID
  static async getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
    return mockSubscriptions.find(sub => sub.userId === userId) || null
  }

  // Create new subscription
  static async createSubscription(userId: string, plan: keyof typeof SUBSCRIPTION_PLANS): Promise<Subscription> {
    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }

    const planConfig = SUBSCRIPTION_PLANS[plan]
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1)

    const subscription: Subscription = {
      id: generateId('sub'),
      userId,
      user,
      plan,
      price: planConfig.price,
      currency: 'ZAR' as const,
      status: 'pending',
      startDate,
      endDate,
      paymentMethod: 'paystack',
      paymentStatus: 'pending',
      features: planConfig.features,
      autoRenew: true,
      nextBillingDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: startDate,
      updatedAt: startDate
    }

    // In a real app, this would be saved to database
    mockSubscriptions.push(subscription)
    
    return subscription
  }

  // Update subscription status
  static async updateSubscriptionStatus(subscriptionId: string, status: Subscription['status']): Promise<Subscription> {
    const subscription = mockSubscriptions.find(sub => sub.id === subscriptionId)
    if (!subscription) {
      throw new Error('Subscription not found')
    }

    subscription.status = status
    subscription.updatedAt = new Date()

    if (status === 'active') {
      subscription.paymentStatus = 'paid'
    }

    return subscription
  }

  // Check if user has active subscription
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getSubscriptionByUserId(userId)
    if (!subscription) return false

    return subscription.status === 'active' && 
           subscription.paymentStatus === 'paid' && 
           new Date() <= subscription.endDate
  }

  // Check feature access for user
  static async hasFeatureAccess(userId: string, feature: keyof Subscription['features']): Promise<boolean> {
    const subscription = await this.getSubscriptionByUserId(userId)
    if (!subscription || subscription.status !== 'active') return false

    return subscription.features[feature] === true || subscription.features[feature] === -1
  }

  // Get subscription plan details
  static getPlanDetails(plan: keyof typeof SUBSCRIPTION_PLANS) {
    return SUBSCRIPTION_PLANS[plan]
  }

  // Process payment (mock implementation)
  static async processPayment(subscriptionId: string, paymentMethod: string): Promise<boolean> {
    const subscription = mockSubscriptions.find(sub => sub.id === subscriptionId)
    if (!subscription) return false

    // Mock payment processing
    subscription.paymentStatus = 'paid'
    subscription.status = 'active'
    subscription.updatedAt = new Date()

    return true
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    const subscription = mockSubscriptions.find(sub => sub.id === subscriptionId)
    if (!subscription) {
      throw new Error('Subscription not found')
    }

    subscription.status = 'cancelled'
    subscription.autoRenew = false
    subscription.updatedAt = new Date()

    return subscription
  }

  // Renew subscription
  static async renewSubscription(subscriptionId: string): Promise<Subscription> {
    const subscription = mockSubscriptions.find(sub => sub.id === subscriptionId)
    if (!subscription) {
      throw new Error('Subscription not found')
    }

    const newEndDate = new Date(subscription.endDate)
    newEndDate.setFullYear(newEndDate.getFullYear() + 1)

    subscription.endDate = newEndDate
    subscription.nextBillingDate = new Date(subscription.endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    subscription.updatedAt = new Date()

    return subscription
  }

  // Get subscription analytics
  static async getSubscriptionAnalytics(): Promise<{
    totalSubscriptions: number
    activeSubscriptions: number
    monthlyRevenue: number
    planDistribution: Record<string, number>
  }> {
    const totalSubscriptions = mockSubscriptions.length
    const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active').length
    
    const monthlyRevenue = mockSubscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => total + sub.price, 0)

    const planDistribution = mockSubscriptions.reduce((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalSubscriptions,
      activeSubscriptions,
      monthlyRevenue,
      planDistribution
    }
  }
}
