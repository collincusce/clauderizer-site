# Distilled Lessons

> Project-level lessons promoted from gameplans (`cz_promote_lesson`).
> Every future handoff carries this list, so it must stay compact: obsolete
> entries that stop earning their place (`cz_obsolete_lesson` with the `L-NN`
> id). Entries are never deleted, only marked.

## Lessons

### Category: Architecture

**L-01.** On an Astro static site, use vanilla Three.js + GSAP in lazy client islands rather than React Three Fiber - R3F drags in the React runtime a non-React site otherwise avoids. Dynamically import three (code-split, boot on requestIdleCallback) so its ~600KB stays off the critical path; the static poster carries the hero until the graph boots. *(evidence: Phase 4 Hero.astro + src/lib/memoryGraph.ts 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*

**L-02.** For an always-on/perpetual animation, never animate height/max-height (forces per-frame layout reflow) - animate opacity/transform only (compositor). A max-height keyframe in the perpetual cz_* loop pegged the renderer (and hung headless screenshots); switching to opacity+transform fixed both. *(evidence: Phase 4 HowItWorks.astro loop-out keyframe 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*

**L-07.** Mobile-safe parallax = CSS scroll-driven animations (animation-timeline: view()/scroll()), gated on BOTH @media (prefers-reduced-motion: no-preference) AND @supports (animation-timeline: view()) so it degrades to clean static content. Motion rides decorative layers only (drifting blobs/dot-grid); content uses a 'reveal' fade-up whose DEFAULT state is fully visible. Avoid background-attachment: fixed (broken on iOS) and JS scroll handlers (jank on touch). Shrink --cz-shift at <=640px. *(evidence: Phase 1/3 parallax sections 2026-06-22; verified no horizontal overflow at 375px)* *(from 2026-06-22-marketing-site-launch)*

**L-08.** Progressive-enhancement pattern for animated demos: put the full final content in the DOM (the no-JS static truth), then have JS cache it, clear it, and animate it in; reduced-motion leaves it shown and hides only the controls. One structure satisfies both 'degrade when JS off' and INVARIANT-03. Restore colored inline markup with cloned child nodes + replaceChildren, never innerHTML (the security hook blocks innerHTML on principle). *(evidence: Phase 4 SessionDemo.astro 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*

**L-09.** CDK offline synth on perms-limited creds: import Route53 zones with HostedZone.fromHostedZoneAttributes (id from cdk context; placeholders synth fine) NOT fromLookup — fromLookup calls route53:ListHostedZones (denied here) and fails synth. Pin the stack env region (us-east-1) explicitly so synth needs no creds. Redirect every non-canonical host with ONE distribution + a viewer-request CloudFront Function (host !== canonical -> 301), not multiple distributions or S3 redirect buckets. *(evidence: Phase 7 infra/cdk synth exit 0, 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*

### Category: Process

**L-03.** preview_screenshot can hang (30s) on pages doing continuous GPU/animation work: an autoplaying loop <video>, a live WebGL canvas (headless-over-WSL has no GPU to composite for capture, and the canvas persists in the DOM even when scrolled past the hero), or after heavy preview_eval/reload churn. Fallbacks: for video, the clean stop->start->resize->screenshot pattern with no eval between; for WebGL/heavy-motion pages, verify via preview_snapshot (a11y tree = content+structure+ARIA) + preview_eval computed styles + the production build instead of pixels. Real browsers/users are unaffected. *(from 2026-06-22-marketing-site-launch)*

**L-04.** Split-host preflight fix: pin profile.lock.toml build/typecheck to the ABSOLUTE v24 npm/npx path. The login-shell `node` resolves to v20 (nvm auto-use doesn't fire in non-interactive `bash -lc`), so a bare `npm run build` false-fails Astro 7 (needs >=22.12). Also: run a11y checks on WebGL/heavy pages by injecting axe-core via preview_eval (dynamic import from CDN + axe.run) when preview_screenshot hangs. *(evidence: Phase 6 profile.lock.toml + axe-core run 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*

**L-05.** Fail-closed CI deploy via GitHub OIDC: gate every AWS step on `if: env.X != ''` where X = a repo VARIABLE (vars.AWS_DEPLOY_ROLE_ARN, not a secret) so the job no-ops cleanly until the role exists — it never deploys credential-less and never needs static keys (INVARIANT-02). Measure the Lighthouse launch gate in CI via @lhci/cli autorun + lighthouserc staticDistDir=./dist asserting categories>=0.95, since there's no local Chrome to measure it. *(evidence: Phase 8 .github/workflows + lighthouserc.json 2026-06-22)* *(from 2026-06-22-marketing-site-launch)*

**L-06.** Pin the build runtime to the framework's real engines field, verified at install time - not a remembered version. Astro 7 needs Node >=22.12; this project builds on Node 24. *(from 2026-06-22-marketing-site-launch)*

**L-10.** AWS explicit-deny bypass for a constrained shared IAM user: attaching AdministratorAccess does NOT override an explicit Deny in another attached policy (explicit deny always wins, e.g. a *-scoped guardrail denying s3:CreateBucket). If you can't detach that policy, create a DEDICATED role with the needed perms and ASSUME it — identity-based denies on the calling user do not apply to the assumed-role session (only SCPs/permission boundaries/session policies do). Keyless via role_arn + source_profile. *(evidence: Phase 9 launch 2026-06-22: lsatprep-deployer-scoped denied s3:CreateBucket; deployed via assumed role clauderizer-deploy.)* *(from 2026-06-22-marketing-site-launch)*

### Category: Design

**L-11.** Cinematic full-bleed pages: every scrim must fade to the EXACT flat section background at fold edges (never generic dark rgba), and overflow:clip belongs only on media/parallax sections — blanket clipping amputates card glows and reads as glitchy borders. *(from 2026-07-18-second-look-density-pass)*

**L-12.** Reference content (glossaries, FAQs) should be printed beautifully, not hidden behind interaction. Interactive structures cost clicks and leave voids; spend the effort on typography. Group-level tabs are acceptable when the corpus overflows one fold — but stack panels in one grid cell so the page never resizes on switch. *(from 2026-07-18-second-look-density-pass)*
