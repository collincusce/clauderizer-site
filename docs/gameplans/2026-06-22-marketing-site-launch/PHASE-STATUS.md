# Marketing Site Launch — Phase Status Tracker

> Living document. Updated after each phase completes.
> Last updated: 2026-06-22

## Phase Status

| Phase | Name | Status | Started | Completed | Handoff |
|-------|------|--------|---------|-----------|---------|
| 0 | Foundation: repo, Astro scaffold and AWS/GitHub wiring | ✅ COMPLETE | 2026-06-22 | 2026-06-22 | handoffs/PHASE-0-HANDOFF.md |
| 1 | Design system and brand language | ✅ COMPLETE | 2026-06-22 | 2026-06-22 | handoffs/PHASE-1-HANDOFF.md |
| 2 | The memory-graph hero (signature centerpiece) | ✅ COMPLETE | 2026-06-22 | 2026-06-22 | handoffs/PHASE-2-HANDOFF.md |
| 3 | Narrative content sections | ✅ COMPLETE | 2026-06-22 | 2026-06-22 | handoffs/PHASE-3-HANDOFF.md |
| 4 | Interactive demos and motion delight | ⬜ NOT STARTED | — | — | handoffs/PHASE-4-HANDOFF.md |
| 5 | Media slots and Higgsfield asset pack | ✅ COMPLETE | 2026-06-22 | 2026-06-22 | handoffs/PHASE-5-HANDOFF.md |
| 6 | SEO, performance and accessibility hardening | ⬜ NOT STARTED | — | — | handoffs/PHASE-6-HANDOFF.md |
| 7 | Infrastructure as code (CDK) | ⬜ NOT STARTED | — | — | handoffs/PHASE-7-HANDOFF.md |
| 8 | CI/CD (GitHub Actions + OIDC) | ⬜ NOT STARTED | — | — | handoffs/PHASE-8-HANDOFF.md |
| 9 | Launch | ⬜ NOT STARTED | — | — | handoffs/PHASE-9-HANDOFF.md |

## Outputs Registry

### Phase 0 Outputs

```
repo_url: https://github.com/collincusce/clauderizer-site (public)
git_remote: origin = HTTPS via gh credential helper; SSH key is passphrase-locked (see C-02)
build_runtime: Node v24.13.1 (Astro 7 requires >=22.12; .nvmrc pins 24)
stack: Astro 7.0.0, @astrojs/mdx 7, @astrojs/sitemap 3.7.3, TypeScript 6, ESLint 10 (flat config), Prettier 3
aws_profile: clauderizer -> account 063337706623 (alias of lsatprep creds; Route53-limited until O-01)
canonical_origin: https://clauderizer.com (astro.config site)
dev_url: http://localhost:4321 (astro dev), build output dist/ ~28K
preflight_commands: profile=node; build='npm run build' (green), test='' (no tests until Phase 6)
```

### Phase 5 Outputs

```
hero_assets: Hero (chosen): Seedream 4.5 21:9 still + Seedance 2.0 fast 21:9 1080p 5s silent loop (amnesia->memory). Generated 2026-06-22, staged in .hero-staging/ (gitignored): seedream21.png, hero_video.mp4. Candidates: soul_v2, flux2, soul_v2b.
```

### Phase 3 Outputs

```
site_pages: Full single-page site shipped (commit 18499f8): Nav, Hero (Seedance build-up scroll-scrub), Problem (two walls), AmnesiaMemory (before/after), HowItWorks (markdown->engine->MCP+hooks + cz_* loop), Features (5 cards), Receipts (beta-with-receipts), Quickstart (3 steps + copy), CTA, Footer. Cinematic film layer (grain/embers/vignette/grade), parallax, scroll-scrub. Mobile + reduced-motion verified (no overflow at 375px).
```

## Corrections Log

### C-01 — Phase 0

**Phase**: 0
**What gameplan said**: Build with WSL-native Node v20.20.2 (D-002 and the source-of-truth capture).
**What was actually correct**: The build runtime is Node v24.13.1. Astro 7 requires Node >=22.12.0, so Node 20 is rejected outright at build.
**Why**: Astro advanced to v7 (past the planning-time knowledge) and dropped Node 20 support; caught at npm install / astro --version.
**Lesson**: Pin the build runtime to the framework's real engines field, verified at install time - not a remembered version. Astro 7 needs Node >=22.12; this project builds on Node 24.

### C-02 — Phase 0

**Phase**: 0
**What gameplan said**: SSH remote git@github.com:collincusce/clauderizer-site (D2).
**What was actually correct**: origin is HTTPS via gh's credential helper. The SSH key is correct and server-accepted but passphrase-protected, so it cannot sign non-interactively from the headless WSL shell.
**Why**: No ssh-agent/passphrase is available to automation; the gh token (repo scope) gives reliable, secret-free pushes. The user can set origin back to SSH for interactive use.
**Lesson**: For automated git push from a headless shell, use gh's HTTPS credential helper rather than a passphrase-protected SSH key.

### C-03 — Phase 2

**Phase**: 2
**What gameplan said**: Phase 2: a WebGL/canvas animated dependency-graph DAG that blooms from amnesia fog, with a static SVG fallback.
**What was actually correct**: The hero is a Higgsfield Seedance build-up video, scroll-scrubbed frame-by-frame (currentTime driven by scroll over a tall sticky track); the static poster is the reduced-motion/no-video fallback.
**Why**: The motion-website pivot (Higgsfield + Claude Code playbook) made a generated cinematic video + scroll-scrub far higher-impact than a hand-built WebGL graph, and it tells the amnesia->memory story directly through the scrub.
**Lesson**: For a cinematic hero, a Higgsfield scroll-scrubbed all-keyframes video can beat a hand-built WebGL graph and reuses the same reduced-motion poster fallback.
