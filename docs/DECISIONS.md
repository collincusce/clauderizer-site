# Decisions

Project-wide architectural decision records (ADRs). Append-only. Numbered `D-NNN`.
Each entry carries a `**Status**` (`active` | `superseded` | `deprecated`). When a
decision supersedes another, the predecessor stays in the record — annotated in place
with a `**Superseded by**: D-NNN` back-ref and `**Status**: superseded` — so the
lifecycle is navigable and the current decision is the one that surfaces.

## Decisions

_(Add entries with `cz_add_decision`.)_

### D-001 — Host on AWS S3 + CloudFront with IaC via AWS CDK (TypeScript)

**Context**: User chose an all-AWS deployment to keep full control inside their AWS account and match conventions already documented for the poe2.design project (CDK in TypeScript, cost tags). The site is a static Astro build and DNS is already on Route 53.
**Decision**: Serve the static site from a private S3 bucket fronted by CloudFront (OAC) with ACM TLS, provisioned and managed as AWS CDK (TypeScript) stacks under infra/cdk. Third-party hosting (Vercel, Cloudflare Pages) was considered and chosen against for control and stack consistency.
**Consequences**: We must build the CDK + deploy pipeline ourselves (poe2 only scaffolded infra/cdk, never implemented it). Launch is gated on obtaining least-privilege deploy permissions in account 063337706623, whose current creds are denied Route53.
**Evidence**: User decision 2026-06-22; poe2design/docs/DEPLOYMENT.md (CDK/TS + account map); aws sts get-caller-identity --profile lsatprep returns 063337706623
**Status**: active (2026-06-22)

### D-002 — Build the site on Astro (static, MDX, islands)

**Context**: It is a content/marketing site that must be extremely fast and SEO-strong, with a few rich interactive showpieces (the memory-graph hero, the terminal demo).
**Decision**: Use Astro: near-zero JS by default for content, MDX for editable copy, and islands for the interactive components. Build with WSL-native Node v20.20.2, not the slow /mnt/c Windows node.
**Consequences**: Excellent Lighthouse/SEO and small bundles; interactivity is opt-in per island. Heavy interactive bits (WebGL graph) live in islands and require explicit reduced-motion and no-WebGL fallbacks.
**Evidence**: User decision 2026-06-22; node v20.20.2 confirmed via nvm in WSL
**Status**: active (2026-06-22)

### D-003 — AWS identity = personal account 063337706623 via a dedicated 'clauderizer' profile; OIDC for CI; no static keys

**Context**: The clauderizer.* domains and Route53 zones live in the personal account 063337706623, currently reachable only via the permission-limited lsatprep profile. poe2's conventions (profile-per-account, OIDC, secret rules) are the template.
**Decision**: All AWS work for this project targets account 063337706623 via a dedicated named profile 'clauderizer'. CI deploys via GitHub -> AWS OIDC with no static keys in repo or CI. A least-privilege deploy identity (Route53 for the clauderizer zones + S3 + CloudFront + ACM) is provisioned before launch.
**Consequences**: Mirrors the poe2 profile-per-account discipline. Until the deploy identity is granted, local deploy is blocked; build and dev need no AWS at all.
**Evidence**: poe2design/docs/DEPLOYMENT.md profile-usage rule; lsatprep AccessDenied on route53:ListHostedZones 2026-06-22
**Status**: active (2026-06-22)

### D-004 — Domain strategy: clauderizer.com canonical; other TLDs and www 301-redirect to the apex

**Context**: Five TLDs are registered and on Route53. SEO and brand clarity require one canonical origin to avoid duplicate-content dilution across TLDs.
**Decision**: clauderizer.com (apex) is the single canonical origin. clauderizer.co/.io/.net/.org and all www subdomains issue 301 permanent redirects to https://clauderizer.com. One ACM SAN cert covers all names.
**Consequences**: Clean SEO and one site to maintain. The redirect layer (CloudFront function or dedicated redirect distributions) must be modeled in CDK and verified at launch.
**Status**: active (2026-06-22)

### D-005 — Design direction: 'Living memory-graph' - cinematic dark, warm amber memory-accent, amnesia->memory motif

**Context**: User wants a high-wow site that makes people want to try Clauderizer, rooted in the README's central image (a brilliant-but-amnesiac agent gaining durable memory) and amenable to cinematic Higgsfield media.
**Decision**: Adopt the 'Living memory-graph' art direction: a dark, premium canvas where a glowing dependency-graph DAG blooms out of amnesia fog into structured memory; warm amber 'memory' accent on deep ink; the amnesia<->memory transformation as the recurring motif.
**Consequences**: Sets palette, motion language, and the media brief. Demands disciplined performance and reduced-motion fallbacks so the cinematic layer never hurts accessibility or Lighthouse.
**Status**: active (2026-06-22)

### D-006 — Adopt GSAP + vanilla Three.js for a maximal-spectacle motion layer; recompose the hero as a WebGL memory-graph

**Context**: User reviewed the Phase 0-3/5 site and judged it under-impressive versus the Clauderizer README assets, directing a '100x' lift and pointing to the '$35K Motion-Website Playbook with Higgsfield' (Higgsfield cinematics + a real web-motion stack: GSAP/Three.js/Motion via CLAUDEDESIGNSKILLS). The existing site used only hand-rolled CSS scroll-timeline. Asked how far to push given the Phase 6 Lighthouse >=95 gate and INVARIANT-03, the user chose 'Maximal spectacle'.
**Decision**: Add gsap + three as deps and build the motion layer with vanilla Three.js + GSAP in lazy client islands (NOT React Three Fiber - the site has no React and R3F would pull in the React runtime). Recompose the hero as a vanilla-Three.js living memory-graph (the original subsys.memory-graph vision). three is dynamically imported/code-split; every enhancement gates on prefers-reduced-motion + WebGL support with a static fallback.
**Consequences**: Much higher visual ceiling and product-true demos, but a ~600KB three chunk (lazy, off the critical path) and more continuous animation that Phase 6 must validate against Lighthouse >=95. Reinstates the WebGL hero that C-03 pivoted away from; the Higgsfield scroll-scrub video is now unused in the hero (its poster remains the no-WebGL fallback).
**Evidence**: x.com/i/article/2067199898689081344 (paywalled, @zeuuss_01) + companion x.com/zeuuss_01/status/2067213248517017884; gsap 3.15.0 + three 0.184.0 installed; astro build green 2026-06-22.
**Status**: active (2026-06-22)

### D-007 — Redesign the marketing site for cinematic emotional storytelling

**Context**: The current site is functionally complete (Astro 7, WebGL memory-graph hero, terminal demo, narrative sections, SEO, CDK infra) but reads as a feature list. The user wants a cooler, more emotionally compelling story that still shows the coding-agent memory experience and reuses the existing logo and provided graphics.
**Decision**: Redesign the entire Clauderizer marketing site around a cinematic, emotional narrative arc, reusing the existing logo and graphics (public/ and .hero-staging/). Keep the Astro stack and existing AWS/CDK/CI infrastructure; this is a front-end + content redesign. The new story centers on the human cost of an agent that forgets and the relief/power of one that remembers, told with film-grade pacing, typography, and motion.
**Consequences**: Scope is front-end + content + possible new pages; infra/CI stays as-is. The existing INVARIANT-03 (motion fallbacks), INVARIANT-04 (Lighthouse >=95), and INVARIANT-07 (public repo / no secrets) still bind the redesign. We may add new sections or pages (e.g., /story, /why-clauderizer, or /for-teams) if the narrative demands them.
**Status**: active (2026-07-18)

### D-008 — Keep Astro 7 static stack; refresh design system and components in place

**Context**: The site already runs on Astro 7 with TypeScript, GSAP, and three.js. A redesign could justify a new framework, but that would add migration risk and infra work for no user-facing gain.
**Decision**: Stay on Astro 7, MDX, TypeScript, and the existing island architecture. Refresh the global design tokens and rebuild section components in place rather than starting a parallel codebase. Continue to lazy-load heavy motion libraries and honor prefers-reduced-motion.
**Consequences**: Faster iteration; no infra or build pipeline changes. New components must follow the existing island pattern and accessibility conventions.
**Status**: active (2026-07-18)

### D-009 — Anchor the redesign on existing logo, favicon, and Higgsfield assets; generate new media only if the story demands it

**Context**: The repo already contains a logo mark (public/favicon.svg), icon set, OG image, Higgsfield poster (public/media/hero/poster.jpg), and .hero-staging/ stills/video clips. The user explicitly wants to use the logo and graphics provided.
**Decision**: Use the existing logo/graphics as the visual anchor for the redesign. Repurpose .hero-staging/ assets where they fit the new cinematic narrative. Generate or source new media only if a specific section's story cannot be told with current assets, and only after Phase 0 creative sign-off.
**Consequences**: Limits scope creep and asset-delivery risk. The new design must look compelling even if no new media is produced.
**Status**: active (2026-07-18)

### D-010 — Director's-cut rebuild of the marketing site (K3)

**Context**: The 10-phase cinematic-site-redesign shipped a solid site, but the owner wanted a fresh, auteur-grade version built by Kimi K3 rather than the prior derivative.
**Decision**: Rebuild the site as 'a film about remembering': Fraunces display serif + JetBrains Mono self-hosted in public/fonts; screenplay slug-lines per section (Scene 01-11 + end credits); cold steel grade for amnesia vs ember-gold for memory; letterbox title-sequence hero; scroll-driven 'memory, developing' strip; festival-laurel stats; end-credits footer.
**Consequences**: global.css rewritten around ink/ember/steel tokens; .kicker replaced by .slug; all 13 components restyled; styleguide + 404 updated; INVARIANT-03 fallbacks preserved (motion only enhances).
**Status**: active (2026-07-18)

### D-011 — Swap display serif Fraunces -> Bodoni Moda; compress page density

**Context**: Owner review of the K3 cut: likes the language/copy glow-up, but dislikes some font choices (picked 'swap the serif entirely'), flagged seam gaps at pagefolds, clipped box glows, too much scrolling/whitespace (measured 13.8 viewports @900px), and the abstract bf-strip image under 'One of them remembers' that communicates nothing.
**Decision**: Replace Fraunces with Bodoni Moda (Didone) as --font-display; keep JetBrains Mono. Merge Problem+Amnesia into one scene and delete the bf-image strip; keep scenes as separate narrative beats otherwise but compress --section-pad to clamp(3.5rem,9vh,5.5rem), put quickstart steps 3-up, and match every media scrim to the flat section background ink-950 so folds are seamless; scope overflow:clip to media/parallax sections only so card glows are not clipped.
**Consequences**: public/fonts fraunces-* removed, bodonimoda-* added; BaseLayout preload updated; AmnesiaMemory.astro deleted as separate scene (ledger folded into Problem); total page target <= ~9.5 viewports; vocab chips move from tiny italic serif to mono for legibility.
**Status**: active (2026-07-18)

### D-012 — Benefit-led clarity over cinematic cleverness in marketing copy

**Context**: A first-time visitor's feedback on clauderizer.com: the hero H1 'Your best ideas shouldn't die in the dark.' 'doesn't tell me anything'; the headline should say what the product does for me; it took them a second to figure out what was going on. External research consensus agrees: benefit-led headlines beat clever ones for cold traffic, the 5-second test is the bar, and clarity beats cleverness. This refines D-007 (cinematic emotional storytelling): the cinema was carrying the message in words, which failed comprehension.
**Decision**: Every headline and sentence on the marketing site must carry plain-language meaning: state what the product does for the visitor. The cinematic film conceit (scenes, slug-lines, letterbox, end credits) remains as VISUAL and structural flavor only — clarity in words, cinema in visuals.
**Consequences**: Hero H1 is rewritten benefit-first; all section H2s audited for plain meaning; emotional storytelling lives in motion/design, not wordplay; D-007 is narrowed, not reversed.
**Evidence**: User feedback 2026-07-19; dev-tool/SaaS copywriting research (5-second test, benefit-vs-ingredient dual structure, problem-first messaging).
**Status**: active (2026-07-19)
