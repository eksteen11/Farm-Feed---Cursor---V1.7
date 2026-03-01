"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSupabaseStore } from "@/store/useSupabaseStore"
import Button from "@/shared/ui/Button"
import { Users, ShoppingCart, Package, Truck, PlusCircle, MessageCircle, TrendingUp, FileText, CheckCircle, Settings } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/Card"

const allCapabilities = [
  { key: "buy", name: "Buyer", icon: ShoppingCart, color: "text-blue-700", description: "Browse and make offers on listings." },
  { key: "sell", name: "Seller", icon: Package, color: "text-green-700", description: "Create new product listings and receive offers." },
  { key: "transport", name: "Transporter", icon: Truck, color: "text-yellow-600", description: "Quote on delivery jobs and manage logistics." },
]

export default function UnifiedDashboard() {
  const { currentUser, getCurrentUser } = useSupabaseStore()
  const [isClient, setIsClient] = useState(false)
  const [showAddCapabilities, setShowAddCapabilities] = useState(false)

  useEffect(() => {
    setIsClient(true)
    getCurrentUser()
  }, [])

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-600">Loading your dashboard...</div>
      </div>
    )
  }

  const { name = "Trader", capabilities = [] } = currentUser

  function handleToggleCap(cap: string) {
    // TODO: Persist to backend/store in real usage
    if (capabilities.includes(cap)) return
    // fake update for demo
    // setCapabilities([...capabilities, cap])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0">
      <div className="bg-white shadow-sm border-b py-6 px-4 mb-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-[#3D693D] mb-2">Welcome back, {name.split(' ')[0]}</h1>
            <div className="text-gray-700 text-base">Your Farm Feed journey ({capabilities.join(", ")})</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">600+ Farmers</span>
            </div>
            <Button href="/settings" variant="ghost" className="text-gray-600"><Settings className="w-5 h-5" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 w-full grid md:grid-cols-2 gap-8">
        {/* 1. Quick Actions for Current Capabilities */}
        {allCapabilities.filter(cap => capabilities.includes(cap.key)).map(cap => {
          const Icon = cap.icon
          return (
            <Card key={cap.key} className="group border-2 border-[#3D693D]/20 hover:border-[#3D693D] transition-colors">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-4 bg-[#3D693D]/10 rounded-lg">
                  <Icon className={`w-7 h-7 ${cap.color}`} />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">{cap.name} Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-800 mb-4">{cap.description}</div>
                <div className="flex flex-row gap-4 mb-2">
                  {cap.key === "buy" && (
                    <Button as="a" href="/listings" className="w-full">Browse Listings</Button>
                  )}
                  {cap.key === "sell" && (
                    <Button as="a" href="/seller/create-listing" className="w-full">Create Listing</Button>
                  )}
                  {cap.key === "transport" && (
                    <Button as="a" href="/dashboard/transport" className="w-full">See Transport Jobs</Button>
                  )}
                </div>
                {/* Contextual nudge */}
                {cap.key === "sell" && <div className="text-xs text-gray-500">Tip: FICA verification needed for listings & offers.</div>}
              </CardContent>
            </Card>
          )
        })}

        {/* 2. Add More Capabilities CTA */}
        <Card className="group border-2 border-dashed border-gray-300 hover:border-[#3D693D] text-center flex flex-col justify-center items-center cursor-pointer transition-colors relative" onClick={() => setShowAddCapabilities(true)}>
          <CardHeader className="flex flex-row gap-2 items-center justify-center w-full">
            <PlusCircle className="w-10 h-10 text-[#3D693D] group-hover:scale-110 transition-transform" />
            <CardTitle className="font-bold text-lg">Add More Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-gray-700">Want to expand? Enable more workflows anytime.</div>
            <div className="text-sm text-gray-500">Seller, Buyer, and Transporter are all available.</div>
          </CardContent>
        </Card>
      </div>
      {/* Modal to Add Capabilities */}
      {showAddCapabilities && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="font-bold text-xl mb-3 text-[#3D693D]">What else would you like to do?</h2>
            <div className="flex flex-col gap-3 mb-4">
              {allCapabilities.filter(cap => !capabilities.includes(cap.key)).map(cap => {
                const Icon = cap.icon
                return (
                  <button key={cap.key} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:bg-[#3D693D]/10 transition-colors" onClick={() => handleToggleCap(cap.key)}>
                    <Icon className={`w-6 h-6 ${cap.color}`} />
                    <span className="font-semibold">Enable {cap.name} features</span>
                  </button>
                )
              })}
              {allCapabilities.filter(cap => !capabilities.includes(cap.key)).length === 0 && (
                <span className="text-gray-500 text-center">All capabilities enabled!</span>
              )}
            </div>
            <Button variant="secondary" className="w-full mt-2" onClick={() => setShowAddCapabilities(false)}>Done</Button>
          </div>
        </div>
      )}
      {/* Add adaptive tips/nudges as needed below */}
    </div>
  )
}
