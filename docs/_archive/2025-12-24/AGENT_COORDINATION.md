# Farm Feed - Agent Coordination Hub

## 🎯 Master Plan
**Reference**: `Farm Feed - Real Development Plan` (the single source of truth)

## 🎼 Conductor's Notes

### Current Status
- ✅ Foundation: Types added, basic structures created
- 🚧 Active Workstreams: Exchange, Feed Nutrition, Transport Auto-Quotes
- 📋 Next: Market Prices, Industry Ads

### Workstream Assignments

#### Workstream 1: Exchange Platform
**Location**: `src/features/exchange/`
**Status**: Foundation complete, UI started
**Owner**: Exchange Team
**Dependencies**: None (can work independently)
**Interfaces**:
- Uses: `ExchangeOrder`, `Trade`, `OrderBook`, `AuctionListing` from `@/types`
- Exports: Exchange components for use in listings pages
- API: `/api/exchange/*` routes

**Tasks**:
1. Order matching engine (priority: HIGH)
2. WebSocket real-time updates (priority: HIGH)
3. Auction bidding UI (priority: MEDIUM)
4. Price charts (priority: MEDIUM)

**Blockers**: None
**Notes**: Can start immediately on order matching logic

---

#### Workstream 2: Feed Nutrition System
**Location**: `src/features/feed-nutrition/`
**Status**: Foundation complete, calculators started
**Owner**: Feed Nutrition Team
**Dependencies**: None (can work independently)
**Interfaces**:
- Uses: `NutritionalProfile`, `FeedRecipe`, `FeedCalculation` from `@/types`
- Exports: Calculator components, recipe library
- API: `/api/feed/*` routes

**Tasks**:
1. Nutritional database seed data (priority: HIGH)
2. Feed ration calculation algorithm (priority: HIGH)
3. Recipe library UI (priority: MEDIUM)
4. Milling calculator (priority: MEDIUM)
5. Animal goal calculator logic (priority: MEDIUM)

**Blockers**: None
**Notes**: Start with seed data, then algorithm

---

#### Workstream 3: Transport Auto-Quotes
**Location**: `src/features/transport/services/autoQuoteService.ts`
**Status**: Service complete, needs UI integration
**Owner**: Transport Team
**Dependencies**: None (can work independently)
**Interfaces**:
- Uses: `TransportRequest`, `AutoTransportQuote` from `@/types`
- Exports: Auto-quote service, UI components
- API: `/api/transport/quotes/auto` routes

**Tasks**:
1. Auto-quote UI for transporters (priority: HIGH)
2. Integration with transport request flow (priority: HIGH)
3. Notification system for auto-quotes (priority: MEDIUM)
4. Transporter bidding on loads (priority: MEDIUM)

**Blockers**: None
**Notes**: Service is ready, just needs UI

---

#### Workstream 4: Market Prices
**Location**: `src/features/market-prices/` (to be created)
**Status**: Not started
**Owner**: Market Data Team
**Dependencies**: None (can work independently)
**Interfaces**:
- Uses: `MarketPrice`, `PriceHistory` from `@/types`
- Exports: Price display components, price feed
- API: `/api/market/prices/*` routes

**Tasks**:
1. Price aggregation service (priority: HIGH)
2. Price history tracking (priority: HIGH)
3. Price display components (priority: MEDIUM)
4. Price alerts system (priority: LOW)

**Blockers**: None
**Notes**: Can start immediately

---

#### Workstream 5: Industry Ads
**Location**: `src/features/ads/` (to be created)
**Status**: Not started
**Owner**: Ads Team
**Dependencies**: None (can work independently)
**Interfaces**:
- Uses: `IndustryAd` from `@/types`
- Exports: Ad display components, ad management
- API: `/api/ads/*` routes

**Tasks**:
1. Ad management system (priority: MEDIUM)
2. Ad display components (priority: MEDIUM)
3. Targeting logic (priority: LOW)
4. Analytics tracking (priority: LOW)

**Blockers**: None
**Notes**: Lower priority, can start after core features

---

## 🔗 Shared Interfaces (All Agents Must Follow)

### Type System
- **Location**: `src/types/index.ts`
- **Rule**: All types defined here, no duplicate definitions
- **Import**: `import type { TypeName } from '@/types'`

### Design System
- **Colors**: Forest Green (#3D693D), Harvest Red (#DB4A39)
- **Components**: Use `@/shared/ui/*` components
- **Styling**: Tailwind CSS only, no inline styles

### API Patterns
```typescript
// All API routes follow this pattern:
// app/api/[feature]/[action]/route.ts

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validate with Zod
    // Process
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
```

### Component Patterns
```typescript
'use client' // Only if needed

import type { TypeName } from '@/types'
import { Card } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'

export default function ComponentName() {
  // Component logic
}
```

---

## 🚫 Conflict Prevention Rules

1. **File Ownership**: Each workstream owns its feature directory
2. **Shared Files**: Only modify shared files with coordination
3. **Types**: Add new types to `src/types/index.ts`, coordinate if breaking changes
4. **Database**: Coordinate schema changes via migrations
5. **API Routes**: Use feature-specific prefixes (`/api/exchange/*`, `/api/feed/*`)

---

## 📊 Progress Tracking

### Daily Standup Format
Each agent should report:
1. What I completed yesterday
2. What I'm working on today
3. Any blockers or conflicts

### Status Updates
Update this file when:
- Starting a new task
- Completing a task
- Encountering blockers
- Making breaking changes

---

## 🎯 Current Sprint Goals

**Week 1 Focus**:
1. Exchange: Order matching engine
2. Feed: Nutritional database + calculation algorithm
3. Transport: Auto-quote UI integration

**Week 2 Focus**:
1. Exchange: WebSocket real-time updates
2. Feed: Recipe library
3. Market: Price aggregation service

---

## 📞 Coordination Protocol

### Before Starting Work
1. Check this file for current assignments
2. Check `IMPLEMENTATION_STATUS.md` for what's done
3. Check plan file for priorities

### When Completing Work
1. Update `IMPLEMENTATION_STATUS.md`
2. Update this file with progress
3. Note any new dependencies or interfaces

### When Blocked
1. Document blocker in this file
2. Check if another agent can help
3. Escalate if needed

---

## 🔄 Integration Points

### Exchange ↔ Listings
- Exchange uses existing `Listing` type
- Adds `auctionEnabled`, `reservePrice` fields
- Listings page shows exchange view option

### Feed ↔ Products
- Feed uses existing `Product` type
- Adds `NutritionalProfile` relationship
- Product detail page shows nutrition info

### Transport ↔ Deals
- Transport auto-quotes trigger on deal creation
- Deals reference transport quotes
- Existing transport flow enhanced, not replaced

---

## ✅ Quality Checklist (All Agents)

Before committing:
- [ ] TypeScript compiles without errors
- [ ] No linter errors
- [ ] Follows design system
- [ ] Uses shared types from `@/types`
- [ ] Uses shared UI components
- [ ] No duplicate code
- [ ] Proper error handling
- [ ] Mobile responsive

---

## 🎼 Conductor's Current Instructions

**All Agents**: 
1. Read this file before starting work
2. Check your workstream assignment
3. Follow the interfaces defined
4. Update progress as you work
5. Coordinate on shared files

**Exchange Team**: Start with order matching engine
**Feed Team**: Start with nutritional database seed data
**Transport Team**: Start with auto-quote UI
**Market Team**: Can start price aggregation service
**Ads Team**: Wait for core features first

**Remember**: We're building a unified system. Keep interfaces clean and follow the plan!

