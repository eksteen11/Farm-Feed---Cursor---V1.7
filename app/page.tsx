'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import ImageComponent from '@/components/ui/Image'
import ClientOnly from '@/components/ui/ClientOnly'
import { useStore } from '@/store/useStore'
import { canUserPerformAction } from '@/types'
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Truck, 
  ArrowRight,
  Star,
  CheckCircle,
  Eye,
  Package,
  ShoppingCart,
  Plus,
  Search,
  FileText,
  MessageSquare,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Zap,
  Target,
  Heart
} from 'lucide-react'
import { mockListings } from '@/lib/mockData'

type UserType = 'buyer' | 'seller' | 'transporter'

export default function HomePage() {
  const { currentUser } = useStore()
  const featuredListings = mockListings.slice(0, 3)
  const [selectedUserType, setSelectedUserType] = useState<UserType>('buyer')

  // User type configurations with industry-specific USPs
  const userTypeConfig = {
    buyer: {
      title: "Buy Quality Grain & Feed",
      subtitle: "Source maize, wheat, soybeans, and feed from verified South African farmers",
      color: "green",
      icon: ShoppingCart,
      problem: "Finding reliable suppliers with quality grain and feed products",
      solution: "Access verified farmers with quality certificates, transparent pricing, and guaranteed delivery",
      benefits: [
        "Quality certificates & lab analysis",
        "Transparent pricing & negotiations", 
        "Reliable delivery & logistics",
        "Secure transactions & contracts"
      ],
      usp: "Get the best prices on maize, wheat, and feed with quality guarantees"
    },
    seller: {
      title: "Sell Your Grain & Feed",
      subtitle: "Reach feedlots, mills, and traders nationwide with your agricultural products",
      color: "green", 
      icon: Package,
      problem: "Finding reliable buyers for your grain and feed products",
      solution: "Reach verified feedlots, mills, and traders with professional product listings",
      benefits: [
        "Professional listing creation with images",
        "Direct communication with buyers",
        "Flexible delivery options",
        "Reputation building & reviews"
      ],
      usp: "Maximize your grain and feed sales with direct access to verified buyers"
    },
    transporter: {
      title: "Transport Agricultural Products",
      subtitle: "Find consistent loads and optimize your routes across South Africa",
      color: "green",
      icon: Truck,
      problem: "Finding consistent grain and feed transport loads",
      solution: "Access integrated transport marketplace with route optimization and backload matching",
      benefits: [
        "Route optimization & backload matching",
        "Consistent grain & feed loads",
        "Reputation system & reviews",
        "Reliable payments & contracts"
      ],
      usp: "Reduce empty trips and maximize revenue with smart route optimization"
    }
  }

  const currentConfig = userTypeConfig[selectedUserType]

  // Feature ordering and emphasis for each user type (aligned with blueprint)
  const featureConfig = {
    buyer: {
      priority: ['Quality Verification', 'Product Listings', 'Offer Management', 'Transport Integration', 'Document Management', 'Email Notifications', 'Dashboard Analytics', 'Mobile Access'],
      emphasis: ['Quality Verification', 'Product Listings', 'Offer Management']
    },
    seller: {
      priority: ['Product Listings', 'Offer Management', 'Transport Options', 'Document Management', 'Email Notifications', 'Dashboard Analytics', 'Quality Verification', 'Mobile Access'],
      emphasis: ['Product Listings', 'Offer Management', 'Transport Options']
    },
    transporter: {
      priority: ['Transport Requests', 'Backload Listings', 'Route Optimization', 'Quote Management', 'Document Management', 'Email Notifications', 'Dashboard Analytics', 'Mobile Access'],
      emphasis: ['Transport Requests', 'Backload Listings', 'Route Optimization']
    }
  }

  const currentFeatureConfig = featureConfig[selectedUserType]

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-16">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-900 via-gray-800 to-orange-900">
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&crop=center"
            alt="South African Agricultural Landscape"
            className="w-full h-full object-cover object-center scale-110 animate-slow-zoom"
            style={{ minHeight: '100vh', minWidth: '100vw' }}
          />
          {/* Dynamic Overlay Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-transparent to-orange-900/30 z-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/50 z-30"></div>
          {/* Smooth gradient transition to white space */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/90 via-white/60 via-white/30 to-transparent z-35"></div>
          
          {/* Floating Particles for Cinematic Effect */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-float animation-delay-1000 opacity-80"></div>
          <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-red-400 rounded-full animate-float animation-delay-2000 opacity-70"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-green-300 rounded-full animate-float animation-delay-1500 opacity-60"></div>
          <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-float animation-delay-3000 opacity-50"></div>
        </div>

        {/* Enhanced Hero Content */}
        <div className="relative z-40 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Industry & Problem Statement */}
          <div className="mb-8 animate-fade-in-up animation-delay-100">
            <div className="text-center mb-6">
              <span className="inline-block bg-green-500/20 text-green-200 px-4 py-2 rounded-full text-sm font-medium border border-green-400/30">
                🌾 Agricultural Trading Platform
              </span>
            </div>
            <p className="text-lg md:text-xl text-red-200 font-medium text-center">
              South African grain & feed traders struggle with fragmented markets, trust issues, and inefficient logistics
            </p>
          </div>

          {/* Solution Statement */}
          <div className="mb-16 animate-fade-in-up animation-delay-200">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
              <span className="block">Farm Feed</span>
              <span className="block bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Grain & Feed Trading
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-4xl mx-auto mb-4">
              The unified platform for maize, wheat, soybeans, and feed trading across South Africa
            </p>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
              Connect buyers, sellers, and transporters in one trusted marketplace
            </p>
          </div>

          {/* User Type Selector */}
          <div className="mb-12 animate-fade-in-up animation-delay-300">
            <p className="text-lg text-gray-200 mb-6">I am a:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              {Object.entries(userTypeConfig).map(([type, config]) => {
                const Icon = config.icon
                const isSelected = selectedUserType === type
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedUserType(type as UserType)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? type === 'buyer' 
                          ? 'border-green-400 bg-green-500/20 text-white shadow-lg'
                          : type === 'seller'
                          ? 'border-red-400 bg-red-500/20 text-white shadow-lg'
                          : 'border-green-400 bg-green-500/20 text-white shadow-lg'
                        : 'border-white/30 bg-white/10 text-gray-200 hover:bg-white/20 hover:border-white/50'
                    }`}
                  >
                    <ClientOnly fallback={<div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />}>
                      <Icon className="w-6 h-6" />
                    </ClientOnly>
                    <span className="font-semibold capitalize">{type}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* User-Specific Content */}
          <div className="animate-fade-in-up animation-delay-400">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {currentConfig.title}
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {currentConfig.subtitle}
            </p>
            
            {/* Problem, Solution & USP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-red-200 mb-3">The Problem</h3>
                <p className="text-gray-200 text-sm">{currentConfig.problem}</p>
              </div>
              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-green-200 mb-3">Our Solution</h3>
                <p className="text-gray-200 text-sm">{currentConfig.solution}</p>
              </div>
              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-green-200 mb-3">Your Advantage</h3>
                <p className="text-gray-200 text-sm">{currentConfig.usp}</p>
              </div>
            </div>
          </div>

          {/* User-Specific Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-fade-in-up animation-delay-500 mt-8">
            <ClientOnly fallback={
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <div className="px-12 py-6 bg-gray-300 rounded-2xl animate-pulse">
                  <div className="w-32 h-6 bg-gray-400 rounded"></div>
                </div>
                <div className="px-12 py-6 bg-gray-300 rounded-2xl animate-pulse">
                  <div className="w-32 h-6 bg-gray-400 rounded"></div>
                </div>
              </div>
            }>
              {currentUser ? (
                <>
                  {/* Logged in user buttons */}
                  <Link href="/dashboard" className="group">
                    <button className="relative overflow-hidden px-12 py-6 bg-white/10 backdrop-blur-sm text-white text-xl font-bold rounded-2xl border-2 border-white/30 shadow-cinematic transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/50 active:scale-95">
                      <span className="relative z-10 flex items-center">
                        <ClientOnly fallback={<div className="w-6 h-6 bg-gray-300 rounded animate-pulse mr-2" />}>
                          <Package className="w-6 h-6 mr-2" />
                        </ClientOnly>
                        Go to Dashboard
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                  </Link>
                </>
              ) : (
              <>
                {/* User-specific CTA buttons */}
                {selectedUserType === 'buyer' && (
                  <>
                    <Link href="/register" className="group">
                      <button className="relative overflow-hidden px-12 py-6 bg-gradient-to-r from-green-600 to-green-500 text-white text-xl font-bold rounded-2xl shadow-cinematic transform transition-all duration-300 hover:scale-105 hover:shadow-cinematic-glow active:scale-95">
                        <span className="relative z-10 flex items-center">
                          <ClientOnly fallback={<div className="w-6 h-6 bg-gray-300 rounded animate-pulse mr-2" />}>
                            <Search className="w-6 h-6 mr-2" />
                          </ClientOnly>
                          Start Buying Today
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </button>
                    </Link>
                    <Link href="/listings" className="group">
                      <button className="relative overflow-hidden px-12 py-6 bg-white/10 backdrop-blur-sm text-white text-xl font-bold rounded-2xl border-2 border-white/30 shadow-cinematic transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/50 active:scale-95">
                        <span className="relative z-10 flex items-center">
                          <ClientOnly fallback={<div className="w-6 h-6 bg-gray-300 rounded animate-pulse mr-2" />}>
                            <ShoppingCart className="w-6 h-6 mr-2" />
                          </ClientOnly>
                          Browse Products
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </Link>
                  </>
                )}
                
                {selectedUserType === 'seller' && (
                  <>
                    <Link href="/register" className="group">
                      <button className="relative overflow-hidden px-12 py-6 bg-gradient-to-r from-red-600 to-red-500 text-white text-xl font-bold rounded-2xl shadow-cinematic transform transition-all duration-300 hover:scale-105 hover:shadow-cinematic-glow active:scale-95">
                        <span className="relative z-10 flex items-center">
                          <ClientOnly fallback={<div className="w-6 h-6 bg-gray-300 rounded animate-pulse mr-2" />}>
                            <Plus className="w-6 h-6 mr-2" />
                          </ClientOnly>
                          Start Selling Today
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </button>
                    </Link>
                    <Link href="/listings" className="group">
                      <button className="relative overflow-hidden px-12 py-6 bg-white/10 backdrop-blur-sm text-white text-xl font-bold rounded-2xl border-2 border-white/30 shadow-cinematic transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/50 active:scale-95">
                        <span className="relative z-10 flex items-center">
                          <ClientOnly fallback={<div className="w-6 h-6 bg-gray-300 rounded animate-pulse mr-2" />}>
                            <Eye className="w-6 h-6 mr-2" />
                          </ClientOnly>
                          See Market Prices
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </Link>
                  </>
                )}
                
                {selectedUserType === 'transporter' && (
                  <>
                    <Link href="/register" className="group">
                      <button className="relative overflow-hidden px-12 py-6 bg-gradient-to-r from-green-600 to-green-500 text-white text-xl font-bold rounded-2xl shadow-cinematic transform transition-all duration-300 hover:scale-105 hover:shadow-cinematic-glow active:scale-95">
                        <span className="relative z-10 flex items-center">
                          <ClientOnly fallback={<div className="w-6 h-6 bg-gray-300 rounded animate-pulse mr-2" />}>
                            <Truck className="w-6 h-6 mr-2" />
                          </ClientOnly>
                          Start Transporting Today
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </button>
                    </Link>
                    <Link href="/transport" className="group">
                      <button className="relative overflow-hidden px-12 py-6 bg-white/10 backdrop-blur-sm text-white text-xl font-bold rounded-2xl border-2 border-white/30 shadow-cinematic transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/50 active:scale-95">
                        <span className="relative z-10 flex items-center">
                          <ClientOnly fallback={<div className="w-6 h-6 bg-gray-300 rounded animate-pulse mr-2" />}>
                            <MapPin className="w-6 h-6 mr-2" />
                          </ClientOnly>
                          View Transport Requests
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
            </ClientOnly>
          </div>

          {/* Floating Elements for Cinematic Effect */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse animation-delay-600"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-red-400/20 rounded-full blur-xl animate-pulse animation-delay-700"></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse animation-delay-800"></div>
          
          {/* Additional Cinematic Elements */}
          <div className="absolute top-1/3 left-1/6 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-2xl animate-glow"></div>
          <div className="absolute bottom-1/3 right-1/6 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full blur-2xl animate-glow animation-delay-1000"></div>
        </div>

        
        {/* Cinematic Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-green-400/30 rounded-tl-3xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-red-400/30 rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-yellow-400/30 rounded-bl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-green-400/30 rounded-br-3xl"></div>
      </section>

      {/* Step-by-Step Workflow Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works for {selectedUserType === 'buyer' ? 'Buyers' : selectedUserType === 'seller' ? 'Sellers' : 'Transporters'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to get started and achieve your goals
            </p>
          </div>

          {/* Dynamic Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {selectedUserType === 'buyer' && (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Users className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Register & Verify</h3>
                  <p className="text-gray-600 text-sm">Create your account and verify your identity to access quality suppliers</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Search className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Browse Products</h3>
                  <p className="text-gray-600 text-sm">Search and filter quality products with certificates and specifications</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Compare & Negotiate</h3>
                  <p className="text-gray-600 text-sm">Compare prices, quality, and negotiate terms with sellers</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Truck className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Arrange Delivery</h3>
                  <p className="text-gray-600 text-sm">Choose delivery options and coordinate with transporters</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Complete Transaction</h3>
                  <p className="text-gray-600 text-sm">Receive products, automatically generated contracts & invoices via email, and build relationships</p>
                </div>
              </>
            )}

            {selectedUserType === 'seller' && (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Users className="w-8 h-8 text-red-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Register & Verify</h3>
                  <p className="text-gray-600 text-sm">Create your account and verify your identity to build trust</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Plus className="w-8 h-8 text-red-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Create Listings</h3>
                  <p className="text-gray-600 text-sm">Add product images, certificates, grades, and packaging details</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <MessageSquare className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Manage Offers</h3>
                  <p className="text-gray-600 text-sm">Receive offers, negotiate terms, and communicate with buyers</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Truck className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Arrange Delivery</h3>
                  <p className="text-gray-600 text-sm">Choose pickup or delivery options and coordinate logistics</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Complete Sale</h3>
                  <p className="text-gray-600 text-sm">Generate contracts, invoices, and receive payment</p>
                </div>
              </>
            )}

            {selectedUserType === 'transporter' && (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Users className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Register & Verify</h3>
                  <p className="text-gray-600 text-sm">Create your account and verify your transport credentials</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Search className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Find Opportunities</h3>
                  <p className="text-gray-600 text-sm">Browse transport requests and backload opportunities</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <FileText className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Submit Quotes</h3>
                  <p className="text-gray-600 text-sm">Provide competitive quotes with vehicle details and pricing</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <MapPin className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Optimize Routes</h3>
                  <p className="text-gray-600 text-sm">Plan efficient routes and find backload opportunities</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Award className="w-8 h-8 text-green-600" />
                    </ClientOnly>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Build Reputation</h3>
                  <p className="text-gray-600 text-sm">Complete deliveries, get rated, and build your reputation</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Active Farmers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Regions Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">99%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Listings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover high-quality agricultural products from verified sellers across South Africa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <ImageComponent
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                  />
                  <div className="absolute top-3 right-3 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {listing.product.category}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary-600">
                      R{listing.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.quantity} {listing.product.unit}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <ImageComponent
                        src={listing.seller.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                        alt={listing.seller.name || "Seller"}
                        className="w-5 h-5 rounded-full mr-2"
                        fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      />
                      {listing.seller.name || "Unknown Seller"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.location}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link href={`/listings/${listing.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/listings/${listing.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        Make Offer
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/listings">
              <Button variant="secondary" size="lg">
                View All Listings
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How Farm Feed Works - Only show when no user type is selected */}
      {!selectedUserType && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How Farm Feed Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Simple steps to start trading agricultural products with confidence
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                    <Users className="w-8 h-8 text-green-600" />
                  </ClientOnly>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Create Account</h3>
                <p className="text-gray-600">
                  Sign up and verify your identity to access our trusted trading platform
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </ClientOnly>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Browse & Connect</h3>
                <p className="text-gray-600">
                  Find products or buyers, make offers, and negotiate terms directly
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                    <Truck className="w-8 h-8 text-green-600" />
                  </ClientOnly>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Complete Deal</h3>
                <p className="text-gray-600">
                  Confirm your deal, arrange transport, and complete the transaction securely
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Features Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Platform Features That Help You Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful tools and features designed to make your agricultural trading experience seamless and profitable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(() => {
              const features: Record<string, any> = {
                'Quality Verification': {
                  icon: Shield,
                  color: 'blue',
                  description: 'Verified sellers with quality certificates and lab analysis for grain and feed products',
                  benefits: ['Quality certificates', 'Lab analysis reports', 'Verified sellers']
                },
                'Product Listings': {
                  icon: Package,
                  color: 'green',
                  description: 'Browse and create detailed listings for maize, wheat, soybeans, and feed products',
                  benefits: ['Product images', 'Quality grades', 'Packaging options']
                },
                'Offer Management': {
                  icon: MessageSquare,
                  color: 'purple',
                  description: 'Make offers, negotiate terms, and manage deals with direct communication',
                  benefits: ['Make offers', 'Negotiate terms', 'Deal management']
                },
                'Transport Integration': {
                  icon: Truck,
                  color: 'orange',
                  description: 'Integrated transport marketplace with route optimization and delivery coordination',
                  benefits: ['Transport requests', 'Route optimization', 'Delivery tracking']
                },
                'Transport Requests': {
                  icon: Truck,
                  color: 'orange',
                  description: 'Submit and manage transport requests for grain and feed deliveries',
                  benefits: ['Request transport', 'Track deliveries', 'Coordinate logistics']
                },
                'Backload Listings': {
                  icon: MapPin,
                  color: 'yellow',
                  description: 'List empty truck space and find backload opportunities to maximize revenue',
                  benefits: ['Empty truck listings', 'Backload matching', 'Route optimization']
                },
                'Route Optimization': {
                  icon: Target,
                  color: 'indigo',
                  description: 'Smart route planning to minimize empty trips and maximize efficiency',
                  benefits: ['Route planning', 'Empty trip reduction', 'Efficiency optimization']
                },
                'Quote Management': {
                  icon: FileText,
                  color: 'red',
                  description: 'Submit competitive transport quotes and manage pricing for different routes',
                  benefits: ['Submit quotes', 'Pricing management', 'Competitive rates']
                },
                'Transport Options': {
                  icon: Truck,
                  color: 'orange',
                  description: 'Choose between pickup, delivery, or seller-arranged transport options',
                  benefits: ['Pickup options', 'Delivery services', 'Seller transport']
                },
                'Document Management': {
                  icon: FileText,
                  color: 'purple',
                  description: 'Automatic contract generation, invoice creation, and document tracking',
                  benefits: ['Auto-generated contracts', 'Invoice creation', 'Document tracking']
                },
                'Email Notifications': {
                  icon: MessageSquare,
                  color: 'green',
                  description: 'Instant email notifications for offers, deals, and important updates',
                  benefits: ['Offer notifications', 'Deal updates', 'Status alerts']
                },
                'Dashboard Analytics': {
                  icon: TrendingUp,
                  color: 'indigo',
                  description: 'Track your trading performance with detailed analytics and insights',
                  benefits: ['Performance metrics', 'Trading insights', 'Revenue tracking']
                },
                'Mobile Access': {
                  icon: Zap,
                  color: 'teal',
                  description: 'Access your trading activities anywhere with our mobile-optimized platform',
                  benefits: ['Mobile-first design', 'Touch-friendly interface', 'Anywhere access']
                }
              }

              return currentFeatureConfig.priority.map((featureName: string, index: number) => {
                const feature = features[featureName]
                if (!feature) return null // Skip if feature not found
                const Icon = feature.icon
                const isEmphasized = currentFeatureConfig.emphasis.includes(featureName)
                
                return (
                <div 
                  key={featureName}
                  className={`bg-white p-8 rounded-2xl shadow-card hover:shadow-lg transition-shadow group ${
                    isEmphasized ? 'ring-2 ring-green-200 bg-green-50/30' : ''
                  }`}
                >
                  {isEmphasized && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Recommended
                    </div>
                  )}
                  <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <ClientOnly fallback={<div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />}>
                      <Icon className={`w-8 h-8 text-${feature.color}-600`} />
                    </ClientOnly>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{featureName}</h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  {feature.benefits.map((benefit: string, benefitIndex: number) => (
                    <div key={benefitIndex} className={`text-sm text-${feature.color}-600 font-medium`}>
                      ✓ {benefit}
                    </div>
                  ))}
                </div>
              )
            })
            })()}
          </div>
        </div>
      </section>

      {/* User-Specific CTA Section */}
      <section className={`py-20 text-white ${
        selectedUserType === 'buyer' ? 'bg-green-600' : 
        selectedUserType === 'seller' ? 'bg-red-600' : 
        'bg-green-600'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {selectedUserType === 'buyer' && "Ready to Find Quality Suppliers?"}
            {selectedUserType === 'seller' && "Ready to Reach More Buyers?"}
            {selectedUserType === 'transporter' && "Ready to Find More Loads?"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {selectedUserType === 'buyer' && "Join thousands of buyers who trust Farm Feed for quality agricultural products"}
            {selectedUserType === 'seller' && "Join thousands of sellers who trust Farm Feed to reach more customers"}
            {selectedUserType === 'transporter' && "Join thousands of transporters who trust Farm Feed for consistent loads"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                {selectedUserType === 'buyer' && "Start Buying Today"}
                {selectedUserType === 'seller' && "Start Selling Today"}
                {selectedUserType === 'transporter' && "Start Transporting Today"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
