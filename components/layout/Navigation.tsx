'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import Button from '@/components/ui/Button'
import ImageComponent from '@/components/ui/Image'
import Logo from '@/components/ui/Logo'
import { 
  Menu, 
  X, 
  User, 
  Bell, 
  LogOut, 
  Settings,
  ShoppingCart,
  Package,
  Truck,
  BarChart3,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  FileText
} from 'lucide-react'

const Navigation: React.FC = () => {
  const { currentUser, isAuthenticated, logout, notifications } = useStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  const unreadNotifications = notifications.filter(n => !n.isRead).length

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FF</span>
                </div>
                <Logo variant="color" size="md" />
              </Link>
            </div>
            {/* Placeholder for navigation items */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {/* Placeholder for user actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FF</span>
              </div>
              <Logo variant="color" size="md" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/listings" className="text-gray-600 hover:text-primary-500 transition-colors">
              Browse Listings
            </Link>
            <Link href="/transport" className="text-gray-600 hover:text-primary-500 transition-colors">
              Transport
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-primary-500 transition-colors">
              Support
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && currentUser ? (
              <>
                {/* Notifications */}
                <Link href="/notifications" className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                                             <ImageComponent
                           src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                           alt={currentUser.name || 'User'}
                           className="w-8 h-8 rounded-full"
                           fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                         />
                    <span className="text-gray-700 font-medium">{currentUser.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <div className="py-1">
                        <Link href="/subscription" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <CreditCard className="w-4 h-4 mr-3" />
                          Subscription
                        </Link>
                        <Link href="/fica" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <ShieldCheck className="w-4 h-4 mr-3" />
                          FICA Verification
                        </Link>
                        {/* Unified Dashboard Sections */}
                        {currentUser.capabilities?.includes('sell') && (
                          <Link href="/dashboard/listings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Package className="w-4 h-4 mr-3" />
                            My Listings
                          </Link>
                        )}
                        {currentUser.capabilities?.includes('buy') && (
                          <Link href="/dashboard/offers" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <ShoppingCart className="w-4 h-4 mr-3" />
                            My Offers
                          </Link>
                        )}
                        {currentUser.capabilities?.includes('transport') && (
                          <Link href="/dashboard/transport" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Truck className="w-4 h-4 mr-3" />
                            Transport
                          </Link>
                        )}
                        <Link href="/dashboard/deals" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <CheckCircle className="w-4 h-4 mr-3" />
                          Active Deals
                        </Link>
                        <Link href="/dashboard/documents" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FileText className="w-4 h-4 mr-3" />
                          Documents
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                      </div>
                      <Link href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-primary-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/listings"
                className="block px-3 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Listings
              </Link>
              <Link
                href="/transport"
                className="block px-3 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Transport
              </Link>
              <Link
                href="/support"
                className="block px-3 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>

              {isAuthenticated && currentUser ? (
                <>
                  <hr className="my-2" />
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-md"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2" />
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
