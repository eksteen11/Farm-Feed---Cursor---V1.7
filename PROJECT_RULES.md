# 📋 Farm Feed - Comprehensive Project Rules & Guidelines

> **Last Updated**: October 2025  
> **Version**: 1.7  
> **Status**: Active Development

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture & Tech Stack](#-architecture--tech-stack)
3. [Design System & Branding](#-design-system--branding)
4. [Database & API Standards](#-database--api-standards)
5. [TypeScript & Code Standards](#-typescript--code-standards)
6. [Component Architecture](#-component-architecture)
7. [State Management](#-state-management)
8. [Security & Authentication](#-security--authentication)
9. [Testing & Quality Assurance](#-testing--quality-assurance)
10. [Deployment & DevOps](#-deployment--devops)
11. [Business Logic Rules](#-business-logic-rules)
12. [Common Patterns & Examples](#-common-patterns--examples)

---

## 🎯 Project Overview

### Mission
Farm Feed is South Africa's premier unified agricultural trading platform connecting buyers, sellers, and transporters in a single seamless marketplace.

### Core Innovation: Unified User System
**Unlike traditional platforms**, Farm Feed uses a **capability-based system** where:
- ✅ Every user can SELL products
- ✅ Every user can BUY products  
- ✅ Every user can TRANSPORT goods
- ✅ All from ONE account

**No role switching. No separate accounts. One unified experience.**

### Revenue Model
- **Subscriptions**: Free, Basic (R10/mo), Premium (R25/mo), Enterprise (R50/mo)
- **Transactional Fees**: R1/ton on products, R300 on transport deals
- **Backload Fees**: R50 per booking

---

## 🏗️ Architecture & Tech Stack

### Frontend Framework
```yaml
Framework: Next.js 14 (App Router)
Language: TypeScript 5.3.3 (Strict Mode)
Styling: Tailwind CSS 3.3.6
UI Library: Custom components + shadcn/ui patterns
Icons: Lucide React
Fonts: Inter (body), Poppins (headlines)
```

### Backend & Database
```yaml
Database: Supabase (PostgreSQL)
Auth: Supabase Auth
Storage: Supabase Storage (images, documents)
Real-time: Supabase Realtime (subscriptions)
Email: Resend (transactional emails)
```

### State & Data Management
```yaml
Global State: Zustand
Server State: React Query (@tanstack/react-query)
Forms: React Hook Form + Zod
Notifications: React Hot Toast
Animations: Framer Motion
```

### Project Structure (Feature-Sliced Design)

```
farm-feed/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (routes)/          # Page routes
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   │
│   ├── entities/              # Business entities
│   │   ├── User.ts
│   │   ├── Listing.ts
│   │   └── Offer.ts
│   │
│   ├── features/              # Feature modules
│   │   ├── deals/            # Deal management
│   │   ├── fica/             # FICA verification
│   │   ├── listings/         # Product listings
│   │   ├── messaging/        # Chat & messages
│   │   ├── offers/           # Offer system
│   │   ├── subscription/     # Subscriptions
│   │   └── transport/        # Transport & logistics
│   │
│   ├── shared/               # Shared resources
│   │   ├── api/             # API clients
│   │   ├── config/          # Configuration
│   │   ├── ui/              # Reusable UI components
│   │   └── utils/           # Helper functions
│   │
│   ├── store/               # Zustand stores
│   │   ├── useStore.ts
│   │   └── useSupabaseStore.ts
│   │
│   └── types/              # TypeScript definitions
│       └── index.ts
│
├── public/                 # Static assets
├── supabase/              # Database migrations
├── components/            # Legacy components (to migrate)
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

### Path Aliases

**ALWAYS USE** these path aliases (configured in `tsconfig.json`):

```typescript
import { Button } from '@/shared/ui/Button'           // ✅ Correct
import { User } from '@/entities/User'                // ✅ Correct
import { OfferCard } from '@/features/offers/components/OfferCard' // ✅ Correct
import type { Listing } from '@/types'                // ✅ Correct

import { Button } from '../../../shared/ui/Button'    // ❌ Wrong
```

---

## 🎨 Design System & Branding

### Brand Color System (TWO-COLOR APPROACH)

This is a **world-class two-color system** designed for maximum impact and consistency.

#### Primary Color: Forest Green (#3D693D)
```css
/* Main brand color - Forest Green */
--primary-50: #f0f9f0
--primary-100: #dcf2dc
--primary-500: #3D693D  /* Main */
--primary-600: #2f522f
--primary-700: #274127
--primary-900: #1a2a1a
```

**Usage:**
- Main CTAs and buttons
- Navigation active states
- Success states
- Brand elements
- Links and interactive elements

#### Secondary Color: Harvest Red (#DB4A39)
```css
/* Secondary brand color - Harvest Red */
--secondary-500: #DB4A39  /* Main */
--secondary-600: #dc2626
--secondary-700: #b91c1c
```

**Usage:**
- Alerts and warnings
- Urgent actions
- Error states
- Secondary CTAs
- Attention-grabbing elements

#### Neutral Palette
```css
/* Professional grays for hierarchy */
--white: #FFFFFF
--charcoal: #1F2937
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-500: #6B7280
--gray-700: #374151
--gray-900: #111827
```

### Typography System

#### Font Families
```css
/* Body Text */
font-family: 'Inter', system-ui, sans-serif;

/* Headlines & Display */
font-family: 'Poppins', system-ui, sans-serif;
```

#### Typography Scale (Tailwind Classes)
```css
.text-display   /* 3.75rem/60px - Hero titles */
.text-headline  /* 1.875rem/30px - Page titles */
.text-title     /* 1.5rem/24px - Section headers */
.text-body      /* 1.125rem/18px - Body text */
.text-caption   /* 0.875rem/14px - Small text */
```

#### Custom Typography Classes
```css
/* Use these for consistent typography */
.text-display    /* Hero sections, major headlines */
.text-headline   /* Page titles, major sections */
.text-title      /* Subsection headers */
.text-body       /* Standard content */
.text-caption    /* Labels, captions, small text */
```

### Component Design System

#### Buttons (3 Variants Only)
```tsx
// Primary - Main actions
<button className="btn-primary">
  {/* Forest Green, white text, shadow, hover lift */}
</button>

// Secondary - Alternative actions  
<button className="btn-secondary">
  {/* White, gray text, border, subtle hover */}
</button>

// Ghost - Subtle actions
<button className="btn-ghost">
  {/* Transparent, gray text, hover background */}
</button>
```

#### Cards
```tsx
// Standard Card
<div className="card">
  {/* White, shadow-lg, border */}
</div>

// Premium Card
<div className="card-premium">
  {/* Enhanced shadow, hover effect */}
</div>

// Premium Elevated Card
<div className="premium-card-elevated">
  {/* Transform on hover, premium shadows */}
</div>
```

#### Forms
```tsx
// Input Field
<input className="input-field" />
{/* Consistent padding, border, focus states */}

// Always wrap in React Hook Form
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <input {...field} className="input-field" />
  )}
/>
```

### Spacing System

**ALWAYS use these spacing utilities:**

```css
.space-section   /* 3rem/48px - Between major sections */
.space-content   /* 2rem/32px - Between content blocks */
.space-elements  /* 1.5rem/24px - Between related elements */
```

**Tailwind spacing scale:**
- `p-4, m-4` = 1rem (16px)
- `p-6, m-6` = 1.5rem (24px)
- `p-8, m-8` = 2rem (32px)
- `p-12, m-12` = 3rem (48px)

### Shadows & Depth
```css
shadow-sm        /* Subtle elevation */
shadow-card      /* Standard card shadow */
shadow-card-hover /* Card hover state */
shadow-premium   /* Premium elevated shadow */
shadow-3xl       /* Maximum depth */
```

### DO NOT (Design)
❌ Don't add colors outside the two-color system  
❌ Don't use fonts other than Inter/Poppins  
❌ Don't create custom shadows (use design system)  
❌ Don't apply gradients to buttons or inputs  
❌ Don't break the spacing scale  
❌ Don't use inline styles  

### DO (Design)
✅ Use design system classes consistently  
✅ Follow Forest Green + Harvest Red color system  
✅ Maintain typography hierarchy  
✅ Test responsive design (mobile-first)  
✅ Ensure WCAG 2.1 AA accessibility  
✅ Use Tailwind utilities  

---

## 💾 Database & API Standards

### Supabase Configuration

#### Environment Variables
```typescript
// ALWAYS use from @/shared/config/env.ts
import { env } from '@/shared/config/env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### Client vs Server
```typescript
// Server Components (app router)
import { createServerClient } from '@supabase/ssr'

// Client Components
import { createClient } from '@supabase/supabase-js'
```

### Database Schema Principles

#### Table Naming
- Use **snake_case** for table names
- Plural nouns: `users`, `listings`, `offers`, `deals`
- Junction tables: `user_listings`, `deal_messages`

#### Column Naming
- Use **snake_case** for columns
- Include timestamps: `created_at`, `updated_at`
- Foreign keys: `user_id`, `listing_id`, `offer_id`

#### Required Columns
Every table should have:
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### Row Level Security (RLS)

**CRITICAL**: All tables MUST have RLS enabled.

```sql
-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own listings
CREATE POLICY "Users can view own listings"
ON listings FOR SELECT
USING (auth.uid() = seller_id);

-- Allow users to insert their own listings
CREATE POLICY "Users can create listings"
ON listings FOR INSERT
WITH CHECK (auth.uid() = seller_id);
```

### API Route Pattern

**File**: `app/api/[feature]/[action]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Define validation schema
const CreateOfferSchema = z.object({
  listingId: z.string().uuid(),
  price: z.number().positive(),
  quantity: z.number().positive(),
  deliveryType: z.enum(['ex-farm', 'delivered']),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request
    const body = await request.json()
    const validatedData = CreateOfferSchema.parse(body)
    
    // 2. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // 3. Process business logic
    const offer = await createOffer(validatedData, user.id)
    
    // 4. Return success response
    return NextResponse.json({
      success: true,
      data: offer,
      message: 'Offer created successfully'
    })
    
  } catch (error) {
    // 5. Handle errors gracefully
    console.error('Create offer error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### API Response Format

**Always use consistent response structure:**

```typescript
// Success Response
{
  success: true,
  data: { /* response data */ },
  message?: string,
  meta?: { page: 1, limit: 10, total: 100 }
}

// Error Response
{
  success: false,
  error: string,
  details?: any
}
```

---

## 🔷 TypeScript & Code Standards

### TypeScript Configuration

**Strict Mode** - ALWAYS enabled:
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "exactOptionalPropertyTypes": false
}
```

### Type Definitions

**ALL types** should be defined in `src/types/index.ts`:

```typescript
// ✅ Correct - Define in types/index.ts
export interface User {
  id: string
  email: string
  capabilities: UserCapability[]
  // ...
}

// ✅ Use in components
import type { User } from '@/types'

// ❌ Wrong - Don't define types inline
interface User { /* ... */ }
```

### Type Safety Rules

#### Never Use `any`
```typescript
// ❌ Wrong
function processData(data: any) { }

// ✅ Correct - Use unknown and narrow
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // Type narrowing
  }
}

// ✅ Correct - Use generic
function processData<T>(data: T) {
  return data
}
```

#### Always Type Function Returns
```typescript
// ❌ Wrong - Implicit return type
function getUser(id: string) {
  return fetch(`/api/users/${id}`)
}

// ✅ Correct - Explicit return type
async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

#### Use Type Guards
```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  )
}

// Usage
if (isUser(data)) {
  // TypeScript knows data is User
  console.log(data.email)
}
```

### Validation with Zod

**ALWAYS validate:**
- API request bodies
- Form submissions
- External data
- User input

```typescript
import { z } from 'zod'

// Define schema
const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().regex(/^0\d{9}$/).optional(),
})

// Validate
const result = UserSchema.safeParse(data)
if (!result.success) {
  console.error(result.error.errors)
  return
}

// Use validated data
const validatedUser = result.data
```

---

## 🧩 Component Architecture

### Server vs Client Components

#### Server Components (Default)
```typescript
// app/listings/page.tsx
// Server component by default - no 'use client'

import { getListings } from '@/features/listings/api'

export default async function ListingsPage() {
  const listings = await getListings()
  
  return (
    <div>
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
```

#### Client Components (When Needed)
```typescript
// components/ListingCard.tsx
'use client' // ✅ Add only when needed

import { useState } from 'react'

export function ListingCard({ listing }: { listing: Listing }) {
  const [isLiked, setIsLiked] = useState(false)
  
  return (
    <div onClick={() => setIsLiked(!isLiked)}>
      {/* ... */}
    </div>
  )
}
```

**Use 'use client' when you need:**
- useState, useEffect, other React hooks
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- Third-party libraries that require client

### Component Structure Template

```typescript
'use client' // Only if needed

// 1. Imports - Organized by category
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

// Internal imports
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import type { User, Listing } from '@/types'

// 2. Props interface
interface ComponentProps {
  user: User
  listing: Listing
  onUpdate?: (listing: Listing) => void
}

// 3. Component
export function ComponentName({ user, listing, onUpdate }: ComponentProps) {
  // 3.1 State
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 3.2 Hooks (router, queries, mutations)
  const router = useRouter()
  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ['key'],
    queryFn: fetchData
  })
  
  // 3.3 Effects
  useEffect(() => {
    // Side effects
  }, [])
  
  // 3.4 Event handlers
  const handleClick = async () => {
    try {
      setIsLoading(true)
      // Logic
      onUpdate?.(updatedListing)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 3.5 Early returns
  if (queryLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  // 3.6 Render
  return (
    <Card className="space-elements">
      <h2 className="text-title">{listing.title}</h2>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Update'}
      </Button>
    </Card>
  )
}
```

### Custom Hooks

**Extract reusable logic** to custom hooks:

```typescript
// hooks/useOfferManagement.ts
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOffer } from '@/features/offers/api'
import type { CreateOfferData, Offer } from '@/types'

export function useOfferManagement() {
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const queryClient = useQueryClient()
  
  const createOfferMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      toast.success('Offer created successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  
  return {
    selectedListing,
    setSelectedListing,
    createOffer: createOfferMutation.mutate,
    isCreating: createOfferMutation.isPending
  }
}

// Usage in component
const { createOffer, isCreating } = useOfferManagement()
```

---

## 🗄️ State Management

### Zustand Stores

**Global application state** - Use for:
- User session
- App settings
- UI state (sidebar, modals)

```typescript
// store/useStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  
  // Sidebar state
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      isAuthenticated: false,
      
      isSidebarOpen: true,
      toggleSidebar: () => set({ 
        isSidebarOpen: !get().isSidebarOpen 
      }),
    }),
    {
      name: 'farm-feed-storage',
      partialize: (state) => ({ 
        user: state.user,
        isSidebarOpen: state.isSidebarOpen 
      })
    }
  )
)
```

### React Query (Server State)

**Server data** - Use for:
- API data fetching
- Caching
- Mutations
- Optimistic updates

```typescript
// Queries
const { data, isLoading, error } = useQuery({
  queryKey: ['listings', filters],
  queryFn: () => fetchListings(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// Mutations
const createListingMutation = useMutation({
  mutationFn: createListing,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['listings'] })
  }
})

// Optimistic updates
const updateOfferMutation = useMutation({
  mutationFn: updateOffer,
  onMutate: async (newOffer) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['offer', newOffer.id] })
    
    // Snapshot previous value
    const previousOffer = queryClient.getQueryData(['offer', newOffer.id])
    
    // Optimistically update
    queryClient.setQueryData(['offer', newOffer.id], newOffer)
    
    return { previousOffer }
  },
  onError: (err, newOffer, context) => {
    // Rollback on error
    queryClient.setQueryData(['offer', newOffer.id], context.previousOffer)
  },
})
```

---

## 🔒 Security & Authentication

### Supabase Authentication

#### Protected Routes
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Protected routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
}
```

#### User Capabilities Check
```typescript
import { canUserPerformAction } from '@/types'

// In component or API route
if (!canUserPerformAction(user, 'sell')) {
  throw new Error('User does not have permission to create listings')
}

// Shorthand
if (!user.capabilities.includes('sell')) {
  return <UpgradeSubscriptionPrompt />
}
```

### FICA Verification

**Required for**:
- Creating listings
- Making offers over R10,000
- Providing transport services

```typescript
// Check FICA status
if (user.ficaStatus !== 'verified') {
  router.push('/fica')
  return
}

// FICA document requirements
const requiredDocs = {
  idDocument: true,      // Required
  bankStatement: true,   // Required
  entityRegistration: businessType === 'company', // Conditional
  taxClearance: false    // Optional
}
```

### Input Sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Sanitize HTML content
const sanitizedContent = DOMPurify.sanitize(userInput)

// Validate file uploads
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxSize = 5 * 1024 * 1024 // 5MB

if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type')
}

if (file.size > maxSize) {
  throw new Error('File too large')
}
```

---

## 🧪 Testing & Quality Assurance

### Pre-Commit Checklist

Before committing code:

```bash
# 1. TypeScript check
npm run typecheck

# 2. Lint check
npm run lint

# 3. Build check
npm run build

# 4. Manual testing
# - Test in browser
# - Check console for errors
# - Test mobile responsive
# - Test all user flows
```

### Code Quality Standards

#### File Size Limits
- **Components**: Max 300 lines
- **Functions**: Max 50 lines
- **Complexity**: Extract to utilities if >5 levels deep

#### Extract Long Components
```typescript
// ❌ Wrong - 500 line component
export function MassiveComponent() {
  // Too much logic
}

// ✅ Correct - Split into smaller pieces
export function ParentComponent() {
  return (
    <>
      <Header />
      <MainContent />
      <Sidebar />
      <Footer />
    </>
  )
}
```

### Error Handling Patterns

```typescript
// API calls
try {
  const data = await fetchData()
  return data
} catch (error) {
  console.error('Fetch error:', error)
  toast.error('Failed to load data. Please try again.')
  throw error // Re-throw for React Query
}

// Form submissions
const onSubmit = async (data: FormData) => {
  try {
    setIsLoading(true)
    await submitForm(data)
    toast.success('Form submitted successfully')
    router.push('/success')
  } catch (error) {
    if (error instanceof ValidationError) {
      setError('validation', { message: error.message })
    } else {
      toast.error('Submission failed. Please try again.')
    }
  } finally {
    setIsLoading(false)
  }
}
```

---

## 🚀 Deployment & DevOps

### Environment Variables

**Required for deployment:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Keep secret!

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_API_BASE_URL=https://api.farmfeed.co.za
```

### Build Process

```bash
# Local build
npm run build
npm run start

# Check build output
# - No TypeScript errors
# - No ESLint errors  
# - All pages building successfully
# - Static assets optimized
```

### Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] SSL certificates valid
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Google Analytics)
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place

---

## 💼 Business Logic Rules

### Unified User System

**CRITICAL**: Every user has capabilities, not roles.

```typescript
// ✅ Correct - Check capabilities
if (user.capabilities.includes('sell')) {
  // User can create listings
}

// ✅ Correct - Multiple capabilities
const canDoEverything = 
  user.capabilities.includes('sell') &&
  user.capabilities.includes('buy') &&
  user.capabilities.includes('transport')

// ❌ Wrong - Don't rely on role
if (user.role === 'seller') {
  // This is outdated thinking
}
```

### Subscription Tiers

```typescript
type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise'

const SUBSCRIPTION_LIMITS = {
  free: {
    listings: 1,
    offers: 3,
    transportRequests: 1,
    transportQuotes: 2,
    chat: false,
    analytics: false,
  },
  basic: {
    listings: -1,  // Unlimited
    offers: -1,
    transportRequests: -1,
    transportQuotes: -1,
    chat: true,
    analytics: false,
  },
  premium: {
    listings: -1,
    offers: -1,
    transportRequests: -1,
    transportQuotes: -1,
    chat: true,
    analytics: true,
    documentGeneration: true,
  },
  enterprise: {
    listings: -1,
    offers: -1,
    transportRequests: -1,
    transportQuotes: -1,
    chat: true,
    analytics: true,
    documentGeneration: true,
    advancedRouting: true,
    backloadMatching: true,
  }
}
```

### Platform Fees

```typescript
// Product transaction fee: R1 per ton
const productFee = quantity * 1

// Transport transaction fee: R300 total (R150 each party)
const transportFee = {
  total: 300,
  buyerPays: 150,
  sellerPays: 150
}

// Backload booking fee: R50
const backloadFee = 50

// Calculate total deal amount
const totalAmount = (price * quantity) + productFee + transportFee.total
```

### Offer Workflow

```typescript
// Offer lifecycle
type OfferStatus = 
  | 'pending'          // Waiting for seller response
  | 'accepted'         // Seller accepted → Deal created
  | 'rejected'         // Seller rejected
  | 'counter-offered'  // Seller made counter-offer
  | 'expired'          // 7 days passed without response

// Automatic deal creation on acceptance
if (offer.status === 'accepted') {
  const deal = await createDeal({
    offerId: offer.id,
    finalPrice: offer.price,
    quantity: offer.quantity,
    deliveryType: offer.deliveryType,
  })
  
  // Generate documents
  await generateContract(deal)
  await generateInvoice(deal)
  
  // Send notifications
  await notifyParties(deal)
}
```

### Transport Request Auto-Generation

```typescript
// When offer accepted with 'delivered' option
if (offer.deliveryType === 'delivered') {
  const transportRequest = await createTransportRequest({
    dealId: deal.id,
    pickupLocation: listing.location,
    deliveryLocation: offer.deliveryAddress,
    quantity: offer.quantity,
    productType: listing.product.name,
    
    // Auto-calculate estimates
    autoQuote: {
      lowEstimate: calculateTransportCost(distance, 'low'),
      mediumEstimate: calculateTransportCost(distance, 'medium'),
      highEstimate: calculateTransportCost(distance, 'high'),
    }
  })
}
```

---

## 📚 Common Patterns & Examples

### Data Fetching Pattern

```typescript
// features/listings/api/getListings.ts
import { supabase } from '@/shared/api/supabase'
import type { Listing, FilterOptions } from '@/types'

export async function getListings(
  filters?: FilterOptions
): Promise<Listing[]> {
  let query = supabase
    .from('listings')
    .select(`
      *,
      seller:users!seller_id(id, name, location),
      product:products(*)
    `)
    .eq('is_active', true)
  
  // Apply filters
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice)
  }
  
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }
  
  // Execute query
  const { data, error } = await query
  
  if (error) {
    console.error('Fetch listings error:', error)
    throw new Error('Failed to fetch listings')
  }
  
  return data as Listing[]
}

// Usage in component
const { data: listings, isLoading } = useQuery({
  queryKey: ['listings', filters],
  queryFn: () => getListings(filters),
})
```

### Form Handling Pattern

```typescript
// components/CreateListingForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createListing } from '@/features/listings/api'
import { Button } from '@/shared/ui/Button'
import { toast } from 'react-hot-toast'

const ListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20),
  price: z.number().positive(),
  quantity: z.number().positive(),
  location: z.string().min(2),
  category: z.enum(['grain', 'feed', 'seed', 'fertilizer']),
})

type ListingFormData = z.infer<typeof ListingSchema>

export function CreateListingForm() {
  const queryClient = useQueryClient()
  
  const form = useForm<ListingFormData>({
    resolver: zodResolver(ListingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      quantity: 0,
      location: '',
      category: 'grain',
    }
  })
  
  const createMutation = useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
      toast.success('Listing created successfully!')
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  
  const onSubmit = (data: ListingFormData) => {
    createMutation.mutate(data)
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-content">
      <div>
        <label className="text-caption font-medium">Title</label>
        <input
          {...form.register('title')}
          className="input-field"
          placeholder="Yellow Maize Grade 1"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-600">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>
      
      {/* More fields... */}
      
      <Button
        type="submit"
        className="btn-primary"
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creating...' : 'Create Listing'}
      </Button>
    </form>
  )
}
```

### Modal Pattern

```typescript
// components/OfferModal.tsx
'use client'

import { useState } from 'react'
import { Dialog } from '@/shared/ui/Dialog'
import { Button } from '@/shared/ui/Button'
import type { Listing } from '@/types'

interface OfferModalProps {
  listing: Listing
  isOpen: boolean
  onClose: () => void
}

export function OfferModal({ listing, isOpen, onClose }: OfferModalProps) {
  const [offerPrice, setOfferPrice] = useState(listing.price)
  
  const handleSubmit = async () => {
    try {
      await createOffer({
        listingId: listing.id,
        price: offerPrice,
        // ...
      })
      toast.success('Offer submitted!')
      onClose()
    } catch (error) {
      toast.error('Failed to submit offer')
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="space-content">
        <Dialog.Title className="text-headline">
          Make an Offer
        </Dialog.Title>
        
        <div className="space-elements">
          <p className="text-body text-gray-600">
            Listing: {listing.title}
          </p>
          <p className="text-body text-gray-600">
            Asking Price: R{listing.price.toLocaleString()}/ton
          </p>
          
          <div>
            <label className="text-caption font-medium">Your Offer</label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              className="input-field"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button onClick={handleSubmit} className="btn-primary">
            Submit Offer
          </Button>
          <Button onClick={onClose} className="btn-secondary">
            Cancel
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
```

---

## 📖 Additional Resources

### Key Documentation Files
- `BLUEPRINT.md` - System architecture overview
- `BRAND_GUIDE.md` - Branding and visual identity
- `COMPREHENSIVE_WORKFLOW_MATRIX.md` - User workflows
- `SUPABASE_SETUP_GUIDE.md` - Database setup
- `design-system.json` - Design tokens
- `.cursorrules` - Cursor AI rules (this file's companion)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query](https://tanstack.com/query/latest)

---

## 🔄 Version History

- **v1.7** (Oct 2025) - Unified user system, enhanced transport, document generation
- **v1.6** (Sep 2025) - Offer system, deal management, messaging
- **v1.5** (Aug 2025) - Enhanced listings, FICA verification
- **v1.0** (Jul 2025) - Initial release

---

## 📞 Support & Questions

For questions about these rules or development standards:
- Check existing documentation first
- Review code examples in the codebase
- Ask in team discussions
- Update this document when patterns evolve

**Remember**: These rules exist to maintain consistency, quality, and scalability. When in doubt, follow the patterns established in the codebase and refer to this guide.

---

*This document is a living guide and should be updated as the project evolves.*


