import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Farm Feed - South African Grain & Feed Trading Platform',
  description: 'Connect with trusted farmers and buyers across South Africa. Trade grain, feed, and agricultural products with confidence.',
  keywords: 'farm feed, grain trading, South Africa, agriculture, farming, feed market',
  authors: [{ name: 'Farm Feed Team' }],
  metadataBase: new URL('https://farmfeed.co.za'),
  openGraph: {
    title: 'Farm Feed - South African Grain & Feed Trading Platform',
    description: 'Connect with trusted farmers and buyers across South Africa. Trade grain, feed, and agricultural products with confidence.',
    type: 'website',
    locale: 'en_ZA',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navigation />
          <main>
            {children}
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
