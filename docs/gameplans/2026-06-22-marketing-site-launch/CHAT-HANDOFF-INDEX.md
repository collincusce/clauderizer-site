# Chat Handoff Index — Marketing Site Launch

> Last updated: 2026-06-22
> Status: Phase 1 ready

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
| 0 | Foundation: repo, Astro scaffold and AWS/GitHub wiring | ✅ COMPLETE | 2026-06-22 | 2026-06-22 | handoffs/PHASE-0-HANDOFF.md |
| 1 | Design system and brand language | ⬜ NOT STARTED | — | — | handoffs/PHASE-1-HANDOFF.md |
| 2 | The memory-graph hero (signature centerpiece) | ⬜ NOT STARTED | — | — | handoffs/PHASE-2-HANDOFF.md |
| 3 | Narrative content sections | ⬜ NOT STARTED | — | — | handoffs/PHASE-3-HANDOFF.md |
| 4 | Interactive demos and motion delight | ⬜ NOT STARTED | — | — | handoffs/PHASE-4-HANDOFF.md |
| 5 | Media slots and Higgsfield asset pack | ⬜ NOT STARTED | — | — | handoffs/PHASE-5-HANDOFF.md |
| 6 | SEO, performance and accessibility hardening | ⬜ NOT STARTED | — | — | handoffs/PHASE-6-HANDOFF.md |
| 7 | Infrastructure as code (CDK) | ⬜ NOT STARTED | — | — | handoffs/PHASE-7-HANDOFF.md |
| 8 | CI/CD (GitHub Actions + OIDC) | ⬜ NOT STARTED | — | — | handoffs/PHASE-8-HANDOFF.md |
| 9 | Launch | ⬜ NOT STARTED | — | — | handoffs/PHASE-9-HANDOFF.md |

**Status legend**: ⬜ NOT STARTED · 🟢 READY · 🟡 IN PROGRESS · ✅ COMPLETE · ⚠️ BLOCKED · 🔴 FAILED

## Per-Phase Completion Summaries

### Phase 0 — completed 2026-06-22

Phase 0 stood up the foundation. Created and pushed the public GitHub repo collincusce/clauderizer-site (over HTTPS via the gh token - the SSH key is passphrase-locked, see C-02), and hand-scaffolded an Astro 7 + TypeScript 6 + ESLint 10 project that builds cleanly on Node 24 (Astro 7 dropped Node 20, see C-01), with a BaseLayout, brand-token starter CSS (reduced-motion baked in per INVARIANT-03), an on-brand placeholder hero, MDX + sitemap, Prettier + ESLint (both clean), and a public README. Clauderizer was switched to the node profile so cz_preflight now runs the real `npm run build` (green), and the dedicated `clauderizer` AWS profile resolves to account 063337706623 (INVARIANT-01). All five exit criteria met. Two divergences recorded (C-01 Node 20->24, C-02 SSH->HTTPS) plus one new open item (O-06): the session host is recorded as native while Claude Code runs on Windows over the wsl.localhost UNC path, so the digest and cz_* MCP tools do not auto-load - the whole phase ran on the clauderize ops CLI fallback. No subsystem cascades fired: scaffolding changed no dependent's contract (INVARIANT-05 judgment).

## Accumulated Lessons

_(Numbered sequentially across the whole gameplan. Categorized. Pruned of
obsolete items — mark with "(obsolete)" rather than deleting.)_

### Category: Process

_(none yet)_

**1.** Pin the build runtime to the framework's real engines field, verified at install time - not a remembered version. Astro 7 needs Node >=22.12; this project builds on Node 24.

**2.** For automated git push from a headless shell, use gh's HTTPS credential helper rather than a passphrase-protected SSH key.

**3.** Clauderizer ops-fallback scratch files (ops batches, runner scripts) must live OUTSIDE the repo (e.g. /tmp), or cz_preflight's clean_tree check trips on the tool's own footprint. *(evidence: Phase 0: first cz_preflight failed clean_tree on _ops_pf.json)*

**4.** clauderize init is idempotent and will NOT clobber an existing config.toml or profile.lock.toml. To switch the host profile after the first scaffold, edit profile.lock.toml (the editable override that preflight reads) and, for a consistent status digest, the config [host] profile scalar. *(evidence: Phase 0: init reported host profile=node but wrote 0 files; profile.lock stayed generic until edited)*

**5.** Windows->WSL split-host Clauderizer wiring needs session_host=windows-wsl:<distro> AND a full-path uvx in .mcp.json/hook - bare uvx fails in the non-login wsl.exe shell (no ~/.local/bin on PATH). Verify from the Windows side: run the SessionStart hook command and clauderize doctor through the wsl.exe shim; both should report 'verified end-to-end'. *(evidence: Phase 0 / O-06; doctor via wsl.exe shim 2026-06-22)*
