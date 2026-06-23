# Distilled Lessons

> Project-level lessons promoted from gameplans (`cz_promote_lesson`).
> Every future handoff carries this list, so it must stay compact: obsolete
> entries that stop earning their place (`cz_obsolete_lesson` with the `L-NN`
> id). Entries are never deleted, only marked.

## Lessons

### Category: Architecture

**L-01.** On an Astro static site, use vanilla Three.js + GSAP in lazy client islands rather than React Three Fiber - R3F drags in the React runtime a non-React site otherwise avoids. Dynamically import three (code-split, boot on requestIdleCallback) so its ~600KB stays off the critical path; the static poster carries the hero until the graph boots. *(evidence: Phase 4 Hero.astro + src/lib/memoryGraph.ts 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*

**L-02.** For an always-on/perpetual animation, never animate height/max-height (forces per-frame layout reflow) - animate opacity/transform only (compositor). A max-height keyframe in the perpetual cz_* loop pegged the renderer (and hung headless screenshots); switching to opacity+transform fixed both. *(evidence: Phase 4 HowItWorks.astro loop-out keyframe 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*

### Category: Process

**L-03.** preview_screenshot can hang (30s) on pages doing continuous GPU/animation work: an autoplaying loop <video>, a live WebGL canvas (headless-over-WSL has no GPU to composite for capture, and the canvas persists in the DOM even when scrolled past the hero), or after heavy preview_eval/reload churn. Fallbacks: for video, the clean stop->start->resize->screenshot pattern with no eval between; for WebGL/heavy-motion pages, verify via preview_snapshot (a11y tree = content+structure+ARIA) + preview_eval computed styles + the production build instead of pixels. Real browsers/users are unaffected. *(from 2026-06-22-marketing-site-launch)*

**L-04.** Split-host preflight fix: pin profile.lock.toml build/typecheck to the ABSOLUTE v24 npm/npx path. The login-shell `node` resolves to v20 (nvm auto-use doesn't fire in non-interactive `bash -lc`), so a bare `npm run build` false-fails Astro 7 (needs >=22.12). Also: run a11y checks on WebGL/heavy pages by injecting axe-core via preview_eval (dynamic import from CDN + axe.run) when preview_screenshot hangs. *(evidence: Phase 6 profile.lock.toml + axe-core run 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*

**L-05.** Fail-closed CI deploy via GitHub OIDC: gate every AWS step on `if: env.X != ''` where X = a repo VARIABLE (vars.AWS_DEPLOY_ROLE_ARN, not a secret) so the job no-ops cleanly until the role exists — it never deploys credential-less and never needs static keys (INVARIANT-02). Measure the Lighthouse launch gate in CI via @lhci/cli autorun + lighthouserc staticDistDir=./dist asserting categories>=0.95, since there's no local Chrome to measure it. *(evidence: Phase 8 .github/workflows + lighthouserc.json 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*
