'use client'

import React from 'react'
import { Card, CardContent } from './Card'
import { Star } from 'lucide-react'
import ImageComponent from './Image'

interface TestimonialCardProps {
  name: string
  role: string
  company?: string
  image?: string
  rating: number
  testimonial: string
  result?: string
}

export default function TestimonialCard({
  name,
  role,
  company,
  image,
  rating,
  testimonial,
  result
}: TestimonialCardProps) {
  return (
    <Card variant="elevated" className="h-full group hover:scale-[1.02] transition-all duration-300">
      <CardContent className="p-8">
        {/* Rating with Enhanced Visual */}
        <div className="flex items-center gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 transition-all ${
                i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-semibold text-gray-600">{rating}.0</span>
        </div>

        {/* Testimonial with Quote Icon */}
        <div className="relative mb-6">
          <div className="absolute -top-2 -left-2 text-[#3D693D]/20 text-6xl font-serif leading-none">&quot;</div>
          <p className="text-gray-700 text-lg leading-relaxed relative z-10 pl-4">
            {testimonial}
          </p>
        </div>

        {/* Result with Enhanced Styling */}
        {result && (
          <div className="bg-gradient-to-r from-[#3D693D]/10 via-[#5A8A5A]/10 to-[#3D693D]/10 border-2 border-[#3D693D]/20 rounded-xl p-4 mb-6 group-hover:border-[#3D693D]/30 transition-colors">
            <p className="text-[#3D693D] font-bold text-sm leading-relaxed">{result}</p>
          </div>
        )}

        {/* Author with Enhanced Profile */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <div className="relative">
            <ImageComponent
              src={image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
              alt={name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#3D693D]/20 group-hover:ring-[#3D693D]/40 transition-all"
              fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#3D693D] rounded-full border-2 border-white flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-base">{name}</p>
            <p className="text-sm text-gray-600 font-medium">
              {role}
              {company && <span className="text-[#3D693D]"> • {company}</span>}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

