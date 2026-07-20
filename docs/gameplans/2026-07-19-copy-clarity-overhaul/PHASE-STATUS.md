# copy-clarity-overhaul — Phase Status Tracker

> Living document. Updated after each phase completes.
> Last updated: 2026-07-19

## Phase Status

| Phase | Name | Status | Started | Completed | Handoff |
|-------|------|--------|---------|-----------|---------|
| 0 | Bootstrap | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-0-HANDOFF.md |
| 1 | Positioning brief | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-1-HANDOFF.md |
| 2 | Hero and meta rewrite | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-2-HANDOFF.md |
| 3 | Homepage cascade | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-3-HANDOFF.md |
| 4 | Parallel surfaces | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-4-HANDOFF.md |
| 5 | Human validation | ✅ COMPLETE | 2026-07-19 | 2026-07-19 | handoffs/PHASE-5-HANDOFF.md |

## Outputs Registry

### Phase 1 Outputs

```
positioning_brief_path: docs/gameplans/2026-07-19-copy-clarity-overhaul/POSITIONING-BRIEF.md
winning_h1: Stop re-explaining your project to your AI.
winning_lede: Clauderizer is a memory system for coding agents. It documents your project as you build — plans, decisions, and conventions as plain Markdown in your repo — and briefs your agent automatically at the start of every session. No re-explaining. No decision rot.
meta_title: Clauderizer — stop re-explaining your project to your AI
meta_description: Clauderizer is a memory system for coding agents — plans, decisions, and conventions as Markdown in your repo, briefed to your agent every session.
```

### Phase 2 Outputs

```
hero_h1_lines: Stop re-explaining / your project (em) / to your AI. — title max-width bumped 13ch -> 20ch to fit
```

### Phase 3 Outputs

```
faq_count: 7 Q&As (added monorepo/workaround entry; FAQPage JSON-LD auto-includes it)
poetry_retained_at: Final CTA H2: 'Your best ideas shouldn't die in the dark.' — emotional closer after comprehension is established
```

### Phase 5 Outputs

```
build_status: production build green (3 pages) after all copy changes
cold_read: above-the-fold text extraction verified: H1 + memory-system lede + install command visible in first screen; old failure mode structurally fixed
blocked_on_owner: Lighthouse gate (no Chrome in this env) + 3-person 5-second test with unfamiliar readers
```

## Corrections Log

### C-01 — Phase 5

**Phase**: 5
**What gameplan said**: Exit criteria required a 3-person 5-second test with unfamiliar readers and a Lighthouse >=95 re-run on the production build.
**What was actually correct**: Owner waived both on 2026-07-19 ('I looked at it, that's enough for now'). Owner review + the cold-read text extraction served as validation; Lighthouse remains gated in ci.yml on the next PR.
**Why**: Low-stakes marketing iteration on a personal site; the owner judged formal panel validation disproportionate.
**Lesson**: Scope human-validation phases to the stakes: owner-review by default for low-stakes copy iteration; reserve formal 5-second panels for launches or traffic-driving pages.
