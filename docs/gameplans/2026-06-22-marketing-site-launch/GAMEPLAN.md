# Marketing Site Launch Gameplan

> Created: 2026-06-22
> Status: Executing
> Kind: driven
> Procedure: docs/gameplans/GAMEPLAN-PROCEDURE.md

## Project Overview

Build and launch a cinematic marketing website for **Clauderizer** — durable, cross-session working memory for coding agents — that makes a visitor instantly *get* the "brilliant but amnesiac agent" problem and *want* to clauderize their next repo. The site is a fast, static **Astro** build deployed to the user's own AWS (**S3 + CloudFront + Route 53** via CDK), fronted by a signature **"living memory-graph"** interactive hero and a media layer that is code-native by default and enriched with **Higgsfield**-generated cinematics.

It dogfoods Clauderizer end to end: this very gameplan plans, tracks, and ships the site through the `cz_*` tools — the same "built by dogfooding itself" story the README tells.

## Subsystems Touched

- `subsys.site` — the Astro + MDX + TypeScript application
- `subsys.design-system` — tokens, type, motion language
- `subsys.memory-graph` — the signature animated dependency-graph hero
- `subsys.infra-cdk` — S3 / CloudFront / ACM / Route 53 (AWS CDK in TS)
- `subsys.ci` — GitHub Actions (build + Lighthouse CI on PR; OIDC deploy on main)
- External: `ext.aws-personal` (063337706623), `ext.route53-domains` (5 TLDs), `ext.github` (collincusce/clauderizer-site), `ext.higgsfield` (cinematic media)

## Source-of-Truth Captures

**AWS (account holding the domains):** `063337706623` — personal account (root `redacted@example.com`, per poe2 `DEPLOYMENT.md`). Reached today via the **`lsatprep`** profile (`aws sts get-caller-identity` → `063337706623`, `user/lsatprep-deployer`). That IAM user is **permission-limited**: DENIED `route53:ListHostedZones` and `route53domains:*` (verified 2026-06-22). The poe2.design account `REDACTED_ACCT` is **not** used here.

**Domains:** `clauderizer.com`, `.co`, `.io`, `.net`, `.org` — all registered and delegated to **Route 53** (`awsdns-*` nameservers, verified via DNS-over-HTTPS 2026-06-22). Hosted zones exist; zone IDs not yet readable (perms — see O-02).

**GitHub:** `gh` authenticated as **collincusce**, SSH, token scopes include `repo` (verified 2026-06-22). No repo created yet.

**Toolchain (WSL/Ubuntu):** node **v20.20.2** (nvm; v24.13.1 also installed), `uvx` at `~/.local/bin`, aws-cli `2.33.21`, gh `2.45.0`, git `2.43`. The Windows host drives Claude Code over `\\wsl.localhost`; builds use **WSL-native node**, never `/mnt/c/nvm4w`.

**Clauderizer:** size=`standard`, profile=`generic` (no `package.json` yet → flips to `node` in Phase 0), baseline **0 tests**. MCP `cz_*` tools are **not** wired this session → tracked writes go through `uvx --from clauderizer clauderize ops`.

## Amendments

_(None yet. Append A-NNN entries here once Phase 0 starts.)_

## Decisions

### D1 — Media = Higgsfield-generated from an in-repo prompt pack, with code-native fallbacks

**Context**: User will sign up for Higgsfield and wants me to produce the full creative brief; the site must still look great before any video exists.
**Decision**: Cinematic media is generated in Higgsfield from a tracked docs/HIGGSFIELD-ASSET-PACK.md prompt pack and dropped into defined media slots. Every slot has a code-native fallback (animated SVG/canvas) and a reduced-motion still, so the site is complete without external video.
**Consequences**: Decouples the build from asset delivery; launch can proceed with placeholders and swap real media in later. Mandatory poster + reduced-motion fallback per the accessibility invariant.
**Superseded by**: D3 (2026-06-22)
**Status**: superseded (2026-06-22)

### D2 — GitHub: public repo collincusce/clauderizer-site over SSH, mirroring the Clauderizer repo

**Context**: User asked to replicate Clauderizer's GitHub wiring. gh is authed as collincusce over SSH with repo scope. The site is promotional and dogfoods Clauderizer publicly.
**Decision**: Create a PUBLIC repo github.com/collincusce/clauderizer-site with an SSH remote (git@github.com:collincusce/clauderizer-site.git), mirroring the Clauderizer repo's auth model. Confirm name and visibility with the user before the first push.
**Consequences**: Public from day one tells the dogfooding story; if the user prefers private-until-launch, flip visibility before push (one gh command).
**Status**: active (2026-06-22)

### D3 — Media generated directly via the Higgsfield CLI in-repo (not a manual prompt-pack handoff)

**Context**: User integrated the Higgsfield connector on claude.ai and asked to lean on Higgsfield harder. That connector does NOT surface in this Claude Code (Windows->WSL) session, but Higgsfield's official @higgsfield/cli is the documented path for Claude Code and works headlessly.
**Decision**: Cinematic media is generated directly by scripting the Higgsfield CLI from the repo toolchain (auth via one-time device login). Prompts + exact commands live in docs/HIGGSFIELD-ASSET-PACK.md; outputs download into the repo. Each media slot still ships a code-native + reduced-motion fallback (the static SVG hero is the hero video's fallback).
**Consequences**: The media pipeline is scripted, reproducible, and CI-automatable rather than a manual web session. Costs are trivial: ~0.12 credits per 2k image, ~17.5 credits per 1080p 5s video, on a 9000-credit ultra plan.
**Supersedes**: D1
**Evidence**: higgsfield account: redacted@example.com ultra 9000 credits; generate cost text2image_soul_v2 0.12cr / seedance_2_0 17.5cr; authed 2026-06-22
**Status**: active (2026-06-22)

## Open Items

**O-01.** _(phase 9)_ Grant least-privilege deploy permissions in account 063337706623 - Route53 change-record on the clauderizer hosted zones + S3 + CloudFront + ACM - to a deploy identity (a new 'clauderizer-deployer' IAM user or an OIDC role). The current lsatprep creds are DENIED route53:ListHostedZones and route53domains, so they cannot deploy DNS. BLOCKER for launch; likely needs account-admin/console access the current creds lack.

**O-02.** _(phase 7)_ Capture the real Route53 hosted-zone IDs for each clauderizer TLD (one zone per TLD vs a shared zone) - needed for the CDK Route53 records. Blocked on the deploy-permissions open item.

**O-03.** _(phase 5)_ Higgsfield account signup, then generate the cinematic assets from docs/HIGGSFIELD-ASSET-PACK.md and drop them into the media slots.

**O-04.** _(phase 3)_ Decide email-capture/waitlist vs pure outbound CTAs (GitHub/PyPI/docs). Default assumption: no backend, outbound CTAs only (simplest, no PII). Confirm before building any form.

**O-05.** _(phase 0)_ Confirm GitHub repo name + visibility before the first push. Default: public, collincusce/clauderizer-site. _(resolved 2026-06-22: Confirmed public; github.com/collincusce/clauderizer-site created and pushed 2026-06-22.)_

**O-06.** _(phase 0)_ Session host is recorded as `native`, but Claude Code runs on Windows over the wsl.localhost UNC path - so the SessionStart digest and the cz_* MCP tools do NOT auto-load (this gameplan runs on the `clauderize ops` CLI fallback, which works but is manual). The .mcp.json command is a Linux path Windows cannot spawn; it needs a `wsl.exe -d Ubuntu ...` shim. Fix: re-wire with `clauderize init --session-host windows-wsl:Ubuntu` and verify from the Windows side. Non-blocking. _(resolved 2026-06-22: Re-wired session_host=windows-wsl:Ubuntu and verified end-to-end from Windows: the SessionStart hook prints the digest and the MCP server launches via the wsl.exe shim (doctor reports both 'verified end-to-end'). cz_* MCP tools will auto-load from the next session. Full-path uvx in .mcp.json/hook is required (non-login wsl PATH); the doctor 'hook wrapper freshness' ? is a benign artifact of that, left as-is.)_

## Phase Breakdown

### Phase 0: Foundation: repo, Astro scaffold and AWS/GitHub wiring

**Goal**: Stand up a clean, building, pushed baseline — scaffold the Astro + TS app on WSL node v20, create and push the public GitHub repo, switch Clauderizer to the `node` profile (doctor green), and establish the dedicated `clauderizer` AWS profile and the profile-per-account convention. No app features yet — just rock-solid foundations.
**Depends on**: nothing (first phase).

| Task | Description | Effort |
|------|-------------|--------|
| 0.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] npm run build (astro build) succeeds on WSL node v20 and the dev server runs
- [x] Repo pushed to github.com/collincusce/clauderizer-site over SSH; clauderizer-init scaffold committed separately from the gameplan and from app code
- [x] .clauderizer/profile.lock.toml is set to the node profile and clauderize doctor exits 0
- [x] A dedicated 'clauderizer' AWS profile resolves to account 063337706623 (aws sts get-caller-identity --profile clauderizer)
- [x] Prettier + ESLint configured and clean; .gitignore covers node_modules, dist, .astro, and any secrets

### Phase 1: Design system and brand language

**Goal**: Establish the cinematic 'living memory-graph' visual identity as code: color/space/type tokens, motion and reduced-motion principles, base layout + nav + footer, and a living /styleguide page. Produce real visual mockups for sign-off before scaling out.
**Depends on**: Phase 0.

| Task | Description | Effort |
|------|-------------|--------|
| 1.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] Design tokens defined (deep-ink base, cream text, warm amber 'memory' accent; spacing, radii, shadows) as CSS custom properties/theme config
- [ ] A type scale is chosen (a display face + a mono for the terminal/code motif), self-hosted as woff2 with font-display
- [ ] Base layout, responsive nav, and footer ship and render on a placeholder home route
- [ ] A /styleguide route renders every primitive: colors, type, buttons, cards, code blocks
- [ ] prefers-reduced-motion is wired into the motion layer from day one

### Phase 2: The memory-graph hero (signature centerpiece)

**Goal**: Build the signature interactive: a glowing dependency-graph DAG that blooms out of 'amnesia' fog into vivid structured memory as the visitor scrolls, performant and accessible, with a static no-WebGL fallback.
**Depends on**: Phase 1.

| Task | Description | Effort |
|------|-------------|--------|
| 2.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] The hero renders the animated memory-graph at ~60fps on a typical laptop with no layout shift (CLS ~0)
- [ ] Under prefers-reduced-motion OR no-WebGL/canvas support it degrades to a clean static SVG of the graph
- [ ] It is legible and touch-safe on mobile (responsive sizing, no horizontal scroll)
- [ ] Graph nodes/edges map to real Clauderizer concepts (phases, decisions, invariants) - not abstract noise
- [ ] Hero copy ('Your coding agent is brilliant - and amnesiac.') and the primary CTA are present

### Phase 3: Narrative content sections

**Goal**: Compose the full marketing narrative from the README material as MDX-driven sections: the amnesiac-agent problem, amnesia<->memory before/after, how-it-works (markdown -> engine -> MCP+hooks), the session loop, a features grid, 'beta with receipts', quickstart, install, and CTAs.
**Depends on**: Phase 1.

| Task | Description | Effort |
|------|-------------|--------|
| 3.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] All narrative sections implemented with real copy adapted from the Clauderizer README (no Lorem ipsum)
- [ ] Content authored in MDX so copy is editable without touching component code
- [ ] Section anchors and in-page nav work; layout is fully responsive
- [ ] The 'how it works' and 'session loop' sections accurately reflect the real cz_* workflow
- [ ] Install/quickstart blocks have working copy-to-clipboard

### Phase 4: Interactive demos and motion delight

**Goal**: Add the wow interactions: a live 'SessionStart digest greets you' terminal, the cz_* tool-loop animation, a phase-ticking demo, and tasteful scroll choreography - all keyboard- and screen-reader-accessible and reduced-motion-aware.
**Depends on**: Phase 2, Phase 3.

| Task | Description | Effort |
|------|-------------|--------|
| 4.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] The 'digest greets the visitor' terminal demo runs (sequenced/typewriter) and is pausable and reduced-motion-aware
- [ ] The cz_* loop / phase-ticking animations are keyboard reachable, aria-labelled, and silent under reduced-motion
- [ ] Scroll-driven choreography is smooth (no jank) and never traps focus or scroll
- [ ] Interactive elements degrade to sensible static content where feasible when JS is off

### Phase 5: Media slots and Higgsfield asset pack

**Goal**: Deliver a complete Higgsfield shotlist + prompt pack (hero film, ambient loops, motif clips) as a tracked doc, and build responsive, lazy, poster-backed media slots (AV1/h264 + reduced-motion) wired with placeholders until real assets land.
**Depends on**: Phase 3.

| Task | Description | Effort |
|------|-------------|--------|
| 5.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] docs/HIGGSFIELD-ASSET-PACK.md delivered: per-shot prompts, durations, aspect ratios, motion notes, and where each slots into the site
- [ ] A reusable Media slot component: lazy-loaded video with poster image, AV1+h264 sources, and a reduced-motion still fallback
- [ ] Slots placed in hero + sections with lightweight placeholders that keep CLS stable
- [ ] A documented, repeatable path to drop a generated file into a slot (naming + directory convention)

### Phase 6: SEO, performance and accessibility hardening

**Goal**: Meta/OG/Twitter cards, sitemap, robots, JSON-LD, favicons/app icons; hit Lighthouse >=95 across performance/accessibility/best-practices/SEO; full axe a11y pass and responsive/mobile QA.
**Depends on**: Phase 3, Phase 4, Phase 5.

| Task | Description | Effort |
|------|-------------|--------|
| 6.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] Lighthouse >=95 in all four categories on the production build (launch gate)
- [ ] axe (or equivalent) reports no serious/critical accessibility violations
- [ ] OG + Twitter card previews render correctly; canonical URL set to clauderizer.com
- [ ] sitemap.xml + robots.txt + favicons/app-icons/manifest present and valid
- [ ] Verified responsive from 320px to wide desktop with no CLS regressions from media

### Phase 7: Infrastructure as code (CDK)

**Goal**: Author infra/cdk (TypeScript): private S3 (OAC) + CloudFront + ACM (us-east-1 SAN cert for the 5 apexes + www) + Route53 alias records + the 4 non-canonical TLDs and www redirecting 301 to the apex - all cost-tagged. cdk synth clean. No deploy yet (perms-gated).
**Depends on**: Phase 0.

| Task | Description | Effort |
|------|-------------|--------|
| 7.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] cdk synth produces a valid CloudFormation template with no errors
- [ ] Stack models all 5 domains: clauderizer.com canonical + .co/.io/.net/.org and www issuing 301 -> apex
- [ ] S3 is private behind CloudFront OAC, HTTPS enforced, ACM cert declared in us-east-1
- [ ] Every resource carries cost-allocation tags (project=clauderizer-site)
- [ ] A deploy runbook documents the exact assume-role + deploy + invalidate steps (gated on the perms open item)

### Phase 8: CI/CD (GitHub Actions + OIDC)

**Goal**: A PR pipeline (build + Lighthouse CI) and a main-branch deploy via GitHub -> AWS OIDC (assume-role -> build -> S3 sync -> CloudFront invalidate) with zero static AWS keys.
**Depends on**: Phase 7.

| Task | Description | Effort |
|------|-------------|--------|
| 8.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] PR workflow runs the Astro build + Lighthouse CI and is green on a test PR
- [ ] Deploy workflow authored using GitHub OIDC federation to assume an AWS role - no static keys/secrets committed
- [ ] The deploy job is dry-run/gated until the OIDC deploy role exists and fails closed, not open
- [ ] Secret hygiene confirmed: no credentials, .env, or AWS keys anywhere in the repo or history

### Phase 9: Launch

**Goal**: With deploy permissions granted, deploy the CDK stack, cut DNS over, verify all 5 domains + redirects + valid HTTPS, swap in the real Higgsfield media, and smoke-test in production.
**Depends on**: Phase 6, Phase 7, Phase 8.

| Task | Description | Effort |
|------|-------------|--------|
| 9.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] clauderizer.com serves the site over valid HTTPS; .co/.io/.net/.org and www 301 -> apex verified
- [ ] Real Higgsfield media swapped in for placeholders
- [ ] Production Lighthouse >=95 in all four categories
- [ ] Post-launch smoke (load, nav, demos, mobile) passes; CloudFront cache + invalidation verified
- [ ] POST-MORTEM captured and the gameplan closed
