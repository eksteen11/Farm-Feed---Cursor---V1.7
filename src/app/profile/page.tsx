'use client'

import React, { useState, useEffect } from 'react'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import Badge from '@/shared/ui/Badge'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import Textarea from '@/shared/ui/Textarea'
import ImageComponent from '@/shared/ui/Image'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Shield, 
  Star,
  Edit3,
  Save,
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  DollarSign,
  Package,
  Truck,
  ShoppingCart,
  Settings,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Plus,
  Calendar,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { currentUser, updateProfile, getCurrentUser } = useSupabaseStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    businessType: 'individual',
    bio: ''
  })

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        company: currentUser.company || '',
        location: currentUser.location || '',
        businessType: currentUser.businessType || 'individual',
        bio: currentUser.bio || ''
      })
    }
  }, [currentUser])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const success = await updateProfile(formData)
      if (success) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        await getCurrentUser() // Refresh user data
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      company: currentUser?.company || '',
      location: currentUser?.location || '',
      businessType: currentUser?.businessType || 'individual',
      bio: currentUser?.bio || ''
    })
    setIsEditing(false)
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'buy': return <ShoppingCart className="w-4 h-4" />
      case 'sell': return <Package className="w-4 h-4" />
      case 'transport': return <Truck className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getCapabilityColor = (capability: string) => {
    switch (capability) {
      case 'buy': return 'bg-blue-100 text-blue-800'
      case 'sell': return 'bg-green-100 text-green-800'
      case 'transport': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case 'premium': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'pro': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8">
            {/* Profile Picture Section */}
            <div className="relative">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                <ImageComponent
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"}
                  alt={currentUser.name || "Profile"}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
                  fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Verification Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white/20 border-white/30 text-white placeholder-white/70 text-4xl lg:text-5xl font-bold"
                        placeholder="Your name"
                      />
                    ) : (
                      currentUser.name
                    )}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                    <Badge className={`${getSubscriptionColor(currentUser.subscriptionStatus)} px-4 py-2 font-bold`}>
                      <Award className="w-4 h-4 mr-2" />
                      {currentUser.subscriptionStatus?.toUpperCase() || 'FREE'} MEMBER
                    </Badge>
                    <Badge className={`${getStatusColor(currentUser.ficaStatus)} px-3 py-1`}>
                      <Shield className="w-4 h-4 mr-1" />
                      {currentUser.ficaStatus?.toUpperCase() || 'PENDING'} VERIFICATION
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      {currentUser.rating || 0}/5.0 Rating
                    </Badge>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <Button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        onClick={handleCancel}
                        variant="outline"
                        className="border-white text-white hover:bg-white/20 px-6 py-3"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                <div className="flex items-center justify-center lg:justify-start">
                  <Mail className="w-5 h-5 mr-3" />
                  {isEditing ? (
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder-white/70"
                      placeholder="Email address"
                    />
                  ) : (
                    <span>{currentUser.email}</span>
                  )}
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <Phone className="w-5 h-5 mr-3" />
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder-white/70"
                      placeholder="Phone number"
                    />
                  ) : (
                    <span>{currentUser.phone || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <MapPin className="w-5 h-5 mr-3" />
                  {isEditing ? (
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder-white/70"
                      placeholder="Location"
                    />
                  ) : (
                    <span>{currentUser.location || 'Not specified'}</span>
                  )}
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <Building className="w-5 h-5 mr-3" />
                  {isEditing ? (
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder-white/70"
                      placeholder="Company name"
                    />
                  ) : (
                    <span>{currentUser.company || 'Not specified'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Capabilities & Role */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center">
                  <Award className="w-6 h-6 mr-2 text-blue-600" />
                  Capabilities & Role
                </CardTitle>
                <CardDescription>
                  Your account permissions and business capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Primary Role</h4>
                    <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">
                      {currentUser.role?.toUpperCase() || 'BUYER'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Account Capabilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.capabilities?.map((capability) => (
                        <Badge 
                          key={capability}
                          className={`${getCapabilityColor(capability)} px-3 py-1`}
                        >
                          {getCapabilityIcon(capability)}
                          <span className="ml-1 capitalize">{capability}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center">
                  <Building className="w-6 h-6 mr-2 text-green-600" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Your business details and trading information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                        <option value="cooperative">Cooperative</option>
                        <option value="farm">Farm</option>
                      </select>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        {currentUser.businessType?.toUpperCase() || 'INDIVIDUAL'}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio/Description
                    </label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself and your business..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                  Activity Statistics
                </CardTitle>
                <CardDescription>
                  Your trading performance and reputation metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {currentUser.totalDeals || 0}
                    </div>
                    <div className="text-sm text-gray-600">Successful Deals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {currentUser.totalTransactions || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {currentUser.reputationScore || 0}
                    </div>
                    <div className="text-sm text-gray-600">Reputation Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {currentUser.rating || 0}
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Settings */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <CardTitle className="flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-indigo-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-3" />
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/offers">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="w-4 h-4 mr-3" />
                    My Offers
                  </Button>
                </Link>
                <Link href="/dashboard/listings">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-3" />
                    My Listings
                  </Button>
                </Link>
                <Link href="/subscription">
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-3" />
                    Upgrade Subscription
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                <CardTitle className="flex items-center">
                  <Lock className="w-6 h-6 mr-2 text-red-600" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-gray-600">Last updated recently</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Two-Factor Auth</div>
                    <div className="text-sm text-gray-600">Not enabled</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Verification</div>
                    <div className="text-sm text-gray-600">
                      {currentUser.isVerified ? 'Verified' : 'Pending'}
                    </div>
                  </div>
                  {!currentUser.isVerified && (
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardTitle className="flex items-center">
                  <Bell className="w-6 h-6 mr-2 text-yellow-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive updates via email</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-600">Browser notifications</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
