# Farm Feed - Complete Development Guide

**Consolidated from all technical, setup, and implementation documentation**

---

## Table of Contents
1. [Project Standards Summary](#project-standards-summary)
2. [Setup & Installation](#setup--installation)
3. [Database Setup](#database-setup)
4. [Architecture & Structure](#architecture--structure)
5. [Code Patterns](#code-patterns)
6. [Testing & Quality](#testing--quality)

---

## Project Standards Summary

### Tech Stack
```yaml
Frontend:
  Framework: Next.js 14 (App Router)
  Language: TypeScript 5.3.3 (Strict Mode)
  Styling: Tailwind CSS 3.3.6
  UI: Custom components + shadcn/ui patterns
  
Backend:
  Database: Supabase (PostgreSQL)
  Auth: Supabase Auth
  Storage: Supabase Storage
  Real-time: Supabase Realtime
  
State Management:
  Global: Zustand
  Server: React Query (@tanstack/react-query)
  Forms: React Hook Form + Zod
  
Additional:
  Icons: Lucide React
  Notifications: React Hot Toast
  Animations: Framer Motion
  Email: Resend
```

### Project Structure (Feature-Sliced Design)
```
src/
├── app/              # Next.js routes & API
├── entities/         # Business entities (User, Listing, Offer)
├── features/         # Feature modules (deals, fica, offers, transport)
├── shared/           # Shared utilities, UI, API clients
├── store/           # Zustand stores
└── types/           # TypeScript definitions
```

### Path Aliases
```typescript
@/*           // src directory
@/shared/*    // shared utilities/components
@/entities/*  // business entities
@/features/*  // feature modules
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation Steps

1. **Clone repository**
```bash
git clone <repository-url>
cd farm-feed
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-only!
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to http://localhost:3000

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript check
```

---

## Database Setup

### Supabase Configuration

#### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Keep secret!
```

#### Always Use
```typescript
import { env } from '@/shared/config/env'
// Never hardcode URLs or keys!
```

### Database Conventions

#### Table Names
- **snake_case**: `users`, `listings`, `offers`, `deals`
- **Plural nouns**: `products` not `product`
- **Junction tables**: `user_listings`, `deal_messages`

#### Required Columns
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### Row Level Security (RLS)

**CRITICAL**: All tables MUST have RLS enabled

```sql
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own listings"
ON listings FOR SELECT
USING (auth.uid() = seller_id);
```

### Database Setup Files
- `supabase/COMPLETE_DATABASE_SETUP.sql` - Complete schema
- `supabase/migrations/` - Migration files
- Run migrations in order

---

## Architecture & Structure

### Server vs Client Components

#### Server (Default)
```typescript
// No 'use client' directive
export default async function Page() {
  const data = await fetchData()
  return <div>{/* ... */}</div>
}
```

#### Client (When Needed)
```typescript
'use client' // Add when you need:
// - useState, useEffect
// - Event handlers
// - Browser APIs
// - Client-only libraries

import { useState } from 'react'

export function Component() {
  const [state, setState] = useState()
  return <div onClick={/* ... */}>{/* ... */}</div>
}
```

### Component Structure Template
```typescript
'use client' // Only if needed

// 1. Imports
import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import type { User } from '@/types'

// 2. Props interface
interface Props {
  user: User
  onAction: () => void
}

// 3. Component
export function Component({ user, onAction }: Props) {
  // 3.1 State
  const [loading, setLoading] = useState(false)
  
  // 3.2 Hooks & queries
  const { data } = useQuery({ /* ... */ })
  
  // 3.3 Handlers
  const handleClick = () => {
    onAction()
  }
  
  // 3.4 Early returns
  if (loading) return <Spinner />
  
  // 3.5 Render
  return <div>{/* ... */}</div>
}
```

---

## Code Patterns

### API Route Pattern
```typescript
// app/api/[feature]/[action]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const Schema = z.object({
  // validation
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = Schema.parse(body)
    
    // Authenticate
    // Process
    // Return
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

### Data Fetching Pattern
```typescript
// features/listings/api/getListings.ts
export async function getListings(filters?: FilterOptions) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('is_active', true)
    
  if (error) throw error
  return data
}

// In component
const { data: listings } = useQuery({
  queryKey: ['listings', filters],
  queryFn: () => getListings(filters),
})
```

### Form Handling Pattern
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(Schema),
})

const mutation = useMutation({
  mutationFn: submitForm,
  onSuccess: () => {
    toast.success('Success!')
    form.reset()
  }
})

const onSubmit = (data: FormData) => {
  mutation.mutate(data)
}
```

### State Management

#### Zustand (Global State)
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'farm-feed-storage' }
  )
)
```

#### React Query (Server State)
```typescript
// Queries
const { data, isLoading } = useQuery({
  queryKey: ['listings'],
  queryFn: fetchListings,
})

// Mutations
const mutation = useMutation({
  mutationFn: createListing,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['listings'] })
  }
})
```

---

## TypeScript Standards

### Strict Mode (Always On)
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true
}
```

### Type Definitions
**All types** → `src/types/index.ts`

```typescript
import type { User, Listing, Offer } from '@/types'
```

### Rules

#### Never Use `any`
```typescript
// ❌ Wrong
function process(data: any) {}

// ✅ Correct
function process(data: unknown) {}
function process<T>(data: T) {}
```

#### Always Type Returns
```typescript
// ❌ Wrong
function getUser(id: string) {
  return fetch(`/api/users/${id}`)
}

// ✅ Correct
async function getUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}
```

#### Validate with Zod
```typescript
import { z } from 'zod'

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

const result = UserSchema.safeParse(data)
if (!result.success) {
  // Handle validation errors
}
```

---

## Security & Authentication

### Supabase Auth

#### Protected Routes
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const { session } = await supabase.auth.getSession()
  
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect('/login')
  }
}
```

#### User Capabilities
```typescript
import { canUserPerformAction } from '@/types'

if (!canUserPerformAction(user, 'sell')) {
  throw new Error('No permission to create listings')
}

// Or shorthand
if (!user.capabilities.includes('sell')) {
  return <UpgradePrompt />
}
```

### FICA Verification
**Required for:**
- Creating listings
- Making offers > R10,000
- Transport services

```typescript
if (user.ficaStatus !== 'verified') {
  router.push('/fica')
}
```

---

## Business Logic Rules

### Unified User System
**CORE CONCEPT**: Every user can:
- ✅ **SELL** products (create listings)
- ✅ **BUY** products (make offers)
- ✅ **TRANSPORT** goods (provide logistics)
- ✅ All from **ONE ACCOUNT**

```typescript
// Check capabilities, not roles!
if (user.capabilities.includes('sell')) {
  // User can create listings
}

// Wrong - don't do this
if (user.role === 'seller') { /* outdated */ }
```

### Subscription Tiers
```typescript
const PLANS = {
  free: {
    price: 0,
    listings: 1,
    offers: 3,
    transportRequests: 1,
    chat: false,
  },
  basic: {
    price: 10,      // R10/month
    listings: -1,   // Unlimited
    offers: -1,
    transportRequests: -1,
    chat: true,
  },
  premium: {
    price: 25,      // R25/month
    // ... + analytics, documents
  },
  enterprise: {
    price: 50,      // R50/month
    // ... + advanced routing, backload matching
  }
}
```

### Platform Fees
```typescript
// Product fee: R1 per ton
const productFee = quantity * 1

// Transport fee: R300 (split)
const transportFee = {
  total: 300,
  buyerPays: 150,
  sellerPays: 150,
}

// Backload booking: R50
const backloadFee = 50
```

### Offer Workflow
```typescript
type OfferStatus = 
  | 'pending'         // Waiting for response
  | 'accepted'        // → Creates Deal
  | 'rejected'        // Declined
  | 'counter-offered' // Seller countered
  | 'expired'         // 7 days passed

// Auto-create deal on acceptance
if (offer.status === 'accepted') {
  await createDeal(offer)
  await generateContract(deal)
  await generateInvoice(deal)
  await notifyParties(deal)
}
```

---

## Testing & Quality

### Pre-Commit Checklist
```bash
# 1. Type check
npm run typecheck

# 2. Lint
npm run lint

# 3. Build
npm run build

# 4. Manual testing
# - Browser testing
# - Console check (no errors)
# - Mobile responsive
# - All user flows
```

### Code Quality Standards

#### File Size Limits
- **Components**: Max 300 lines
- **Functions**: Max 50 lines
- **Complexity**: Extract if >5 levels deep

#### Error Handling
```typescript
try {
  const data = await fetchData()
  return data
} catch (error) {
  console.error('Fetch error:', error)
  toast.error('Failed to load data. Please try again.')
  throw error // Re-throw for React Query
}
```

---

## DO NOT (Critical Rules)

### Code
- ❌ Don't use `any` type
- ❌ Don't hardcode env variables
- ❌ Don't bypass TypeScript strict mode
- ❌ Don't create inline styles
- ❌ Don't skip error handling
- ❌ Don't commit console.logs

### Design
- ❌ Don't add new colors
- ❌ Don't use other fonts
- ❌ Don't create custom shadows
- ❌ Don't break spacing scale

### Architecture
- ❌ Don't mix server/client incorrectly
- ❌ Don't put logic in components
- ❌ Don't create circular dependencies
- ❌ Don't bypass path aliases

---

## DO (Best Practices)

### Code
- ✅ Use TypeScript strict mode
- ✅ Validate inputs with Zod
- ✅ Use path aliases
- ✅ Extract complex logic
- ✅ Use React Query for data
- ✅ Handle loading/error states

### Design
- ✅ Use design system classes
- ✅ Follow two-color system
- ✅ Maintain typography hierarchy
- ✅ Test responsive design
- ✅ Ensure accessibility

### Architecture
- ✅ Follow feature-sliced design
- ✅ Keep components focused
- ✅ Use custom hooks
- ✅ Implement error boundaries
- ✅ Use server components by default

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] SSL certificates valid
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place

---

*This master guide consolidates all technical, setup, and implementation documentation into one comprehensive resource.*

