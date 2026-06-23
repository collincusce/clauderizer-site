# Invariants

Rules that hold across all work. Append-only. Numbered `INVARIANT-NN`.

## Invariants

_(Add entries with `cz_add_invariant`.)_

### INVARIANT-01 — All AWS commands for this project use --profile clauderizer (account 063337706623). Pre-flight aws sts get-caller-identity --profile clauderizer must return 063337706623 before any AWS mutation.
**Introduced by**: Marketing Site Launch gameplan - AWS identity decision

All AWS commands for this project use --profile clauderizer (account 063337706623). Pre-flight aws sts get-caller-identity --profile clauderizer must return 063337706623 before any AWS mutation.

### INVARIANT-02 — No static AWS keys in the repo or CI. Deploy auth is GitHub -> AWS OIDC or a local least-privilege named profile only; never committed credentials, .env secrets, or long-lived access keys.
**Introduced by**: Marketing Site Launch gameplan - AWS identity decision

No static AWS keys in the repo or CI. Deploy auth is GitHub -> AWS OIDC or a local least-privilege named profile only; never committed credentials, .env secrets, or long-lived access keys.

### INVARIANT-03 — Every visual or animation ships with a prefers-reduced-motion fallback and a no-WebGL/static fallback. Motion is an enhancement, never a requirement for content or accessibility.
**Introduced by**: Marketing Site Launch gameplan - design direction decision

Every visual or animation ships with a prefers-reduced-motion fallback and a no-WebGL/static fallback. Motion is an enhancement, never a requirement for content or accessibility.

### INVARIANT-04 — Lighthouse >=95 in performance, accessibility, best-practices, and SEO is a launch gate, checked on the production build.
**Introduced by**: Marketing Site Launch gameplan - hardening phase

Lighthouse >=95 in performance, accessibility, best-practices, and SEO is a launch gate, checked on the production build.

### INVARIANT-05 — The CloudFront ACM certificate must be issued in us-east-1, because CloudFront only accepts certificates from us-east-1.
**Introduced by**: Marketing Site Launch gameplan - infra decision

The CloudFront ACM certificate must be issued in us-east-1, because CloudFront only accepts certificates from us-east-1.

### INVARIANT-06 — Every AWS resource carries cost-allocation tags (at minimum project=clauderizer-site) so spend is attributable.
**Introduced by**: Marketing Site Launch gameplan - infra decision

Every AWS resource carries cost-allocation tags (at minimum project=clauderizer-site) so spend is attributable.

### INVARIANT-07 — This repo is PUBLIC and its docs/ memory ships with it: never commit raw PII or secrets to tracked files (personal emails, unrelated AWS account IDs, credentials, keys). Record source-of-truth secrets/PII indirectly (named AWS profiles, env, untracked notes) or redact in-doc. The project own account id 063337706623 is acceptable (load-bearing in infra/cdk, not secret). If something leaks, scrub with git filter-repo + force-push and verify on the remote.
**Introduced by**: Phase 9 post-launch PII scrub (2 emails + account 116662357168 redacted from history) 2026-06-22

This repo is PUBLIC and its docs/ memory ships with it: never commit raw PII or secrets to tracked files (personal emails, unrelated AWS account IDs, credentials, keys). Record source-of-truth secrets/PII indirectly (named AWS profiles, env, untracked notes) or redact in-doc. The project own account id 063337706623 is acceptable (load-bearing in infra/cdk, not secret). If something leaks, scrub with git filter-repo + force-push and verify on the remote.
