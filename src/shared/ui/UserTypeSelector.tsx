'use client'

import React from 'react'
import { ShoppingCart, Package, Truck } from 'lucide-react'

type UserType = 'buyer' | 'seller' | 'transporter'

interface UserTypeSelectorProps {
  selectedUserType: UserType
  onSelect: (type: UserType) => void
  className?: string
}

export default function UserTypeSelector({ selectedUserType, onSelect, className = '' }: UserTypeSelectorProps) {
  const userTypes: Array<{ type: UserType; label: string; icon: React.ReactNode }> = [
    { type: 'buyer', label: "I'm a Buyer", icon: <ShoppingCart className="w-5 h-5" /> },
    { type: 'seller', label: "I'm a Seller", icon: <Package className="w-5 h-5" /> },
    { type: 'transporter', label: "I'm a Transporter", icon: <Truck className="w-5 h-5" /> },
  ]

  return (
    <div className={`${className}`}>
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-4">
          {userTypes.map(({ type, label, icon }) => {
            const isSelected = selectedUserType === type
            return (
              <button
                key={type}
                onClick={() => onSelect(type)}
                className={`
                  flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm md:text-base
                  transition-all duration-300 min-h-[56px] w-full sm:w-auto
                  ${isSelected
                    ? 'bg-[#3D693D] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-[1.02] active:scale-95'
                  }
                `}
              >
                {icon}
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

