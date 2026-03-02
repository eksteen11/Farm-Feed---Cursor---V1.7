"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { TrendingUp, MapPin, Leaf, ChevronDown } from "lucide-react"

const FALLBACK_HERO = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&h=1080&fit=crop&q=90"

const PULSE_ACTIVITIES = [
  { id: 1, message: "John from Western Cape just sold 50 tons of maize", location: "Cape Town, WC", icon: Leaf, color: "text-green-700" },
  { id: 2, message: "Sarah from Gauteng matched a transport request", location: "Johannesburg, GP", icon: MapPin, color: "text-red-700" },
  { id: 3, message: "Peter from Limpopo listed 120 tons of soya beans", location: "Polokwane, LP", icon: TrendingUp, color: "text-yellow-700" },
]

export default function NewHeroSection() {
  const [heroImage, setHeroImage] = useState<{ url: string; alt: string } | null>(null)
  const [pulseIdx, setPulseIdx] = useState(0)
  const [liveAmount, setLiveAmount] = useState(2946000)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    fetch("/api/unsplash-hero")
      .then((res) => res.json())
      .then((data) => setHeroImage({ url: data?.url || FALLBACK_HERO, alt: data?.alt || "Grain harvest" }))
      .catch(() => setHeroImage({ url: FALLBACK_HERO, alt: "Grain harvest" }))
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPulseIdx((i) => (i + 1) % PULSE_ACTIVITIES.length)
      setLiveAmount((a) => a + Math.floor(Math.random() * 7000 + 2000))
    }, 3500)
    return () => clearInterval(intervalRef.current!)
  }, [])

  const [animateStat, setAnimateStat] = useState(0)
  useEffect(() => {
    let raf: number
    const target = liveAmount
    let curr = 0
    function tick() {
      curr += Math.max(1, Math.floor(target / 35))
      if (curr >= target) {
        setAnimateStat(target)
        return
      }
      setAnimateStat(curr)
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [liveAmount])

  const pulse = PULSE_ACTIVITIES[pulseIdx]
  const PulseIcon = pulse.icon
  const bgUrl = heroImage?.url || FALLBACK_HERO

  /* Wow 2: Magnetic CTA - cursor-reactive primary button */
  const ctaRef = useRef<HTMLDivElement>(null)
  const [magnetic, setMagnetic] = useState({ x: 0, y: 0 })
  const [reduceMotion, setReduceMotion] = useState(true)
  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reduceMotion || !ctaRef.current) return
      const rect = ctaRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const maxDist = 140
      const strength = 0.22
      if (dist < maxDist) {
        const f = (1 - dist / maxDist) * strength
        setMagnetic({ x: Math.max(-10, Math.min(10, dx * f)), y: Math.max(-10, Math.min(10, dy * f)) })
      } else {
        setMagnetic((prev) => ({ x: prev.x * 0.85, y: prev.y * 0.85 }))
      }
    },
    [reduceMotion]
  )
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  return (
    <section className="relative h-screen max-h-[100dvh] min-h-[560px] flex flex-col justify-end overflow-hidden bg-[#2d4d2d]" aria-label="Hero section">
      {/* Wow 1: Full-bleed image with parallax float */}
      <div className="hero-image-float absolute inset-0 z-0 overflow-hidden">
        <img
          src={bgUrl}
          alt={heroImage?.alt || ""}
          className="hero-image-zoom absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          fetchPriority="high"
        />
      </div>
      {/* Gradient for card readability */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(29,49,29,0.98) 0%, rgba(29,49,29,0.5) 30%, rgba(0,0,0,0.15) 60%, transparent 85%)",
        }}
      />
      {/* Wow 3: Ambient glow behind card */}
      <div className="hero-ambient-glow" aria-hidden />

      {/* One compact action card - bottom third, above-the-fold */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-12 pt-6 md:pb-16 md:pt-8">
        <div className="rounded-2xl bg-[#1e3d1e]/95 backdrop-blur-md border border-white/10 shadow-2xl p-6 sm:p-8">
          {/* Live pulse - one line */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-between gap-3 mb-5 rounded-lg bg-white/10 px-3 py-2"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.div key={pulse.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 min-w-0 truncate">
                <PulseIcon className={`w-4 h-4 flex-shrink-0 ${pulse.color}`} aria-hidden />
                <span className="text-sm font-medium text-white truncate">{pulse.message}</span>
              </motion.div>
            </AnimatePresence>
            <span className="text-xs font-bold text-white/90 whitespace-nowrap">R{animateStat.toLocaleString()} / 24h</span>
          </motion.div>

          {/* Headline - short, massive */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white font-black leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl"
          >
            SA Grain. You Trade, We Connect.
          </motion.h1>

          {/* Tagline - one line, inspiring */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.35 }}
            className="mt-2 text-white/90 text-base sm:text-lg font-medium"
          >
            Verified, contracted, paid. You keep the profit.
          </motion.p>

          {/* Primary CTA - magnetic + unmissable */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.14, duration: 0.35 }}
            className="mt-5 flex flex-wrap items-center gap-3"
          >
            <div ref={ctaRef} className="hero-cta-primary inline-block">
              <Link href="/listings" className="block">
                <motion.span
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-black rounded-xl bg-red-600 text-white shadow-lg ring-2 ring-red-400/50 hover:bg-red-700 transition-colors duration-300"
                  animate={{ x: magnetic.x, y: magnetic.y }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                >
                  See live listings
                </motion.span>
              </Link>
            </div>
            <span className="text-white/50 text-sm hidden sm:inline">or</span>
            <div className="flex flex-wrap gap-2">
              {[
                { href: "/register?intent=seller", label: "List grain" },
                { href: "/listings", label: "Browse stock" },
                { href: "/transport/available", label: "See loads" },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-bold rounded-xl border-2 border-red-400/80 text-white bg-transparent hover:bg-red-500/20 hover:border-red-300 transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <p className="mt-5 text-white/80 text-sm font-medium">
            500+ traders · R50M+ traded · 4.8/5 · 97% match
          </p>
          <p className="mt-1 text-white/40 text-xs">
            Transporter? <Link href="/register?intent=transporter" className="underline text-red-300 hover:text-red-200 hover:no-underline">Register to quote</Link>
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#live-listings"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="scroll-cue absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 text-white/40 hover:text-white/60 text-xs"
        aria-label="Scroll to content"
      >
        <ChevronDown className="w-5 h-5" aria-hidden />
      </motion.a>
    </section>
  )
}
