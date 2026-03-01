"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useSupabaseStore } from "@/store/useSupabaseStore"
import Button from "@/shared/ui/Button"
import Input from "@/shared/ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/Card"
import { User, ShoppingCart, Package, Truck, Zap, ChevronRight } from "lucide-react"

const capabilityOptions = [
  { key: "buy", label: "Buy products", icon: ShoppingCart, description: "Browse listings, make offers, and complete deals." },
  { key: "sell", label: "Sell products", icon: Package, description: "Create new listings and receive offers from buyers." },
  { key: "transport", label: "Transport / Logistics", icon: Truck, description: "Offer or manage transport, submit delivery quotes." },
]

const OnboardingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please use a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location: z.string().min(2, "Location required"),
  capabilities: z.array(z.enum(["buy", "sell", "transport"])).min(1, "Choose at least one"),
})

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useSupabaseStore()

  const [step, setStep] = useState(1)
  const [pending, setPending] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
    confirm: "",
    capabilities: [] as ("buy" | "sell" | "transport")[],
  })
  const [errors, setErrors] = useState<any>({})
  const [emailSent, setEmailSent] = useState(false)

  function validateCurrStep() {
    if (step === 1) {
      const result = OnboardingSchema.pick({ name: true, email: true, password: true, location: true }).safeParse(form)
      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors)
        return false
      }
    } else if (step === 2) {
      if (!form.capabilities.length) {
        setErrors({ capabilities: "Choose at least one option" })
        return false
      }
    }
    setErrors({})
    return true
  }

  function handleNext() {
    if (validateCurrStep()) setStep(step + 1)
  }

  function handlePrev() {
    setStep(Math.max(1, step - 1))
  }

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    if (!validateCurrStep()) return
    setPending(true)
    try {
      // Determine role based on capabilities (database trigger expects 'buyer', 'seller', or 'transporter')
      // Priority: seller > transporter > buyer
      let role: 'buyer' | 'seller' | 'transporter' = 'buyer'
      if (form.capabilities.includes('sell')) {
        role = 'seller'
      } else if (form.capabilities.includes('transport')) {
        role = 'transporter'
      }

      const success = await register(
        {
          name: form.name,
          email: form.email,
          location: form.location,
          role: role,
          capabilities: form.capabilities,
        },
        form.password
      )
      
      if (success) {
        setEmailSent(true)
      } else {
        // Get the actual error from the store
        const { error: storeError } = useSupabaseStore.getState()
        const errorMessage = storeError || "Registration failed. Please try again."
        console.error('Registration failed:', errorMessage)
        setErrors({ general: errorMessage })
      }
    } catch (err: any) {
      console.error('Registration exception:', err)
      const errorMessage = err?.message || err?.toString() || "Registration failed. Please try again."
      setErrors({ general: errorMessage })
    } finally {
      setPending(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#3D693D]">Account Created!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-700">
              Your account has been created successfully!
              {form.email && (
                <>
                  <br />
                  <br />
                  Email: <b>{form.email}</b>
                  <br />
                  <br />
                  {/*
                    If email confirmation is enabled, Supabase will send a verification email.
                    If disabled, you can sign in immediately.
                  */}
                  Check your email for a verification link, or try signing in now.
                </>
              )}
            </p>
            <div className="space-y-2">
              <Link href="/login" className="block">
                <Button className="w-full">Go to Login</Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="secondary" className="w-full">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-[#3D693D] text-center mb-2">Set Up Your Farm Feed Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-7">
          <form onSubmit={handleFinalSubmit}>
            {step === 1 && (
              <>
                <div className="mb-4">
                  <label className="font-medium text-gray-700 mb-1 block">Full Name *</label>
                  <Input id="input-name" type="text" autoComplete="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
                </div>
                <div className="mb-4">
                  <label className="font-medium text-gray-700 mb-1 block">Location (province/town) *</label>
                  <Input id="input-location" type="text" autoComplete="address-level1" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                  {errors.location && <div className="text-xs text-red-600 mt-1">{errors.location}</div>}
                </div>
                <div className="mb-4">
                  <label className="font-medium text-gray-700 mb-1 block">Email *</label>
                  <Input id="input-email" type="email" autoComplete="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
                </div>
                <div className="mb-4">
                  <label className="font-medium text-gray-700 mb-1 block">Password *</label>
                  <Input id="input-password" type="password" autoComplete="new-password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
                </div>
                <Button type="button" onClick={handleNext} className="w-full mt-2">Continue <ChevronRight className="inline ml-1" /></Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-5">
                  <div className="font-semibold text-[#3D693D] text-lg mb-2 text-center">What do you want to do first?</div>
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    {capabilityOptions.map(opt => {
                      const isActive = form.capabilities.includes(opt.key as any)
                      const Icon = opt.icon
                      return (
                        <button
                          type="button"
                          key={opt.key}
                          className={`flex-1 p-5 rounded-xl border-2 ${isActive ? 'border-[#3D693D] bg-[#3D693D]/10' : 'border-gray-200'} flex flex-col items-center transition-colors hover:border-[#3D693D] cursor-pointer`}
                          aria-pressed={isActive}
                          onClick={() => setForm(f => ({ ...f, capabilities: isActive ? f.capabilities.filter(c => c !== opt.key) : [...f.capabilities, opt.key as any] }))}
                        >
                          <Icon className={`w-7 h-7 mb-1 ${isActive ? 'text-[#3D693D]' : 'text-gray-400'}`} />
                          <span className="font-bold text-sm md:text-base text-gray-900 mb-1">{opt.label}</span>
                          <span className="text-xs text-gray-600 text-center">{opt.description}</span>
                        </button>
                      )
                    })}
                  </div>
                  {errors.capabilities && <div className="text-xs text-red-600 mt-1 text-center">{errors.capabilities}</div>}
                </div>
                <div className="flex justify-between gap-2">
                  <Button type="button" variant="secondary" onClick={handlePrev}>Back</Button>
                  <Button type="button" onClick={handleNext}>Continue <ChevronRight className="inline ml-1" /></Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="mb-4 text-center">
                  <div className="text-lg font-bold mb-1">Welcome to Farm Feed, {form.name.split(' ')[0] || 'Trader'}!</div>
                  <div className="mb-2 text-gray-700">You’ll have instant access to:</div>
                  <ul className="mb-4 text-gray-800 text-left mx-auto w-fit list-disc list-inside">
                    {form.capabilities.includes("buy") && <li>Browse and buy products from real verified farmers</li>}
                    {form.capabilities.includes("sell") && <li>List your farm products and receive secure offers</li>}
                    {form.capabilities.includes("transport") && <li>Quote on transport jobs and grow your logistics</li>}
                  </ul>
                </div>
                {errors.general && <div className="text-xs text-red-600 mb-2 text-center">{typeof errors.general === "string" ? errors.general : String(errors.general?.message || errors.general)}</div>}
                <div className="flex justify-between gap-2">
                  <Button type="button" variant="secondary" onClick={handlePrev}>Back</Button>
                  <Button type="submit" className="w-2/3 mt-2" disabled={pending}>{pending ? "Creating account..." : "Start Your Journey"}</Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
