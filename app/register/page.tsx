'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register, login } = useSupabaseStore()
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: ['buyer'] as ('buyer' | 'seller' | 'transporter')[]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleRoleToggle = (role: 'buyer' | 'seller' | 'transporter') => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }))
    // Clear error when user makes a selection
    if (errors.roles) {
      setErrors(prev => ({ ...prev, roles: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (formData.roles.length === 0) {
      newErrors.roles = 'Please select at least one role'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Create a new user with mock data
      const newUser = {
        name: formData.name,
        company: formData.company || 'Individual',
        email: formData.email,
        role: formData.roles[0], // Primary role for backward compatibility
        roles: formData.roles, // Now supports multiple roles
        location: '',
        phone: '',
        isVerified: false,
        rating: 0,
        totalDeals: 0,
        capabilities: formData.roles.map(role => {
          switch(role) {
            case 'buyer': return 'buy'
            case 'seller': return 'sell'
            case 'transporter': return 'transport'
            default: return 'buy'
          }
        }),
        subscriptionStatus: 'inactive' as const,
        ficaStatus: 'pending' as const,
        ficaDocuments: {},
        totalTransactions: 0,
        reputationScore: 0,
        businessType: 'individual' as const
      }

      // Use the Supabase register function
      const success = await register(newUser, formData.password)
      
      if (success) {
        // Check if email verification is required
        // For development, we might want to redirect directly to dashboard
        // For production, show email verification screen
        
        // Try to sign in immediately to check if email verification is required
        try {
          const loginSuccess = await login(formData.email, formData.password)
          
          if (loginSuccess) {
            // Email verification not required or user is already verified
            router.push('/dashboard')
          } else {
            // Email verification required
            setShowEmailVerification(true)
          }
        } catch (error) {
          // If login fails, assume email verification is required
          setShowEmailVerification(true)
        }
      } else {
        setErrors({ submit: 'Registration failed. Email may already exist.' })
      }
    } catch (error) {
      console.error('Registration failed:', error)
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Email verification success screen
  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">FF</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Farm Feed</span>
            </Link>
          </div>

          <Card className="p-6">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check Your Email
              </h2>
              
              <p className="text-gray-600 mb-6">
                We've sent a verification link to <strong>{formData.email}</strong>
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      What's Next?
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Check your email inbox (and spam folder)</li>
                        <li>Click the verification link in the email</li>
                        <li>Return here and sign in to access your account</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setShowEmailVerification(false)
                    router.push('/login')
                  }}
                  className="w-full"
                >
                  Go to Sign In
                </Button>
                
                <button
                  onClick={() => setShowEmailVerification(false)}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back to Registration
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">FF</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Farm Feed</span>
          </Link>
        </div>

        <Card className="p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Create your account</CardTitle>
            <p className="text-gray-600">Join South Africa's leading agricultural trading platform</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Farm Name (Optional)
                </label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Enter your company or farm name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a (select all that apply)
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'buyer', label: 'Buyer', description: 'I want to purchase agricultural products' },
                    { value: 'seller', label: 'Seller', description: 'I want to sell agricultural products' },
                    { value: 'transporter', label: 'Transporter', description: 'I provide transport services' }
                  ].map((role) => (
                    <div key={role.value} className="flex items-start space-x-3">
                      <div className="flex items-center h-5">
                        <input
                          id={role.value}
                          type="checkbox"
                          checked={formData.roles.includes(role.value as 'buyer' | 'seller' | 'transporter')}
                          onChange={() => handleRoleToggle(role.value as 'buyer' | 'seller' | 'transporter')}
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        />
                      </div>
                      <div className="text-sm">
                        <label htmlFor={role.value} className="font-medium text-gray-900 cursor-pointer">
                          {role.label}
                        </label>
                        <p className="text-gray-500 text-xs mt-1">{role.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.roles && <p className="text-red-500 text-sm mt-2">{errors.roles}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
