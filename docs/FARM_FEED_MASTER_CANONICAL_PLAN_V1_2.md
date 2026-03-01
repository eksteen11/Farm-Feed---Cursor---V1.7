# Farm Feed — Master Canonical Platform Plan (V1.3)

**Last Updated**: 2025-12-24  
**Status**: Authoritative Source of Truth  
**Version**: 1.3

**Major Update (V1.3):** Added comprehensive UX workflow design section (11A) mapping user problems → solutions → features → goals → revenue. This section defines the complete user journey for buyers, sellers, transporters, and unified users, with detailed workflow paths, trust building, and revenue alignment strategies.

---

## 1. Definition

Farm Feed is a unified South African agricultural trading platform that connects buyers, sellers, and transporters in one trusted marketplace for grain and feed products, with fully automated deal orchestration, off-platform payments, and integrated transport logistics.

---

## 1A. Positioning & Value Proposition (The Basics)

**One line:** Farm Feed is the **Digital Handshake** — we generate the paperwork and then step out of the way.

**Value proposition:** **Speed. Connection. Ironclad Documentation.** We are not a middleman taking a cut of the risk; we are the **Engine that creates the deal.** Users find each other, agree on terms, get a contract and invoice, then handle logistics and payments privately. We eliminate friction; they keep the profit.

---

## 1B. Landing Page & Hero Design — "Risk-Free Hub"

### 1. The Hero: The Connection Engine

- **Headline:** *The Pulse of SA Grain. You Trade, We Connect.*
- **Sub-headline:** The ultimate peer-to-peer ecosystem for South African farmers, buyers, and transporters. We provide the FICA-verified listings, the automated contracts, and the professional invoices. You keep the profit. We eliminate the friction.
- **Visual:** A dynamic "Network Map" of South Africa with glowing lines connecting Cape Town, Jo'burg, and the Free State — representing **Connection** without **Ownership**.

### 2. The "3-Pillar" User Flow

Instead of one generic "Start Trading" button, use three distinct portals so users see exactly who is being connected:

| Portal | CTA / Outcome |
|--------|----------------|
| **I am a Farmer** | List your grain. Get direct offers. |
| **I am a Buyer** | Browse verified stock. Make an offer. |
| **I am a Transporter** | Quote on loads. Fill your trucks. |

### 3. The "Pure Transparency" Feature Grid

Be loud and clear about the model so users feel safe:

| Feature | The Farm Feed "No-Risk" Way |
|---------|-----------------------------|
| **Verification** | Every user is FICA-verified before they can see a single price. No tire-kickers. |
| **The Deal** | Our Smart-Offer System handles the bidding. Once accepted, we auto-generate the contract. |
| **Documentation** | Instant, professional Invoices and Sales Agreements signed digitally on-platform. |
| **The Handover** | Once the contract is signed, you get the direct contact details. Logistics and payments happen privately between you. |

### 4. Addressing "The Problem" (The "Messy" Middle)

- **Headline:** *Stop Chasing Paper. Start Closing Deals.*
- **Copy:** "Agriculture in SA moves on trust, but it stalls on admin. Farm Feed digitizes the 'handshake.' We solve the problem of finding the right partner and fixing the legal paperwork. Once the deal is locked, the platform steps aside, leaving you to manage your logistics and finances privately, just the way you like it."

### 5. The "New World" Transformation — How the Client Is Better Off

- **Reduced Overhead:** No brokers taking massive commissions.
- **Speed:** Go from "Listing" to "Signed Contract" in minutes, not days.
- **Security:** You only talk to people who have been vetted by our system.
- **Control:** Since payments happen offline, you maintain your existing banking and accounting relationships.

### 6. How It Works (Step-by-Step Visual)

1. **LIST** — Farmer posts FICA-verified grain.
2. **BID** — Buyer makes an offer; Transporter submits a quote.
3. **LOCK** — Farm Feed generates the legally binding contract & invoice.
4. **GO** — Parties connect offline to execute delivery and payment. Deal Done.

---

## 2. Non-Negotiables

1. **Farm Feed is NOT a payment processor.** All product + transport payments happen OFF-PLATFORM directly between users.
2. **Farm Feed never touches funds, goods, or transactional risk.** Risk and disputes remain between users.
3. **Users must complete deals end-to-end without Farm Feed intervention** (fully automated orchestration).
4. **Platform supports 2-party deals** (Buyer↔Seller) and **3-party deals** (Buyer↔Seller↔Transporter).
5. **Chat is core:** deal-scoped chat between parties, with attachments and audit trail.
6. **Unified user system:** no role switching. One account can buy/sell/transport with capability gating.
7. **All design follows the two-color system:** Forest Green (#3D693D) 80%, Harvest Red (#DB4A39) 20%, neutrals only.

---

## 3. Platform Boundary

### What Farm Feed Does:
- ✅ Facilitates connections between buyers, sellers, and transporters
- ✅ Generates contracts, invoices, and transport agreements (PDFs)
- ✅ Tracks deal status and payment confirmations (user-reported)
- ✅ Provides deal-scoped chat with audit trail
- ✅ Manages transport quotes and backload matching
- ✅ Handles FICA verification and user reputation
- ✅ Collects subscription fees (R10/R25/R50/month) and platform fees (R1/ton product, R300/transport split)
- ✅ Provides document storage and email notifications

### What Farm Feed Does NOT Do:
- ❌ Process payments (all payments off-platform)
- ❌ Hold funds in escrow
- ❌ Verify payment completion (users upload proof of payment)
- ❌ Guarantee transactions or goods quality
- ❌ Resolve disputes (users handle directly)
- ❌ Touch physical goods
- ❌ Provide insurance or guarantees

---

## 4. Participants & Capability Model

### Unified User System (No Role Switching)

Every user has a **capabilities array** that determines what they can do:
- `sell` - Can create product listings
- `buy` - Can make offers on listings
- `transport` - Can submit transport quotes and create backload listings
- `admin` - Platform administration

**Key Rules:**
- Users can have multiple capabilities simultaneously
- Capabilities are checked, not roles
- One unified dashboard shows all capabilities
- No switching between "seller mode" and "buyer mode"

### Subscription Tiers

**Free Plan:**
- 1 listing (product or transport)
- 3 offers per month
- 1 transport request per month
- 2 transport quotes per month
- No chat access
- Basic analytics

**Basic Plan (R10/month):**
- Unlimited listings
- Unlimited offers
- Unlimited transport requests/quotes
- Chat access
- Basic analytics

**Premium Plan (R25/month):**
- Everything in Basic
- Advanced analytics
- Priority support
- Document generation
- Contract templates

**Enterprise Plan (R50/month):**
- Everything in Premium
- Advanced routing optimization
- Backload matching algorithms
- Custom integrations
- Dedicated support

---

## 5. End-to-End Workflows

### 5.1 Two-Party Deal (Buyer↔Seller)

**Flow:**
1. **Seller creates listing** → Listing goes live
2. **Buyer browses** → Views listing details
3. **Buyer makes offer** → Offer sent to seller
4. **Seller responds:**
   - Accept → Deal created automatically
   - Counter → Buyer receives counter offer
   - Reject → Offer closed
5. **If accepted:**
   - Deal created with status: `pending_payment`
   - Contract generated (PDF)
   - Invoice generated (PDF)
   - Email notifications sent
   - Chat thread created for deal
6. **Buyer pays off-platform** → Uploads proof of payment
7. **Seller confirms payment received** → Status: `payment_confirmed`
8. **Seller prepares goods** → Status: `goods_ready`
9. **If ex-farm:** Buyer arranges own transport
10. **If delivered:** Transport request auto-generated
11. **Goods delivered** → Buyer confirms receipt
12. **Deal complete** → Status: `completed`

**Payment States:**
- `pending_payment` - Awaiting Payment (Off-Platform)
- `payment_uploaded` - Buyer uploaded POP
- `payment_confirmed` - Seller confirmed receipt
- `payment_disputed` - Payment issue (users resolve)

### 5.2 Three-Party Deal (Buyer↔Seller↔Transporter)

**Flow:**
1. **Steps 1-5 same as two-party deal**
2. **Transport request auto-generated** (if delivery option selected)
3. **Transporters see request** → Submit quotes
4. **Buyer/Seller selects quote** → Transport quote accepted
5. **Transporter accepts job** → Status: `transport_assigned`
6. **Transporter picks up goods** → Status: `in_transit`
7. **Transporter delivers** → Uploads delivery photos
8. **Buyer confirms delivery** → Status: `delivered`
9. **Transport payment** (off-platform):
   - Buyer pays transporter R150 (half of R300)
   - Seller pays transporter R150 (half of R300)
   - Platform fee: R300 total (R150 from each)
10. **Deal complete** → Status: `completed`

**Transport States:**
- `request_created` - Transport request generated
- `quotes_received` - Transporters submitted quotes
- `quote_accepted` - Buyer/Seller selected quote
- `transport_assigned` - Transporter accepted job
- `pickup_scheduled` - Pickup date/time set
- `in_transit` - Goods en route
- `delivered` - Delivery confirmed
- `transport_complete` - Transport payment confirmed

---

## 6. Deal State Machine (Final)

```
CREATED
  ↓
PENDING_PAYMENT (Awaiting Payment Off-Platform)
  ↓
PAYMENT_UPLOADED (Buyer uploaded POP)
  ↓
PAYMENT_CONFIRMED (Seller confirmed)
  ↓
GOODS_READY (Seller prepared goods)
  ↓
[If delivered:]
TRANSPORT_ASSIGNED
  ↓
IN_TRANSIT
  ↓
DELIVERED
  ↓
COMPLETED

[If ex-farm:]
GOODS_READY
  ↓
PICKUP_SCHEDULED
  ↓
PICKED_UP
  ↓
COMPLETED

[Error states:]
PAYMENT_DISPUTED → Users resolve → Back to PENDING_PAYMENT or CANCELLED
CANCELLED → Deal terminated
```

**State Rules:**
- Only specific transitions allowed (enforced in code)
- Each state change triggers notifications
- State history tracked in audit log
- Users can view state timeline

---

## 7. Chat System (Deal-Scoped)

### Core Requirements:
- **Deal-scoped:** Each deal has its own chat thread
- **Participants:** All parties in the deal (buyer, seller, transporter if applicable)
- **Attachments:** Support file uploads (images, PDFs, documents)
- **Audit trail:** All messages timestamped and non-deletable
- **Notifications:** Real-time notifications for new messages
- **Email fallback:** Email notifications if user offline

### Chat Features:
- Message threading
- File attachments (max 10MB per file)
- Read receipts (optional)
- Message search within thread
- Export chat history (PDF)

### Chat States:
- `active` - Deal in progress, chat active
- `archived` - Deal completed, chat archived
- `locked` - Deal cancelled, chat locked

---

## 8. Documents & Automation

### Auto-Generated Documents:

**Contract (PDF):**
- Generated when deal created
- Includes: parties, product details, price, quantity, delivery terms, payment terms
- Both parties receive copy
- Stored in deal documents

**Invoice (PDF):**
- Generated when deal created
- Includes: buyer details, seller details, line items, totals, platform fee
- Sent to buyer
- Stored in deal documents

**Transport Agreement (PDF):**
- Generated when transport quote accepted
- Includes: transporter, route, quantity, price, pickup/delivery details
- All parties receive copy
- Stored in transport request documents

### Automation Triggers:

**When Offer Accepted:**
1. Create deal record
2. Generate contract (PDF)
3. Generate invoice (PDF)
4. Create chat thread
5. Send email notifications
6. If delivered: Create transport request
7. Update listing quantity

**When Payment Confirmed:**
1. Update deal status
2. Send confirmation emails
3. If delivered: Notify transporters

**When Transport Quote Accepted:**
1. Generate transport agreement (PDF)
2. Send notifications to all parties
3. Update transport request status

**When Delivery Confirmed:**
1. Update deal status to `delivered`
2. Send completion emails
3. Prompt for ratings
4. Archive chat thread

---

## 9. Off-Platform Payments (Tracking Only)

### Payment Flow:
1. **Deal created** → Status: `pending_payment`
2. **Buyer pays seller off-platform** (bank transfer, cash, etc.)
3. **Buyer uploads proof of payment** (screenshot, receipt, etc.)
4. **Status updates to:** `payment_uploaded`
5. **Seller reviews POP** → Confirms or disputes
6. **If confirmed:** Status: `payment_confirmed`
7. **If disputed:** Status: `payment_disputed` → Users resolve directly

### Payment Tracking UI:
- **Status badge:** "Awaiting Payment (Off-Platform)"
- **Upload POP button:** For buyer to upload proof
- **Confirm/Dispute buttons:** For seller to respond
- **Payment history:** Shows all payment-related actions with timestamps

### Legal Wording:
**"Farm Feed does not process payments. All payments are made directly between users off-platform. Farm Feed tracks payment status based on user-uploaded proof of payment. Farm Feed does not verify, guarantee, or hold funds. Users are responsible for all payment disputes and risks."**

---

## 10. Trust, Safety & Verification

### FICA Verification:
**Required for:**
- Creating listings
- Making offers > R10,000
- Transport services

**FICA States:**
- `pending` - Documents uploaded, awaiting review
- `verified` - Approved, can use platform fully
- `rejected` - Documents insufficient, must resubmit

**FICA Documents:**
- ID Document (required)
- Bank Statement (required)
- Entity Registration (optional, for companies)
- Tax Clearance (optional, for companies)

### Reputation System:
- **Transaction count:** Number of completed deals
- **Rating system:** 1-5 stars from other users
- **Response time:** Average time to respond to offers/messages
- **Completion rate:** % of deals completed successfully

### Audit Trail:
- All state changes logged with timestamp and user
- Chat messages non-deletable
- Document versions tracked
- Payment confirmations logged
- Dispute history maintained

---

## 11. UX Rules

### Core Principles:
1. **One primary CTA per screen** - Never overwhelm, clear purpose
2. **Progressive disclosure** - Show only what's needed, when needed
3. **Status visibility** - Current deal/offer status always visible
4. **Immediate feedback** - Every action has instant, clear response
5. **Error prevention** - Design to prevent mistakes, not just handle them
6. **Trust through clarity** - Transparent pricing, clear status, visible progress
7. **2-Second Clarity Rule** - User must know within 2 seconds: Problem → Solution → Features → Next Step

### Landing Page 2-Second Test:
**User must instantly see:**
- **PROBLEM:** "I struggle with [specific problem]"
- **SOLUTION:** "Farm Feed solves this by [specific solution]"
- **FEATURES:** "Using [specific features]"
- **NEXT STEP:** "Click here to [specific action]"

**See:** `docs/LANDING_PAGE_20_UX_IMPROVEMENTS.md` for complete implementation guide.

### Screen Patterns:

**Listing Detail:**
- Hero image gallery
- Key info bar (price, quantity, location, grade)
- Specifications card
- Seller card with reputation
- Single CTA: "Make Offer"

**Offer Modal:**
- Pre-filled from listing
- Live calculation of total
- Platform fee shown clearly
- Single CTA: "Send Offer"

**Deal Dashboard:**
- Status timeline (visual progress)
- Key metrics (large numbers)
- Action items (prominent buttons)
- Recent activity feed
- Documents section

**Chat Interface:**
- Deal context always visible
- Message thread with timestamps
- Attachment support
- Send button prominent

---

## 11A. UX Workflow Design: Problem → Solution → Feature → Goal → Revenue

**Core Philosophy:** Users arrive with problems/needs → Platform provides solutions → Users achieve goals → Platform generates revenue → Millions of users attracted

### Workflow Design Principles:
1. **Problem-First Design:** Every feature starts with a real user problem
2. **Solution Clarity:** Each problem has one clear, obvious solution path
3. **Goal Achievement:** Every workflow ends with user goal completion
4. **Revenue Alignment:** Solutions naturally create revenue opportunities
5. **Friction Elimination:** Remove all unnecessary steps between problem and solution
6. **Trust Building:** Each interaction builds trust through transparency and automation

---

### WORKFLOW 1: BUYER - "I Need Quality Grain/Feed Fast"

**User Problem:**
- "I need to find reliable suppliers with quality grain/feed products quickly"
- "I don't know who to trust - quality varies, prices are unclear"
- "I need to compare options and negotiate efficiently"
- "I need delivery arranged and contracts sorted"

**User Goal:** Purchase quality grain/feed at fair price with reliable delivery

**Platform Solution Path:**

**Step 1: Discovery (Browse Listings)**
- **Feature:** Advanced search & filter system
  - Filter by: Product type, grade, location, price range, seller verification
  - Sort by: Price, distance, seller rating, listing date
  - Visual quality indicators: Verified badges, certificate icons, grade labels
- **UX Flow:**
  1. Buyer lands on homepage → Sees "Browse Listings" CTA
  2. Clicks → Sees filtered grid of listings
  3. Can search by keyword or use filters
  4. Each listing card shows: Image, price/ton, quantity, location, grade, seller badge
  5. Click listing → See detailed view
- **Trust Signal:** Verified seller badges, quality certificates visible, ratings shown
- **Revenue:** Free browsing (attracts users), Premium users get advanced filters

**Step 2: Evaluation (Listing Detail)**
- **Feature:** Comprehensive listing detail page
  - Hero image gallery (multiple angles)
  - Key metrics bar: Price/ton, total quantity, location, grade, ME Energy
  - Specifications: Packaging, fibre content, payment terms
  - Quality certificates: Lab results, certificates (downloadable)
  - Seller profile: Name, rating, transaction count, response time, location
  - Delivery options: Ex-farm or delivered (with cost)
- **UX Flow:**
  1. Buyer views listing detail
  2. Scrolls through images, reads specs
  3. Downloads certificates if needed
  4. Reviews seller reputation
  5. Sees clear pricing breakdown
  6. Single CTA: "Make Offer" button (prominent, green)
- **Trust Signal:** Full transparency - all info visible, nothing hidden
- **Revenue:** Platform fee shown upfront (R1/ton) - no surprises

**Step 3: Negotiation (Make Offer)**
- **Feature:** Smart offer system
  - Pre-filled form from listing (price, quantity, delivery)
  - Live calculation: Subtotal + Platform fee = Total
  - Optional: Counter-offer capability
  - Offer expires in 7 days (auto-reminder)
- **UX Flow:**
  1. Buyer clicks "Make Offer"
  2. Modal opens with pre-filled form
  3. Adjusts price/quantity if needed
  4. Sees live total calculation
  5. Types message (optional)
  6. Clicks "Send Offer"
  7. Confirmation: "Offer sent! Seller will respond within 24 hours"
  8. Redirected to "My Offers" dashboard
- **Trust Signal:** Clear pricing, no hidden fees, offer tracking
- **Revenue:** Platform fee (R1/ton) calculated and shown

**Step 4: Deal Completion (Offer Accepted)**
- **Feature:** Automated deal orchestration
  - When seller accepts: Deal auto-created
  - Contract generated (PDF)
  - Invoice generated (PDF)
  - Chat thread created
  - Email notifications sent
  - Transport request auto-generated (if delivered)
- **UX Flow:**
  1. Buyer receives notification: "Your offer was accepted!"
  2. Clicks notification → Goes to deal dashboard
  3. Sees deal status: "Pending Payment (Off-Platform)"
  4. Sees action items: "Upload Proof of Payment"
  5. Downloads contract and invoice (PDFs)
  6. Pays seller off-platform (bank transfer, etc.)
  7. Uploads proof of payment (screenshot/receipt)
  8. Status updates: "Payment Uploaded - Awaiting Seller Confirmation"
  9. Seller confirms → Status: "Payment Confirmed - Goods Being Prepared"
  10. If delivered: Transport quotes appear → Buyer selects → Transport arranged
  11. Goods delivered → Buyer confirms receipt
  12. Deal complete → Rating prompt appears
- **Trust Signal:** Every step automated, transparent, tracked
- **Revenue:** Platform fee (R1/ton) + Transport fee (R300 split) if delivered

**Goal Achievement:** Buyer successfully purchased quality grain/feed with full transparency, automated contracts, and reliable delivery

**Revenue Generated:**
- Platform fee: R1/ton (product transaction)
- Transport fee: R300 (if delivered, split R150 buyer + R150 seller)
- Subscription: Buyer may upgrade to Premium for advanced features

**User Attraction:** 
- Fast, transparent process attracts buyers
- Quality verification builds trust
- Automated contracts reduce friction
- Word-of-mouth: "This platform makes buying grain so easy"

---

### WORKFLOW 2: SELLER - "I Need to Sell My Grain/Feed Quickly at Fair Price"

**User Problem:**
- "I have grain/feed to sell but don't know where to find buyers"
- "I need to create professional listings quickly"
- "I want to negotiate offers efficiently"
- "I need contracts and invoices generated automatically"
- "I need transport arranged if buyer wants delivery"

**User Goal:** Sell grain/feed at fair price with minimal effort, professional presentation

**Platform Solution Path:**

**Step 1: Listing Creation (Create Professional Listing)**
- **Feature:** Enhanced listing creation form
  - Product details: Type, grade, quantity, price/ton
  - Quality uploads: Multiple images, videos, certificates, lab results
  - Specifications: Packaging, ME Energy, fibre, payment terms
  - Delivery options: Ex-farm or delivered (with cost)
  - Location: Map picker or address
- **UX Flow:**
  1. Seller clicks "Create Listing" from dashboard
  2. Form opens with clear sections
  3. Fills basic info (product, quantity, price)
  4. Uploads images (drag & drop, multiple files)
  5. Adds certificates (optional but recommended)
  6. Sets delivery options
  7. Preview listing before publishing
  8. Clicks "Publish Listing"
  9. Confirmation: "Listing live! Buyers can now see and make offers"
  10. Redirected to "My Listings" dashboard
- **Trust Signal:** Professional presentation builds buyer confidence
- **Revenue:** Free tier: 1 listing, Premium: Unlimited listings

**Step 2: Offer Management (Receive & Respond to Offers)**
- **Feature:** Smart offer management dashboard
  - Incoming offers list with buyer details
  - Offer details: Price, quantity, delivery type, buyer message
  - Buyer reputation visible: Rating, transaction count
  - Quick actions: Accept, Counter, Reject
  - Offer expiry countdown
- **UX Flow:**
  1. Seller receives notification: "New offer on [Product Name]"
  2. Clicks notification → Goes to offer detail
  3. Reviews offer: Price, quantity, buyer reputation
  4. Sees buyer message (if any)
  5. Three options:
     - **Accept:** Deal created immediately, contracts generated
     - **Counter:** Adjust price/quantity, send counter-offer
     - **Reject:** Offer closed, buyer notified
  6. If accepts: Deal dashboard opens automatically
  7. Sees deal status: "Pending Payment (Off-Platform)"
  8. Waits for buyer to upload proof of payment
- **Trust Signal:** Transparent buyer reputation, clear offer terms
- **Revenue:** Platform fee (R1/ton) calculated on deal creation

**Step 3: Deal Completion (Payment & Delivery)**
- **Feature:** Automated deal orchestration
  - Payment tracking: Buyer uploads POP → Seller confirms
  - Goods preparation: Seller marks "Goods Ready"
  - Transport: If delivered, transport quotes auto-generated
  - Delivery confirmation: Buyer confirms receipt
- **UX Flow:**
  1. Seller receives notification: "Buyer uploaded proof of payment"
  2. Reviews POP (screenshot/receipt)
  3. Confirms payment received → Status: "Payment Confirmed"
  4. Prepares goods → Marks "Goods Ready"
  5. If ex-farm: Buyer arranges pickup → Seller confirms pickup
  6. If delivered: Transport quotes appear → Seller/Buyer selects → Transport arranged
  7. Transporter picks up → Delivers → Buyer confirms
  8. Deal complete → Rating prompt appears
- **Trust Signal:** Every step tracked, automated, transparent
- **Revenue:** Platform fee (R1/ton) + Transport fee (R300 split) if delivered

**Goal Achievement:** Seller successfully sold grain/feed with professional listing, efficient negotiation, automated contracts, and reliable delivery

**Revenue Generated:**
- Platform fee: R1/ton (product transaction)
- Transport fee: R300 (if delivered, split R150 buyer + R150 seller)
- Subscription: Seller may upgrade to Premium for unlimited listings, advanced analytics

**User Attraction:**
- Professional listing creation attracts quality sellers
- Automated contracts reduce admin burden
- Efficient offer management saves time
- Word-of-mouth: "This platform makes selling so professional and easy"

---

### WORKFLOW 3: TRANSPORTER - "I Need Consistent Loads & Route Optimization"

**User Problem:**
- "I have an empty truck and need to find loads"
- "I want to optimize my routes and reduce empty trips"
- "I need to bid on transport jobs efficiently"
- "I want to find backload opportunities"

**User Goal:** Maximize truck utilization, reduce empty trips, consistent revenue

**Platform Solution Path:**

**Step 1: Load Discovery (View Transport Requests)**
- **Feature:** Transport marketplace
  - Active transport requests list
  - Filter by: Route, distance, quantity, vehicle type, date
  - Map view: See all requests on map
  - Request details: Pickup location, delivery location, quantity, deadline
  - Buyer/Seller reputation visible
- **UX Flow:**
  1. Transporter clicks "Transport" from navigation
  2. Sees list of active transport requests
  3. Can filter by route or view on map
  4. Clicks request → Sees full details
  5. Reviews: Route, distance, quantity, deadline, buyer/seller info
  6. Single CTA: "Submit Quote"
- **Trust Signal:** Transparent route info, buyer/seller reputation
- **Revenue:** Free browsing, Premium users get route optimization

**Step 2: Quote Submission (Smart Auto-Quote)**
- **Feature:** Auto-quote system with manual adjustment
  - Platform calculates base quote from: Distance, quantity, route complexity
  - Transporter can adjust: Price, pickup/delivery times, special requirements
  - Quote includes: Total price, breakdown, estimated duration
  - Quote valid for 24 hours
- **UX Flow:**
  1. Transporter clicks "Submit Quote"
  2. Modal opens with auto-calculated quote
  3. Reviews calculation: Distance × Rate + Platform fee
  4. Adjusts price if needed (with reason)
  5. Sets pickup/delivery windows
  6. Adds notes (optional)
  7. Clicks "Submit Quote"
  8. Confirmation: "Quote submitted! Buyer/Seller will review"
  9. Redirected to "My Quotes" dashboard
- **Trust Signal:** Transparent pricing, fair calculation
- **Revenue:** Platform fee (R300 split: R150 buyer + R150 seller)

**Step 3: Backload Opportunities (Empty Truck Routes)**
- **Feature:** Backload listing system
  - Transporter creates backload listing: Empty truck route, available capacity, dates
  - Buyers/Sellers see backload opportunities
  - Booking system: Buyer/Seller books backload → Transporter confirms
- **UX Flow:**
  1. Transporter has empty truck on return route
  2. Clicks "Create Backload Listing"
  3. Enters: Route (from → to), available capacity, dates, price
  4. Publishes → Listing appears in backload marketplace
  5. Buyer/Seller sees opportunity → Books backload
  6. Transporter confirms → Transport arranged
  7. Completion → Payment (off-platform)
- **Trust Signal:** Transparent route, capacity, pricing
- **Revenue:** Backload booking fee (R50) + Transport fee (R300 split)

**Step 4: Job Completion (Pickup → Delivery)**
- **Feature:** Transport tracking system
  - Status updates: Assigned → Pickup Scheduled → In Transit → Delivered
  - Photo uploads: Pickup photos, delivery photos
  - GPS tracking (optional, Premium)
  - Delivery confirmation: Buyer confirms receipt
- **UX Flow:**
  1. Transporter receives notification: "Quote accepted!"
  2. Confirms job → Status: "Transport Assigned"
  3. Schedules pickup → Status: "Pickup Scheduled"
  4. Picks up goods → Uploads pickup photos → Status: "In Transit"
  5. Delivers goods → Uploads delivery photos → Status: "Delivered"
  6. Buyer confirms receipt → Status: "Transport Complete"
  7. Payment (off-platform): Buyer pays R150, Seller pays R150
  8. Rating prompt appears
- **Trust Signal:** Photo evidence, status tracking, transparent process
- **Revenue:** Transport fee (R300 split) + Backload fee (R50 if applicable)

**Goal Achievement:** Transporter successfully completed transport jobs with optimized routes, consistent loads, and reliable payments

**Revenue Generated:**
- Transport fee: R300 (split R150 buyer + R150 seller)
- Backload booking fee: R50
- Subscription: Transporter may upgrade to Enterprise for route optimization, backload matching

**User Attraction:**
- Consistent loads attract transporters
- Route optimization reduces empty trips
- Backload matching maximizes revenue
- Word-of-mouth: "This platform keeps my truck busy and profitable"

---

### WORKFLOW 4: UNIFIED USER - "I Want to Buy, Sell, AND Transport from One Account"

**User Problem:**
- "I'm a farmer who sometimes buys feed, sometimes sells grain, sometimes transports"
- "I don't want to manage multiple accounts or switch roles"
- "I want one dashboard that shows all my activity"

**User Goal:** Seamless access to all platform capabilities from one account

**Platform Solution Path:**

**Step 1: Capability-Based Access (No Role Switching)**
- **Feature:** Unified user system with capabilities
  - User account has capabilities: `['sell', 'buy', 'transport']`
  - Dashboard shows sections based on capabilities
  - No role switching needed - all features accessible
  - FICA verification unlocks capabilities
- **UX Flow:**
  1. User registers → Completes FICA verification
  2. Selects capabilities: "I want to sell, buy, and transport"
  3. Dashboard shows all sections:
     - My Listings (if can sell)
     - My Offers (if can buy)
     - Transport Requests (if can transport)
  4. User can create listing, make offer, submit transport quote - all from one dashboard
- **Trust Signal:** One account, one reputation, one profile
- **Revenue:** Subscription unlocks capabilities (Free: Limited, Premium: Unlimited)

**Step 2: Unified Dashboard (All Activity in One Place)**
- **Feature:** Comprehensive unified dashboard
  - Overview: Stats for all activities (listings, offers, deals, transport)
  - Activity feed: Recent activity across all capabilities
  - Quick actions: Create listing, Browse listings, View transport requests
  - Documents: All contracts, invoices, transport agreements in one place
  - Messages: All deal-scoped chats in one inbox
- **UX Flow:**
  1. User logs in → Sees unified dashboard
  2. Overview shows: Active listings, pending offers, active deals, transport jobs
  3. Activity feed shows: Recent offers, new messages, deal updates
  4. Quick actions: "Create Listing", "Browse Listings", "View Transport"
  5. All activity visible in one place - no switching needed
- **Trust Signal:** Complete visibility, no hidden activity
- **Revenue:** Premium subscription for advanced analytics, unlimited features

**Goal Achievement:** User successfully manages all trading activities (buy, sell, transport) from one unified account with seamless access

**Revenue Generated:**
- Platform fees: R1/ton (product) + R300 (transport) across all activities
- Subscription: User upgrades to Premium/Enterprise for unlimited features, advanced analytics

**User Attraction:**
- Unified system attracts multi-capability users (most farmers)
- No account switching reduces friction
- Complete visibility builds trust
- Word-of-mouth: "This platform understands how farmers actually work"

---

### WORKFLOW 5: TRUST BUILDING - "I Need to Trust This Platform Before I Use It"

**User Problem:**
- "How do I know sellers are legitimate?"
- "How do I verify product quality?"
- "What if something goes wrong?"
- "Is my data safe?"

**User Goal:** Feel confident and secure using the platform

**Platform Solution Path:**

**Step 1: Verification System (FICA + Reputation)**
- **Feature:** Multi-layer verification
  - FICA verification: Required for listings, offers, transport
  - Reputation system: Transaction count, ratings, response time
  - Quality certificates: Lab results, certificates visible on listings
  - Verification badges: "Verified Seller", "Verified Transporter"
- **UX Flow:**
  1. User sees verification badges on listings/profiles
  2. Clicks badge → Sees verification details
  3. Reviews seller reputation: Rating, transactions, response time
  4. Downloads quality certificates if needed
  5. Feels confident to proceed
- **Trust Signal:** Visible verification, transparent reputation
- **Revenue:** Verification builds trust → More transactions → More revenue

**Step 2: Transparent Process (Every Step Visible)**
- **Feature:** Complete transparency
  - Deal status always visible
  - Payment tracking: POP upload, confirmation visible
  - Transport tracking: Status updates, photos visible
  - Document access: Contracts, invoices always available
  - Chat audit trail: All messages logged, non-deletable
- **UX Flow:**
  1. User sees deal status timeline
  2. Every action visible: "Payment uploaded", "Payment confirmed", "Goods ready"
  3. Can download documents at any time
  4. Can view chat history
  5. Feels in control, informed
- **Trust Signal:** Nothing hidden, everything transparent
- **Revenue:** Trust → More users → More transactions → More revenue

**Step 3: Automated Contracts (Legal Protection)**
- **Feature:** Auto-generated legal documents
  - Contracts: Generated on deal creation, both parties receive
  - Invoices: Generated automatically, sent to buyer
  - Transport agreements: Generated on quote acceptance
  - All documents stored, downloadable, non-editable
- **UX Flow:**
  1. Deal created → Contract generated automatically
  2. User receives email: "Your contract is ready"
  3. Downloads contract from deal dashboard
  4. Reviews terms, feels protected
  5. Proceeds with confidence
- **Trust Signal:** Legal protection, professional documents
- **Revenue:** Trust → More transactions → More revenue

**Goal Achievement:** User feels confident, secure, and protected using the platform

**Revenue Generated:**
- Trust → User retention → Lifetime value increases
- Trust → Word-of-mouth → User acquisition → More revenue

**User Attraction:**
- Verification system attracts quality users
- Transparency builds trust
- Legal protection reduces risk
- Word-of-mouth: "This platform is trustworthy and professional"

---

### WORKFLOW 6: REVENUE OPTIMIZATION - "How Does Platform Make Money While Users Win?"

**Platform Revenue Strategy:**

**1. Transaction Fees (Primary Revenue)**
- Product transactions: R1/ton (shown upfront, no surprises)
- Transport transactions: R300 split (R150 buyer + R150 seller)
- Backload bookings: R50 fee
- **UX Design:** Fees shown clearly before commitment, transparent calculation
- **User Benefit:** Small fee for huge value (automation, contracts, trust)

**2. Subscription Tiers (Recurring Revenue)**
- Free: 1 listing, 3 offers/month, 1 transport request/month (attracts users)
- Basic (R10/month): Unlimited everything, chat access (value proposition)
- Premium (R25/month): + Advanced analytics, priority support, documents (power users)
- Enterprise (R50/month): + Route optimization, backload matching (transporters)
- **UX Design:** Clear value proposition, easy upgrade path, no hidden costs
- **User Benefit:** Pay for what you need, upgrade when you grow

**3. Premium Features (Value-Add Revenue)**
- Advanced analytics: Market trends, price history, competitor analysis
- Priority support: Faster response times, dedicated help
- Document management: Enhanced storage, digital signatures
- Route optimization: AI-powered route planning (Enterprise)
- **UX Design:** Features clearly valuable, easy to understand, simple to purchase
- **User Benefit:** Tools that directly increase revenue/profitability

**Revenue Alignment with User Goals:**
- Platform makes money when users succeed (transaction fees)
- Users succeed when platform provides value (automation, trust, efficiency)
- Win-win relationship: More transactions = More revenue = More platform investment = Better features = More users

**User Attraction Strategy:**
- Free tier attracts users (low barrier to entry)
- Value demonstration (first successful transaction) → Upgrade to Basic
- Growth needs (more listings, analytics) → Upgrade to Premium
- Business needs (route optimization) → Upgrade to Enterprise
- Word-of-mouth: "This platform pays for itself" → Viral growth

---

### UX Workflow Summary: The Complete User Journey

**Entry Point:** User arrives with problem/need
**Discovery:** Platform shows clear solution path
**Action:** User takes action (create listing, make offer, submit quote)
**Automation:** Platform handles complexity (contracts, notifications, tracking)
**Completion:** User achieves goal (sale, purchase, transport)
**Revenue:** Platform earns fees (transaction, subscription)
**Retention:** User returns for next transaction
**Growth:** User upgrades subscription, refers others

**Key Success Metrics:**
- Time to first transaction: < 24 hours
- Transaction completion rate: > 85%
- User retention: > 70% monthly
- Subscription conversion: > 30% (Free → Paid)
- Net Promoter Score: > 50

---

## 12. Navigation & IA

### Desktop Navigation:
- **Top nav (floating glassmorphism):**
  - Logo (left)
  - Browse | Dashboard | Transport | Messages (center)
  - User menu (right)
- **Dashboard sections:**
  - Overview & Analytics
  - My Listings
  - My Offers
  - Active Deals
  - Transport
  - Documents
  - Messages

### Mobile Navigation:
- **Bottom tab bar (fixed):**
  - Home | Search | Activity | Messages | Profile
- **Swipe gestures:** Cards swipeable, modals dismissible
- **Touch targets:** Minimum 44px × 44px

### Information Architecture:
```
Homepage
├── Hero (search)
├── Featured Listings
└── How It Works

Browse Listings
├── Search & Filters
├── Listing Grid
└── Listing Detail

Dashboard (Unified)
├── Overview
├── Commerce
│   ├── My Listings
│   ├── My Offers
│   └── Active Deals
├── Transport
│   ├── My Requests
│   ├── My Quotes
│   └── Backload Listings
├── Documents
└── Messages

Transport Marketplace
├── Transport Requests
└── Backload Opportunities
```

---

## 13. Design System Constitution

### Colors

**Primary: Forest Green (#3D693D) - 80% Usage**
- Main CTAs, navigation, success states, brand elements
- Tailwind: `bg-primary-500`, `text-primary-500`
- Classes: `.btn-primary`, `.bg-primary`, `.text-primary`

**Secondary: Harvest Red (#DB4A39) - 20% Usage**
- Alerts, urgency, warnings, secondary actions
- Tailwind: `bg-secondary-500`, `text-secondary-500`
- Classes: `.bg-urgency`, `.text-urgency`

**Neutrals:**
- White (#FFFFFF) - Backgrounds, cards
- Charcoal (#1F2937) - Primary text, headings
- Gray Scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

**80/20 Rule:** Forest Green dominates (80%), Harvest Red accents (20%)

### Typography

**Headlines: Poppins**
- Hero: 96px (desktop), 64px (mobile) - `.text-display`
- Section Headers: 48px - `.text-headline`
- Page Titles: 30px - `.text-title`
- Weights: 400-800

**Body: Inter**
- Base: 18px, 1.75 line-height - `.text-body`
- Large: 20px - `.text-body-lg`
- Small: 14px - `.text-caption`
- Weights: 300-700

**Price Display:**
- 32px, bold, Forest Green - `.text-price`

### Spacing

**Section Spacing:** 160px vertical padding - `.space-section`
**Card Padding:** 48px internal - `.space-card`
**Element Gaps:** 32px minimum - `.space-elements`
**Content Width:** 1400px max-width
**Touch Targets:** Minimum 44px × 44px

### Component Primitives

**Button:**
- Primary: 56px height, Forest Green, white text, shadow - `.btn-primary`
- Secondary: 56px height, white, 2px border, gray text - `.btn-secondary`
- Ghost: Transparent, hover background - `.btn-ghost`

**Card:**
- Standard: White, subtle shadow, 24px radius - `.card`
- Premium: 3-layer shadow, hover lift - `.card-premium`
- Elevated: Full premium treatment - `.premium-card-elevated`

**Input:**
- 56px height, 2px border, rounded-16px, 16px padding - `.input-field`
- Floating labels (animate up on focus)
- Focus ring: 4px, Forest Green

**Modal:**
- Backdrop blur, centered, 600px max-width
- Close button top-right
- Single primary CTA

**Drawer (Mobile):**
- Slide in from side
- Backdrop overlay
- Swipe to dismiss

**Badge:**
- Rounded-full, small padding
- Verified: Green with checkmark
- Status: Color-coded (pending=yellow, active=green, etc.)

**Skeleton:**
- Animated shimmer effect
- Matches content layout
- Brand colors in animation

**Empty State:**
- Custom illustration (grain, truck, etc.)
- Helpful copy
- Single primary CTA button

**Timeline:**
- Vertical progress indicator
- States: completed (green), active (yellow), pending (gray)
- Icons for each step

---

## 14. Data Model Overview

### Core Tables (Supabase):

**users:**
- id, email, name, phone, capabilities[], fica_status, subscription_tier, created_at, updated_at

**products:**
- id, name, category, unit, created_at

**listings:**
- id, seller_id, product_id, title, description, price, quantity, location, grade, images[], videos[], certificates[], specifications, delivery_options, is_active, created_at, updated_at

**offers:**
- id, listing_id, buyer_id, price, quantity, delivery_type, delivery_address, message, status, expires_at, created_at, updated_at

**deals:**
- id, offer_id, listing_id, buyer_id, seller_id, price, quantity, total, platform_fee, status, payment_status, created_at, updated_at

**messages:**
- id, deal_id, sender_id, receiver_id, message, attachments[], is_read, created_at

**transport_requests:**
- id, deal_id, requester_id, pickup_location, delivery_location, quantity, product_type, status, created_at, updated_at

**transport_quotes:**
- id, transport_request_id, transporter_id, price, estimated_days, vehicle_type, insurance, message, status, created_at, updated_at

**documents:**
- id, deal_id, type (contract/invoice/transport_agreement), file_url, created_at

**notifications:**
- id, user_id, title, message, type, is_read, created_at

### Relationships:
- User → Listings (one-to-many)
- Listing → Offers (one-to-many)
- Offer → Deal (one-to-one)
- Deal → Messages (one-to-many)
- Deal → Transport Request (one-to-one)
- Transport Request → Transport Quotes (one-to-many)
- Deal → Documents (one-to-many)

---

## 15. Event-Driven Automation Triggers

**If Offer Accepted:**
→ Create deal
→ Generate contract PDF
→ Generate invoice PDF
→ Create chat thread
→ Send email notifications
→ If delivered: Create transport request
→ Update listing quantity

**If Payment Confirmed:**
→ Update deal status to `payment_confirmed`
→ Send confirmation emails
→ If delivered: Notify transporters of transport request

**If Transport Quote Accepted:**
→ Generate transport agreement PDF
→ Send notifications to all parties
→ Update transport request status to `quote_accepted`

**If Delivery Confirmed:**
→ Update deal status to `delivered`
→ Send completion emails
→ Prompt for ratings
→ Archive chat thread
→ Update user reputation

**If Offer Expires (7 days):**
→ Update offer status to `expired`
→ Send notification to buyer
→ Remove from active offers

**If FICA Verified:**
→ Unlock listing creation capability
→ Send verification email
→ Update user dashboard

---

## 16. Revenue Model

### Subscription Revenue:
- **Free:** R0/month (conversion funnel)
- **Basic:** R10/month (60% of users)
- **Premium:** R25/month (30% of users)
- **Enterprise:** R50/month (10% of users)

### Platform Fees (Transactional):
- **Product transactions:** R1 per ton
- **Transport transactions:** R300 total (R150 buyer, R150 seller)
- **Backload bookings:** R50 booking fee

### Projected Annual Revenue (10,000 users):
- Subscriptions: R1,080,000/year
- Product fees: R500,000/year (50,000 tons)
- Transport fees: R300,000/year (1,000 transport deals)
- Backload fees: R100,000/year (2,000 backload bookings)
- **TOTAL: R1,980,000/year**

### Payment Processing:
- **Subscriptions:** Processed via PayStack (Farm Feed handles)
- **Platform fees:** Collected via PayStack (Farm Feed handles)
- **Product/Transport payments:** Off-platform (users handle directly)

---

## 17. Legal Disclaimers

### Mandatory Copy Blocks:

**Payment Disclaimer (on all deal pages):**
"Farm Feed does not process payments for product or transport transactions. All payments are made directly between users off-platform. Farm Feed tracks payment status based on user-uploaded proof of payment. Farm Feed does not verify, guarantee, or hold funds in escrow. Users are solely responsible for all payment disputes, risks, and transaction fulfillment."

**No Escrow Disclaimer:**
"Farm Feed does not provide escrow services. We do not hold funds, verify payments, or guarantee transactions. All financial transactions occur directly between users. Users assume all risks associated with transactions."

**Goods Disclaimer:**
"Farm Feed does not inspect, verify, or guarantee the quality, quantity, or condition of goods. All product specifications and quality claims are provided by sellers. Buyers are responsible for verifying goods before payment. Farm Feed is not liable for any issues with goods or transactions."

**Transport Disclaimer:**
"Farm Feed facilitates connections between users and transporters but does not provide transport services. Transport agreements are between users and transporters. Farm Feed is not liable for transport delays, damages, or disputes."

**Platform Fee Disclosure:**
"Farm Feed charges platform fees for transactions: R1 per ton for product transactions, R300 total (split between buyer and seller) for transport transactions, and R50 for backload bookings. These fees are separate from product and transport prices negotiated between users."

---

## 18. Build Plan / Implementation Checklist

### Phase 1: Foundation (Weeks 1-2)
- [ ] Unified user system with capabilities
- [ ] Authentication & FICA verification
- [ ] Subscription system
- [ ] Basic listing creation
- [ ] Offer system
- [ ] Deal creation automation

### Phase 2: Core Workflows (Weeks 3-4)
- [ ] Two-party deal flow (end-to-end)
- [ ] Payment tracking (off-platform)
- [ ] Document generation (contracts, invoices)
- [ ] Chat system (deal-scoped)
- [ ] Email notifications

### Phase 3: Transport Integration (Weeks 5-6)
- [ ] Transport request creation
- [ ] Transport quote system
- [ ] Three-party deal flow
- [ ] Transport agreement generation
- [ ] Backload listings

### Phase 4: UX Polish (Weeks 7-8)
- [ ] Premium navigation (glassmorphism)
- [ ] Card elevation & micro-interactions
- [ ] Typography hierarchy
- [ ] Loading states (skeleton screens)
- [ ] Empty states with illustrations
- [ ] Mobile optimization

### Phase 5: Advanced Features (Weeks 9-10)
- [ ] Exchange platform (order book, auctions)
- [ ] Feed nutrition system
- [ ] Market prices integration
- [ ] Industry ads system
- [ ] Advanced analytics

### Phase 6: Testing & Launch (Weeks 11-12)
- [ ] End-to-end testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Legal review
- [ ] Beta testing
- [ ] Production launch

---

## 19. File Canon & Governance

**"If it's not in this doc it doesn't exist."**

### This Document Is:
- ✅ The single source of truth for Farm Feed platform
- ✅ Authoritative for all design, UX, workflow, and business rules
- ✅ Required reading before any feature development
- ✅ Updated only through formal review process

### All Other Planning Docs:
- Archived in `/docs/_archive/YYYY-MM-DD/`
- Superseded by this canonical plan
- Kept for historical reference only

### Code Documentation:
- Setup instructions (Supabase, environment) remain in codebase
- SQL schemas remain in `supabase/` directory
- API documentation in code comments
- Component documentation in Storybook (if applicable)

### Adding New Features:
1. Update this canonical plan first
2. Get approval
3. Implement according to plan
4. Update implementation checklist

### Contradictions:
- If any document contradicts this plan, this plan takes precedence
- Report contradictions to maintainers
- Update this plan if business rules change

---

## Appendix: Quick Reference

### Design Tokens:
- Primary: `#3D693D` (Forest Green)
- Secondary: `#DB4A39` (Harvest Red)
- Font Headlines: Poppins
- Font Body: Inter
- Section Spacing: 160px
- Card Padding: 48px
- Max Width: 1400px

### Key Classes:
- `.btn-primary` - Primary button
- `.card-premium` - Premium card
- `.text-display` - Hero typography
- `.text-headline` - Section headers
- `.text-body` - Body text
- `.space-section` - Section spacing
- `.input-field` - Form inputs

### State Names:
- Deal: `pending_payment`, `payment_confirmed`, `goods_ready`, `in_transit`, `delivered`, `completed`
- Offer: `pending`, `accepted`, `rejected`, `counter-offered`, `expired`
- Transport: `request_created`, `quote_accepted`, `transport_assigned`, `in_transit`, `delivered`

---

**END OF CANONICAL PLAN**

*This document is the authoritative source of truth for Farm Feed platform development. All features, workflows, and design decisions must align with this plan.*

