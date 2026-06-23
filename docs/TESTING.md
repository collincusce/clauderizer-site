# Testing

## Test Discipline

This is a static marketing site, so correctness is enforced by the build and by
Lighthouse rather than a unit-test suite. `astro check` (type + template checks)
must pass on every build. Accessibility is verified with axe-core — no
serious/critical violations is the bar. There is no application logic to
unit-test; the interactive demos are progressively enhanced and must degrade to
finished static content with JS off and under reduced-motion before they merge.

## Runner & Baseline

- Runner: `npm run build` (`astro check` + `astro build`) on Node 24.
- Lighthouse CI: `@lhci/cli autorun` against the built `dist/`, asserting
  performance / accessibility / best-practices / SEO each ≥ 0.95 (INVARIANT-04),
  on every PR.
- Baseline test count: **0** (no unit suite, by design for a static site).

## Coverage Policy

The launch gates *are* the coverage policy: a green build, Lighthouse ≥ 95 in all
four categories, and an axe pass with no serious/critical violations. Any new
interactive feature must ship a reduced-motion and a no-JS / no-WebGL fallback
(INVARIANT-03) before merge.
