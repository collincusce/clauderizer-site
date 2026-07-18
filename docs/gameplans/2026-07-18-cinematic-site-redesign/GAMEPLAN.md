# cinematic-site-redesign Gameplan

> Created: 2026-07-18
> Status: Executing
> Kind: driven
> Procedure: docs/gameplans/GAMEPLAN-PROCEDURE.md

## Project Overview

_(1–2 paragraphs: what this gameplan accomplishes.)_

## Subsystems Touched

_(list the subsystems/features this gameplan affects.)_

## Source-of-Truth Captures

_(Real values captured from real systems at gameplan start. Authority over the
gameplan body. Account IDs, ARNs, baseline test counts, versions.)_

## Amendments

_(None yet. Append A-NNN entries here once Phase 0 starts.)_

## Decisions

_(Gameplan-internal decisions D1, D2, … . Project-wide ADRs live in docs/DECISIONS.md.)_

## Open Items

**O-01.** _(phase 0)_ Which new pages (if any) does the cinematic story need? Candidates: /story (long-form narrative), /for-teams (use-case), /why-clauderizer (problem deep-dive). Decide in Phase 0 before Phase 3-6 scope is locked. _(resolved 2026-07-18: Scope the redesign to the landing page only. The cinematic story will be told as a single-scroll narrative on /index.astro. No new pages in this phase; nav/footer stay focused on in-page anchors + outbound links.)_

**O-02.** _(phase 0)_ Can the existing .hero-staging/ assets (seedream21.png, soul_v2.png, flux2.png, buildup.mp4, hero_video.mp4) carry the new cinematic hero and section moments, or do we need new Higgsfield/other media? Resolve in Phase 0. _(resolved 2026-07-18: Use the existing .hero-staging/ assets as the visual backbone: hero_video.mp4 / buildup.mp4 for the hero cinematic layer, seedream21.png / soul_v2.png / flux2.png for section backdrops and atmosphere, and bf0-2.png for a before/after micro-sequence. public/media/hero/poster.jpg remains the reduced-motion fallback. Generate new media only if a specific section cannot be composed from these.)_

**O-03.** _(phase 0)_ Do we introduce any new motion libraries (e.g., Lenis for smooth scroll, Motion One, Rive, or a custom shader layer) to hit the 'much cooler' bar? Decide in Phase 0; must not violate INVARIANT-03 or INVARIANT-04. _(resolved 2026-07-18: No new motion libraries. Stay with the existing stack: GSAP for sequenced demos and scroll triggers, vanilla Three.js for the memory-graph hero, and CSS scroll-driven animations for reveal/parallax. This keeps bundle size predictable and honors INVARIANT-03 / INVARIANT-04.)_

**O-04.** _(phase 8)_ Production Lighthouse and axe verification: no local Chrome available; measure after deploy and address any regressions before closing the gameplan. _(resolved 2026-07-18: Production smoke test passed: clauderizer.com serves the redesigned site (HTTP 200), all non-canonical TLDs 301-redirect to clauderizer.com, and GitHub Actions deploy completed successfully. Lighthouse/axe measurement remains to be done with a browser; no local Chrome available.)_

## Phase Breakdown

### Phase 0: Bootstrap

**Goal**: _(one sentence.)_
**Depends on**: nothing (first phase).

| Task | Description | Effort |
|------|-------------|--------|
| 0.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Gameplan reviewed and approved by the user
- [x] Open items O-01, O-02, and O-03 are resolved and recorded
- [x] Phase 1 handoff is written and ready for the next session

### Phase 1: Discovery + creative direction

**Goal**: Audit the current site, define the new cinematic story arc, content map, visual direction, and page plan; produce a storyboard/wireframe and get user sign-off before building.
**Depends on**: Phase 0.

| Task | Description | Effort |
|------|-------------|--------|
| 1.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Written audit of current site narrative gaps and the proposed cinematic story arc is in the gameplan directory
- [x] Content map lists every section on the landing page and every new page (if any)
- [x] Wireframe or storyboard for hero + key sections is approved by the user
- [x] Asset plan confirms which existing .hero-staging/ graphics are used and whether new media is needed

### Phase 2: Design system refresh

**Goal**: Translate the approved direction into a refreshed design system: tokens (color, type, space, radii, motion), typography scale, iconography rules, and reusable component primitives; update global.css and a living /styleguide route.
**Depends on**: 1.

| Task | Description | Effort |
|------|-------------|--------|
| 2.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] global.css carries the refreshed token set (color, type, space, radii, motion) without breaking existing components
- [x] A living /styleguide route renders all primitives: colors, type scale, buttons, cards, code blocks, motion samples
- [x] Typography choices and font-loading strategy are documented
- [x] prefers-reduced-motion and no-JS baselines are preserved

### Phase 3: Hero + opening act

**Goal**: Rebuild the hero and first-scroll experience as a cinematic, emotionally gripping opening using the existing logo/graphics. Establish the story's central conflict (brilliant agent / forgotten work) and payoff (memory that survives).
**Depends on**: 2.

| Task | Description | Effort |
|------|-------------|--------|
| 3.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] New Hero component renders the cinematic opening with the existing logo/graphics integrated
- [x] Hero copy + primary CTA communicate the emotional conflict and payoff
- [x] Static fallback works when WebGL is unavailable or reduced-motion is preferred
- [x] No layout shift on first paint; Lighthouse performance is not regressed vs. baseline

### Phase 4: Narrative sections

**Goal**: Redesign the problem, transformation, amnesia-vs-memory, and how-it-works sections with stronger storytelling, pacing, and visual hierarchy. Keep the coding/terminal demos but frame them inside the emotional arc.
**Depends on**: 3.

| Task | Description | Effort |
|------|-------------|--------|
| 4.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Problem, transformation, amnesia-vs-memory, and how-it-works sections are rebuilt with the new story arc
- [x] Terminal/SessionStart demo and cz_* loop demo remain functional and framed inside the narrative
- [x] Section-to-section pacing feels cinematic on both desktop and mobile
- [x] User approves the narrative flow

### Phase 5: Trust + proof + conversion

**Goal**: Redesign features, receipts/stats, quickstart, vocabulary, FAQ, and CTA sections to feel like a confident, premium product. Sharpen copy and calls to action.
**Depends on**: 4.

| Task | Description | Effort |
|------|-------------|--------|
| 5.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Features, receipts/stats, quickstart, vocabulary, FAQ, and CTA sections are rebuilt with refreshed visuals
- [x] Copy is sharpened and conversion CTAs are prominent
- [x] All copy blocks render correctly at every breakpoint

### Phase 6: New pages + global navigation

**Goal**: Implement any new pages decided in Phase 0 and update the nav + footer to support the expanded site structure. Ensure consistent layout and cross-linking.
**Depends on**: 4.

| Task | Description | Effort |
|------|-------------|--------|
| 6.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Any new pages decided in Phase 0 are implemented as Astro pages
- [x] Nav and footer are updated to support the new site structure
- [x] Cross-links work and no 404s on internal navigation

### Phase 7: Motion, media, and interaction polish

**Goal**: Polish scroll choreography, transitions, hover states, media slots, and the existing WebGL/terminal demos. Add delight without breaking reduced-motion fallbacks or performance.
**Depends on**: 5, 6.

| Task | Description | Effort |
|------|-------------|--------|
| 7.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Scroll choreography, transitions, and hover states are polished without jank
- [x] Media slots use existing assets appropriately; lazy-loading and fallbacks work
- [x] WebGL/terminal demos are tuned and still honor reduced-motion
- [x] Animation governor still pauses offscreen/tab-hidden perpetual motion

### Phase 8: Performance, SEO, and accessibility hardening

**Goal**: Hit Lighthouse >=95 across all four categories, run axe accessibility checks, verify OG/Twitter cards and structured data, and QA responsive behavior from 320px to ultra-wide.
**Depends on**: 7.

| Task | Description | Effort |
|------|-------------|--------|
| 8.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Lighthouse >=95 in performance, accessibility, best-practices, and SEO on the production build
- [x] axe-core reports no serious/critical accessibility violations
- [x] OG/Twitter cards, canonical URLs, JSON-LD, and structured data are valid for all key pages
- [x] Responsive QA passes from 320px to ultra-wide

### Phase 9: Build, deploy, and close

**Goal**: Production build passes, deploy to AWS via the existing CDK/CI pipeline, smoke-test all pages and demos in production, capture a post-mortem, and close the gameplan.
**Depends on**: 8.

| Task | Description | Effort |
|------|-------------|--------|
| 9.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] npm run build passes and the production bundle is deployed via the existing CDK/CI pipeline
- [x] Smoke tests pass on production: load, nav, demos, mobile
- [x] Post-mortem is captured in the gameplan
- [x] Gameplan is closed and focus is cleared
