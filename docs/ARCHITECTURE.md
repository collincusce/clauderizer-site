# Architecture

Subsystems, capabilities, and components. Tracked entities live in
`docs/subsystems/` with frontmatter that declares the Project DAG; this doc is
the prose overview.

## Subsystems

- **subsys.site** — the Astro 7 static app (TypeScript + MDX), built on Node 24.
  One page composed of section components (Hero, SessionDemo, Problem,
  AmnesiaMemory, HowItWorks, Features, Receipts, Quickstart, CTA, Footer) plus a
  404, all under a single `BaseLayout`. Output is static HTML to `dist/`.
- **subsys.memory-graph** — the signature WebGL hero (`src/lib/memoryGraph.ts`):
  a vanilla three.js "living memory-graph" that blooms from amnesia into a
  structured dependency graph; nodes map to real entity types. Lazy/code-split;
  the Higgsfield poster is the no-WebGL / reduced-motion fallback.
- **subsys.infra-cdk** — AWS CDK app (`infra/cdk`, us-east-1): a private S3
  bucket + CloudFront (Origin Access Control), one ACM cert covering all five
  apexes + their `www`, a viewer-request CloudFront Function that serves the
  canonical apex and 301-redirects every other host, and Route53 alias records
  across the five hosted zones. Cost-tagged `project=clauderizer-site`.
- **subsys.ci** — GitHub Actions: a PR pipeline (build + Lighthouse CI) and a
  fail-closed deploy to S3 + CloudFront via GitHub→AWS OIDC.

## Capabilities

- **Motion layer** — GSAP drives the SessionStart terminal demo; the cz_* loop is
  CSS-only (runs without JS). An animation governor pauses perpetual animations
  when their section is offscreen or the tab is hidden. Everything gates on
  `prefers-reduced-motion` and WebGL support.
- **Media** — Higgsfield-generated stills used as posters and reduced-motion
  fallbacks; lazy-loaded with stable layout (no CLS).

## Security posture

Keyless by design (INVARIANT-02). Site content is public via CloudFront; the S3
origin is private (OAC only). Deploys use short-lived credentials — GitHub OIDC
in CI, a scoped assume-role profile locally — with no static access keys anywhere.
Tracked memory carries no secrets or PII (INVARIANT-07). The CloudFront ACM
certificate is issued in us-east-1 (INVARIANT-05).
