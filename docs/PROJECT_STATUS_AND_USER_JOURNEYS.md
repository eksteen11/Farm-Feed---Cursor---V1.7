# Farm Feed — Project Status & User Journeys

**Date:** March 2025  
**Purpose:** Where we are now + full workflows for Seller, Buyer, and Transporter

---

## 1. Where We Are Right Now

### What Farm Feed Is
Farm Feed is a **unified South African grain and feed marketplace** that connects:
- **Sellers** (farmers, traders) who list grain/feed
- **Buyers** (feed mills, buyers) who make offers and buy
- **Transporters** who quote on delivery and run backloads

**Core rules:**
- **No payment processing** — all product and transport payments happen off-platform (bank transfer, etc.). Farm Feed only tracks proof of payment (POP).
- **One account, many capabilities** — a user can have `sell`, `buy`, and/or `transport`; no “role switching.”
- **Design:** Forest Green (#3D693D) 80%, Harvest Red (#DB4A39) 20%, neutrals.

---

### Current Implementation Status

| Area | Status | Notes |
|------|--------|--------|
| **Auth (Signup/Login)** | ⚠️ Needs DB fix | Frontend passes `role` + `capabilities`; profile creation depends on Supabase trigger. Run `supabase/migrations/FIX_USER_REGISTRATION_TRIGGER.sql` in Supabase SQL Editor if signup fails with “Database error saving new user”. |
| **Landing page** | ✅ In place | Hero, listings CTA, role/capability messaging, testimonials, live activity, etc. |
| **Listings** | ✅ | Browse `/listings`, detail `/listings/[id]`, filters, product cards. |
| **Seller: Create listing** | ✅ | `/seller/create-listing` — product details, images, specs, delivery options. |
| **Seller: Offers** | ✅ | `/dashboard/offers` — view, accept, reject offers. Accept → creates deal. |
| **Seller: Deals** | ⚠️ Partial | `/dashboard/deals` — list and basic status. **Missing:** seller “Confirm payment”, “Goods ready”, “Confirm delivery”, ratings. See `docs/SELLER_WORKFLOW_NEXT_STEPS.md`. |
| **Buyer: Browse & offer** | ✅ | Browse listings, make offer from listing detail. |
| **Buyer: Dashboard** | ✅ | `/buyer/dashboard` — buyer-focused view. |
| **Transport** | ✅ Partial | `/transport` — requests, quotes, backloads. Some stats/real data wiring and deal-linked requests noted in `docs/TRANSPORT_PAGE_UX_ANALYSIS.md`. |
| **Unified dashboard** | ✅ | `/dashboard` — shows actions by capability (buy/sell/transport). |
| **Subscription / FICA** | Pages exist | `/subscription`, `/fica` — structure in place; full flows may need completion. |

**Source of truth for product/UX:** `docs/FARM_FEED_MASTER_CANONICAL_PLAN_V1_2.md`.

---

## 2. Seller — Full Journey, Features, Benefits & Solutions

### Who Is the Seller?
Farmers and traders who have grain/feed to sell and want buyers, contracts, and less admin.

### Problems We Solve
- “I have grain/feed to sell but don’t know where to find buyers.”
- “I need professional listings and clear offers.”
- “I want contracts and invoices without manual paperwork.”
- “I need delivery options (ex-farm or delivered) and transport visibility.”

### Benefits
- **Reach** — Listings visible to all buyers on the platform.
- **Professional image** — Listings with images, specs, grades, certificates.
- **Less admin** — Auto-generated contracts and invoices when a deal is created.
- **Clear process** — Offer → Accept → Payment tracking → Goods ready → Delivery.
- **Trust** — Buyer reputation visible; payment confirmation and status tracking.

### Solutions (What the Platform Does)
1. **Listing creation** — Rich listings (product, quantity, price/ton, images, specs, delivery options).
2. **Offer management** — See offers, buyer details, accept/counter/reject; accept creates deal and documents.
3. **Deal flow** — See deal status; confirm payment (when implemented); mark “Goods ready”; delivery confirmation and completion (when implemented).
4. **Documents** — Contract and invoice PDFs when deal is created.
5. **Transport** — If “delivered” is chosen, transport request is created; transporters quote; buyer/seller choose quote.

### New Seller Journey (Step-by-Step)

1. **Sign up**  
   - Go to `/register`.  
   - Step 1: Name, email, password, location.  
   - Step 2: Choose “Sell products” (and optionally Buy / Transport).  
   - Submit → account created (ensure DB trigger is run if signup fails).

2. **Optional: FICA & subscription**  
   - FICA: `/fica` (required for listing creation / larger offers per plan).  
   - Subscription: `/subscription` — Free (1 listing) vs Basic R10/mo (unlimited), etc.

3. **Create first listing**  
   - Dashboard → “Create Listing” or go to `/seller/create-listing`.  
   - Fill product, quantity, price/ton, images, specs, delivery (ex-farm/delivered).  
   - Publish → listing is live.

4. **Receive offers**  
   - Notifications / `/dashboard/offers`.  
   - See buyer, price, quantity, message.  
   - **Accept** → deal created, contract + invoice generated, chat thread (when implemented).

5. **Deal: wait for payment**  
   - Status: “Pending payment (off-platform)”.  
   - Buyer pays you off-platform and uploads proof of payment (POP).

6. **Confirm payment (when implemented)**  
   - In deal detail: view POP → “Confirm payment received” or “Dispute”.  
   - Status → “Payment confirmed”.

7. **Goods ready (when implemented)**  
   - Prepare goods → “Mark goods ready”.  
   - Buyer is notified; if delivered, transport quotes can be requested/selected.

8. **Delivery / pickup**  
   - **Ex-farm:** Buyer arranges pickup; you confirm when collected.  
   - **Delivered:** Transporter selected from quotes → pickup → in transit → delivery; buyer confirms receipt.

9. **Complete & rate (when implemented)**  
   - Seller confirms delivery complete → deal status “Completed”.  
   - Rate buyer (and transporter if applicable).

### Seller Routes (App)
- `/register` (choose Sell)
- `/dashboard` (unified; seller actions)
- `/seller/create-listing`
- `/seller/dashboard`
- `/dashboard/offers`
- `/dashboard/deals`
- `/dashboard/listings`

---

## 3. Buyer — Full Journey, Features, Benefits & Solutions

### Who Is the Buyer?
Feed mills, buyers, and traders who need to source quality grain/feed reliably.

### Problems We Solve
- “I need reliable suppliers and quality grain/feed quickly.”
- “I don’t know who to trust; quality and prices vary.”
- “I want to compare options and negotiate without hassle.”
- “I need delivery arranged and proper contracts.”

### Benefits
- **Discovery** — One place to browse and filter listings (product, grade, location, price, seller).
- **Trust** — Verified badges, ratings, certificates, clear terms.
- **Transparency** — Price/ton, platform fee (e.g. R1/ton), total shown upfront.
- **Simple process** — Make offer → accept → pay off-platform → upload POP → goods ready → delivery.
- **Documents** — Contract and invoice when deal is created.

### Solutions (What the Platform Does)
1. **Search & filters** — By product type, grade, location, price, seller verification.
2. **Listing detail** — Full specs, images, certificates, seller profile, delivery options.
3. **Offers** — Make offer (price, quantity, delivery); platform fee shown; optional message.
4. **Deal flow** — When seller accepts: deal created, contract + invoice; buyer pays off-platform, uploads POP; seller confirms (when implemented); goods ready → delivery or pickup.
5. **Transport** — If “delivered,” transport request is created; buyer (or seller) selects transporter quote; delivery tracked to completion.

### New Buyer Journey (Step-by-Step)

1. **Sign up**  
   - `/register` → Step 1 (name, email, password, location) → Step 2: choose “Buy products” (and optionally Sell / Transport).

2. **Optional: FICA & subscription**  
   - FICA for higher-value or platform requirements.  
   - Subscription for more offers/features (Free: 3 offers/month, etc.).

3. **Browse listings**  
   - `/listings` or “Browse Listings” from dashboard.  
   - Filter/sort; open listing for full detail.

4. **Make offer**  
   - On listing detail: “Make Offer” → set price, quantity, delivery, message.  
   - See total and platform fee → “Send offer”.

5. **Offer accepted**  
   - Notification → deal created.  
   - Deal dashboard: status “Pending payment (off-platform)”.

6. **Pay & upload POP**  
   - Pay seller off-platform (bank transfer, etc.).  
   - In deal: “Upload proof of payment” (screenshot/receipt).  
   - Status → “Payment uploaded – awaiting seller confirmation”.

7. **Seller confirms payment (when implemented)**  
   - Status → “Payment confirmed – goods being prepared”.

8. **Goods ready**  
   - If ex-farm: arrange pickup; seller confirms.  
   - If delivered: view transport quotes → select quote → transporter assigned; pickup → in transit → delivery.

9. **Confirm receipt & complete**  
   - Confirm delivery/receipt → deal moves to completed.  
   - Rate seller (and transporter if applicable).

### Buyer Routes (App)
- `/register` (choose Buy)
- `/dashboard`
- `/listings`, `/listings/[id]`
- `/buyer/dashboard`
- `/dashboard/offers`
- `/dashboard/deals`

---

## 4. Transporter — Full Journey, Features, Benefits & Solutions

### Who Is the Transporter?
Truck owners and logistics providers who want loads, fewer empty trips, and backloads.

### Problems We Solve
- “I have an empty truck and need loads.”
- “I want to optimize routes and reduce empty mileage.”
- “I need to bid on jobs simply and get paid.”
- “I want to advertise backloads when I have space.”

### Benefits
- **Load discovery** — See transport requests from deals (and standalone requests).
- **Quote simply** — Submit quotes (auto-calc + manual adjust when implemented); clear fee (e.g. R300 split).
- **Backloads** — Create “empty truck” listings; buyers/sellers can book.
- **Status tracking** — Assigned → pickup scheduled → in transit → delivered; photo proof where implemented.
- **One account** — Same login as buy/sell; capability “transport” unlocks transport features.

### Solutions (What the Platform Does)
1. **Transport marketplace** — List of active requests; filter by route, distance, quantity, date (and map when available).
2. **Quote submission** — Submit quote (price, pickup/delivery, notes); when accepted, job is assigned.
3. **Backload listings** — Create backload (route, capacity, dates, price); others book; you confirm.
4. **Job execution** — Update status (pickup scheduled → in transit → delivered); upload photos if supported.
5. **Payment** — Off-platform: typically R150 from buyer + R150 from seller (R300 total); platform fee structure per canonical plan.

### New Transporter Journey (Step-by-Step)

1. **Sign up**  
   - `/register` → Step 2: choose “Transport / Logistics” (and optionally Buy/Sell).

2. **Optional: FICA & subscription**  
   - FICA may be required for transport.  
   - Subscription: Free (e.g. 2 quotes/month) vs Basic (unlimited), etc.

3. **Find loads**  
   - “Transport” in nav or `/transport`, `/transport/available`.  
   - Browse requests; open for route, quantity, dates, buyer/seller.

4. **Submit quote**  
   - “Submit quote” on a request → enter price, pickup/delivery windows, notes.  
   - Submit → buyer/seller can accept.

5. **Quote accepted**  
   - Notification → job assigned.  
   - Confirm job → status “Transport assigned”.

6. **Run the job**  
   - Schedule pickup → “Pickup scheduled”.  
   - Load goods, upload pickup photos if available → “In transit”.  
   - Deliver, upload delivery photos if available → “Delivered”.

7. **Buyer confirms delivery**  
   - Buyer confirms receipt → “Transport complete”.  
   - Payment off-platform (R150 + R150); rate each other when implemented.

8. **Backloads (optional)**  
   - Empty return trip → `/transport/create-backload`.  
   - Set route, capacity, dates, price → publish; accept bookings and complete as above.

### Transporter Routes (App)
- `/register` (choose Transport)
- `/dashboard`
- `/transport` (main transport dashboard)
- `/transport/available` (browse requests)
- `/transport/my-requests` (your requests/quotes)
- `/transport/create-backload`
- `/dashboard/transport`

---

## 5. Quick Reference: Capabilities vs Routes

| Capability | Main actions | Key routes |
|------------|--------------|------------|
| **Sell** | Create listing, manage offers, confirm payment, goods ready, confirm delivery | `/seller/create-listing`, `/dashboard/offers`, `/dashboard/deals`, `/dashboard/listings` |
| **Buy** | Browse, make offer, pay, upload POP, confirm receipt | `/listings`, `/listings/[id]`, `/buyer/dashboard`, `/dashboard/offers`, `/dashboard/deals` |
| **Transport** | Find requests, submit quote, create backload, run job | `/transport`, `/transport/available`, `/transport/create-backload`, `/transport/my-requests` |

---

## 6. Recommended Next Steps (Priority)

1. **Auth** — Run `supabase/migrations/FIX_USER_REGISTRATION_TRIGGER.sql` in Supabase if signup still fails; verify login and session persistence.
2. **Seller workflow** — Implement payment confirmation, “Goods ready,” and delivery completion + ratings (see `docs/SELLER_WORKFLOW_NEXT_STEPS.md`).
3. **Transport** — Tie transport requests to deals where “delivered” is selected; ensure stats and action items use real data (see `docs/TRANSPORT_PAGE_UX_ANALYSIS.md`).
4. **Unified UX** — Ensure all dashboards and CTAs respect capabilities (e.g. `canUserPerformAction(user, 'transport')`) and match the canonical plan.

---

*This document is a snapshot of project status and intended user journeys. For the full product and UX spec, see `docs/FARM_FEED_MASTER_CANONICAL_PLAN_V1_2.md`.*
