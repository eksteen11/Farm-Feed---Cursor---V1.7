# Landing Page: Risk-Free Hub UX — Steps and How To Do It

This doc reworks the canonical plan (sections 1A and 1B) into the actual landing page UX. One task at a time; confirm each before applying.

---

## What to do (steps in order)

1. **Hero: Connection Engine** — Update headline to "The Pulse of SA Grain. You Trade, We Connect." and sub-headline to the peer-to-peer + FICA + contracts + invoices line. Optionally add or reuse a South Africa network map visual (Cape Town, Jo'burg, Free State) in or below the hero.
2. **3-Pillar user flow** — Replace the single "Start Trading" hero CTA with three clear portals: **I am a Farmer** (List your grain. Get direct offers.), **I am a Buyer** (Browse verified stock. Make an offer.), **I am a Transporter** (Quote on loads. Fill your trucks.). Each links to register with the right intent or a role-specific page.
3. **Pure Transparency section** — Add a new section with the 4-row "No-Risk" grid: Verification (FICA before prices), The Deal (Smart-Offer → auto-contract), Documentation (invoices & agreements on-platform), The Handover (contact details; logistics & payment private).
4. **Problem section** — Replace or reframe the current Problem/Solution block with headline "Stop Chasing Paper. Start Closing Deals." and the copy about agriculture moving on trust but stalling on admin, digitizing the handshake, and the platform stepping aside after the deal is locked.
5. **New World transformation** — Add a short section with four outcomes: Reduced Overhead, Speed, Security, Control (as in the canonical plan).
6. **How it Works** — Change the current "Get Started in 3 Simple Steps" to the 4-step visual: **LIST** (Farmer posts FICA-verified grain) → **BID** (Buyer makes an offer; Transporter submits a quote) → **LOCK** (Farm Feed generates contract & invoice) → **GO** (Parties connect offline. Deal Done.).
7. **Final CTA** — Optionally align final CTA copy with the Risk-Free Hub tone (e.g. "Ready to connect? You trade, we handle the paperwork.").

---

## How you’re going to do it (implementation)

- **Step 1 (Hero)**  
  - **File:** `src/shared/ui/NewHeroSection.tsx`  
  - **Changes:** Replace the current `<h1>` text ("Where Agriculture Trades Itself") with "The Pulse of SA Grain. You Trade, We Connect." Replace the `<h2>` sub-headline with the canonical sub-headline (peer-to-peer ecosystem, FICA-verified listings, automated contracts, professional invoices, you keep the profit, we eliminate friction).  
  - **Optional:** In the same component or directly in `src/app/page.tsx`, add a small "Network Map" block (e.g. reuse or adapt `SouthAfricaMap.tsx` with simple glowing lines between Cape Town, Jo'burg, Free State) below the hero text or as a background element; keep it lightweight (CSS/SVG, no heavy deps).

- **Step 2 (3-Pillar)**  
  - **File:** `src/shared/ui/NewHeroSection.tsx` (or a small new component used only in the hero).  
  - **Changes:** Remove or replace the single "Start Trading" button with three buttons or cards: "I am a Farmer" → e.g. `/register?role=seller` or `/seller/create-listing`, "I am a Buyer" → `/register?role=buyer` or `/listings`, "I am a Transporter" → `/register?role=transporter` or `/transport`. Use the exact CTA sub-lines from the plan (List your grain… / Browse verified stock… / Quote on loads…).  
  - **No other files** for this step unless you extract the three buttons into `RoleSelectionCards.tsx` and use it inside the hero.

- **Step 3 (Pure Transparency)**  
  - **File:** `src/app/page.tsx`  
  - **Changes:** Insert a new section (e.g. after the stats block or after LiveMarketplacePulse). Content: a 4-row grid (cards or table). Each row = one of: Verification, The Deal, Documentation, The Handover, with the "Farm Feed No-Risk Way" copy from the canonical plan. Use existing design system (Forest Green, Card if applicable).

- **Step 4 (Problem)**  
  - **File:** `src/app/page.tsx`  
  - **Changes:** In the existing Problem/Solution section (id `problem-solution`), replace "The Problem" / "Our Solution" headline and body with the single headline "Stop Chasing Paper. Start Closing Deals." and the single paragraph about trust vs admin, digitizing the handshake, and platform stepping aside. You can keep one CTA (e.g. "Start Trading Now") and optionally remove or simplify the role-switching imagery if it clutters the message.

- **Step 5 (New World)**  
  - **File:** `src/app/page.tsx`  
  - **Changes:** Add a new section (e.g. after Problem or after Pure Transparency) with four items: Reduced Overhead (no broker commissions), Speed (listing to signed contract in minutes), Security (only vetted users), Control (payments offline, keep your banking). Use a simple 2x2 or 4-column grid and existing typography/colors.

- **Step 6 (How it Works)**  
  - **File:** `src/app/page.tsx`  
  - **Changes:** In the section with id `how-it-works`, replace the current three steps (Sign Up, Browse & Connect, Trade & Grow) with four steps: LIST, BID, LOCK, GO, and the short descriptions from the plan. Keep the same section structure (e.g. grid + icons/numbers) so only content and number of steps change.

- **Step 7 (Final CTA)**  
  - **File:** `src/app/page.tsx`  
  - **Changes:** In the final CTA section (id `final-cta`), optionally change the headline and/or sub-text to match the Risk-Free Hub tone (e.g. "Ready to connect? You trade, we handle the paperwork." and a line about FICA-verified partners). Keep the primary button (e.g. "Start Trading Today - Free") or align label with the 3-pillar (e.g. "Get Started" that goes to register).

---

## Order of work (one task at a time)

| # | Task              | Main file(s)                    | Dependencies |
|---|-------------------|----------------------------------|--------------|
| 1 | Hero copy + map   | NewHeroSection.tsx (page.tsx if map in page) | None |
| 2 | 3-Pillar CTAs    | NewHeroSection.tsx (or RoleSelectionCards)   | None |
| 3 | Pure Transparency| page.tsx                         | None |
| 4 | Problem copy     | page.tsx                         | None |
| 5 | New World        | page.tsx                         | None |
| 6 | How it Works     | page.tsx                         | None |
| 7 | Final CTA copy   | page.tsx                         | None |

After you confirm which step to apply first (or "apply step 1", "apply all", etc.), implementation will be limited to that step’s file(s) and changes listed above.
