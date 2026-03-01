'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/shared/ui/Button'
import { Card, CardContent } from '@/shared/ui/Card'
import ImageComponent from '@/shared/ui/Image'
import ClientOnly from '@/shared/ui/ClientOnly'
import UserTypeSelector from '@/shared/ui/UserTypeSelector'
import TestimonialCard from '@/shared/ui/TestimonialCard'
import { StatsCounter } from '@/shared/ui/StatsCounter'
import FAQSection from '@/shared/ui/FAQSection'
import LiveActivityFeed from '@/shared/ui/LiveActivityFeed'
import TornadoHero from '@/shared/ui/TornadoHero'
import Tooltip from '@/shared/ui/Tooltip'
import ScrollReveal from '@/shared/ui/ScrollReveal'
import ProductShowcase from '@/shared/ui/ProductShowcase'
import PricingSection from '@/shared/ui/PricingSection'
import { useSupabaseStore } from '@/store/useSupabaseStore'
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
  DollarSign,
  Award,
  Zap,
  Target
} from 'lucide-react'
import { mockListings } from '@/shared/utils/mockData'
import { motion, AnimatePresence } from 'framer-motion'

type UserType = 'buyer' | 'seller' | 'transporter'

export default function HomePage() {
  const { currentUser, getCurrentUser } = useSupabaseStore()
  const router = useRouter()
  const featuredListings = mockListings.slice(0, 3)
  const [selectedUserType, setSelectedUserType] = useState<UserType>('buyer')
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null)
  const [isTransformed, setIsTransformed] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:46',message:'HomePage component mounted',data:{hasCurrentUser:!!currentUser},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  }, [currentUser]);
  // #endregion

  // Initialize user data when component mounts (non-blocking)
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:55',message:'getCurrentUser called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    getCurrentUser().catch((err) => {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:58',message:'getCurrentUser error',data:{errorMessage:err?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      console.error(err)
    })
  }, [])

  // Allow logged-in users to see the full homepage content
  // The homepage will show different CTAs for logged-in vs non-logged-in users

  // User type configurations - simplified and focused
  const userTypeConfig = {
    buyer: {
      title: "Find Quality Grain & Feed",
      subtitle: "Source from verified South African farmers with quality certificates",
      cta: "Browse Listings",
      ctaLink: "/listings",
      workflow: [
        { step: 1, title: "Search & Filter", description: "Find quality products with certificates and verified sellers" },
        { step: 2, title: "Make Offer", description: "Submit offer with price, quantity, and delivery type" },
        { step: 3, title: "Complete Deal", description: "Auto-generated contracts, payment tracking, and delivery" }
      ],
      keyFeatures: [
        { icon: Shield, title: "Verified Sellers", description: "FICA verified with reputation scores", tooltip: "All sellers are FICA verified and have reputation scores based on successful deals" },
        { icon: FileText, title: "Quality Certificates", description: "Lab results and certificates on every listing", tooltip: "Every listing includes quality certificates, lab results, and product specifications" },
        { icon: Zap, title: "Auto-Contracts", description: "Contracts and invoices generated automatically", tooltip: "Contracts and invoices are automatically generated when deals are accepted, saving hours of admin work" },
        { icon: Truck, title: "Transport Integration", description: "Integrated transport marketplace", tooltip: "Find transport for your orders or list empty truck space for backloads - all in one place" },
        { icon: MessageSquare, title: "Real-time Chat", description: "Deal-scoped chat with attachments", tooltip: "Communicate directly with buyers/sellers within each deal, with file attachments and notifications" },
        { icon: DollarSign, title: "Payment Tracking", description: "Track off-platform payments with POP", tooltip: "Upload proof of payment and track payment status in real-time for complete transparency" }
      ]
    },
    seller: {
      title: "Sell Your Grain & Feed",
      subtitle: "Reach verified buyers nationwide with professional listings",
      cta: "Create Your First Listing",
      ctaLink: "/seller/create-listing",
      workflow: [
        { step: 1, title: "Create Listing", description: "Add product details, images, certificates, and grades" },
        { step: 2, title: "Receive Offers", description: "Buyers make offers - see reputation and negotiate terms" },
        { step: 3, title: "Get Paid", description: "Accept offer, auto-contracts generated, payment confirmed" }
      ],
      keyFeatures: [
        { icon: Package, title: "Professional Listings", description: "Create listings with images and certificates", tooltip: "Create professional listings with multiple images, quality certificates, lab results, and detailed product specifications" },
        { icon: MessageSquare, title: "Offer Management", description: "Receive, negotiate, and manage offers", tooltip: "Receive offers from verified buyers, see their reputation scores, and negotiate terms all in one place" },
        { icon: Truck, title: "Transport Options", description: "Flexible delivery and transport coordination", tooltip: "Offer ex-farm collection or delivered options. Integrated transport marketplace finds the best rates automatically" },
        { icon: FileText, title: "Auto-Contracts", description: "Contracts and invoices generated automatically", tooltip: "When you accept an offer, contracts and invoices are automatically generated, saving you hours of paperwork" },
        { icon: Star, title: "Reputation Building", description: "Build trust with ratings and reviews", tooltip: "Every successful deal builds your reputation. Higher ratings mean more buyers trust you and you can charge premium prices" },
        { icon: TrendingUp, title: "Dashboard Analytics", description: "Track performance and revenue", tooltip: "See your sales performance, revenue trends, most popular products, and buyer insights in your dashboard" }
      ]
    },
    transporter: {
      title: "Transport Agricultural Products",
      subtitle: "Find consistent loads and optimize routes across South Africa",
      cta: "Find Transport Jobs",
      ctaLink: "/transport/available",
      workflow: [
        { step: 1, title: "Find Requests", description: "Browse transport requests and filter by route" },
        { step: 2, title: "Submit Quote", description: "Auto-calculated quotes - adjust and submit" },
        { step: 3, title: "Complete Job", description: "Pickup, deliver, upload photos, get paid" }
      ],
      keyFeatures: [
        { icon: Truck, title: "Transport Requests", description: "Browse and filter transport opportunities", tooltip: "Browse transport requests from buyers and sellers. Filter by route, distance, load size, and payment terms" },
        { icon: MapPin, title: "Backload Listings", description: "List empty truck space and find backloads", tooltip: "List your empty truck space for return trips. Find backloads that match your route and maximize revenue" },
        { icon: Target, title: "Route Optimization", description: "AI-powered route planning (Enterprise)", tooltip: "Enterprise feature: AI optimizes your routes to minimize distance, fuel costs, and maximize backload opportunities" },
        { icon: FileText, title: "Quote Management", description: "Submit competitive quotes easily", tooltip: "Get auto-calculated quotes based on distance and load. Adjust and submit competitive quotes in seconds" },
        { icon: Award, title: "Build Reputation", description: "Complete deliveries and get rated", tooltip: "Every successful delivery builds your reputation. Higher ratings mean more transport requests and better rates" },
        { icon: DollarSign, title: "Reliable Payments", description: "Track payments and contracts", tooltip: "Automated contracts protect you. Track payment status and get paid within 48 hours of delivery confirmation" }
      ]
    }
  }

  // Use selectedRole if transformed, otherwise use selectedUserType
  const activeRole = selectedRole || selectedUserType
  const currentConfig = userTypeConfig[activeRole]

  const handleStartTrading = () => {
    // This will be called when user clicks "Start Trading" in hero
    // The hero will handle the morphing animation
    // Scroll to top smoothly when transformation starts
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRoleSelected = (role: UserType) => {
    // Start transition
    setIsTransitioning(true)
    
    // Update role after a brief delay for smooth transition
    setTimeout(() => {
      setSelectedRole(role)
      setIsTransformed(true)
      setSelectedUserType(role) // Also update the original state for compatibility
      
      // End transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Living Marketplace Hero - The Complete System Explained */}
      <TornadoHero 
        currentUser={currentUser}
        onStartTrading={handleStartTrading}
        onRoleSelected={handleRoleSelected}
      />

      {/* Problem/Solution Section */}
      <AnimatePresence mode="wait">
        <section key={`problem-solution-${activeRole}`} className="relative py-32 md:py-40 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              key={`problem-${activeRole}`}
              layout
              initial={isTransformed && !isTransitioning ? { opacity: 0, x: -50 } : false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="bg-gradient-to-br from-red-50 to-white rounded-3xl p-8 border-2 border-red-100 shadow-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <span className="w-2 h-12 bg-gradient-to-b from-[#DB4A39] to-[#B83A2A] rounded-full"></span>
                  The Problem
            </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {activeRole === 'buyer' && "Finding reliable suppliers with quality grain and feed products takes weeks. Quality varies, prices aren't transparent, and delivery logistics cost you R500-2000 extra per load. You waste hours calling multiple farmers, verifying certificates, and coordinating transport."}
                  {activeRole === 'seller' && "Finding reliable buyers for your grain and feed products takes 2-4 weeks. You waste time on unqualified leads, struggle with pricing transparency, and lose R300-500 per ton to transport costs. Payment delays and contract disputes eat into your profits."}
                  {activeRole === 'transporter' && "Finding consistent grain and feed transport loads is a daily struggle. Empty return trips cost you R2000-5000 per trip, route planning wastes hours, and backload opportunities are missed. You're losing 30-40% of potential revenue to empty miles."}
            </p>
            </div>
                </motion.div>
            <motion.div
              key={`solution-${activeRole}`}
              layout
              initial={isTransformed && !isTransitioning ? { opacity: 0, x: 50 } : false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="bg-[#3D693D]/5 rounded-3xl p-12 border-2 border-[#3D693D]/20 shadow-lg">
                <h2 className="text-section text-[#3D693D] mb-8 flex items-center gap-4">
                  <span className="w-2 h-12 bg-[#3D693D] rounded-full"></span>
                  Our Solution
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {activeRole === 'buyer' && "Find verified farmers with quality certificates in 24 hours. Transparent pricing, guaranteed delivery, and automated contracts save you 10+ hours per deal. Integrated transport saves R300-500 per load. Join 200+ buyers who've traded R50M+ on the platform."}
                  {activeRole === 'seller' && "Reach 200+ verified feedlots, mills, and traders with professional listings. Sell in 48 hours instead of 2-4 weeks. Automated contracts save 5+ hours per deal. Integrated transport saves R300-500 per ton. Track payments in real-time. Join 300+ sellers who've completed 1000+ deals."}
                  {activeRole === 'transporter' && "Access 50+ transport requests monthly with route optimization and backload matching. Reduce empty trips by 40%, increase revenue by R5000-10000 per month. Reliable payments within 48 hours. Smart routing saves 2-3 hours per trip. Join 100+ transporters earning consistently."}
                </p>
              </div>
                </motion.div>
              </div>
                </div>
        </section>
      </AnimatePresence>

      {/* How It Works - 3 Steps Only */}
      <AnimatePresence mode="wait">
        <section key={`how-it-works-${activeRole}`} id="how-it-works" className="relative py-32 md:py-40 bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-section text-gray-900 mb-8">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From signup to your first deal in under 48 hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {currentConfig.workflow.map((step: any, index: number) => {
              const IconComponent = step.step === 1 ? Users : step.step === 2 ? Search : CheckCircle
              return (
                <motion.div
                  key={`workflow-${activeRole}-${step.step}`}
                  layout
                  initial={isTransformed && !isTransitioning ? { opacity: 0, y: 30 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="text-center group">
                    {/* Enhanced Step Circle with Gradient */}
                    <div className="relative w-24 h-24 bg-[#3D693D] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-black shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <span className="relative z-10">{step.step}</span>
                    </div>

                    {/* Icon */}
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-[#3D693D]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#3D693D]/20 transition-colors">
                        <IconComponent className="w-8 h-8 text-[#3D693D]" />
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-[#3D693D] transition-colors">{step.title}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
                </div>
                </div>
        </section>
      </AnimatePresence>

      {/* Key Features - Streamlined */}
      <AnimatePresence mode="wait">
        <section key={`features-${activeRole}`} id="features" className="relative py-32 md:py-40 bg-white">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-section text-gray-900 mb-8">
              Everything You Need to Trade Successfully
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features that save you time, money, and eliminate risk
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {currentConfig.keyFeatures.map((feature: any, index: number) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={`feature-${activeRole}-${index}`}
                  layout
                  initial={isTransformed && !isTransitioning ? { opacity: 0, y: 30 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Card 
                    variant="elevated" 
                    className="p-12 text-center group border-2 border-transparent hover:border-[#3D693D]/20"
                  >
                    {/* Large Icon */}
                    <div className="w-16 h-16 mx-auto mb-8 bg-[#3D693D]/10 rounded-2xl flex items-center justify-center">
                      <Icon className="w-10 h-10 text-[#3D693D]" />
                  </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-[#3D693D] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              )
            })}
                  </div>
                </div>
        </section>
      </AnimatePresence>

      {/* Stats Section */}
      <section className="relative py-32 md:py-40 bg-[#3D693D] text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { value: 500, suffix: '+', label: 'Active Farmers', icon: Users, decimals: 0 },
              { value: 50, prefix: 'R', suffix: 'M+', label: 'In Transactions', icon: TrendingUp, decimals: 0 },
              { value: 4.8, suffix: '/5', label: 'Average Rating', icon: Star, decimals: 1 },
              { value: 99, suffix: '%', label: 'Deal Completion', icon: CheckCircle, decimals: 0 }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="group hover-lift">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border border-white/20 group-hover:scale-110 group-hover:border-white/40">
                      <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 text-white group-hover:text-green-100 transition-colors duration-300">
                    <StatsCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="text-lg text-green-100 font-medium group-hover:text-white transition-colors duration-300">{stat.label}</div>
                </div>
              )
            })}
                  </div>
          <div className="text-center mt-12">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#3D693D] hover:bg-gray-100 min-h-[64px] px-12 shadow-2xl hover:shadow-[#3D693D]/20 transition-all duration-300 hover:scale-105 font-bold group">
                <span className="flex items-center">
                  Join 500+ Verified Farmers - Free to Start
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <p className="text-green-100 text-sm mt-4 font-medium">
              No credit card required • Start trading in 5 minutes
            </p>
          </div>
        </div>
      </section>


      {/* Social Proof - Testimonials */}
      <section className="relative py-32 md:py-40 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8">
              Trusted by 500+ South African Farmers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real farmers who&apos;ve transformed their trading
            </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <TestimonialCard
              name="John van der Merwe"
              role="Grain Farmer"
              company="Vredenburg Farms, Western Cape"
              rating={5}
              testimonial="Sold 50 tons of Grade A maize in my first month - something that used to take me 6-8 weeks. The platform made it so easy to find verified buyers and the automated contracts saved me 8 hours of admin work per deal. Best decision I made this year."
              result="Sold 50 tons in first month • 8 hours saved per deal"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            />
            <TestimonialCard
              name="Sarah Mthembu"
              role="Feedlot Owner"
              company="Mthembu Feedlots, KwaZulu-Natal"
              rating={5}
              testimonial="Found 3 quality suppliers with certificates in 24 hours - previously took me 2-3 weeks. The payment tracking system gives me peace of mind, and the transport integration saved me R800 on my last order. I've completed 12 deals in 3 months."
              result="Found suppliers in 24 hours • R800 saved per order"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
            />
            <TestimonialCard
              name="Mike Botha"
              role="Transporter"
              company="Botha Transport, Gauteng"
              rating={5}
              testimonial="Reduced my empty trips by 40% with backload matching. The route optimization feature is a game-changer - saves me 3 hours per trip. Payments are always on time, and I've increased my monthly revenue by R12,000. This platform changed my business."
              result="40% fewer empty trips • R12,000 more revenue/month"
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
            />
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="relative py-32 md:py-40 bg-[#3D693D] text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8">
              Real Results from Real Farmers
          </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              See how Farm Feed is transforming agricultural trading in South Africa
            </p>
                  </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl font-black mb-4 text-white">
                R50M+
                </div>
              <div className="text-xl font-semibold mb-2">Total Value Traded</div>
              <div className="text-green-100">Across 1000+ successful deals</div>
                </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl font-black mb-4 text-white">
                48hrs
                </div>
              <div className="text-xl font-semibold mb-2">Average Time to Deal</div>
              <div className="text-green-100">vs 2-4 weeks traditional methods</div>
                </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl font-black mb-4 text-white">
                99%
                </div>
              <div className="text-xl font-semibold mb-2">Deal Completion Rate</div>
              <div className="text-green-100">Highest in the industry</div>
                </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="relative py-32 md:py-40 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8">
              Featured Listings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover high-quality agricultural products from verified sellers across South Africa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {featuredListings.map((listing) => (
              <Card key={listing.id} variant="elevated" className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <ImageComponent
                    src={listing.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                  />
                  </div>
                <CardContent className="p-12">
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
                    {listing.title}
                  </h3>
                  <Link href={`/listings/${listing.id}`} className="block">
                    <Button className="w-full min-h-[56px] text-lg" size="lg">
                        View Details
                      <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
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


      {/* Product Showcase - Premium Quality Products */}
      <ProductShowcase />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection
        faqs={[
          {
            question: "How do I get started on Farm Feed?",
            answer: "Getting started is free and takes just 5 minutes. Simply sign up, complete your profile, and choose your user type (Buyer, Seller, or Transporter). Once your FICA verification is approved (usually within 24-48 hours), you can start creating listings, making offers, or finding transport jobs immediately."
          },
          {
            question: "Is Farm Feed free to use?",
            answer: "Yes! Farm Feed offers a free tier that includes 1 listing, 3 offers per month, and 1 transport request per month. For unlimited access, we offer Basic (R10/month), Premium (R25/month), and Enterprise (R50/month) plans with additional features like advanced analytics, priority support, and route optimization."
          },
          {
            question: "How does payment work?",
            answer: "Farm Feed uses off-platform payments for your security. Once a deal is accepted, we generate automated contracts and invoices. Buyers and sellers handle payments directly (EFT, cash, or other agreed methods), and you can upload proof of payment. The platform tracks payment status and sends reminders to ensure smooth transactions."
          },
          {
            question: "What is FICA verification and why do I need it?",
            answer: "FICA (Financial Intelligence Centre Act) verification ensures all users are legitimate and verified. This protects everyone on the platform from fraud. You'll need to upload your ID, bank statement, and entity registration documents. Verification typically takes 24-48 hours. You can browse listings without verification, but you'll need it to create listings, make offers, or submit transport quotes."
          },
          {
            question: "How does transport integration work?",
            answer: "When a buyer selects 'delivered' as their delivery option, a transport request is automatically created. Transporters can browse these requests, see pickup and delivery locations, and submit competitive quotes. Buyers and sellers can also browse backload listings to find empty truck space for return trips, saving money on transport costs."
          },
          {
            question: "What happens if a deal goes wrong?",
            answer: "Farm Feed has a 99% deal completion rate. If issues arise, our support team is available to help mediate disputes. All deals include automated contracts that protect both parties. We also have a rating and review system that helps build trust. In rare cases, we can help resolve payment or delivery disputes through our support channels."
          },
          {
            question: "Can I use Farm Feed on my phone?",
            answer: "Absolutely! Farm Feed is fully responsive and works perfectly on mobile devices. You can browse listings, create offers, manage deals, and even upload product photos directly from your phone. We're also working on a mobile app for an even better experience."
          },
          {
            question: "How do I know if a seller is trustworthy?",
            answer: "Every verified seller has a FICA badge, rating score, and deal history visible on their profile. You can see their total successful deals, average rating, and read reviews from previous buyers. Look for sellers with high ratings (4.5+), multiple successful deals, and quality certificates on their listings."
          }
        ]}
        title="Got Questions? We've Got Answers"
        subtitle="Everything you need to know about trading on Farm Feed"
      />

      {/* Final CTA Section */}
      <section className="relative py-32 md:py-40 bg-[#3D693D] text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 drop-shadow-lg">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-green-100 font-medium">
            Join 500+ verified farmers who&apos;ve traded R50M+ on Farm Feed
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-green-100 text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free to start</span>
                    </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
                  </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Set up in 5 minutes</span>
                    </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>99% deal completion rate</span>
          </div>
        </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-[#3D693D] hover:bg-gray-100 min-h-[56px] sm:min-h-[64px] px-8 sm:px-12 text-base sm:text-lg shadow-2xl hover:shadow-[#3D693D]/30 transition-all duration-300 hover:scale-105 font-bold group">
                <span className="flex items-center justify-center">
                  Start Trading Today - Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="/listings" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 min-h-[56px] sm:min-h-[64px] px-8 sm:px-12 text-base sm:text-lg backdrop-blur-sm transition-all duration-300">
                Browse Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
