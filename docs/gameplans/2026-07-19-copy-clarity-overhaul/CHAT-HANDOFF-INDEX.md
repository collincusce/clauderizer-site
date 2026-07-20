# Chat Handoff Index — copy-clarity-overhaul

> Last updated: 2026-07-19
> Status: Phase 4 of 6 in progress

## How This Works

This is the coordination point for sessions executing this gameplan. A fresh
session gets current state automatically from the Clauderizer SessionStart hook,
then calls `cz_next_phase_context` for the active phase. No manual reading order.

## Pre-Flight Verification

Run `cz_preflight` before any code. If any enabled check fails: STOP, report.

**Current baseline test count**: 0

## Ending Protocol

1. `cz_transition_phase` the finished phase to complete.
2. `cz_add_output` each concrete produced value; `cz_add_phase_summary` the recap;
   `cz_add_correction` / `cz_add_lesson` as earned.
3. `cz_transition_status` on touched entities (fires cascade); `cz_resolve_cascade`
   the verdicts.
4. `cz_write_handoff` for the next phase.
5. Run exit verification; report the test count.

## Phase Status Table

| Phase | Name | Status | Started | Completed | Handoff |
|-------|------|--------|---------|-----------|---------|
| 0 | Bootstrap | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-0-HANDOFF.md |
| 1 | Positioning brief | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-1-HANDOFF.md |
| 2 | Hero and meta rewrite | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-2-HANDOFF.md |
| 3 | Homepage cascade | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-3-HANDOFF.md |
| 4 | Parallel surfaces | 🟡 IN PROGRESS | 2026-07-19 | — | handoffs/PHASE-4-HANDOFF.md |
| 5 | Human validation | ⬜ NOT STARTED | — | — | handoffs/PHASE-5-HANDOFF.md |

**Status legend**: ⬜ NOT STARTED · 🟢 READY · 🟡 IN PROGRESS · ✅ COMPLETE · ⚠️ BLOCKED · 🔴 FAILED

## Per-Phase Completion Summaries

### Phase 1 — completed 2026-07-19

Digested the visitor feedback (hero H1 'tells me nothing'; headline should say what the product does for me; visitor uses monorepos as their workaround) against a full copy inventory of the site and external copywriting research (5-second test, benefit-led beats clever, dual-structure hero). Wrote POSITIONING-BRIEF.md: seven-field message brief, workaround positioning table (CLAUDE.md, monorepo, re-explaining), 11 headline candidates across four directions, 3 lede candidates. With the owner, chose pain-first H1 'Stop re-explaining your project to your AI.' + the 'memory system' lede (the owner's draft copy, de-jargoned), plus derived meta title/description for Phase 2 to apply.

### Phase 2 — completed 2026-07-19

Applied the Phase 1 positioning above the fold. Hero.astro: H1 is now 'Stop re-explaining / your project / to your AI.' (ember italic on 'your project', title max-width 13ch -> 20ch), lede is the chosen memory-system copy with docs/ kept as inline code, aria-label updated. BaseLayout.astro: default title, meta description (drives OG/Twitter/JSON-LD), and og:image:alt all carry the new positioning. site.webmanifest description updated. Build passes; dist/index.html verified to contain the new title/description/H1 and zero occurrences of the old poetic H1.

### Phase 3 — completed 2026-07-19

Cascaded the positioning through the homepage with surgical edits. Section H2s audited: all pass the plain-meaning test unchanged (mantras 'A system, not a hope', 'Markdown wins', 'conventions rot' preserved per D2). MCP expanded at first on-page mention (HowItWorks pipeline stage 3). FAQ gained a monorepo/workaround Q&A per D3 (7 total; FAQPage JSON-LD picks it up automatically). Drift fixed: scene-number comments now match slugs in HowItWorks/Features/Receipts/CTA/FAQ, 'honour' -> 'honor', Vocabulary added to nav. The retired poetic H1 was deliberately restored as the final CTA's emotional closer (per the Phase 1 brief), where comprehension is already established. Build + lint green; mantras verified in dist.

## Accumulated Lessons

_(Numbered sequentially across the whole gameplan. Categorized. Pruned of
obsolete items — mark with "(obsolete)" rather than deleting.)_

### Category: Process

_(none yet)_

**1.** Marketing copy needs an outsider comprehension check before launch: the author is too close to notice that poetic headlines carry no information for a first-time visitor. A 5-second test with one unfamiliar reader caught what the whole build missed. *(evidence: 2026-07-19 visitor feedback on the hero H1 'Your best ideas shouldn't die in the dark.')*
