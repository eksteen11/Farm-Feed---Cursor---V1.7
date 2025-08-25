import React from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import ImageComponent from '@/components/ui/Image'
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Truck, 
  ArrowRight,
  Star,
  CheckCircle,
  Eye
} from 'lucide-react'
import { mockListings } from '@/lib/mockData'

export default function HomePage() {
  const featuredListings = mockListings.slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Connect with Trusted Farmers
            <span className="block text-2xl md:text-3xl font-normal mt-2">
              South Africa's Premier Grain & Feed Trading Platform
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
            Buy and sell agricultural products with confidence. Verified sellers, secure transactions, and reliable delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Start Trading Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/listings">
              <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                Browse Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Active Farmers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Regions Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">99%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Listings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover high-quality agricultural products from verified sellers across South Africa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <ImageComponent
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    fallbackSrc="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                  />
                  <div className="absolute top-3 right-3 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {listing.product.category}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary-600">
                      R{listing.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.quantity} {listing.product.unit}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <ImageComponent
                        src={listing.seller.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                        alt={listing.seller.name || "Seller"}
                        className="w-5 h-5 rounded-full mr-2"
                        fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      />
                      {listing.seller.name || "Unknown Seller"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.location}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link href={`/listings/${listing.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/listings/${listing.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        Make Offer
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/listings">
              <Button variant="secondary" size="lg">
                View All Listings
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Farm Feed Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to start trading agricultural products with confidence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Create Account</h3>
              <p className="text-gray-600">
                Sign up and verify your identity to access our trusted trading platform
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Browse & Connect</h3>
              <p className="text-gray-600">
                Find products or buyers, make offers, and negotiate terms directly
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Complete Deal</h3>
              <p className="text-gray-600">
                Confirm your deal, arrange transport, and complete the transaction securely
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Farm Feed?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for the South African agricultural community with trust and security at its core
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-card">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Sellers</h3>
              <p className="text-gray-600">
                All sellers undergo strict verification to ensure product quality and reliability
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-card">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Built-in escrow and secure payment systems protect both buyers and sellers
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-card">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transport Solutions</h3>
              <p className="text-gray-600">
                Integrated transport marketplace for seamless delivery across South Africa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of farmers and buyers who trust Farm Feed for their agricultural trading needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
