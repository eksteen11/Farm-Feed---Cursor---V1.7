'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Package, Truck, Route, User } from 'lucide-react'
import { useUser, UserType } from './UserContext'

export default function UserTypeSelector() {
  const { userType, setUserType } = useUser()

  const userTypes = [
    {
      type: 'buyer' as UserType,
      title: 'Buyer',
      description: 'Looking for agricultural products',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      type: 'seller' as UserType,
      title: 'Seller',
      description: 'Selling agricultural products',
      icon: Route,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      type: 'transporter' as UserType,
      title: 'Transporter',
      description: 'Providing transport services',
      icon: Truck,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ]

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">I am a...</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {userTypes.map(({ type, title, description, icon: Icon, color, bgColor, borderColor }) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                userType === type
                  ? `${bgColor} ${borderColor} border-2`
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-6 h-6 ${userType === type ? color : 'text-gray-400'}`} />
                <div>
                  <h4 className={`font-semibold ${userType === type ? color : 'text-gray-900'}`}>
                    {title}
                  </h4>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {userType !== 'guest' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ <strong>{userTypes.find(t => t.type === userType)?.title}</strong> mode activated. 
              The map will now show relevant information for your needs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}







