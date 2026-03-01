# 📊 Farm Feed - Project Standards Summary

> **Quick Reference Guide** - All project rules, standards, and guidelines in one place

---

## 🎯 What Has Been Set Up

I've analyzed your entire codebase and created comprehensive project standards. Here's what you now have:

### ✅ Created Files

1. **`.cursorrules`** - Cursor AI configuration (auto-loaded)
2. **`PROJECT_RULES.md`** - Complete development guidelines  
3. **`CURSOR_SETUP_GUIDE.md`** - How to use Cursor with these rules
4. **`PROJECT_STANDARDS_SUMMARY.md`** - This summary (you are here)

---

## 🏗️ Project Architecture

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

### Path Aliases (Use These!)
```typescript
@/*           // src directory
@/shared/*    // shared utilities/components
@/entities/*  // business entities
@/features/*  // feature modules
```

---

## 🎨 Design System Rules

### Color Palette - Two-Color System ⚡

#### Primary: Forest Green (#3D693D)
- **Usage**: Main CTAs, navigation, success states, brand elements
- **Tailwind**: `bg-primary-500`, `text-primary-500`
- **Classes**: `.btn-primary`, `.bg-primary`, `.text-primary`

#### Secondary: Harvest Red (#DB4A39)
- **Usage**: Alerts, urgency, warnings, secondary actions
- **Tailwind**: `bg-secondary-500`, `text-secondary-500`
- **Classes**: `.bg-urgency`, `.text-urgency`

#### Neutrals
- **White** (#FFFFFF), **Charcoal** (#1F2937)
- **Gray Scale**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Typography

#### Fonts
- **Headlines**: Poppins (400-800 weights)
- **Body**: Inter (300-700 weights)

#### Scale
```css
.text-display   /* 60px - Hero titles */
.text-headline  /* 30px - Page titles */
.text-title     /* 24px - Section headers */
.text-body      /* 18px - Body text */
.text-caption   /* 14px - Small text */
```

### Components

#### Buttons (3 variants only)
```css
.btn-primary    /* Forest Green, white text, shadow */
.btn-secondary  /* White, border, gray text */
.btn-ghost      /* Transparent, hover background */
```

#### Cards
```css
.card                    /* Standard white card */
.card-premium           /* Enhanced shadow */
.premium-card-elevated  /* Full premium treatment */
```

#### Forms
```css
.input-field    /* Consistent input styling */
```

#### Spacing
```css
.space-section   /* 48px - Between sections */
.space-content   /* 32px - Between content */
.space-elements  /* 24px - Between elements */
```

---

## 💾 Database & API Standards

### Supabase Configuration

#### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-only!
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

### API Route Pattern

**File**: `app/api/[feature]/[action]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const Schema = z.object({ /* ... */ })

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

### API Response Format

**Always use:**
```typescript
// Success
{ success: true, data: {...}, message?: string }

// Error  
{ success: false, error: string }
```

---

## 🔷 TypeScript Standards

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

## 🧩 Component Architecture

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

### Component Structure

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

## 🗄️ State Management

### Zustand (Global State)

**Use for:**
- User session
- App settings  
- UI state (sidebar, modals)

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

### React Query (Server State)

**Use for:**
- API data fetching
- Caching
- Mutations

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

## 🔒 Security & Authentication

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

## 💼 Business Logic Rules

### Unified User System 🌟

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

## 🚫 DO NOT (Critical Rules)

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
- ❌ Don't apply gradients to buttons/inputs

### Architecture
- ❌ Don't mix server/client incorrectly
- ❌ Don't put logic in components
- ❌ Don't create circular dependencies
- ❌ Don't bypass path aliases
- ❌ Don't duplicate utilities

---

## ✅ DO (Best Practices)

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

## 🧪 Quality Checklist

Before committing:

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

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] SSL certificates valid
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place

---

## 📚 Key Documentation Files

### Main Guides
- **`.cursorrules`** - Cursor AI rules (auto-loaded)
- **`PROJECT_RULES.md`** - Complete development guide
- **`CURSOR_SETUP_GUIDE.md`** - How to use Cursor AI
- **`PROJECT_STANDARDS_SUMMARY.md`** - This summary

### Project Docs
- **`BLUEPRINT.md`** - System architecture
- **`BRAND_GUIDE.md`** - Branding & design
- **`COMPREHENSIVE_WORKFLOW_MATRIX.md`** - User workflows
- **`SUPABASE_SETUP_GUIDE.md`** - Database setup
- **`design-system.json`** - Design tokens

### Code References
- **`src/types/index.ts`** - All TypeScript types
- **`src/app/globals.css`** - Global styles & design system
- **`tailwind.config.js`** - Tailwind configuration
- **`tsconfig.json`** - TypeScript configuration

---

## 🎯 Quick Start for New Developers

### 1. Read Documentation
```
1. Read this summary (you are here) ✓
2. Read CURSOR_SETUP_GUIDE.md
3. Skim PROJECT_RULES.md (reference as needed)
4. Review BLUEPRINT.md (understand system)
```

### 2. Setup Environment
```bash
# Install dependencies
npm install

# Setup .env.local
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev
```

### 3. Verify Cursor AI
```
1. Open Cursor
2. Verify .cursorrules is active
3. Test with: "Create a simple button component"
4. Confirm it follows design system
```

### 4. Start Coding
```typescript
// Use Cursor AI commands like:
"Create a listing card following the design system"
"Add an offer form with Zod validation"
"Create an API route for transport quotes"

// Cursor will follow all the rules automatically!
```

---

## 💡 Cursor AI Usage Examples

### Basic Commands
```
"Create a new offer card component"
"Add authentication to this page"
"Refactor this to follow project patterns"
```

### Advanced Commands
```
"Create a complete feature module for reviews
following the feature-sliced design structure"

"Based on BLUEPRINT.md, implement the backload
matching system with proper types and API routes"
```

### Code Review
```
Select code and ask:
"Does this follow our coding standards?"
"Optimize this component for performance"
"Add proper error handling to this function"
```

---

## 🔄 Common Patterns

### Data Fetching
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

### Form Handling
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

### Modal Pattern
```typescript
import { Dialog } from '@/shared/ui/Dialog'

export function MyModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Title</Dialog.Title>
        {/* Content */}
      </Dialog.Content>
    </Dialog>
  )
}
```

---

## 📊 Project Status

### ✅ Completed Features
- Unified user system
- Enhanced listings (images, videos, certificates)
- Offer system with counter-offers
- Deal management
- Transport integration
- Document generation (contracts, invoices)
- Messaging system
- FICA verification

### 🔄 In Progress
- Payment integration (Paystack)
- Real-time messaging (WebSocket)
- Advanced analytics

### ❌ Planned
- Digital signatures
- Rating/review system
- Mobile app (React Native)
- AI price predictions

---

## 🆘 Troubleshooting

### Cursor AI Not Following Rules
1. Check `.cursorrules` exists in root
2. Reload Cursor window
3. Enable "Use Rules" in settings
4. Be specific in prompts

### TypeScript Errors
1. Run `npm run typecheck`
2. Check `src/types/index.ts` for types
3. Ensure strict mode compliance
4. Use proper type imports

### Design Inconsistencies
1. Check `design-system.json`
2. Review `BRAND_GUIDE.md`
3. Use design system classes
4. Follow two-color palette

### Build Failures
1. Check environment variables
2. Run `npm run lint`
3. Fix TypeScript errors
4. Clear `.next` folder
5. Reinstall dependencies

---

## 📞 Support & Resources

### Internal Resources
- Project documentation (see above)
- Code examples in codebase
- Design system in `globals.css`
- Type definitions in `src/types`

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Query](https://tanstack.com/query/latest)

### Getting Help
1. Check documentation first
2. Review similar code in codebase
3. Use Cursor AI for guidance
4. Ask team members

---

## 🎉 You're Ready!

You now have:

✅ **Complete project standards** defined  
✅ **Cursor AI configured** with comprehensive rules  
✅ **Design system** documented  
✅ **Code patterns** established  
✅ **Best practices** outlined  
✅ **Quick reference** guides  

### Next Steps

1. **Read** `CURSOR_SETUP_GUIDE.md` for AI usage
2. **Review** `PROJECT_RULES.md` for deep dive
3. **Reference** `BLUEPRINT.md` for architecture
4. **Start coding** with Cursor AI assistance!

---

## 🚀 Quick Reference Card

```
TECH STACK
Next.js 14 | TypeScript | Tailwind | Supabase | Zustand | React Query

PATH ALIASES
@/* | @/shared/* | @/features/* | @/entities/*

COLORS
Forest Green (#3D693D) | Harvest Red (#DB4A39) | Neutrals

BUTTONS
.btn-primary | .btn-secondary | .btn-ghost

TYPOGRAPHY
.text-display | .text-headline | .text-title | .text-body | .text-caption

SPACING
.space-section (48px) | .space-content (32px) | .space-elements (24px)

VALIDATION
Always use Zod | Always type returns | Never use 'any'

STATE
Zustand (global) | React Query (server) | Hook Form (forms)

SECURITY
RLS always | FICA verification | Capability checks

BUSINESS
Unified users | Capabilities not roles | R1/ton + R300/transport fees
```

---

*Project standards created and configured successfully! Happy coding! 🎉*


