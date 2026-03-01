# 🎨 BILLION-DOLLAR UX WORKFLOW MASTERPLAN
## Farm Feed - Complete User Journey Design

*Designed with the simplicity and elegance of Apple's design philosophy - where every pixel serves a purpose and every interaction feels effortless*

---

## 🔒 Non-Negotiables (Synced from All MD Sources)
- Two-color brand only: Forest Green `#3D693D` (80%) primary, Harvest Red `#DB4A39` (20%) secondary; neutrals (white, charcoal, gray scale) for everything else.
- Typography: Poppins for headlines (hero up to 96px desktop / 64px mobile), Inter for body (18px base, 1.75 line-height, tightened letter-spacing on big headings).
- Spacing & layout: Sections 160px vertical; cards 48px padding; element gaps 32px; max width 1400px; touch targets ≥44px.
- Components: Use shared UI + design tokens; premium cards (24px radius, 3-layer shadow), glass nav, 56px primary buttons, floating-label inputs, branded skeletons with shimmer.
- Accessibility: Contrast ≥4.5:1; 4px focus rings; full keyboard navigation; ARIA + semantic HTML; supports 200% zoom.
- Interaction patterns: One primary CTA per screen; progressive disclosure; inline validation; empty states with one CTA; branded loading states; immediate feedback.
- Brand implementation plan: Remove non-brand colors; map primary actions to Forest Green, alerts/secondary to Harvest Red; audit with 80/20 rule across dashboards, buttons, badges, nav, inputs.
- Workflow alignment: Keep flows consistent with `BLUEPRINT.md` and `COMPREHENSIVE_WORKFLOW_MATRIX.md`; capability-based (sell/buy/transport for everyone), no role switching.
- Workstreams to respect: Exchange, Feed Nutrition, Transport Auto-Quotes, Market Prices, Industry Ads—navigation/entry points must leave room for these tracks.

---

## 🎯 CORE UX PHILOSOPHY

**"The best interface is no interface. The best design is invisible."**

### Design Principles:
1. **One Action Per Screen** - Never overwhelm. One primary CTA, clear purpose.
2. **Progressive Disclosure** - Show only what's needed, when it's needed.
3. **Visual Hierarchy** - Size, color, spacing guide the eye naturally.
4. **Immediate Feedback** - Every action has instant, clear response.
5. **Error Prevention** - Design to prevent mistakes, not just handle them.
6. **Trust Through Clarity** - Transparent pricing, clear status, visible progress.

---

## 👤 USER TYPE: BUYER
*Mission: Find quality feed, negotiate fair price, receive goods safely*

### JOURNEY MAP: BUYER WORKFLOW

#### **PHASE 1: DISCOVERY (Landing → Browse → Detail)**

**Screen 1: Homepage Hero**
- **What User Sees:**
  - Massive hero headline: "Find Quality Feed. Fast." (96px, bold)
  - Single search bar (64px height, centered, prominent)
  - Three filter chips: "Commodity", "Location", "Price Range"
  - Subtle animation: Search bar gently pulses to draw attention
- **What User Does:**
  - Types search OR clicks filter chip
- **Next Step:**
  - Results page with premium cards

**Screen 2: Browse Listings**
- **What User Sees:**
  - Grid of premium cards (3 columns desktop, 1 mobile)
  - Each card: Hero image (16:10 ratio), price (large, bold), location, grade badge
  - Floating filter sidebar (slide-out on mobile)
  - "24 listings found" counter
- **Card Design:**
  - White background, subtle shadow
  - Hover: Lifts 8px, shadow intensifies
  - Image: Rounded corners (20px), gradient overlay bottom
  - Price: Forest Green, 32px, bold
  - Location: Gray, 14px, with map pin icon
- **What User Does:**
  - Scrolls, hovers cards, clicks to view detail
- **Next Step:**
  - Detailed listing page

**Screen 3: Listing Detail**
- **What User Sees:**
  - **Hero Section:** Large image gallery (swipeable on mobile)
  - **Key Info Bar:** Price (massive, 48px), Quantity, Location, Grade
  - **Specifications Card:** Protein, Moisture, Fibre, ME Energy, Packaging
  - **Seller Card:** Name, rating (stars), "Verified" badge, transaction count
  - **Delivery Options:** Clear chips (Ex-Farm / Delivered)
  - **Single CTA Button:** "Make Offer" (56px height, Forest Green, prominent)
- **What User Does:**
  - Reviews details, checks seller reputation, clicks "Make Offer"
- **Next Step:**
  - Offer creation modal

---

#### **PHASE 2: NEGOTIATION (Offer → Counter → Accept)**

**Screen 4: Make Offer Modal**
- **What User Sees:**
  - **Pre-filled from listing:** Product name, seller name, base price
  - **Form Fields:**
    - Quantity (with slider: 1 to available quantity)
    - Price per ton (with suggested range: "Typical: R2,800 - R3,200")
    - Delivery type (radio: Ex-Farm / Delivered)
    - Delivery address (if delivered, with autocomplete)
    - Message (optional, textarea)
  - **Live Calculation:** "Total: R140,000" updates as user types
  - **Platform Fee:** "R50 (R1/ton)" shown clearly
  - **Single CTA:** "Send Offer" button (primary, large)
- **What User Does:**
  - Fills form, sees live total, clicks "Send Offer"
- **Feedback:**
  - Success animation: Checkmark, "Offer sent!" message
  - Modal closes, returns to listing
- **Next Step:**
  - Dashboard shows "Pending Offers" card

**Screen 5: Offer Status Dashboard**
- **What User Sees:**
  - **Status Timeline:** Visual progress bar
    - Step 1: Offer Sent (green, checkmark)
    - Step 2: Seller Reviewing (yellow, clock icon)
    - Step 3: Response (pending, gray)
  - **Offer Card:**
    - Product image thumbnail
    - Price, quantity, total amount
    - Status badge (Pending / Accepted / Countered / Rejected)
    - Time remaining: "Expires in 5 days"
  - **Action Buttons:**
    - If Countered: "View Counter Offer" (primary)
    - If Pending: "Cancel Offer" (secondary, small)
- **What User Does:**
  - Monitors status, clicks to view details
- **Next Step:**
  - Counter offer screen OR deal confirmation

**Screen 6: Counter Offer Response**
- **What User Sees:**
  - **Comparison Card:**
    - Your offer: R2,800/ton (grayed out)
    - Seller's counter: R3,000/ton (highlighted, green)
    - Difference: "+R200/ton" (shown clearly)
  - **Seller's Message:** Displayed in quote box
  - **Action Buttons:**
    - "Accept Counter" (primary, large, green)
    - "Propose New Price" (secondary)
    - "Decline" (tertiary, text link)
- **What User Does:**
  - Reviews counter, decides, clicks action
- **Next Step:**
  - Deal confirmation OR back to negotiation

---

#### **PHASE 3: DEAL EXECUTION (Deal → Transport → Payment)**

**Screen 7: Deal Confirmation**
- **What User Sees:**
  - **Success Animation:** Confetti, checkmark, "Deal Confirmed!"
  - **Deal Summary Card:**
    - Product: Yellow Maize, 50 tons
    - Price: R3,000/ton
    - Total: R150,000
    - Platform Fee: R50
    - **Grand Total: R150,050** (large, bold)
  - **Delivery Details:**
    - Type: Delivered
    - Address: [Your address]
    - Estimated Date: [7 days from now]
  - **Documents Generated:**
    - Contract (PDF icon, "Download")
    - Invoice (PDF icon, "Download")
  - **Single CTA:** "Proceed to Payment" (primary, large)
- **What User Does:**
  - Reviews deal, downloads documents, clicks payment
- **Next Step:**
  - Payment screen OR transport selection

**Screen 8: Transport Selection (If Delivered)**
- **What User Sees:**
  - **Auto-Generated Request:** "Transport request created automatically"
  - **Quote Cards:** 3 transporter quotes displayed
    - Each card: Price, estimated days, vehicle type, rating
    - Best match highlighted (green border)
  - **Backload Suggestion:** "Empty truck available on your route - Save R500"
  - **Comparison Table:** Side-by-side quote comparison
  - **Single CTA:** "Accept Quote" (primary) OR "Request More Quotes" (secondary)
- **What User Does:**
  - Compares quotes, selects best option
- **Next Step:**
  - Transport confirmed, payment screen

**Screen 9: Payment**
- **What User Sees:**
  - **Payment Summary:**
    - Product: R150,000
    - Transport: R3,200
    - Platform Fee: R50
    - **Total: R153,250** (massive, 64px, bold)
  - **Payment Method:** Card input (PayStack integration)
  - **Security Badges:** SSL, encrypted, secure
  - **Single CTA:** "Pay R153,250" (primary, large, green)
- **What User Does:**
  - Enters card details, clicks pay
- **Feedback:**
  - Loading state: Skeleton, "Processing payment..."
  - Success: "Payment successful!" animation
- **Next Step:**
  - Deal tracking dashboard

**Screen 10: Deal Tracking**
- **What User Sees:**
  - **Progress Timeline:**
    - ✅ Payment Received (green, checkmark)
    - ✅ Transport Assigned (green, checkmark)
    - 🔄 In Transit (yellow, active)
    - ⏳ Delivery Pending (gray, upcoming)
  - **Live Status Card:**
    - Current status: "In Transit"
    - Location: "En route from [Seller Location]"
    - ETA: "Arriving in 2 days"
    - Map: Live tracking (if available)
  - **Documents:**
    - Contract (signed)
    - Invoice (paid)
    - Transport Agreement
- **What User Does:**
  - Monitors progress, waits for delivery
- **Next Step:**
  - Delivery confirmation

**Screen 11: Delivery Confirmation**
- **What User Sees:**
  - **Delivery Card:**
    - Status: "Delivered" (green badge)
    - Date: [Date]
    - Photos: Proof of delivery images
  - **Confirmation Button:** "Confirm Delivery" (primary)
  - **Rating Prompt:** "Rate your experience" (stars, 1-5)
- **What User Does:**
  - Confirms delivery, rates seller and transporter
- **Next Step:**
  - Deal complete, receipt generated

---

## 🏪 USER TYPE: SELLER
*Mission: List products, receive offers, negotiate, fulfill orders, get paid*

### JOURNEY MAP: SELLER WORKFLOW

#### **PHASE 1: SETUP (Onboard → Verify → Subscribe)**

**Screen 1: Registration**
- **What User Sees:**
  - Clean form: Name, Email, Password, Phone
  - Capability selection: "What can you do?" (checkboxes: Sell / Buy / Transport)
  - All selected by default (unified system)
  - "Create Account" button (primary, large)
- **What User Does:**
  - Fills form, clicks create
- **Next Step:**
  - Email verification → Dashboard

**Screen 2: FICA Verification**
- **What User Sees:**
  - **Progress Indicator:** "Step 1 of 3: Verify Identity"
  - **Upload Cards:**
    - ID Document (drag & drop, preview)
    - Bank Statement (drag & drop, preview)
    - Entity Registration (optional, for companies)
  - **Status:** "Pending Review" (yellow badge)
  - **Note:** "You can browse, but need verification to create listings"
- **What User Does:**
  - Uploads documents, submits
- **Next Step:**
  - Dashboard (with "Complete FICA" prompt)

**Screen 3: Subscription Selection**
- **What User Sees:**
  - **Plan Cards:** 4 options (Free, Basic, Premium, Enterprise)
  - **Free Plan:** Highlighted limitations (1 listing, 3 offers/month)
  - **Basic Plan:** "Most Popular" badge, R10/month
  - **Comparison Table:** Feature comparison
  - **Single CTA per card:** "Choose [Plan Name]"
- **What User Does:**
  - Selects plan, proceeds to payment
- **Next Step:**
  - Payment → Dashboard unlocked

---

#### **PHASE 2: LISTING CREATION (Create → Publish → Monitor)**

**Screen 4: Create Listing - Step 1: Basics**
- **What User Sees:**
  - **Progress Bar:** "Step 1 of 5"
  - **Form Fields:**
    - Product Name (autocomplete: "Yellow Maize", "Soybean Meal", etc.)
    - Quantity (with unit selector: tons/kg/liters)
    - Location (map picker with autocomplete)
    - Grade (dropdown: A, B, C, D, Premium)
  - **Live Preview:** Card preview updates as user types
  - **Next Button:** "Continue" (primary, bottom right)
- **What User Does:**
  - Fills basics, clicks continue
- **Next Step:**
  - Pricing step

**Screen 5: Create Listing - Step 2: Pricing**
- **What User Sees:**
  - **Price Input:** "R / ton" (large input, with market price hint)
  - **Delivery Options:**
    - Ex-Farm (checkbox)
    - Delivered (checkbox, shows transport calculator)
    - Own Transport (checkbox, if user has transport capability)
  - **Payment Terms:** Textarea with template options
  - **Next Button:** "Continue"
- **What User Does:**
  - Sets price, selects delivery options
- **Next Step:**
  - Specifications step

**Screen 6: Create Listing - Step 3: Specifications**
- **What User Sees:**
  - **Specification Fields:**
    - Protein (%)
    - Moisture (%)
    - Fibre (%)
    - ME Energy (MJ/kg)
  - **Packaging:** Dropdown (Bulk, 25kg bag, 50kg bag, etc.)
  - **Certificates:** Upload area (lab results, quality certificates)
  - **Next Button:** "Continue"
- **What User Does:**
  - Fills specs, uploads certificates
- **Next Step:**
  - Media step

**Screen 7: Create Listing - Step 4: Media**
- **What User Sees:**
  - **Image Upload:** Drag & drop, preview grid (up to 10 images)
  - **Video Upload:** Optional, single video
  - **Image Tips:** "First image is your hero image"
  - **Next Button:** "Continue"
- **What User Does:**
  - Uploads images/video
- **Next Step:**
  - Review step

**Screen 8: Create Listing - Step 5: Review**
- **What User Sees:**
  - **Full Preview:** Complete listing card as buyers will see it
  - **Summary:** All details listed
  - **Publish Button:** "Publish Listing" (primary, large, green)
- **What User Does:**
  - Reviews, clicks publish
- **Feedback:**
  - Success: "Listing live!" animation
  - Share options: "Share on WhatsApp", "Copy Link"
- **Next Step:**
  - Dashboard shows new listing

---

#### **PHASE 3: OFFER MANAGEMENT (Receive → Respond → Deal)**

**Screen 9: Offers Dashboard**
- **What User Sees:**
  - **Two Tabs:** "Received" (primary, with badge count) / "Sent"
  - **Offer Cards:**
    - Buyer name, rating, verification badge
    - Product thumbnail
    - Offer price, quantity, total
    - Status badge (Pending / Countered / Accepted)
    - Time remaining: "Expires in 3 days"
  - **Quick Actions:** "Accept", "Counter", "Reject" (on hover)
- **What User Does:**
  - Reviews offers, clicks to view detail
- **Next Step:**
  - Offer detail screen

**Screen 10: Offer Detail**
- **What User Sees:**
  - **Buyer Card:** Name, rating, transaction history, verification
  - **Offer Details:**
    - Price: R2,800/ton (vs your listing: R3,200/ton)
    - Quantity: 50 tons
    - Delivery: Delivered
    - Message: [Buyer's message]
  - **Action Buttons:**
    - "Accept Offer" (primary, large, green)
    - "Counter Offer" (secondary)
    - "Reject" (tertiary, red)
- **What User Does:**
  - Reviews offer, clicks action
- **Next Step:**
  - Counter offer modal OR deal creation

**Screen 11: Counter Offer Modal**
- **What User Sees:**
  - **Current Offer:** R2,800/ton (grayed out)
  - **Your Counter:** Price input (pre-filled: R3,000/ton)
  - **Message:** Textarea (optional)
  - **Send Button:** "Send Counter Offer" (primary)
- **What User Does:**
  - Sets counter price, sends
- **Next Step:**
  - Offer status updates, buyer notified

**Screen 12: Deal Created (After Accept)**
- **What User Sees:**
  - **Success Animation:** "Deal Created!"
  - **Deal Summary:**
    - Buyer: [Name]
    - Product: 50 tons Yellow Maize
    - Price: R3,000/ton
    - Total: R150,000
    - Platform Fee: R50 (deducted)
    - **Your Earnings: R149,950** (large, bold, green)
  - **Documents:**
    - Contract (generated, ready to sign)
    - Invoice (generated, sent to buyer)
  - **Transport Section:**
    - If delivered: "Transport request created"
    - If ex-farm: "Buyer will arrange transport"
  - **Next Steps:**
    - "Prepare Goods" checklist
- **What User Does:**
  - Reviews deal, downloads contract
- **Next Step:**
  - Fulfillment tracking

---

#### **PHASE 4: FULFILLMENT (Prepare → Ship → Get Paid)**

**Screen 13: Fulfillment Dashboard**
- **What User Sees:**
  - **Active Deals:** List of deals in progress
  - **Status Timeline:**
    - ✅ Deal Confirmed
    - ✅ Payment Received (or pending)
    - 🔄 Preparing Goods (active)
    - ⏳ Pickup Scheduled
    - ⏳ In Transit
    - ⏳ Delivered
  - **Action Items:**
    - "Mark Goods Ready" button
    - "Schedule Pickup" calendar
- **What User Does:**
  - Updates status, coordinates pickup
- **Next Step:**
  - Delivery confirmation

**Screen 14: Payment Received**
- **What User Sees:**
  - **Payment Card:**
    - Status: "Payment Received" (green badge)
    - Amount: R149,950
    - Date: [Date]
    - Platform Fee: R50 (shown separately)
  - **Payout Status:** "Processing" / "Completed"
  - **Receipt:** Download button
- **What User Does:**
  - Confirms payment, downloads receipt
- **Next Step:**
  - Deal complete, rating prompt

---

## 🚛 USER TYPE: TRANSPORTER
*Mission: Find loads, quote competitively, transport safely, get paid*

### JOURNEY MAP: TRANSPORTER WORKFLOW

#### **PHASE 1: DISCOVERY (Browse Requests → View Details)**

**Screen 1: Transport Marketplace**
- **What User Sees:**
  - **Two Sections:**
    - "Transport Requests" (buyers/sellers need transport)
    - "Backload Opportunities" (empty trucks, your routes)
  - **Request Cards:**
    - Route: "Johannesburg → Cape Town"
    - Quantity: 50 tons
    - Product: Yellow Maize
    - Budget: R3,000 - R4,000
    - Urgency: "Urgent" badge (if applicable)
  - **Filter Bar:** Route, Date, Capacity, Price Range
- **What User Does:**
  - Browses requests, clicks to view detail
- **Next Step:**
  - Request detail screen

**Screen 2: Transport Request Detail**
- **What User Sees:**
  - **Route Map:** Visual route with distance
  - **Details:**
    - Pickup: [Location, Date, Time]
    - Delivery: [Location, Date]
    - Quantity: 50 tons
    - Product: Yellow Maize
    - Special Requirements: [If any]
  - **Auto-Calculated Estimate:** "Typical: R3,200 - R3,800"
  - **Quote Button:** "Submit Quote" (primary, large)
- **What User Does:**
  - Reviews request, clicks to quote
- **Next Step:**
  - Quote form

---

#### **PHASE 2: QUOTING (Create Quote → Submit → Wait)**

**Screen 3: Create Quote**
- **What User Sees:**
  - **Pre-filled:** Route, quantity, product
  - **Quote Fields:**
    - Price (with suggested range)
    - Estimated Days (slider: 1-7 days)
    - Vehicle Type (dropdown: Covered Truck, Flatbed, etc.)
    - Available Date (calendar picker)
    - Insurance (dropdown: Basic, Full Coverage)
    - Message (optional)
  - **Breakdown:**
    - Base Price: R2,500
    - Fuel Surcharge: R400
    - Insurance: R200
    - **Total: R3,100** (updates live)
  - **Submit Button:** "Submit Quote" (primary)
- **What User Does:**
  - Fills quote, submits
- **Feedback:**
  - Success: "Quote submitted! You'll be notified when selected."
- **Next Step:**
  - Quotes dashboard

**Screen 4: My Quotes Dashboard**
- **What User Sees:**
  - **Tabs:** "Pending" / "Accepted" / "Rejected"
  - **Quote Cards:**
    - Route, quantity
    - Your quote: R3,100
    - Status: Pending / Accepted
    - Time submitted: "2 hours ago"
  - **Action:** "View Details" (if accepted)
- **What User Does:**
  - Monitors quotes, waits for acceptance
- **Next Step:**
  - Quote accepted notification

---

#### **PHASE 3: TRANSPORT EXECUTION (Accept → Pickup → Deliver)**

**Screen 5: Quote Accepted**
- **What User Sees:**
  - **Success Notification:** "Quote Accepted!"
  - **Job Details:**
    - Route, quantity, price
    - Pickup: [Date, Time, Location]
    - Delivery: [Date, Location]
    - Contact: [Buyer/Seller phone]
  - **Documents:**
    - Transport Agreement (download)
    - Route Map (download)
  - **Action Button:** "Accept Job" (primary)
- **What User Does:**
  - Reviews job, accepts
- **Next Step:**
  - Active transport dashboard

**Screen 6: Active Transport**
- **What User Sees:**
  - **Status Timeline:**
    - ✅ Job Accepted
    - 🔄 En Route to Pickup (active)
    - ⏳ Pickup Scheduled
    - ⏳ In Transit
    - ⏳ Delivery
  - **Action Buttons:**
    - "Mark En Route" (when leaving)
    - "Confirm Pickup" (with photo upload)
    - "Start Delivery" (when loaded)
    - "Confirm Delivery" (with photo upload)
  - **Map:** Live location (if GPS enabled)
- **What User Does:**
  - Updates status at each step
- **Next Step:**
  - Delivery confirmation

**Screen 7: Delivery Confirmation**
- **What User Sees:**
  - **Delivery Form:**
    - Upload photos (proof of delivery)
    - Delivery time (auto-filled)
    - Notes (optional)
  - **Submit Button:** "Confirm Delivery" (primary)
- **What User Does:**
  - Uploads photos, confirms
- **Feedback:**
  - Success: "Delivery confirmed! Payment processing..."
- **Next Step:**
  - Payment received

**Screen 8: Payment Received**
- **What User Sees:**
  - **Payment Card:**
    - Amount: R3,100
    - Platform Fee: R150 (deducted)
    - **Your Earnings: R2,950** (large, bold)
  - **Receipt:** Download button
  - **Rating Prompt:** "Rate your experience with buyer/seller"
- **What User Does:**
  - Confirms payment, rates
- **Next Step:**
  - Job complete

---

#### **PHASE 4: BACKLOAD OPTIMIZATION (Post Empty Routes)**

**Screen 9: Create Backload Listing**
- **What User Sees:**
  - **Form:**
    - Route: Pickup → Delivery (map picker)
    - Available Date: Calendar
    - Capacity: 20 tons (slider)
    - Price per km: R2.80
    - Vehicle Details: Type, equipment
  - **Auto-Calculate:** Total price based on distance
  - **Publish Button:** "List Backload" (primary)
- **What User Does:**
  - Fills form, publishes
- **Next Step:**
  - Backload listed, buyers can book

---

## 👑 USER TYPE: ADMIN
*Mission: Oversee platform, verify users, resolve disputes, ensure quality*

### JOURNEY MAP: ADMIN WORKFLOW

#### **PHASE 1: DASHBOARD OVERVIEW**

**Screen 1: Admin Command Center**
- **What Admin Sees:**
  - **KPI Cards (4 columns):**
    - Active Listings: 1,234
    - Pending Offers: 56
    - Active Deals: 89
    - FICA Pending: 12
  - **Alert Banner:** "12 FICA verifications pending review"
  - **Recent Activity Feed:**
    - New listings (with moderation buttons)
    - Dispute reports
    - Payment issues
  - **Quick Actions:**
    - "Review FICA" (primary)
    - "View Disputes" (secondary)
    - "System Analytics" (tertiary)
- **What Admin Does:**
  - Reviews overview, clicks to action
- **Next Step:**
  - Specific admin section

---

#### **PHASE 2: USER VERIFICATION**

**Screen 2: FICA Review Queue**
- **What Admin Sees:**
  - **Queue List:**
    - User name, email
    - Documents uploaded (thumbnails)
    - Submitted: [Date]
    - Status: Pending
  - **Review Panel (when clicked):**
    - Document viewer (full screen)
    - User details
    - Action Buttons:
      - "Approve" (green, primary)
      - "Reject" (red, secondary)
      - "Request More Info" (yellow, tertiary)
  - **Bulk Actions:** "Approve All Verified" (if confident)
- **What Admin Does:**
  - Reviews documents, approves/rejects
- **Next Step:**
  - User notified, status updated

---

#### **PHASE 3: CONTENT MODERATION**

**Screen 3: Listing Moderation**
- **What Admin Sees:**
  - **Flagged Listings:**
    - Listing card with "Flagged" badge
    - Reason: "Suspicious pricing" / "Duplicate" / etc.
    - User details
  - **Actions:**
    - "Approve" (if false flag)
    - "Unpublish" (if violation)
    - "Warn User" (if minor issue)
    - "Suspend User" (if serious)
- **What Admin Does:**
  - Reviews, takes action
- **Next Step:**
  - Listing status updated, user notified

---

#### **PHASE 4: DISPUTE RESOLUTION**

**Screen 4: Dispute Management**
- **What Admin Sees:**
  - **Dispute Cards:**
    - Deal ID, parties involved
    - Issue: "Payment not received" / "Quality dispute" / etc.
    - Status: Open / In Review / Resolved
  - **Dispute Detail:**
    - Full conversation history
    - Documents (contracts, invoices, photos)
    - Resolution options:
      - "Refund Buyer"
      - "Release Payment to Seller"
      - "Partial Refund"
      - "Close Dispute" (if resolved)
- **What Admin Does:**
  - Reviews dispute, makes decision
- **Next Step:**
  - Resolution applied, parties notified

---

#### **PHASE 5: ANALYTICS & INSIGHTS**

**Screen 5: Platform Analytics**
- **What Admin Sees:**
  - **Revenue Dashboard:**
    - Subscription revenue (chart)
    - Transaction fees (chart)
    - Total: RXXX,XXX
  - **User Metrics:**
    - Active users (DAU, MAU)
    - Conversion rates
    - Churn rate
  - **Transaction Metrics:**
    - Deals completed
    - Average deal value
    - Platform fee collected
- **What Admin Does:**
  - Monitors metrics, exports reports
- **Next Step:**
  - Data-driven decisions

---

## 🎨 DESIGN SYSTEM INTEGRATION

### Visual Language:
- **Typography:** Poppins (headlines, 96px hero), Inter (body, 18px base)
- **Colors:** Forest Green (#3D693D) primary, Harvest Red (#DB4A39) urgency
- **Spacing:** 160px section padding, 48px card padding, 32px element gaps
- **Shadows:** 3-layer depth system (soft, medium, hard)
- **Animations:** 300ms cubic-bezier transitions, 8px hover lift
- **Cards:** 24px border radius, white background, subtle border

### Interaction Patterns:
- **Buttons:** 56px height primary, 2px border secondary, text tertiary
- **Forms:** Floating labels, 2px focus ring, real-time validation
- **Modals:** Backdrop blur, centered, 600px max-width
- **Loading:** Skeleton screens with shimmer, branded colors
- **Empty States:** Custom illustrations, helpful copy, single CTA

### Mobile Optimization:
- **Navigation:** Bottom tab bar (Home, Search, Activity, Profile)
- **Touch Targets:** 44px minimum
- **Swipe Gestures:** Cards swipeable, modals dismissible
- **Forms:** Full-width inputs, larger spacing

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Core Screens (Week 1-2)
- [ ] Buyer: Homepage, Browse, Detail, Offer Modal
- [ ] Seller: Registration, FICA, Create Listing (5 steps)
- [ ] Transporter: Marketplace, Request Detail, Quote Form
- [ ] Admin: Dashboard, FICA Queue

### Phase 2: Workflow Integration (Week 3-4)
- [ ] Buyer: Offer Status, Counter Response, Deal Confirmation, Payment
- [ ] Seller: Offers Dashboard, Counter Modal, Deal Created, Fulfillment
- [ ] Transporter: Quotes Dashboard, Active Transport, Delivery
- [ ] Admin: Moderation, Disputes, Analytics

### Phase 3: Polish & Optimization (Week 5-6)
- [ ] All: Empty states, loading states, error handling
- [ ] All: Mobile optimization, accessibility
- [ ] All: Animations, micro-interactions
- [ ] All: Testing, refinement

---

## 🚀 READY TO BUILD

This masterplan provides **every screen, every interaction, every detail** needed to build a billion-dollar user experience. Each screen has:
- Clear purpose
- Single primary action
- Immediate feedback
- Natural progression
- Trust-building elements

**Let's build something extraordinary.** 🎯✨

