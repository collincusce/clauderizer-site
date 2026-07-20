# Positioning Brief — copy-clarity-overhaul

> Phase 1 deliverable. Governing decisions: D-012 (benefit-led clarity; cinema is
> visual-only), D1 (dual-structure hero), D2 (preserve doctrine mantras),
> D3 (position against workarounds).

## The feedback that started this

A first-time visitor, shown the site:

> "This doesn't tell me anything. It should say something like 'Save your
> development process'… your headline should be what the product does **for me**.
> It took me a second to figure out what was going on lol. It's funny, I actually
> use mono-repos specifically for this purpose."

Diagnosis: the hero H1 ("Your best ideas shouldn't die in the dark.") is poetry
that could hang on any product. It fails the 5-second test. The lede underneath
does the real explanatory work — one beat too late.

## Message brief

| Field | Content |
| --- | --- |
| **Audience** | Devs and small teams building with AI coding agents (Claude Code, Cursor, Copilot, Codex, Gemini…) on projects that span many sessions. They know "context window" and have felt the agent forget; most have *not* heard of MCP. |
| **Trigger** | The agent forgot something it knew yesterday, contradicted an earlier decision, or the user caught themselves re-explaining the architecture. Or: a long session filled the context window mid-task and the agent lost the plot. |
| **Pain** | Re-briefing burns time, tokens, and patience. Decisions and conventions rot silently. Multi-day AI work drifts from the plan. |
| **Desired outcome** | Every session starts oriented — the agent already knows where things stand. The plan is live state, conventions are executed not advised, momentum survives the night. |
| **Primary proof** | The SessionStart digest demo, dogfooded on this very site ("this is the digest for this very site"). Plus receipts: 42 MCP tools, zero runtime dependencies, Apache 2.0, 3×3 OS×Python CI. |
| **Main objection** | "I already handle this" — with a CLAUDE.md/rules file, a monorepo, or just re-explaining. (The feedback-giver's own words: monorepos.) |
| **Single CTA** | `uvx --from clauderizer clauderize init` (secondary: GitHub). |

## Positioning against the workarounds (D3)

| Their workaround | Why it falls short | Our answer |
| --- | --- | --- |
| **CLAUDE.md / rules file** | Prose the agent must *remember* to read and follow; nothing executes it, so it rots. | Memory is exposed as self-describing tools + hooks: orientation is an executed tool call, not a convention. |
| **Monorepo everything** | Forces your repo topology to serve the agent's amnesia; still no plan/decision tracking, still starts blank. | Memory lives as Markdown in *any* repo — no topology tax — and the digest greets the agent at session start. |
| **Just re-explain each session** | Burns the first N minutes of every session; the re-brief itself drifts from reality. | The digest is generated from the tracked plan, not from your recollection. |

## One-line promise

**Every session starts exactly where the last one ended — because your project's
memory lives in the repo and briefs your agent for you.**

## Hero structure (D1: dual structure)

- **H1** = the benefit, in the visitor's own language (chosen below).
- **Lede** = the mechanism, de-jargoned from the owner's draft: a memory system
  that documents the project as you build (plans, decisions, conventions as
  Markdown in your repo) and briefs the agent automatically every session —
  no re-explaining, no decision rot.

## Headline candidates

### Direction A — Pain-first
1. **Stop re-explaining your project to your AI.**
2. **Your agent forgets everything overnight. Fix that.**
3. **Every session, your AI starts from zero. It doesn't have to.**

### Direction B — Outcome-first
1. **Every session picks up exactly where you left off.**
2. **Open a fresh session. Your agent is already up to speed.**
3. **Ship week-long AI projects without losing the plot.**

### Direction C — Category statement
1. **Durable memory for AI coding agents.**
2. **The memory layer for your coding agent.**
3. **Project memory your coding agent actually uses.**

### Direction D — Retained poetry (strengthened subhead)
1. **Your best ideas shouldn't die in the dark.** — kept verbatim; the *lede* is rewritten to state plainly, in the first sentence, what Clauderizer is and does.
2. **Your agent's memory shouldn't reset every session.** — a middle path: keeps the emotional cadence, names the mechanism.

## Lede candidates (mechanism subhead, pairs with any H1 above)

1. "Clauderizer is a memory system for coding agents. It documents your project
   as you build — plans, decisions, and conventions as plain Markdown in your
   repo — and briefs your agent automatically at the start of every session.
   No re-explaining. No decision rot."
2. "Every session your agent forgets: the architecture, the decisions, the
   momentum. Clauderizer keeps it all as plain Markdown in your repo and hands
   it back to your agent before you type a word."
3. "Clauderizer turns your project docs into living memory: tracked plans and
   decisions in your repo, injected into every session through your agent's own
   tools. Conventions stop rotting because something finally executes them."

## Chosen direction

Chosen with the site owner on 2026-07-19 (pain-first + memory-system lede):

- **Winning H1:** **Stop re-explaining your project to your AI.**
- **Winning lede:** "Clauderizer is a memory system for coding agents. It
  documents your project as you build — plans, decisions, and conventions as
  plain Markdown in your repo — and briefs your agent automatically at the
  start of every session. No re-explaining. No decision rot."
- **New meta title (Phase 2 applies):** `Clauderizer — stop re-explaining your project to your AI`
- **New meta description (Phase 2 applies, ~145 chars):** `Clauderizer is a memory system for coding agents — plans, decisions, and conventions as Markdown in your repo, briefed to your agent every session.`
- **Retained as poetry:** "Your best ideas shouldn't die in the dark." may
  survive as a *section-level* emotional beat further down the page (e.g. the
  final CTA), never as the hero H1. Decision D-012 governs.
