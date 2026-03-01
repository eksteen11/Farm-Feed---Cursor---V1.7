# Farm Feed Landing Page — Next Steps for Bettering UX/UI

This plan ties together the per-persona review (5 good / 5 bad for Buyer, Seller, Transporter) and the visual/design audit (first-century vs 2026 world-class billion-dollar). Steps are ordered by impact and feasibility so you can implement in sequence.

---

## How This Plan Was Built

- **Per-persona:** 5 good / 5 bad for Buyer, Seller, Transporter (experience, trust, urge to register).
- **Visual/design:** What feels "first-century" vs "2026 world-class billion-dollar" (design, styling, colours, images, video, icons, typography, CTAs).

---

## Phase 1 — One Clear Action Per Persona (High Impact, Low Risk)

**Goal:** Each persona has one primary CTA and one "proof" moment so the urge to connect/register is specific.

| Step | What | Where / How |
|------|------|-------------|
| 1.1 | **Buyer – primary CTA** | Make the main action for buyers explicit: e.g. "See live listings" (→ `/listings`) or "Browse verified stock" as the hero/secondary CTA next to the 3 pillars. Ensure "I am a Buyer" doesn't compete; one is "see first," one is "register." |
| 1.2 | **Seller – primary CTA** | One clear seller CTA: "Create your first listing" or "List your grain" → `/register?intent=seller` or `/seller/create-listing`. Add one short line under it: e.g. "First offer in 24–48 hours" or "List once. Get offers. Keep the profit." |
| 1.3 | **Transporter – primary CTA** | One clear transporter CTA: "See open loads" or "View transport board" → `/transport` or `/transport/available`, plus "Register to quote" as secondary. So they see value (loads) before signup. |
| 1.4 | **Single hero CTA** | Decide the one "above the fold" action (e.g. "See listings" for anonymous, or "Get started" → register). Make it one button style (e.g. filled green); all others secondary/ghost so hierarchy is obvious. |

**Done when:** Each persona has exactly one primary next step and one secondary; no two CTAs of equal weight for the same goal.

---

## Phase 2 — One "Product" Moment Per Persona (Trust + 2026 Feel)

**Goal:** Show the product, not only copy. One visual "proof" per persona so it feels like a real app, not a brochure.

| Step | What | Where / How |
|------|------|-------------|
| 2.1 | **Buyer – proof of supply** | Add one section or block: "Live listings" or "What you can find" with 3–6 example listing cards (image, commodity, location, price/ton, "View"). Can be real data from API or static "example" cards. Ensures "there's grain here." |
| 2.2 | **Seller – proof of outcome** | Add one block: "From listing to deal" – 3 frames (e.g. "List" → "Offers" → "Contract") with short copy or simple illustration. Optional: "First offer in 24–48 hours" or a testimonial line with a number (e.g. "Sold 50t in first month"). |
| 2.3 | **Transporter – proof of volume** | Add one block: "Open loads" or "Transport board" – 3–5 example load cards (origin → destination, tonnage, "Quote") or a simple map with 2–3 route lines. Can be static/example. Optional: one stat ("X loads this week" or "Quote in under 2 min"). |

**Done when:** Each persona can point at one place on the page and say "that's what I get."

---

## Phase 3 — Consistent Stats and Copy (Credibility)

**Goal:** One set of numbers site-wide; no conflicting "500+" vs "thousands"; clear segment language.

| Step | What | Where / How |
|------|------|-------------|
| 3.1 | **Lock one stat set** | Pick one set (e.g. "500+ traders • R50M+ traded • 4.8/5 • 97% match") and use it everywhere: hero trust line, stats section, final CTA. Remove or replace any "Join thousands" or other variant. |
| 3.2 | **Segment line for buyers** | Add one line for buyers: e.g. "For feed mills, traders & processors" or "Find verified grain and feed." So they feel addressed. |
| 3.3 | **Seller outcome line** | Add one concrete promise for sellers: "List in 5 minutes" or "First offer in 24–48 hours" near the farmer CTA. |
| 3.4 | **Transporter volume line** | Add one line or number for transporters: "X loads per week" or "Quote on real loads in 2 minutes" (even if placeholder at first). |

**Done when:** Stats are consistent and each persona has one clear, credible promise.

---

## Phase 4 — Visual Design System (2026 Billion-Dollar Feel)

**Goal:** Typography, colour, and spacing feel intentional and premium; one accent for "transport" so transporters feel a distinct block.

| Step | What | Where / How |
|------|------|-------------|
| 4.1 | **Type scale** | Define and apply: one display size (hero), one headline (sections), one body, one caption. Use the same scale in `globals.css` or Tailwind config. Make stats "numbers first": big number, smaller label. |
| 4.2 | **Colour semantics** | Keep Forest Green primary. Use it for: primary CTAs, "verified/success." Use Harvest Red only for urgency or secondary emphasis. Add one neutral for "trust" (e.g. dark grey for footer/legal). Optional: one accent (e.g. orange or blue) only for the "Transporter" block so it reads as "transport" at a glance. |
| 4.3 | **Spacing and depth** | One consistent vertical rhythm (e.g. 64px or 80px between sections on desktop). Add subtle shadows or borders to cards so they're not flat; keep it minimal. |
| 4.4 | **Icon set** | Use one style (e.g. all rounded or all sharp) and one size range. Optional: very subtle motion on "verified" or "live" (e.g. shield or pulse) so it feels alive. |

**Done when:** The page has a clear type scale, consistent colour use, and one distinct "transport" accent if you choose to add it.

---

## Phase 5 — Imagery and Video (Emotional + Product Proof)

**Goal:** At least one "product" or "outcome" image per persona; one short video to show the product.

| Step | What | Where / How |
|------|------|-------------|
| 5.1 | **Hero image** | Keep landscape if it performs; consider adding a subtle "product" overlay (e.g. small screenshot of listings or app) or a second "product" section with a single strong image (listings grid or "deal done" screen). |
| 5.2 | **Seller image** | One image: "farmer with device" or "listing going live" or "offer notification." Real or stock, but clearly "you selling on Farm Feed." |
| 5.3 | **Transporter image** | One image: truck in context, or "load board" UI, or simple map with routes. So transporters see "this is for me." |
| 5.4 | **One hero or "how it works" video** | One short (6–15s) muted loop: e.g. search → results → offer (buyer), or list → offer → contract (seller), or load → quote (transporter). Single video is enough for "2026" feel; can expand later. |

**Done when:** Each persona has at least one image that shows "their" outcome or product; the page has one video that shows the product in action.

---

## Phase 6 — Persona-Specific Blocks (Scanability and "For Me")

**Goal:** One clearly distinct block per persona so they can instantly see "my" section.

| Step | What | Where / How |
|------|------|-------------|
| 6.1 | **Buyer block** | One section: "For buyers" – headline (e.g. "Browse verified grain & feed"), 2–3 short bullets, "See live listings" CTA, optional "Live listings" preview (from Phase 2). Slightly different background (e.g. light grey) so it's scannable. |
| 6.2 | **Seller block** | One section: "For farmers" – headline (e.g. "List your grain. Get direct offers."), "First offer in 24–48 hours" or "You keep the profit," "Create your first listing" CTA, optional "From listing to deal" visual (from Phase 2). Optional: very subtle warm/earth tone (e.g. light amber) in background. |
| 6.3 | **Transporter block** | One section: "For transporters" – headline (e.g. "Quote on loads. Fill your trucks."), "See open loads" or "X loads this week," "See transport board" or "Register to quote" CTA, optional map or load cards (from Phase 2). Optional: one accent colour (e.g. orange) only in this block. |

**Done when:** A buyer, seller, or transporter can scroll and immediately find "their" section and one primary CTA.

---

## Phase 7 — Final CTA and Footer (Clarity and Consistency)

**Goal:** One final CTA that matches the Risk-Free Hub message; footer supports trust and doesn't distract.

| Step | What | Where / How |
|------|------|-------------|
| 7.1 | **Final CTA copy** | Use one line: e.g. "Ready to connect? You trade, we handle the paperwork." Subline: one consistent stat ("Join 500+ FICA-verified traders") and "You keep the profit." Button: one primary ("Start trading – free" or "Get started"). |
| 7.2 | **Footer** | Keep Company / Solutions / Resources / Legal. Ensure "Solutions" links to listings (buyers), seller/create-listing or register (sellers), transport (transporters). No competing CTAs in footer. |

**Done when:** The last thing a user sees before footer reinforces one message and one action.

---

## Order of Implementation (Spear Sequence)

1. **Phase 1** – CTAs (quick wins, less design risk).
2. **Phase 2** – One product moment per persona (listings preview, listing→deal, loads/map).
3. **Phase 3** – Stats and copy (consistency and promises).
4. **Phase 4** – Type scale, colour, spacing, icons (design system).
5. **Phase 5** – Images and one video.
6. **Phase 6** – Persona blocks (buyer / seller / transporter sections).
7. **Phase 7** – Final CTA and footer.

---

## Success Criteria (How You Know It's "Bettered")

- **Buyer:** Can answer "Where do I see listings?" and "What do I do first?" in one glance; one primary CTA; one "proof" moment (listings or video).
- **Seller:** Can answer "What do I get?" (offers, you keep profit) and "What do I do?" (create listing); one primary CTA; one "outcome" moment (listing→deal or testimonial with number).
- **Transporter:** Can answer "Is there real volume?" (loads or stat) and "What do I do?" (see loads / register to quote); one primary CTA; one "transport" visual (loads or map).
- **Design:** Feels 2026: one type scale, clear colour roles, one product moment, one video, one primary CTA per section.
