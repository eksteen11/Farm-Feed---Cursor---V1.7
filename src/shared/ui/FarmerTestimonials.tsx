'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Play, ArrowRight, ArrowLeft, CheckCircle, TrendingUp, Star } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: 'seller' | 'buyer' | 'transporter'
  location: string
  image: string
  quote: string
  videoUrl?: string
  results: {
    metric: string
    value: string
    change: string
  }[]
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'John van der Merwe',
    role: 'seller',
    location: 'Western Cape',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    quote: 'I used to spend 2-3 weeks finding buyers. Now I get offers in 24 hours. Farm Feed changed everything.',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    results: [
      { metric: 'Time to Sale', value: '2-3 weeks → 48 hours', change: '-85%' },
      { metric: 'Revenue', value: 'R120K more this year', change: '+35%' },
      { metric: 'Transport Savings', value: 'R300 per ton saved', change: '-40%' }
    ],
    rating: 5
  },
  {
    id: '2',
    name: 'Sarah Khumalo',
    role: 'buyer',
    location: 'Gauteng',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80',
    quote: 'The quality verification and transparent pricing saves me hours every week. Best decision we made.',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    results: [
      { metric: 'Search Time', value: '3 hours → 15 minutes', change: '-75%' },
      { metric: 'Quality Issues', value: 'Reduced by 90%', change: '-90%' },
      { metric: 'Cost Savings', value: 'R50K saved this quarter', change: '+20%' }
    ],
    rating: 5
  },
  {
    id: '3',
    name: 'Mike Botha',
    role: 'transporter',
    location: 'KwaZulu-Natal',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
    quote: 'Empty trips are a thing of the past. Backload matching increased my revenue by R8000 per month.',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    results: [
      { metric: 'Empty Trips', value: 'Reduced by 40%', change: '-40%' },
      { metric: 'Monthly Revenue', value: 'R8000 increase', change: '+32%' },
      { metric: 'Route Efficiency', value: '3 hours saved per trip', change: '-25%' }
    ],
    rating: 5
  },
  {
    id: '4',
    name: 'Anna Pretorius',
    role: 'seller',
    location: 'Free State',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80',
    quote: 'I love the automated contracts. No more chasing paperwork. Everything happens automatically.',
    results: [
      { metric: 'Admin Time', value: '10 hours → 2 hours', change: '-80%' },
      { metric: 'Deals Completed', value: '15 this month', change: '+50%' },
      { metric: 'Payment Speed', value: '48 hours vs 2 weeks', change: '+85%' }
    ],
    rating: 5
  }
]

export default function FarmerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentTestimonial = TESTIMONIALS[currentIndex]

  useEffect(() => {
    if (isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % TESTIMONIALS.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % TESTIMONIALS.length)
    setIsPlaying(true)
  }

  const prevTestimonial = () => {
    setCurrentIndex(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
    setIsPlaying(true)
  }

  return (
    <div className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D693D]/10 rounded-full mb-6">
            <Quote className="w-5 h-5 text-[#3D693D]" />
            <span className="text-sm font-semibold text-[#3D693D] uppercase tracking-wider">Real Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            Meet the Farmers Transforming Agriculture
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real people, real results, real South African agriculture
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <div className="mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left: Image & Video */}
                <div className="relative h-96 lg:h-auto">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                  {currentTestimonial.videoUrl && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl group"
                        onClick={() => window.open(currentTestimonial.videoUrl, '_blank')}
                      >
                        <Play className="w-8 h-8 text-[#3D693D] ml-1 group-hover:text-[#2A4A2A] transition-colors" />
                      </motion.button>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-gray-900">{currentTestimonial.name}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(currentTestimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="capitalize font-semibold">{currentTestimonial.role}</span>
                        <span>•</span>
                        <span>{currentTestimonial.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Quote & Results */}
                <div className="p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <Quote className="w-12 h-12 text-[#3D693D]/20 mb-6" />
                    <p className="text-2xl md:text-3xl font-semibold text-gray-900 leading-relaxed mb-8">
                      &ldquo;{currentTestimonial.quote}&rdquo;
                    </p>
                  </div>

                  {/* Results */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Their Results</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {currentTestimonial.results.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-[#3D693D]/5 rounded-xl p-4 border border-[#3D693D]/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">{result.metric}</span>
                            <span className="text-sm font-black text-[#3D693D]">{result.change}</span>
                          </div>
                          <div className="text-lg font-black text-gray-900">{result.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-[#3D693D] text-white flex items-center justify-center shadow-lg hover:bg-[#2A4A2A] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsPlaying(true)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-[#3D693D]'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-[#3D693D] text-white flex items-center justify-center shadow-lg hover:bg-[#2A4A2A] transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Meet the Farmers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setCurrentIndex(index)
                setIsPlaying(true)
              }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                index === currentIndex ? 'ring-4 ring-[#3D693D]' : ''
              }`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h4 className="text-xl font-black mb-1">{testimonial.name}</h4>
                <p className="text-sm text-white/80 capitalize">{testimonial.role} • {testimonial.location}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
