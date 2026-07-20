# Post-Mortem — copy-clarity-overhaul

Closed 2026-07-19. All 6 phases complete. Deployed live to clauderizer.com.

## What worked

- **Feedback → research → plan → ship in one day.** A single piece of outsider
  feedback ("this doesn't tell me anything") was digested against a full copy
  inventory and external copywriting research, turned into a positioning brief
  with real alternatives, and shipped the same day. No thrash.
- **The dual-structure hero (D1).** Pain-first H1 + mechanism lede solved the
  comprehension failure without flattening the site's voice. The owner's draft
  copy was good mechanism material and became the lede nearly verbatim.
- **Surgical cascade (D2).** Preserving the doctrine mantras while auditing
  every H2 kept the site's identity intact; the retired poetic H1 found a
  legitimate second life as the final CTA's emotional closer.
- **Cold-read verification.** Extracting the built page's visible text and
  reading it as a stranger caught what code review can't: the actual
  first-screen narrative. Cheap, repeatable, effective.
- **The feedback-giver's aside became a feature.** "I use mono-repos for this"
  turned into the workaround-positioning decision (D3) and a new FAQ entry.

## What didn't (root causes)

- **The original hero failed the 5-second test for months.** Root cause: the
  copy was written by people too close to the product; poetic headlines feel
  meaningful when you already know what the product does. No outsider read the
  page before launch. (Lesson L-13.)
- **Em-dashes everywhere.** Root cause: AI-assisted drafting defaults to
  em-dash punctuation; nobody had a style rule against it. (Lesson L-14.)
- **The OG card silently contradicted the new copy.** Root cause: the card is
  a baked image, invisible to text greps; yesterday's stale-unfurl fix
  re-rendered it with the old headline hours before the overhaul. Only a
  direct visual inspection caught it. Images that carry copy must be on the
  checklist for any copy overhaul.
- **Phase 5's formal validation was over-scoped.** Root cause: exit criteria
  were written for a high-stakes launch, but this was low-stakes iteration on
  a personal site. Waived by the owner (C-01).

## Procedure improvements

- Scope human-validation phases to the stakes: owner review by default,
  formal 5-second panels only for launches or traffic-driving pages. (C-01
  lesson.)
- Add "images with baked-in copy (OG cards, social assets)" to the copy-change
  cascade checklist.
- The render script for the OG card now exists (`.hero-staging/render_og.py`),
  so future copy changes can re-render the card in minutes instead of
  regenerating it by hand.

## Open threads

- **Lighthouse ≥95 re-run** — waived here; `ci.yml` enforces it automatically
  on the next PR. No action needed unless scores regress.
- **Analytics (O-01, declined)** — no quantitative measurement of the copy
  change. If the site starts getting real traffic, revisit.
- **Deploys are push-to-main** — worked smoothly twice today (both ~30s).

## Outputs

- New hero: "Stop re-explaining your project to your AI." + memory-system lede
- Positioning brief: `POSITIONING-BRIEF.md` (message table, workaround
  positioning, 14 headline/lede candidates)
- New FAQ entry (monorepo workaround); MCP gloss; nav/drift/typo fixes
- llms.txt + README + webmanifest aligned; "42 tools" count made consistent
- OG card v2 (`public/og-2026-v2.jpg`) with the new positioning
- Decisions D-012 (project) + D1–D3; lessons L-13, L-14 promoted to project
  memory; correction C-01
