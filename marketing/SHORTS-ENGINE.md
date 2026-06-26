# Clauderizer Shorts Engine

A repeatable system for producing short-form video marketing for X (and TikTok / Reels /
YouTube Shorts) using the **Higgsfield** toolchain. Goal: ship on-brand, high-craft shorts
*on a regular cadence* without reinventing the look or the process each time.

> Status: v1 (bootstrapped 2026-06-25). This doc is the source of truth for the engine.
> The visual system is reverse-engineered from `.hero-staging/`, `public/og.png`, and
> `public/favicon.svg`. Move/rename freely — nothing else depends on this path yet.

---

## 1. Brand system (the non-negotiables)

Every frame obeys this grammar so the channel looks like one author.

### Palette
| Token | Hex | Use |
|---|---|---|
| Void | `#0b0d12` | Background. Almost-black, very slightly blue. |
| Amber (primary) | `#f59e0b` | Memory, structure, "remembering," the graph. |
| Hot core | `#ffb454` | Node cores, highlights, the logo center. |
| Brilliant (white) | `#f5f6f8` | The "brilliant" half of the line; primary text. |
| Amnesiac (cold) | `#8a94a6` | Grey-blue. The "forgetting" half; cold/dead matter. |
| Status green | `#3fb950` | Terminal "ok / Apache 2.0 / MCP-native" accents. |
| Signal blue | `#5a9cff` | Sparingly, for one accent node in a constellation. |

### The core metaphor (already in your staging art — keep it sacred)
**COLD → WARM, left → right (or top → bottom).**
- **Cold side** = amnesia: desaturated grey-blue, smoke, shattered crystal/cube fragments,
  drifting debris, glitch, things coming *apart*.
- **Warm side** = Clauderizer: scattered pages organizing into labeled **folders, open
  books, and a mind made of documents**, joined by fine warm light-threads (a living index /
  dependency graph), hot `#ffb454` core — things *holding together*. Human-first: paper and
  minds, **not** a cold sci-fi node-lattice. The lattice is the AI-startup cliché we avoid;
  *organized documentation as memory* is what's actually true and ownable.
- The story of nearly every asset is matter resolving from chaos into a remembered graph.

### Motifs
- The **⊙ aperture logo** (amber ring, hot center) — the brand mark.
- A **constellation / dependency graph** of nodes + thin edges.
- Drifting **amber embers** on void (the site's particle field).
- A **terminal pill**: monospace, `$ uvx --from clauderizer clauderize init`, green status text.
- The **SessionStart digest card**: `gameplan … · phase 4 / 10 · baseline … · next: …`.
- The **phase counter** ticking `0 → 4 → 10`.

### Type
- Headlines: bold geometric grotesque (match the site).
- Terminal / labels: monospace.
- Keep text as **crisp overlays added in the edit** — do not trust image/video models to
  render legible code or UI. Generate the *mood/scene*; composite the words on top.

### Logo — NEVER generated (hard rule)
The ⊙ mark (amber ring `#f59e0b` + hot center dot `#ffb454`) is **always composited from the
real asset** — `marketing/brand/logo-mark.png` is a **true transparent ⊙**, color-keyed from
`public/icon-512.png` (whose tile is pure `#000000`, not `#0b0d12` — sample, don't guess). To
stamp it onto a finished frame, **sample that frame's own bg color and erase the corner with a
matched box first**, then overlay — each card's black is a slightly different near-black
(`#05070c`, `#020307`…), so a flat box shows an edge and an undersized overlay leaves a double
ring. **Never drawn by an image model** — gen models render it inconsistently (ring-only, wrong
stroke, missing the dot — the bug we hit). Prompt cards with an **empty top-left corner**; the
stamped real mark is then identical on every frame. (Stamped set: `marketing/brand/cards/`.)

---

## 2. The production pipeline (the repeatable chain)

Run top to bottom. The discipline that saves credits and raises quality: **cheap stills
first, approve the look, only then spend video credits.**

| # | Stage | Higgsfield tool | Notes |
|---|---|---|---|
| 1 | Pick a concept | — | From the Concept Bank (§3) or a fresh hook. |
| 2 | Keyframe stills | `generate_image` (`get_cost:true` to preflight) | Lock composition + palette cheaply. 2 variants/beat. Models in §4. |
| 3 | **Approve the look** | — | Human gate. Don't animate anything not approved. |
| 4 | Animate | `generate_video` (image-to-video from the still's `job_id`) | `kling3_0` for multi-shot/with-audio; `kling3_0_turbo` for fast single-start-frame; `seedance_2_0` for identity. Browse motion via `presets_show`. |
| 5 | Voiceover | `generate_audio` (`text2speech_v2_*`) | **TTS only.** Pick a voice via `list_voices` (`voice_id`+`voice_type`). |
| 6 | Music / SFX | *not Higgsfield* | No standalone music/SFX tool here. Use a licensed library track, or rely on a video model that emits its own audio. Added in the edit. |
| 7 | Assemble | editor (CapCut / Premiere / Resolve) **or** `kling3_0` multi-shot | Cut beats, add text overlays + captions + music. This is where the words go on. |
| 8 | Reframe | `reframe` | One master → `9:16`, `1:1`, `16:9`. X autoplays 1:1 largest in-feed; 9:16 is the "shorts" master. |
| 9 | Upscale | `upscale_video` (`topaz` 2160p, or `bytedance` 4k) | Final polish. |
| 10 | **Score the cut** | `virality_predictor` (`action:'create'`) | Hook strength / retention risk *before* posting. Re-cut a weak first 3s; re-test. |
| 11 | Ship + caption | X | Use the copy template (§5). Log result in §7. |

Turnkey alternative for volume: `show_marketing_studio` ingests `clauderizer.com` as a
**webproduct** and auto-builds a DTC ad (TV Spot / Hyper Motion / Wild Card / UGC presets).
Lower craft ceiling, but fast — good for filling the calendar between hero pieces. Requires
the Brand Kit (below) to be `status:completed`.

### Brand Kit (the on-brand autopilot)
A Higgsfield **Brand Kit** for `clauderizer.com` is fetched once (`show_marketing_studio
action:'fetch' type:'brand_kit'`). Once complete it injects logo/colors/tone into Marketing
Studio renders automatically. Locks brand consistency for the turnkey path.

### Surfacing renders to rafa (the display channel)
`SendUserFile` **can't show these**: it rejects the repo's `\\wsl.localhost` UNC paths, and
even delivered from a local `C:\…\Temp` copy the client only renders un-previewable PNG
*chips* ("I can't see those pictures"). Inlining base64 into a `show_widget` is also a dead
end — base64 tokenizes at ~1 token/char, so a 48 KB JPEG ≈ 60k tokens and blows the context
window. **The reliable channel is Higgsfield's own viewer** (same place generations appear):

1. Composite locally with `ffmpeg`. For a multi-asset proof, **tile everything into ONE image**
   (a montage) — one blob is far cheaper than N images, and cost scales with pixels, not count.
2. `media_upload` (`filename` + `content_type`) → presigned `upload_url` + `media_id`.
3. `curl -X PUT -H "Content-Type: image/jpeg" --data-binary @file '<upload_url>'` — bytes go
   straight to S3, **never through context**. The signed URL *requires* the matching
   `Content-Type` header (`SignedHeaders=content-type;host`) or it 403s.
4. `media_confirm` (`type:image`, `media_id`).
5. `show_medias` (`type:image`) renders it inline in the Higgsfield panel; the returned
   CloudFront `url` is a permanent shareable link — hand it over as a fallback.

`job_display` is for generation `job_id`s only, **not** uploads — don't reach for it here. The
10 logo-stamped cards live tiled at image media `76b13723-8136-421f-9e1b-096066826df7` (4:3) and
`fc338898-abf0-4677-8c7a-0eff598006db` (16:9, the animation start-frame) for reuse.

---

## 3. Concept bank

### A — "The Amnesiac Genius" (cinematic brand film, ~15–20s)
Human-first metaphor, no UI, **no sci-fi lattices**. Cold scattered loose pages (forgetting)
→ organize into labeled folders, open books, and a *mind made of documents* connected by
warm amber threads (a living index). Line lands: *"Your coding agent is brilliant, and
amnesiac."* → *"Not a neural net you can't read — a memory you can."* → *"Plans, decisions,
a dependency graph. As Markdown."* → ⊙ logo + install pill. Model: `soul_cinematic` /
`cinematic_studio_2_5`. The spectacle *is* organized documentation — which is the product.

### B — "Same agent, same repo. One of them remembers." (split-screen demo, ~20–25s)
Two terminals. Cold one: re-explains the architecture, *"wait… did we already build this?"*,
plan drifts. Warm one: greeted by the digest — *"phase 4 of 10, preflight passed, building."*
Tension → resolution. Highest dev conversion because it shows the product. Terminal text is
**overlaid in the edit**, not generated. Model: `cinematic_studio_2_5` (scene) + overlays.

### C — "POV: 2am" (meme / UGC, ~10–15s)
*"POV: you've explained the architecture to your agent for the 4th time today."* Tired dev in
monitor glow → cut to the digest greeting them oriented → relief. Native, shareable, cheap.
Model: `soul_2` (realistic human) + caption overlays.

### Hook seeds for future shorts
- "Conventions rot because nothing executes them." (decisions-log-that-dies → live tool calls)
- "Your context window just overflowed. Watch it contradict itself." (the long-session wall)
- "Memory that ships in your git diff." (Markdown-in-repo angle, reviewer sees it in a PR)
- "One install. Eleven agents." (host-portability: Claude Code, Cursor, Copilot, Codex…)
- "It built this very site by remembering how." (dogfooding / phase 4 of 10 meta-angle)

### Series map (messaging pillar → concept → asset)
A content calendar, not a pile of clips. One visual system, many arguments.
| Pillar | Concept / clip | Asset (job id) |
|---|---|---|
| The feeling: amnesia → memory | Brand film — desk-brain, lattice-build, head-of-docs | `a6a4b892` · `307bf270` · `a2a399ba` |
| Same agent, one remembers | CRT split-screen | `3d582c5a` |
| Relatable pain (POV) | 2am frustration push-in | `d5c58dc8` |
| Why not just conventions | "Conventions rot" | `58412b6f` (still) |
| Works with every agent | "One install, every agent" (host-portability) | `d07556f8` (still) |
| The long-session wall | "Context overflow" | `0fd439fa` (still) |
| The payoff: momentum | "Start oriented, not blank" | `272d6abe` (still) |

---

## 4. Model cheat-sheet
| Job | Model ID | Why |
|---|---|---|
| Cinematic concept art (graphs, metaphor) | `soul_cinematic` | Cinema-grade stills + concept art. |
| Cinematic stills, up to 4K | `cinematic_studio_2_5` | High-res hero frames. |
| Realistic human / UGC / character | `soul_2` | The "2am dev," talking-head, avatars. |
| Brand cards, icons, legible text, palette-locked | `recraft-v4-1` | Takes explicit `colors` hex array + `background_color`. |
| Legible data cards (digest, stats, end card) | `gpt_image_2` | Best text rendering — spells exact strings. The in-MCP "injected data scene" engine. Proven: digest `8963ba71`, stats `1f491263`. |
| Hero motion (video) | `seedance_2_0` | **Preferred.** Up to 15s, 9:16, 4K (`mode:std`), optional native audio. |
| Image → video (multi-shot, can carry audio) | `kling3_0` | Hero motion. |
| Image → video (fast, single start frame) | `kling3_0_turbo` | Quick animations. |
| Reframe / upscale / virality | `reframe` / `upscale_video` / `virality_predictor` | Finishing + QA. |

Always pass brand hexes (`#0b0d12`, `#f59e0b`, `#ffb454`) in the prompt; on `recraft-v4-1`
pass them in the `colors` param to *enforce* the palette.

**`seedance_2_0` image-to-video defaults bite:** leave params unset and it picks `3:4` +
`720p` + `generate_audio:true`. For a wide source (e.g. the card montage) that `3:4` crop eats
your outer columns — **pre-pad the still to the target ratio (void `#0b0d12` bars) and pin
`aspect_ratio` + `resolution` explicitly.** Always `get_cost:true` first; it echoes the exact
defaults it *would* use so you catch the crop before spending credits.

**Data-card animation = local motion-graphics, NOT AI video.** Seedance *fictionalizes* a data
card — invents UI chrome and garbles the copy into gibberish, even on frame 1 — because diffusion
treats the still as *inspiration*, not ground truth. So the rule: **AI video for things that should
look imagined (humans, brain-of-folders, lattice, B-roll); ffmpeg for things that must stay true
(cards, digests, diffs).** The reusable **type-on engine** is `marketing/tools/typeon.sh`
(`bash marketing/tools/typeon.sh "recall stripe …"`): binarized row-profile detects each text
line's band + L/R extent → a **per-line local-bg-sampled cover** is swept off left-to-right,
stepped ~per character, with a blinking ⊙-amber cursor → drift-free push-in → lands on the full
crisp card. 9:16, 5 s, **0 credits, pixel-perfect** (it composites the real PNG, never regenerates).
The 10-card set is built + in Higgsfield media. ffmpeg gotchas baked in: `crop` has **no
`eval=frame`** in our build (animate the reveal with a moving `overlay` `x` instead); `zoompan`
drifts clip duration (push-in via `scale(eval=frame)` + a centered `crop`); `ffprobe` emits CRLF on
Windows (strip `\r`); make covers **gap-to-gap tall** or descenders/`·` peek as orange dots; sample
bg **per line** (a global void sample paints rectangles inside panel cards); narrow top element
(the logo) is auto-skipped so it stays persistent.

**Assembly stack (30–45s films):** our MCP generates the *beats* (`seedance_2_0`), *data cards*
(`gpt_image_2`) and *voiceover* (`generate_audio` TTS). **Vibe Motion** (web) animates data /
infographic / text scenes from those cards. **Cinema Studio** (web) assembles the multi-shot
timeline. So: MCP makes the parts → Vibe Motion animates data → Cinema Studio cuts the film.

---

## 5. X copy templates

**Hook tweet (video attached), pick a punch:**
- *Your AI coding agent is brilliant. It also forgets everything you decided an hour ago.*
- *POV: you've explained your architecture to Cursor for the 4th time today.*
- *Same agent. Same repo. One of them remembers. (sound on 🔊)*
- *Most "AI memory" is a black box. Clauderizer's is Markdown you can read in your own PR.*

**Body / reply with substance:**
> Clauderizer gives coding agents durable, cross-session memory — plans, decisions, and a
> dependency graph as plain, Git-diffable Markdown it reads and writes through real MCP tool
> calls. Not a rules file it forgets to read. A system.
>
> Free, Apache 2.0, works with Claude Code / Cursor / Copilot / Codex / Gemini + more.

**CTA reply:** `uvx --from clauderizer clauderize init` → ⭐ github.com/collincusce/Clauderizer

Rules: hook in first 2s of the video AND the first line of the tweet. One CTA. Reply-thread
the install command (don't put a link in the main tweet if testing reach).

---

## 6. Cadence

- **Target:** 1 hero short + 1–2 turnkey/meme shorts per week.
- **Keep a 3-deep backlog** of approved stills so there's always something to animate.
- **Optional automation:** a scheduled cloud agent (weekly) that drafts the next concept from
  the bank, pre-generates keyframes, and posts them here for approval Monday AM. *Not yet
  wired — confirm cadence + per-run budget before enabling.*

---

## 7. Visual asset bank + production log

Confirmed direction (2026-06-25): **human-first documentation metaphor**, not the sci-fi
node-lattice cliché. Cold→warm arc throughout. The "loved" concepts below are the reusable
**bank** — each future short pulls beats from it.

**Beat library — all Seedance 2.0, 1080p, 9:16 (canonical). kling3_0 versions superseded.**
| Beat | Still | Seedance 2.0 clip | (kling, superseded) |
|---|---|---|---|
| CRT split-screen (retro) | `a31b52af` | `bd7657eb` | `3d582c5a` |
| Desk-brain connecting files | `64302d87` | `cc9b1532` ✅ | `a6a4b892` |
| Human POV — 2am frustration | `3fc6b5c1` | `a9e356cf` | `d5c58dc8` |
| Lattice build (one node → many) | `105eaa90` | `73a18018` | `307bf270` |
| Context overflow | `0fd439fa` | `d027e19f` ✅ | — |
| One install, every agent | `d07556f8` | `47ca69c5` ✅ | — |
| Conventions rot | `58412b6f` | `ec644190` ✅ | — |
| Head-of-documents | `a2a399ba` | `2aac9b1e` ✅ | — |

**Data cards (legible, `gpt_image_2`):** digest `8963ba71` · git-diff `bf129681` · end card `529d4f57` · stats `1f491263` (bank-only, benefit rule).
Animate in Vibe Motion, or hold with a push-in in Cinema Studio.

**Still bank (future shorts / beats):**
- Head-made-of-documents (hero/poster): `a2a399ba`
- Living archive / mind-palace (opening beat): `1b2e9034`
- Fragments → igniting core (alt brand-film): `90bbd026`
- Golden-lattice macro (B-roll texture): `6308c094`
- Modern split-screen panels (B alt): `d36934f2`

**Next:** assemble → VO (`generate_audio`, TTS) + captions + music in edit → `reframe` to
1:1 / 16:9 → `upscale_video` → `virality_predictor` → post with §5 copy.

| Date | Batch | Notes |
|---|---|---|
| 2026-06-25 | v1 stills + first motion | 6 concept stills → human-first A re-roll → 3 motion clips. Higgsfield Ultra, ~8.9k credits; ~10 cr / 5s clip. |
| 2026-06-25 | Seedance standardize | Re-rendered all 6 beats on `seedance_2_0` @1080p (kling superseded). gpt_image_2 data cards proven legible. |

---

## 8. Flagship cut sheet — 45s ("Brilliant, and amnesiac")
**Benefit-first: every line is what Clauderizer does _for the user_, never system specs.**
Assemble in Cinema Studio. All beats Seedance 2.0 / 1080p / 9:16. Music = trending/ambient in edit.

| # | In–Out | Beat (clip job) | On-screen text | Voiceover |
|---|---|---|---|---|
| 1 | 0–4 | Human 2am `a9e356cf` | "You've explained your architecture 4× today." | "It's 2am — you've explained your codebase to your agent for the fourth time today." |
| 2 | 4–8 | Overflow `d027e19f` | "It forgot. Again." | "Because the moment a session ends, it forgets everything you decided." |
| 3 | 8–12 | Conventions-rot `ec644190` | "Your docs? It never reads them." | "Your notes, your decisions log — it never reads them." |
| 4 | 12–16 | CRT split `bd7657eb` | "What if it just remembered?" | "What if it just… remembered?" |
| 5 | 16–20 | Desk-brain `cc9b1532` | "Clauderizer remembers — for you." | "Clauderizer remembers your plans and decisions for you." |
| 6 | 20–24 | Digest card `8963ba71` | "Pick up where you left off." | "So every session, it picks up exactly where you left off." |
| 7 | 24–28 | Head-of-docs `2aac9b1e` | "No re-explaining. No contradictions." | "No more re-explaining. No more contradicting itself an hour later." |
| 8 | 28–32 | Git-diff card `bf129681` | "You can read every bit of it." | "It's all plain Markdown — you read and review every decision." |
| 9 | 32–36 | Lattice `73a18018` | "Your whole project, connected." | "Your whole project stays connected, so nothing gets lost." |
| 10 | 36–40 | Hosts `47ca69c5` | "Works with your agent." | "Works with whatever coding agent you already use." |
| 11 | 40–45 | End card `529d4f57` | logo · install · clauderizer.com | "Give your agent a memory. Stop repeating yourself." |

30s variant: drop segs 3, 8, 9 and tighten holds. **Spec/stats cards (e.g. `1f491263`) are
bank-only — NEVER in the cut.** Nobody cares about 38 tools / 0 deps; they care what it does
for them. Talk pain → outcome.

## 9. X launch post (benefit-first)
- **Tweet (video):** *Your AI coding agent forgets everything you decided the moment the session ends. So you explain your architecture. Again. And again. I fixed that. 🧵 (sound on)*
- **↳ reply:** *Clauderizer gives your coding agent a memory that survives — it remembers your plans and decisions, picks up exactly where you left off, and stops contradicting itself. So you stop repeating yourself.*
- **↳ reply:** *Works with Claude Code, Cursor, Copilot, Codex, Gemini + more. Free.* `uvx --from clauderizer clauderize init` ⭐ github.com/collincusce/Clauderizer

---

## 10. "A real session" workflow piece (~36s — built from genuine Clauderizer I/O)
The dev-credibility companion to the metaphor film: the exact UX a user lives, cut from real
artifacts (digest, recall, tool calls, cascade, handoff). Splittable into a 3-part micro-series.

**Real-artifact card bank** (all `gpt_image_2`, legible, brand-styled):
digest `8963ba71` · user-prompt `64faf6fe` · preflight `c4968344` · recall `fcec82c9` ·
decision `f3631786` (Stripe) · cascade report `1d50152b` · handoff `fdbd4fc0` ·
DECISIONS.md doc `815c9bba` · file-tree `960d1448` · git-diff `bf129681` · loop `0d975bfa` · end `529d4f57`.
Cascade-ripple beat (Seedance): `1c77c03c`.

| # | In–Out | Beat | On-screen / VO (UX → benefit) |
|---|---|---|---|
| 1 | 0–4 | digest `8963ba71` | "Open your editor — it already knows where you left off." |
| 2 | 4–8 | user-prompt `64faf6fe` | "You don't re-brief it. You just say what you want." |
| 3 | 8–11 | preflight `c4968344` | "It checks your tests pass — before it builds." |
| 4 | 11–15 | recall `fcec82c9` | "Mid-task it surfaces the decisions that matter." |
| 5 | 15–19 | decision `f3631786` | "Every choice captured — with the why." |
| 6 | 19–24 | cascade ripple `1c77c03c` + report `1d50152b` | "Change one thing? It flags everything downstream." |
| 7 | 24–28 | handoff `fdbd4fc0` | "It hands off to itself — tomorrow picks up right here." |
| 8 | 28–32 | doc `815c9bba` / file-tree `960d1448` | "And it's all plain Markdown you own." |
| 9 | 32–36 | end card `529d4f57` | "Your agent, with a memory. → clauderizer.com" |

Micro-series split: ① wakes-up-oriented = beats 1–3 · ② remembers-&-protects = 4–6 · ③ never-loses-the-thread = 7–9.

**Built (2026-06-26):** every data-card beat now exists as a **type-on clip** (local `marketing/tools/typeon.sh`, 9:16 / 5 s, in Higgsfield media) — user-prompt `e8240868` · recall `7a802345` · preflight `cd88c992` · decision/Stripe `8a7bc362` · cascade-report `7d4a35e5` · handoff `aa74fedd` · file-tree `63c086bb` · doc `fdce4bf6` · git-diff `191c3774` · loop `50da11be`. First assembly = a **33 s data-card spine** (8 beats, hard cuts, silent): media `676dd853`. **Full ~38 s cut built (2026-06-26):** 2am human hook (`a9e356cf`) → user-prompt → recall → preflight → decision → cascade-ripple beat (`1c77c03c`) → cascade-report → handoff → file-tree → end-card CTA (`529d4f57`) — media **`1ac7dbda`** (silent, hard cuts, 9:16). Remaining to ship: VO (`generate_audio` TTS) + music bed + captions, `reframe` to 1:1/16:9, `virality_predictor`. Assembly recipe: ffmpeg `concat` filter over the type-on clips + downloaded beats (normalize each to 1080×1920 / 30 fps / `setsar=1`, trim with per-input `-t`, animate the still end-card with `scale(eval=frame)` push-in); or import the media IDs into Cinema Studio.
