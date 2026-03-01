'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/shared/ui/Button'
import NewHeroSection from '@/shared/ui/NewHeroSection'
import LiveMarketplacePulse from '@/shared/ui/LiveMarketplacePulse'
import FarmerTestimonials from '@/shared/ui/FarmerTestimonials'
import InteractiveDemo from '@/shared/ui/InteractiveDemo'
import VisualDataStorytelling from '@/shared/ui/VisualDataStorytelling'
import ScarcityUrgency from '@/shared/ui/ScarcityUrgency'
import { ParallaxScroll, MouseTilt, FloatingElement } from '@/shared/ui/ParallaxScroll'
import PersonalizedOnboarding from '@/shared/ui/PersonalizedOnboarding'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { ArrowRight, Users, Search, CheckCircle, TrendingUp, Shield, Star, FileText, FileCheck, FileSignature, Zap, Package, Gavel } from 'lucide-react'

export default function HomePage() {
  const { currentUser, getCurrentUser } = useSupabaseStore()
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'transporter' | null>(null)

  useEffect(() => {
    getCurrentUser().catch(() => {})
  }, [])

  const handleStartTrading = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRoleSelected = (role: 'buyer' | 'seller' | 'transporter') => {
    setSelectedRole(role)
  }

  const activeRole = selectedRole || 'buyer'

  const roleConfig = {
    buyer: {
      problem: "Finding reliable suppliers takes weeks. Quality varies, prices aren't transparent.",
      solution: "Find verified farmers in 24 hours. Transparent pricing, automated contracts.",
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&q=80'
    },
    seller: {
      problem: "Finding buyers takes 2-4 weeks. Unqualified leads, pricing struggles, transport costs.",
      solution: "Reach 200+ verified buyers in 48 hours. Automated contracts, real-time payments.",
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&q=80'
    },
    transporter: {
      problem: "Empty return trips cost R2000-5000. Route planning wastes hours, missed opportunities.",
      solution: "Reduce empty trips by 40%. Route optimization, backload matching, reliable payments.",
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&q=80'
    }
  }

  const config = roleConfig[activeRole]

  return (
    <>
    <div className="min-h-screen bg-white">

      {/* Hero — first breath: no competing elements above it */}
      <NewHeroSection />

      {/* Scarcity & Urgency — below the fold so hero has full focus */}
      <ScarcityUrgency />

      {/* Live Marketplace Pulse - Feature #1 */}
      <LiveMarketplacePulse />

      {/* Stats Section - FIXED: Ensure it renders */}
      <section className="py-24 bg-[#3D693D] text-white" id="stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Traders', icon: Users },
              { value: 'R50M+', label: 'Traded', icon: TrendingUp },
              { value: '4.8/5', label: 'Rating', icon: Star },
              { value: '97%', label: 'Match Rate', icon: Shield }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={`stat-${index}`}
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-black">{stat.value}</div>
                  <div className="text-white/80 font-medium text-base md:text-lg">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Phase 2: Buyer – proof of supply (live listings) */}
      <section className="py-20 bg-gray-50" id="live-listings">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4"
          >
            What you can find
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            FICA-verified grain and feed from SA farmers. Browse live listings — no signup required.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Yellow Maize', location: 'Free State', price: 'R4,500', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=260&fit=crop&q=80' },
              { title: 'Soybean Meal', location: 'Gauteng', price: 'R6,800', img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=260&fit=crop&q=80' },
              { title: 'Wheat Class 2', location: 'Western Cape', price: 'R5,200', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=260&fit=crop&q=80' },
              { title: 'Sunflower Meal', location: 'Limpopo', price: 'R5,900', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=260&fit=crop&q=80' }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href="/listings" className="block group">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-[#3D693D]">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.location}</p>
                      <p className="text-lg font-bold text-[#3D693D] mt-1">{item.price} / ton</p>
                      <span className="inline-block mt-2 text-sm font-semibold text-[#3D693D]">View listing →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/listings">
              <Button variant="primary" className="bg-[#3D693D] text-white hover:bg-[#2d4d2d]">
                See all live listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Phase 2: Seller – proof of outcome (from listing to deal) */}
      <section className="py-20 bg-white" id="from-listing-to-deal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4"
          >
            From listing to deal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            List once. Get offers. Sign the contract. First offer in 24–48 hours.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'List', desc: 'Post your FICA-verified grain. Set price and quantity.', icon: Package },
              { step: '2', title: 'Offers', desc: 'Buyers make offers. You accept, counter, or reject.', icon: FileSignature },
              { step: '3', title: 'Contract', desc: 'We generate the contract and invoice. You get paid offline.', icon: FileCheck }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#3D693D] text-white text-2xl font-black flex items-center justify-center mx-auto mb-4">{item.step}</div>
                  <div className="w-14 h-14 rounded-xl bg-[#3D693D]/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-7 h-7 text-[#3D693D]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/register?intent=seller">
              <Button variant="primary" className="bg-[#3D693D] text-white hover:bg-[#2d4d2d]">
                Create your first listing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Phase 2: Transporter – proof of volume (open loads) */}
      <section className="py-20 bg-gray-50" id="open-loads">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4"
          >
            Open loads
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Quote on real transport requests. Fill your trucks. Register to quote in under 2 minutes.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { route: 'Bloemfontein → Johannesburg', tons: '50t', product: 'Maize' },
              { route: 'Nelspruit → Durban', tons: '35t', product: 'Soya' },
              { route: 'Cape Town → Port Elizabeth', tons: '40t', product: 'Wheat' }
            ].map((item, i) => (
              <motion.div
                key={item.route}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="font-bold text-gray-900">{item.route}</p>
                <p className="text-sm text-gray-600 mt-1">{item.tons} • {item.product}</p>
                <Link href="/transport/available" className="inline-block mt-3 text-sm font-semibold text-[#3D693D] hover:underline">
                  Quote on this load →
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/transport/available">
              <Button variant="primary" className="bg-[#3D693D] text-white hover:bg-[#2d4d2d]">
                See transport board
              </Button>
            </Link>
            <Link href="/register?intent=transporter">
              <Button variant="secondary" className="border-[#3D693D] text-[#3D693D]">
                Register to quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pure Transparency - No-Risk Way */}
      <section className="py-24 bg-white" id="pure-transparency">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-16"
          >
            The Farm Feed &quot;No-Risk&quot; Way
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Shield, title: 'Verification', text: 'Every user is FICA-verified before they can see a single price. No tire-kickers.' },
              { icon: FileSignature, title: 'The Deal', text: 'Our Smart-Offer System handles the bidding. Once accepted, we auto-generate the contract.' },
              { icon: FileText, title: 'Documentation', text: 'Instant, professional Invoices and Sales Agreements signed digitally on-platform.' },
              { icon: FileCheck, title: 'The Handover', text: 'Once the contract is signed, you get the direct contact details. Logistics and payments happen privately between you.' }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-6 rounded-2xl border-2 border-[#3D693D]/20 bg-gray-50/50 hover:border-[#3D693D]/40 transition-colors"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#3D693D]/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#3D693D]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Problem: Stop Chasing Paper - Risk-Free Hub */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden bg-[#1F2937]" id="problem-solution">
        <div className="absolute inset-0 z-0">
          <img
            src={config.image}
            alt="South African agriculture"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#3D693D]/20" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 text-wrap-balance">
              Stop Chasing Paper. Start Closing Deals.
            </h2>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              Agriculture in SA moves on trust, but it stalls on admin. Farm Feed digitizes the &quot;handshake.&quot; We solve the problem of finding the right partner and fixing the legal paperwork. Once the deal is locked, the platform steps aside, leaving you to manage your logistics and finances privately, just the way you like it.
            </p>
            <Link href="/register">
              <Button size="lg" className="min-h-[56px] px-10 text-lg bg-white text-[#3D693D] hover:bg-gray-100 shadow-xl font-bold mt-4">
                Start Trading Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New World Transformation */}
      <section className="py-24 bg-gray-50" id="new-world">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-16"
          >
            How You&apos;re Better Off
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, title: 'Reduced Overhead', text: 'No brokers taking massive commissions.' },
              { icon: Zap, title: 'Speed', text: 'Go from Listing to Signed Contract in minutes, not days.' },
              { icon: Shield, title: 'Security', text: 'You only talk to people vetted by our system.' },
              { icon: Star, title: 'Control', text: 'Payments happen offline — you keep your existing banking and accounting.' }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#3D693D]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[#3D693D]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Emotional Storytelling - Feature #2 */}
      <FarmerTestimonials />

      {/* Interactive Demo - Feature #3 */}
      <InteractiveDemo />

      {/* Visual Data Storytelling - Feature #4 */}
      <VisualDataStorytelling />

      {/* How It Works - LIST / BID / LOCK / GO */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 text-wrap-balance">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 'LIST', icon: Package, desc: 'Farmer posts FICA-verified grain.' },
              { step: 'BID', icon: Gavel, desc: 'Buyer makes an offer; Transporter submits a quote.' },
              { step: 'LOCK', icon: FileCheck, desc: 'Farm Feed generates the legally binding contract & invoice.' },
              { step: 'GO', icon: CheckCircle, desc: 'Parties connect offline to execute delivery and payment. Deal Done.' }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-[#3D693D] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-black shadow-xl">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 mx-auto mb-3 bg-[#3D693D]/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#3D693D]" />
                  </div>
                  <p className="text-base text-gray-700 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA - Risk-Free Hub */}
      <section className="py-32 bg-[#3D693D] text-white" id="final-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 text-wrap-balance">
              Ready to Connect? You Trade, We Handle the Paperwork.
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Join 500+ FICA-verified traders. R50M+ traded • 4.8/5 • 97% match. No brokers. Just the deal.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="min-h-[56px] px-12 text-lg bg-white text-[#3D693D] hover:bg-gray-100 shadow-2xl font-bold"
              >
                Start Trading Today - Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-white/70 text-sm mt-6">
              No credit card required • You keep the profit
            </p>
          </motion.div>
        </div>
      </section>

      {/* Personalized Onboarding - Feature #7 */}
      <PersonalizedOnboarding />
    </div>
    </>
  )
}
