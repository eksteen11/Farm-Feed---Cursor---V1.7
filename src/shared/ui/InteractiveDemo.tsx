'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Search, Package, ShoppingCart, Truck, FileText, DollarSign, CheckCircle } from 'lucide-react'
import Button from '@/shared/ui/Button'

interface DemoStep {
  id: string
  title: string
  description: string
  component: 'listing' | 'offer' | 'deal' | 'transport'
  action: string
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: '1',
    title: 'Browse Listings',
    description: 'Search thousands of verified products from South African farmers',
    component: 'listing',
    action: 'Click a listing to see details'
  },
  {
    id: '2',
    title: 'Make an Offer',
    description: 'Submit your offer with price, quantity, and delivery preferences',
    component: 'offer',
    action: 'Offer automatically sent to seller'
  },
  {
    id: '3',
    title: 'Review Deal',
    description: 'Automated contract generated, ready for both parties to review',
    component: 'deal',
    action: 'Contract and invoice created automatically'
  },
  {
    id: '4',
    title: 'Arrange Transport',
    description: 'Match with transporters instantly, optimize routes automatically',
    component: 'transport',
    action: 'Transport quotes appear instantly'
  }
]

const SAMPLE_LISTINGS = [
  { id: 1, title: 'Premium Yellow Maize', price: 'R4,500/ton', quantity: '100 tons', location: 'Western Cape', grade: 'A', verified: true },
  { id: 2, title: 'Grade A Wheat', price: 'R5,200/ton', quantity: '75 tons', location: 'Free State', grade: 'A', verified: true },
  { id: 3, title: 'Sunflower Seeds', price: 'R6,800/ton', quantity: '50 tons', location: 'Mpumalanga', grade: 'B', verified: true }
]

export default function InteractiveDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const currentDemo = DEMO_STEPS[currentStep]

  const nextStep = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const renderDemoComponent = () => {
    switch (currentDemo.component) {
      case 'listing':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-black text-gray-900 mb-2">Premium Yellow Maize</h4>
                  <p className="text-gray-600">Grade A • 100 tons available</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Verified</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Price</span>
                  <p className="text-2xl font-black text-[#3D693D]">R4,500/ton</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Location</span>
                  <p className="text-lg font-semibold text-gray-900">Western Cape</p>
                </div>
              </div>
              <Button className="w-full">
                Make Offer
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )
      case 'offer':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <h4 className="text-xl font-black text-gray-900 mb-2">Your Offer</h4>
              <p className="text-gray-600">Premium Yellow Maize • 50 tons</p>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Your Price</span>
                <span className="text-xl font-black text-gray-900">R4,450/ton</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Quantity</span>
                <span className="text-xl font-black text-gray-900">50 tons</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Delivery</span>
                <span className="text-xl font-black text-gray-900">Ex-farm</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5" />
              <span>Offer sent! Seller will respond within 24 hours</span>
            </div>
          </div>
        )
      case 'deal':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#3D693D] to-[#2A4A2A] rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-black">Deal Completed</h4>
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-2 text-white/90">
                <p>✓ Contract generated</p>
                <p>✓ Invoice created</p>
                <p>✓ Payment scheduled</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-3xl font-black text-gray-900">R222,500</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Platform Fee (R1/ton)</span>
                <span>R50</span>
              </div>
            </div>
          </div>
        )
      case 'transport':
        return (
          <div className="space-y-4">
            {[
              { company: 'ABC Transport', price: 'R3,500', rating: 4.8, vehicles: 3 },
              { company: 'Fast Freight Co', price: 'R3,200', rating: 4.9, vehicles: 5 },
              { company: 'Reliable Logistics', price: 'R3,800', rating: 4.7, vehicles: 2 }
            ].map((quote, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-[#3D693D] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-black text-gray-900">{quote.company}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{quote.vehicles} vehicles available</span>
                      <span className="text-sm font-semibold text-yellow-600">★ {quote.rating}</span>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#3D693D]">{quote.price}</span>
                </div>
                <Button variant="secondary" className="w-full">
                  Accept Quote
                </Button>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            Try It Yourself
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience the platform without signing up. See how easy it is to trade.
          </p>
          <Button
            size="lg"
            onClick={() => setIsOpen(true)}
            className="min-h-[72px] px-12 text-xl"
          >
            Launch Interactive Demo
            <ChevronRight className="w-6 h-6 ml-3" />
          </Button>
        </motion.div>

        {/* Demo Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {DEMO_STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setIsOpen(true)
                setCurrentStep(index)
              }}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-[#3D693D] group"
            >
              <div className="w-12 h-12 bg-[#3D693D]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#3D693D] transition-colors">
                {step.component === 'listing' && <Search className="w-6 h-6 text-[#3D693D] group-hover:text-white transition-colors" />}
                {step.component === 'offer' && <ShoppingCart className="w-6 h-6 text-[#3D693D] group-hover:text-white transition-colors" />}
                {step.component === 'deal' && <FileText className="w-6 h-6 text-[#3D693D] group-hover:text-white transition-colors" />}
                {step.component === 'transport' && <Truck className="w-6 h-6 text-[#3D693D] group-hover:text-white transition-colors" />}
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Interactive Demo</h3>
                  <p className="text-sm text-gray-600 mt-1">Step {currentStep + 1} of {DEMO_STEPS.length}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDemo.id}
                    initial={{ opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-8">
                      <h4 className="text-3xl font-black text-gray-900 mb-3">{currentDemo.title}</h4>
                      <p className="text-lg text-gray-600 mb-4">{currentDemo.description}</p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#3D693D]">
                        <ChevronRight className="w-4 h-4" />
                        <span>{currentDemo.action}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
                      {renderDemoComponent()}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Navigation */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {DEMO_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentStep ? 'w-8 bg-[#3D693D]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < DEMO_STEPS.length - 1 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3D693D] text-white font-semibold hover:bg-[#2A4A2A] transition-colors"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <Button onClick={() => setIsOpen(false)}>
                    Complete Demo
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

