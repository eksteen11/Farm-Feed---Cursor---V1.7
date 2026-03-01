'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Clock, DollarSign, Calculator } from 'lucide-react'
import Button from '@/shared/ui/Button'

export default function VisualDataStorytelling() {
  const [calculatorInputs, setCalculatorInputs] = useState({
    monthlyVolume: 50,
    averagePrice: 4500,
    transportTrips: 4
  })

  const savings = {
    timeSaved: calculatorInputs.monthlyVolume * 0.5, // 0.5 hours per ton saved
    transportSaved: calculatorInputs.transportTrips * 300, // R300 per trip saved
    adminSaved: calculatorInputs.monthlyVolume * 0.1, // 0.1 hours per ton admin
    totalValue: (calculatorInputs.monthlyVolume * calculatorInputs.averagePrice * 0.01) + // 1% price improvement
                (calculatorInputs.transportTrips * 300) + // Transport savings
                (calculatorInputs.monthlyVolume * 0.6 * 250) // Time saved at R250/hour
  }

  const comparisonData = {
    traditional: {
      time: '2-4 weeks',
      admin: '10-15 hours',
      transport: 'R500 extra per trip',
      transparency: 'Low',
      color: '#DB4A39'
    },
    farmFeed: {
      time: '48 hours',
      admin: '2 hours',
      transport: 'Included & optimized',
      transparency: '100%',
      color: '#3D693D'
    }
  }

  return (
    <div className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D693D]/10 rounded-full mb-6">
            <Calculator className="w-5 h-5 text-[#3D693D]" />
            <span className="text-sm font-semibold text-[#3D693D] uppercase tracking-wider">Calculate Your Savings</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            See Your Potential Savings
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare traditional trading vs Farm Feed. Calculate your real savings.
          </p>
        </motion.div>

        {/* Comparison Timeline */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traditional */}
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 border-2 border-red-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingDown className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-black text-gray-900">Traditional Trading</h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Time to Sale', value: comparisonData.traditional.time, icon: Clock },
                  { label: 'Admin Hours', value: comparisonData.traditional.admin, icon: Calculator },
                  { label: 'Transport Cost', value: comparisonData.traditional.transport, icon: DollarSign },
                  { label: 'Price Transparency', value: comparisonData.traditional.transparency, icon: TrendingDown }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 1, y: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/80 rounded-xl p-4 flex items-center justify-between"
                      >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-gray-900">{item.label}</span>
                      </div>
                      <span className="text-lg font-black text-red-600">{item.value}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Farm Feed */}
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#3D693D]/10 to-[#2A4A2A]/10 rounded-3xl p-8 border-2 border-[#3D693D]"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-[#3D693D]" />
                <h3 className="text-2xl font-black text-gray-900">Farm Feed</h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Time to Sale', value: comparisonData.farmFeed.time, icon: Clock },
                  { label: 'Admin Hours', value: comparisonData.farmFeed.admin, icon: Calculator },
                  { label: 'Transport Cost', value: comparisonData.farmFeed.transport, icon: DollarSign },
                  { label: 'Price Transparency', value: comparisonData.farmFeed.transparency, icon: TrendingUp }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 1, y: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-4 flex items-center justify-between shadow-lg"
                      >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-[#3D693D]" />
                        <span className="font-semibold text-gray-900">{item.label}</span>
                      </div>
                      <span className="text-lg font-black text-[#3D693D]">{item.value}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Savings Calculator */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200"
        >
          <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">Calculate Your Savings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                label: 'Monthly Volume (tons)',
                value: calculatorInputs.monthlyVolume,
                onChange: (val: number) => setCalculatorInputs(prev => ({ ...prev, monthlyVolume: val })),
                icon: TrendingUp
              },
              {
                label: 'Average Price (R/ton)',
                value: calculatorInputs.averagePrice,
                onChange: (val: number) => setCalculatorInputs(prev => ({ ...prev, averagePrice: val })),
                icon: DollarSign
              },
              {
                label: 'Transport Trips/Month',
                value: calculatorInputs.transportTrips,
                onChange: (val: number) => setCalculatorInputs(prev => ({ ...prev, transportTrips: val })),
                icon: TrendingUp
              }
            ].map((input, index) => {
              const Icon = input.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-[#3D693D]" />
                    <label className="text-sm font-semibold text-gray-600">{input.label}</label>
                  </div>
                  <input
                    type="number"
                    value={input.value}
                    onChange={(e) => input.onChange(Number(e.target.value))}
                    className="w-full text-3xl font-black text-gray-900 bg-transparent border-none focus:outline-none"
                    min="0"
                  />
                </div>
              )
            })}
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-[#3D693D] to-[#2A4A2A] rounded-2xl p-8 text-white">
            <h4 className="text-xl font-black mb-6">Your Estimated Monthly Savings</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Time Saved', value: `${savings.timeSaved.toFixed(1)} hours`, icon: Clock },
                { label: 'Transport Saved', value: `R${savings.transportSaved}`, icon: DollarSign },
                { label: 'Admin Saved', value: `${savings.adminSaved.toFixed(1)} hours`, icon: Calculator },
                { label: 'Total Value', value: `R${savings.totalValue.toLocaleString()}`, icon: TrendingUp, highlight: true }
              ].map((result, index) => {
                const Icon = result.icon
                return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 1, scale: 1 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 ${result.highlight ? 'ring-2 ring-white/50' : ''}`}
                    >
                    <Icon className="w-6 h-6 mb-3 text-white/80" />
                    <div className="text-sm text-white/80 mb-2">{result.label}</div>
                    <div className={`text-2xl font-black ${result.highlight ? 'text-yellow-300' : 'text-white'}`}>
                      {result.value}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
