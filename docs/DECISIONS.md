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
