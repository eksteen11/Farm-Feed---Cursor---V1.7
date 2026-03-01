'use client'

import React from 'react'
import { Card, CardContent } from './Card'
import ImageComponent from './Image'
import { CheckCircle, Award, FileText, Shield, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Button from './Button'
import { ArrowRight } from 'lucide-react'

interface ProductShowcaseProps {
  className?: string
}

const showcaseProducts = [
  {
    id: 1,
    title: "Grade A Yellow Maize",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80",
    price: 4500,
    quantity: "50 tons",
    location: "Free State",
    seller: "Vredenburg Farms",
    rating: 4.9,
    verified: true,
    certificates: ["SANS 214", "Lab Tested"],
    qualityGrade: "A",
    moisture: "12.5%",
    protein: "8.2%"
  },
  {
    id: 2,
    title: "Premium Soybean Meal",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop&q=80",
    price: 6800,
    quantity: "30 tons",
    location: "Gauteng",
    seller: "Mthembu Feedlots",
    rating: 5.0,
    verified: true,
    certificates: ["ISO Certified", "Quality Assured"],
    qualityGrade: "Premium",
    moisture: "10.2%",
    protein: "44.5%"
  },
  {
    id: 3,
    title: "High-Quality Wheat",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&q=80",
    price: 5200,
    quantity: "75 tons",
    location: "Western Cape",
    seller: "Botha Farms",
    rating: 4.8,
    verified: true,
    certificates: ["SANS 214", "Organic Certified"],
    qualityGrade: "A+",
    moisture: "11.8%",
    protein: "12.1%"
  }
]

export default function ProductShowcase({ className = '' }: ProductShowcaseProps) {
  return (
    <section className={`relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden ${className}`}>
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(61, 105, 61, 0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D693D]/10 rounded-full mb-6">
            <Award className="w-5 h-5 text-[#3D693D]" />
            <span className="text-sm font-semibold text-[#3D693D]">Premium Quality Products</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            See the Quality You&apos;re Trading
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every product comes with quality certificates, lab results, and verified sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {showcaseProducts.map((product) => (
            <Card 
              key={product.id} 
              variant="elevated" 
              className="overflow-hidden group hover:scale-[1.02] transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-video bg-gray-200 overflow-hidden">
                <ImageComponent
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop"
                />
                
                {/* Quality Badge */}
                <div className="absolute top-4 left-4 bg-[#3D693D] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Grade {product.qualityGrade}
                </div>
                
                {/* Verified Badge */}
                {product.verified && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-[#3D693D]">
                    <Shield className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                {/* Title & Rating */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <div className="text-2xl font-black bg-gradient-to-r from-[#3D693D] to-[#5A8A5A] bg-clip-text text-transparent">
                      R{product.price.toLocaleString()}/ton
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{product.quantity} available</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{product.location}</div>
                    <div className="text-xs text-gray-500">{product.seller}</div>
                  </div>
                </div>

                {/* Quality Specs */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Moisture Content:</span>
                    <span className="font-semibold text-gray-900">{product.moisture}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Protein Content:</span>
                    <span className="font-semibold text-gray-900">{product.protein}</span>
                  </div>
                </div>

                {/* Certificates */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {product.certificates.map((cert, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 bg-[#3D693D]/10 rounded-md text-xs font-medium text-[#3D693D]"
                      >
                        <FileText className="w-3 h-3" />
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Link href="/listings" className="block">
                  <Button className="w-full" size="sm">
                    View Full Details
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quality Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-2xl border-2 border-[#3D693D]/10">
            <CheckCircle className="w-8 h-8 text-[#3D693D] mx-auto mb-3" />
            <div className="text-2xl font-black text-gray-900 mb-1">100%</div>
            <div className="text-sm text-gray-600">Verified Sellers</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border-2 border-[#3D693D]/10">
            <FileText className="w-8 h-8 text-[#3D693D] mx-auto mb-3" />
            <div className="text-2xl font-black text-gray-900 mb-1">All</div>
            <div className="text-sm text-gray-600">Lab Tested</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border-2 border-[#3D693D]/10">
            <Shield className="w-8 h-8 text-[#3D693D] mx-auto mb-3" />
            <div className="text-2xl font-black text-gray-900 mb-1">4.8/5</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border-2 border-[#3D693D]/10">
            <TrendingUp className="w-8 h-8 text-[#3D693D] mx-auto mb-3" />
            <div className="text-2xl font-black text-gray-900 mb-1">R50M+</div>
            <div className="text-sm text-gray-600">Traded</div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/listings">
            <Button variant="secondary" size="lg" className="min-h-[56px] sm:min-h-[64px]">
              Browse All Premium Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}


