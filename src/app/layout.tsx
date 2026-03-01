import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/shared/ui/layout/Navigation'
import Footer from '@/shared/ui/layout/Footer'
import SessionProvider from '@/shared/ui/SessionProvider'
import QueryProvider from '@/shared/ui/QueryProvider'
import { AppErrorBoundary } from '@/shared/ui/AppErrorBoundary'

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    location: 'global-error-handler',
                    message: 'Uncaught JavaScript error',
                    data: {errorMessage: e.message, errorStack: e.error?.stack, filename: e.filename, lineno: e.lineno, colno: e.colno},
                    timestamp: Date.now(),
                    sessionId: 'debug-session',
                    runId: 'run1',
                    hypothesisId: 'C'
                  })
                }).catch(() => {});
              });
              window.addEventListener('unhandledrejection', function(e) {
                fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    location: 'global-promise-rejection-handler',
                    message: 'Unhandled promise rejection',
                    data: {reason: e.reason?.toString(), errorStack: e.reason?.stack},
                    timestamp: Date.now(),
                    sessionId: 'debug-session',
                    runId: 'run1',
                    hypothesisId: 'C'
                  })
                }).catch(() => {});
              });
            `
          }}
        />
        <AppErrorBoundary>
          <QueryProvider>
            <SessionProvider>
              <Navigation />
              <main className="relative">
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
          </QueryProvider>
        </AppErrorBoundary>
      </body>
    </html>
  )
}
