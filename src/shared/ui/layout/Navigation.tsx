'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import Button from '@/shared/ui/Button'
import ImageComponent from '@/shared/ui/Image'
import Logo from '@/shared/ui/Logo'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  ShoppingCart,
  Package,
  Truck,
  BarChart3,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  FileText,
  Map,
  ChevronDown
} from 'lucide-react'
import NotificationSystem from '@/features/messaging/components/NotificationSystem'

const Navigation: React.FC = () => {
  const { currentUser, isAuthenticated, logout, getCurrentUser } = useSupabaseStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    getCurrentUser()
  }, [])

  // Optimized scroll handler
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo variant="color" size="md" />
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Spacer for fixed nav */}
      <div className="h-16" />
      
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
            : 'bg-white/90 backdrop-blur-lg border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
              <Logo variant="color" size="md" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink href="/" pathname={pathname}>Home</NavLink>
              <NavLink href="/listings" pathname={pathname}>Browse Listings</NavLink>
              <NavLink href="/transport" pathname={pathname}>Transport</NavLink>
              <NavLink href="/maps" pathname={pathname} icon={<Map className="w-4 h-4" />}>Maps</NavLink>
              <NavLink href="/support" pathname={pathname}>Support</NavLink>
            </div>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated && currentUser ? (
                <>
                  {currentUser && <NotificationSystem currentUser={currentUser} />}
                  
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#3D693D]/5 transition-colors"
                    >
                      <ImageComponent
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                        alt={currentUser.name || 'User'}
                        className="w-8 h-8 rounded-full"
                        fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      />
                      <span className="text-sm font-medium text-gray-700 hidden xl:block">
                        {currentUser.name || currentUser.email?.split('@')[0]}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                          <BarChart3 className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                        <div className="border-t my-1"></div>
                        <Link href="/subscription" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                          <CreditCard className="w-4 h-4 mr-3" />
                          Subscription
                        </Link>
                        <Link href="/fica" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                          <ShieldCheck className="w-4 h-4 mr-3" />
                          FICA Verification
                        </Link>
                        {currentUser.capabilities?.includes('sell') && (
                          <Link href="/dashboard/listings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                            <Package className="w-4 h-4 mr-3" />
                            My Listings
                          </Link>
                        )}
                        <Link href="/dashboard/offers" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                          <ShoppingCart className="w-4 h-4 mr-3" />
                          Offers
                        </Link>
                        {currentUser.capabilities?.includes('transport') && (
                          <Link href="/dashboard/transport" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                            <Truck className="w-4 h-4 mr-3" />
                            Transport
                          </Link>
                        )}
                        <Link href="/dashboard/deals" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                          <CheckCircle className="w-4 h-4 mr-3" />
                          Active Deals
                        </Link>
                        <Link href="/dashboard/documents" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                          <FileText className="w-4 h-4 mr-3" />
                          Documents
                        </Link>
                        <Link href="/maps" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                          <Map className="w-4 h-4 mr-3" />
                          Maps
                        </Link>
                        <div className="border-t my-1"></div>
                        <Link href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#3D693D]/5 hover:text-[#3D693D]" onClick={() => setIsUserMenuOpen(false)}>
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <div className="border-t my-1"></div>
                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50">
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-[#3D693D] hover:bg-[#3D693D]/5"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                <MobileNavLink href="/" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink href="/listings" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)}>Browse Listings</MobileNavLink>
                <MobileNavLink href="/transport" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)}>Transport</MobileNavLink>
                <MobileNavLink href="/maps" pathname={pathname} icon={<Map className="w-4 h-4" />} onClick={() => setIsMobileMenuOpen(false)}>Maps</MobileNavLink>
                <MobileNavLink href="/support" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)}>Support</MobileNavLink>
                
                {isAuthenticated && currentUser ? (
                  <>
                    <div className="border-t my-2"></div>
                    <MobileNavLink href="/dashboard" pathname={pathname} icon={<BarChart3 className="w-4 h-4" />} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                    <MobileNavLink href="/profile" pathname={pathname} icon={<User className="w-4 h-4" />} onClick={() => setIsMobileMenuOpen(false)}>Profile</MobileNavLink>
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t my-2"></div>
                    <Link href="/login" className="block px-4 py-3 text-gray-700 hover:text-[#3D693D] hover:bg-[#3D693D]/5 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                    <Link href="/register" className="block px-4 py-3 bg-[#3D693D] text-white rounded-lg hover:bg-[#2A4A2A] text-center font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

// NavLink Component
interface NavLinkProps {
  href: string
  pathname: string
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
}

const NavLink: React.FC<NavLinkProps> = ({ href, pathname, children, icon, onClick }) => {
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
        isActive 
          ? 'text-[#3D693D] bg-[#3D693D]/10' 
          : 'text-gray-700 hover:text-[#3D693D] hover:bg-[#3D693D]/5'
      }`}
    >
      <span className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </Link>
  )
}

const MobileNavLink: React.FC<NavLinkProps> = ({ href, pathname, children, icon, onClick }) => {
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'text-[#3D693D] bg-[#3D693D]/10' 
          : 'text-gray-700 hover:text-[#3D693D] hover:bg-[#3D693D]/5'
      }`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </Link>
  )
}

export default Navigation
