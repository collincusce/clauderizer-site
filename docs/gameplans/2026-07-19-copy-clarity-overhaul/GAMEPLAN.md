# copy-clarity-overhaul Gameplan

> Created: 2026-07-19
> Status: Complete
> Kind: driven
> Procedure: docs/gameplans/GAMEPLAN-PROCEDURE.md

## Project Overview

_(1–2 paragraphs: what this gameplan accomplishes.)_

## Subsystems Touched

_(list the subsystems/features this gameplan affects.)_

## Source-of-Truth Captures

_(Real values captured from real systems at gameplan start. Authority over the
gameplan body. Account IDs, ARNs, baseline test counts, versions.)_

## Amendments

_(None yet. Append A-NNN entries here once Phase 0 starts.)_

## Decisions

### D1 — Dual-structure hero: benefit H1 + mechanism subhead

**Context**: Research shows the winning pattern is a benefit-led headline paired with a mechanism subhead that answers 'what is it, how does it work' for educated evaluators. The user's own draft copy ('MCP + ritual system... gameplans... without decision and convention rot') is accurate mechanism material but too jargon-dense for an H1.
**Decision**: Hero = outcome/pain H1 in the visitor's own language + a lede that states what Clauderizer is (memory system: Markdown in your repo, injected via MCP tools/hooks) and the payoff (agent stays oriented, no re-briefing, no convention rot). Phase 0 develops candidates across four directions: pain-first, outcome-first, category statement, and a retained-poetry option with a strengthened subhead.
**Consequences**: The user's draft copy is mined for the lede/FAQ, de-jargoned; H1 candidates are chosen with the user in Phase 0 before any code changes.
**Status**: active (2026-07-19)

### D2 — Preserve doctrine mantras; prune only accidental redundancy

**Context**: The site intentionally repeats doctrine: 'a system, not a hope' (x2), 'conventions rot because nothing executes them' (x2), 'Markdown wins' (x3), 'tool calls the agent can't forget to make' (x3), 'ships with the code, shows up in diffs' (x3). This repetition is a deliberate persuasion device.
**Decision**: Keep the mantras and their repetition. The overhaul changes clarity of meaning, not the doctrine. Only prune repetitions that are accidental rather than doctrinal.
**Consequences**: Copy edits are surgical; reviewers must not 'tidy away' mantra repetition during the cascade pass.
**Status**: active (2026-07-19)

### D3 — Position against the visitor's existing workaround

**Context**: The feedback-giver said 'I actually use mono-repos specifically for this purpose' — visitors mentally map Clauderizer onto their current workaround (monorepos, CLAUDE.md/rules files, manually re-explaining). The FAQ already covers rules files but not monorepos or the do-nothing default.
**Decision**: Add explicit positioning against the alternatives visitors already use: monorepo-everything, CLAUDE.md/rules files (existing), and re-explaining each session. Each gets a fair, concrete 'why this beats the workaround' treatment, primarily in the FAQ and Problem sections.
**Consequences**: FAQ gains at least one new Q&A; Problem section copy may reference the workaround pattern; claims must stay product-true.
**Status**: active (2026-07-19)

## Open Items

**O-01.** The site has no analytics, so copy performance cannot be measured quantitatively — validation relies on human 5-second tests. Decide separately whether to add privacy-friendly analytics. _(resolved 2026-07-19: Declined for now. Owner judgment 2026-07-19: qualitative human feedback is sufficient at this stage; no analytics to be added. Revisit if the site starts getting real traffic.)_

## Phase Breakdown

### Phase 0: Bootstrap

**Goal**: _(one sentence.)_
**Depends on**: nothing (first phase).

| Task | Description | Effort |
|------|-------------|--------|
| 0.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] _(verifiable assertion)_

### Phase 1: Positioning brief

**Goal**: Write a one-page message brief (audience, trigger, pain, desired outcome, primary proof, main objection, single CTA) plus headline candidates across the four chosen directions (pain-first, outcome-first, category statement, retained-poetry); the user picks the winning H1 + lede before any code is touched.
**Depends on**: Phase 0.

| Task | Description | Effort |
|------|-------------|--------|
| 1.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] - [ ] Message brief file exists in the gameplan dir with all seven fields filled: audience, trigger, pain, desired outcome, primary proof, main objection, single CTA
- [x] - [ ] Headline candidates written for all four directions (pain-first, outcome-first, category statement, retained-poetry), at least 3 per direction
- [x] - [ ] Winning H1 + lede recorded in the brief (chosen with the user)
- [x] - [ ] Brief includes positioning against the monorepo/CLAUDE.md/re-explaining workarounds

### Phase 2: Hero and meta rewrite

**Goal**: Apply the chosen positioning above the fold: Hero.astro H1/lede/slug/CTAs/aria-labels, BaseLayout title/description/OG/Twitter/JSON-LD, and site.webmanifest — all consistent with the new message.
**Depends on**: 1.

| Task | Description | Effort |
|------|-------------|--------|
| 2.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] - [ ] Hero H1 and lede match the chosen positioning from Phase 1
- [x] - [ ] BaseLayout default title, meta description, OG/Twitter description, and JSON-LD all carry the new positioning
- [x] - [ ] site.webmanifest description updated to match
- [x] - [ ] `npm run build` passes (astro check + production build)
- [x] - [ ] grep confirms the old H1 'shouldn\'t die in the dark' no longer appears in src/ except where deliberately retained as poetry

### Phase 3: Homepage cascade

**Goal**: Propagate the new positioning through every homepage section (SessionDemo, Problem, HowItWorks, Features, Receipts, Quickstart, Vocabulary, FAQ, CTA, Footer): plain-language H2s, expand MCP on first mention, add monorepo-alternative Q&A, and fix known drift (scene-number comment slugs, British 'honour', missing Vocabulary nav link).
**Depends on**: 2.

| Task | Description | Effort |
|------|-------------|--------|
| 3.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] - [ ] Every section H2 passes the plain-meaning test (a first-time visitor can say what the section claims)
- [x] - [ ] 'MCP' is expanded or glossed at first on-page mention
- [x] - [ ] FAQ contains a monorepo/workaround alternative Q&A
- [x] - [ ] Scene-number comment/slug drift, 'honour', and the missing Vocabulary nav link are fixed
- [x] - [ ] `npm run build` and `npm run lint` pass
- [x] - [ ] Doctrine mantras ('a system, not a hope', 'Markdown wins', 'tool calls the agent can\'t forget to make') are preserved

### Phase 4: Parallel surfaces

**Goal**: Bring every off-page surface in line with the new positioning: public/llms.txt (full parallel deck), README tagline, 404 and styleguide copy, and the '42 MCP tools + 3 resources vs + 2 prompts' discrepancy.
**Depends on**: 3.

| Task | Description | Effort |
|------|-------------|--------|
| 4.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] - [ ] public/llms.txt rewritten to match the new positioning, with the '42 MCP tools' count made consistent with the site
- [x] - [ ] README tagline, 404 copy, and styleguide lede aligned with the new positioning
- [x] - [ ] grep consistency check: key claims (tagline, tool counts, host list) identical across src/, public/llms.txt, README.md
- [x] - [ ] `npm run build` passes

### Phase 5: Human validation

**Goal**: Prove the 5-second test passes: production build, Lighthouse >=95 gate (INVARIANT-04), then 5-second tests with at least 3 people unfamiliar with the product; each must be able to say what Clauderizer does for them; iterate on findings.
**Depends on**: 4.

| Task | Description | Effort |
|------|-------------|--------|
| 5.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] - [ ] Lighthouse >=95 in all four categories on the production build (INVARIANT-04)
- [ ] - [ ] At least 3 people unfamiliar with the product complete a 5-second test
- [ ] - [ ] Every tester can state, unprompted, what Clauderizer does for them
- [ ] - [ ] Findings from the tests are recorded and resulting copy fixes applied
