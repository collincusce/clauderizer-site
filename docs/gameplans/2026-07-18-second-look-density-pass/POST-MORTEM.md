# Post-mortem — second-look-density-pass

> Closed: 2026-07-18 · 6 phases (0–5) complete · amendment A-001 · correction C-01

## What this gameplan did

Took the K3 director's-cut site through a critical second pass after owner review:
fixed fold-seam gaps and clipped glows, compressed 13.8 viewports of scroll into
10.4, swapped the display serif (Fraunces → Bodoni Moda), merged scenes, restructured
the glossary three times to its final sidebar-tab form, and absorbed follow-on fixes
(3×2 features grid + Auditable card, hero video 0.7× two-clip ping-pong, terminal
height pinning, full mobile audit).

## What worked

- **Measured critique beats vibes.** Capturing `document.body.scrollHeight` and
  seam-by-seam screenshots turned "feels too long / glitchy borders" into exact
  diagnoses: scrims fading to generic rgba instead of the section bg, and blanket
  `overflow: clip` amputating card glows. Both fixes were one-time systemic changes
  (global scrim token, scoped `.clip` class).
- **The owner's instinct on the strip.** The abstract "developing" constellation was
  decoration; the merged Scene 03 (walls → closer → ledger) is information-dense and
  shorter. Decoration must justify its scroll cost.
- **Grid-stacked panels.** `grid-area: 1/1` + `visibility` gave stable page height
  for tabbed content with zero JS — verified identical scrollHeight across all groups.
- **Two-clip video ping-pong.** Pre-rendered `hero-rev.mp4` (ffmpeg `reverse`, 765KB)
  + crossfade killed the seek-scrub jank. The reverse clip's first frame being the
  forward clip's last makes the swap invisible.

## What didn't (root causes)

- **Glossary needed three attempts.** Chips (reflow, 26 click targets) → master-detail
  rail (database-dump look, void pane) → static dictionary (overflowed the fold) →
  sidebar tabs with stacked panels (final). Root cause: designing the *pattern* before
  respecting the *content's shape* — 26 terms in 5 groups wants group-level selection,
  and reference content wants print, not interaction. Recorded as C-01 and L-12.
- **Seek-scrubbing video backwards.** Shipped, then janked in the wild: sparse
  keyframes make every backward seek a multi-frame decode; seeks queued and burst.
  Root cause: choosing a codec-fighting technique over the boring correct one (a
  second clip). Replaced; verified frame-aligned.
- **Density target missed, then amended.** Set ≤9.5 viewports before measuring where
  height lives (hero title card, terminal demo, glossary are content-bound). A-001
  records the honest 10.2→10.4 result instead of a fake hit. Set targets from a
  measurement first next time.

## Procedure improvements

- Font swaps are owner-subjective: offer the decision early (AskUserQuestion worked
  well: "swap the serif entirely" → Bodoni Moda) rather than defending a first pick.
- Test rigs must mirror production capability: Python `http.server` lacks HTTP Range
  support, which made a working video controller look broken. The range-capable Node
  static server is now the standard QA harness (see also: verify against `dist/`,
  not dev server).

## Open threads

- AWS deploy (O-01 identity, O-02 zone IDs) — resolved during this close; first
  production deploy + content publish performed at close. Verify all 10 hostnames
  once DNS/CloudFront settle.

## Audit findings

`cz_audit`: 1 mechanical (uncommitted tree — resolved by the close commit) +
4 judgment checks affirmed: all QA ran against the production `dist/` build
(clean environment); removed-token/component consumers grepped and updated;
copy claims carried from previously verified content or functionally verified
this pass; every shipped artifact screenshot/function-verified.
