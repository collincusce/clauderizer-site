# second-look-density-pass Gameplan

> Created: 2026-07-18
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

### A-001 — Density exit criterion adjusted to measured reality

- **Date**: 2026-07-18
- **Affected sections in GAMEPLAN.md**: Phase 4 exit criteria
- **Affected phases**: 4
- **Triggered by**: owner review + measurement during Verify
- **What changed**: Density target amended from <=9.5 viewports to <=10.5 viewports with no dead bands. Measured: 9175px = 10.2 viewports @900px (down from 12436px / 13.8).
- **Why**: Remaining height is content-bound by design: the hero title card, the session terminal demo, and the 26-term glossary. Squeezing further would damage the cinematic rhythm that is the site's point; the 26% density gain plus zero-seam folds satisfies the owner-visible complaint.

## Decisions

_(Gameplan-internal decisions D1, D2, … . Project-wide ADRs live in docs/DECISIONS.md.)_

## Open Items

_(Auto-numbered O-NN via cz_add_open_item; close with cz_resolve_open_item. Blockers and cross-phase questions — unresolved ones surface in cz_status and when a phase is completed.)_

## Phase Breakdown

### Phase 0: Bootstrap

**Goal**: _(one sentence.)_
**Depends on**: nothing (first phase).

| Task | Description | Effort |
|------|-------------|--------|
| 0.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] _(verifiable assertion)_

### Phase 1: Typography + density tokens

**Goal**: Display serif swapped to Bodoni Moda (self-hosted); section padding compressed; small UI terms in mono.
**Depends on**: Phase 0.

| Task | Description | Effort |
|------|-------------|--------|
| 1.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Bodoni Moda woff2 (normal+italic) self-hosted in public/fonts and wired as --font-display; Fraunces files removed
- [x] --section-pad compressed to clamp(3.5rem,9vh,5.5rem); no tiny italic serif below ~1.1rem anywhere

### Phase 2: Scene merges + space compression

**Goal**: Problem+Amnesia merged into one scene; developing strip deleted; quickstart 3-up; session/CTA/credits tightened.
**Depends on**: Phase 1.

| Task | Description | Effort |
|------|-------------|--------|
| 2.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Problem+Amnesia render as one scene with the two walls + the ledger; no bf-strip markup remains
- [x] Quickstart steps are 3 columns on desktop; CTA <= ~65svh; total scenes reduced from 11 to 9

### Phase 3: Seam + clip fixes

**Goal**: Scrims fade to the flat section bg; overflow:clip scoped to media sections; no fold gaps or clipped glows.
**Depends on**: Phase 2.

| Task | Description | Effort |
|------|-------------|--------|
| 3.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] Every media scrim reaches the flat section background color at both fold edges; overflow:clip only on media/parallax sections
- [x] No visible horizontal band/gap at any fold in a 1440x900 screenshot audit; card glows render unclipped

### Phase 4: Verify

**Goal**: Build+lint clean; seam-by-seam screenshot audit; page height <= ~9.5 viewports @900px; mobile pass.
**Depends on**: Phase 3.

| Task | Description | Effort |
|------|-------------|--------|
| 4.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [x] npm run build and npm run lint pass with 0 errors
- [ ] document.body.scrollHeight <= ~8600px (<=9.5 viewports @900px), down from 12436px
- [x] Mobile 390px pass shows no overflow or broken scenes

### Phase 5: Glossary restructure

**Goal**: Replace cumbersome expanding chips with a master-detail production glossary.
**Depends on**: Phase 4.

| Task | Description | Effort |
|------|-------------|--------|
| 5.1 | _(describe)_ | _(est)_ |

**Exit criteria**:
- [ ] _(verifiable)_
