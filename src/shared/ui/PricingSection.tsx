'use client'

import React from 'react'
import { Card, CardContent } from './Card'
import { CheckCircle, Zap, Award, Crown, Building2 } from 'lucide-react'
import Button from './Button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface PricingSectionProps {
  className?: string
}

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    period: 'Forever',
    icon: Zap,
    description: 'Perfect for trying out the platform',
    features: [
      '1 active listing',
      '3 offers per month',
      '1 transport request/month',
      'Basic support',
      'Browse all listings'
    ],
    cta: 'Start Free',
    popular: false,
    color: 'gray'
  },
  {
    name: 'Basic',
    price: 10,
    period: 'per month',
    icon: CheckCircle,
    description: 'For active traders',
    features: [
      'Unlimited listings',
      'Unlimited offers',
      'Unlimited transport requests',
      'Real-time chat access',
      'Email support',
      'Basic analytics'
    ],
    cta: 'Start Trading',
    popular: true,
    color: 'green'
  },
  {
    name: 'Premium',
    price: 25,
    period: 'per month',
    icon: Award,
    description: 'For serious traders',
    features: [
      'Everything in Basic',
      'Advanced analytics dashboard',
      'Priority support',
      'Document management',
      'Custom contracts',
      'Performance insights'
    ],
    cta: 'Go Premium',
    popular: false,
    color: 'green'
  },
  {
    name: 'Enterprise',
    price: 50,
    period: 'per month',
    icon: Building2,
    description: 'For large operations',
    features: [
      'Everything in Premium',
      'Route optimization (AI-powered)',
      'Backload matching',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'Volume discounts'
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'green'
  }
]

export default function PricingSection({ className = '' }: PricingSectionProps) {
  return (
    <section className={`relative py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden ${className}`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D693D]/10 rounded-full">
            <CheckCircle className="w-5 h-5 text-[#3D693D]" />
            <span className="text-sm font-semibold text-[#3D693D]">No credit card required to start</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon
            const isPopular = plan.popular
            
            return (
              <Card
                key={plan.name}
                variant="elevated"
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isPopular 
                    ? 'border-2 border-[#3D693D] shadow-xl ring-4 ring-[#3D693D]/10' 
                    : 'border-2 border-transparent hover:border-[#3D693D]/20'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-[#3D693D] text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                
                <CardContent className="p-6">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-[#3D693D]/10 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-[#3D693D]`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-xs text-gray-500">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900">R{plan.price}</span>
                      {plan.price > 0 && (
                        <span className="text-gray-600 text-sm">/{plan.period}</span>
                      )}
                    </div>
                    {plan.price === 0 && (
                      <span className="text-gray-600 text-sm">{plan.period}</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#3D693D] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/register" className="block">
                    <Button 
                      className={`w-full ${
                        isPopular 
                          ? 'bg-[#3D693D] hover:bg-[#2A4A2A] text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                      {!isPopular && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-3xl p-8 border-2 border-[#3D693D]/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-[#3D693D] mb-2">R1/ton</div>
              <div className="text-gray-600">Platform fee on transactions</div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#3D693D] mb-2">R300</div>
              <div className="text-gray-600">Transport fee (split between buyer & seller)</div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#3D693D] mb-2">R50</div>
              <div className="text-gray-600">Backload booking fee</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Questions about pricing?
          </p>
          <Link href="/contact" className="text-[#3D693D] font-semibold hover:text-[#2A4A2A] transition-colors">
            Contact our sales team →
          </Link>
        </div>
      </div>
    </section>
  )
}


