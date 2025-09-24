'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { initializeSession } = useSupabaseStore()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Handling auth callback...')
        
        // Get the URL hash and search params
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const searchParams = new URLSearchParams(window.location.search)
        
        // Check for error in URL
        const error = hashParams.get('error') || searchParams.get('error')
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description')
        
        if (error) {
          console.error('❌ Auth callback error:', error, errorDescription)
          setStatus('error')
          
          if (error === 'access_denied' && errorDescription?.includes('otp_expired')) {
            setMessage('Email verification link has expired. Please request a new verification email.')
          } else if (error === 'access_denied' && errorDescription?.includes('invalid')) {
            setMessage('Invalid verification link. Please request a new verification email.')
          } else {
            setMessage(`Authentication failed: ${errorDescription || error}`)
          }
          return
        }

        // Handle the auth callback
        const { data, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          console.error('❌ Auth session error:', authError)
          setStatus('error')
          setMessage('Failed to verify email. Please try again.')
          return
        }

        if (data.session?.user) {
          console.log('✅ Email verification successful for:', data.session.user.email)
          
          // Initialize the session in our store
          await initializeSession()
          
          setStatus('success')
          setMessage('Email verified successfully! Redirecting to dashboard...')
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          console.log('⚠️ No session found')
          setStatus('error')
          setMessage('No active session found. Please try logging in again.')
        }
      } catch (error: any) {
        console.error('❌ Auth callback error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    handleAuthCallback()
  }, [initializeSession, router])

  const handleRetry = () => {
    router.push('/login')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-2">
                <Button onClick={() => router.push('/dashboard')} className="w-full">
                  Go to Dashboard
                </Button>
                <Button onClick={handleGoHome} variant="secondary" className="w-full">
                  Go to Home
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-2">
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
                <Button onClick={handleGoHome} variant="secondary" className="w-full">
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
