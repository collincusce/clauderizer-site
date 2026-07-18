# Post-Mortem: Cinematic Site Redesign

> Gameplan: 2026-07-18-cinematic-site-redesign
> Closed: 2026-07-18

## What worked

- **Creative brief as anchor.** Writing the brief up front (story arc, asset map, scope) made every section decision faster. The landing-page-only scope kept the redesign achievable in one pass.
- **Existing assets carried the redesign.** The `.hero-staging/` stills and videos became cinematic backdrops without generating new media. After JPEG optimization, the whole backdrop set is ~1.2 MB.
- **Stack was sufficient.** Astro 7 + GSAP + vanilla Three.js + CSS scroll-driven animations hit the "much cooler" bar without adding new dependencies.
- **CI deploy was reliable.** Once local AWS creds proved insufficient, pushing to `main` triggered the existing OIDC workflow, which built, synced to S3, and invalidated CloudFront in ~30 seconds.

## What didn't / surprises

- **Remote `main` had diverged.** The push was rejected; rebasing 13 redesign commits against remote design refinements created conflicts in `global.css`, `Hero.astro`, `AmnesiaMemory.astro`, `SessionDemo.astro`, and `Features.astro`. All were resolvable, but it added friction.
- **Local AWS creds couldn't deploy.** The `clauderizer` profile lacks `cloudformation:DescribeStacks` and IAM role assumption, so `cdk deploy` was not an option. The CI OIDC role was the only viable path.
- **No local browser for Lighthouse/axe.** Chrome/Chromium is not installed in this environment, so performance and accessibility scoring could not be verified locally. Smoke tests passed, but numeric gates are untested.
- **Video files are still heavy.** `hero.mp4` (7.5 MB) and `buildup.mp4` (9.1 MB) could be re-encoded for web delivery. They are not on the critical render path for text, but they matter for mobile data and Lighthouse performance.

## Procedure improvements

- **Sync with remote before a big redesign.** A `git pull` at the start would have surfaced the divergence before 13 commits were stacked.
- **Set Node default early.** Preflight failed until Node v24 was made the default via `~/.local/bin` symlinks. Do this before the first preflight.
- **Optimize images during asset planning, not after.** Converting PNG backdrops to JPEG could have happened in Phase 1/2 instead of Phase 7.
- **Keep a browser option available.** For marketing-site gameplans, reserve a way to run Lighthouse/axe (local Chrome, CI Lighthouse job, or Pagespeed Insights API) before claiming the gate passes.

## Open threads

- [ ] Run Lighthouse and axe on the production build; address any sub-95 scores or a11y violations.
- [ ] Consider re-encoding `hero.mp4` and `buildup.mp4` for smaller file sizes (e.g., H.264 at lower bitrate, or AV1 fallback).
- [ ] Refresh `og.png` to match the new headline and visual direction.
- [ ] Decide whether to keep `hero-scrub.mp4` (unused) or remove it to reduce bundle weight.
