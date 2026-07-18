# Creative Brief: Clauderizer Site Redesign

## North Star

Turn the site from a feature walkthrough into a **short film about creative momentum**. The visitor should feel the ache of losing work to an amnesiac agent, then the relief of an agent that remembers — and want that for themselves.

## Story Arc (single-scroll)

1. **Hook / Hero** — "Your best ideas are dying in the dark."
   - Full-bleed cinematic video background (hero_video.mp4).
   - Large, editorial headline. The agent is brilliant; the forgetting is the villain.
   - Primary CTA: install command + GitHub star.

2. **The Failure Mode** — "Long-running AI work hits two walls."
   - Personal, emotional cards: the blank session, the overflowing context.
   - Backdrop: seedream21.png with a deep scrim.

3. **The Transformation** — "Same agent, same repo. One of them remembers."
   - Before/after ledger using bf0-2.png as a visual beat.
   - Without: grey, muted, forgetful. With: warm, alive, momentum.

4. **How It Works** — "Your memory is just readable files in docs/."
   - Re-frame the Markdown engine as durability, not plumbing.
   - Backdrop: flux2.png.

5. **Session Demo** — "This is what momentum feels like."
   - Keep the terminal demo, but make it the emotional payoff.

6. **Features** — "A system, not a hope."
   - Cleaner, bolder feature cards with stronger icons.

7. **Receipts** — "Stable, with receipts."
   - Large stats, trust signals.

8. **Quickstart** — "Three steps. Then just drive."
   - Keep the install steps, polish the presentation.

9. **Vocabulary + FAQ + CTA** — confident, premium closing.
   - CTA uses buildup.mp4 or a warm glow.

## Visual Direction

- **Palette**: keep deep ink base, push amber to a richer "memory gold," add a subtle rose/clay warmth for emotional moments.
- **Typography**: larger display type (clamp 3rem–7rem for hero), tighter line-height, editorial confidence.
- **Imagery**: full-bleed cinematic stills/videos with gradient scrims; no tiny inline images.
- **Motion**: slow, film-like. No jarring animations. Scroll-driven reveals, parallax backdrops, subtle hover lifts.
- **Reduced motion**: static posters and no-scroll reveals.

## Asset Map

| Section | Asset | Usage |
|---------|-------|-------|
| Hero | `hero_video.mp4` + `poster.jpg` | full-bleed loop, reduced-motion fallback |
| Problem | `seedream21.png` | backdrop scrim |
| Transformation | `bf0.png`, `bf1.png`, `bf2.png` | before/after micro-sequence |
| How it works | `flux2.png` | backdrop scrim |
| Features / Receipts | `soul_v2.png` or `soul_v2b.png` | backdrop texture |
| CTA | `buildup.mp4` | ambient loop or glow substitute |

## Scope

- Single-page redesign (`src/pages/index.astro`).
- No new pages; nav anchors remain in-page.
- Keep Astro, GSAP, Three.js, CSS scroll-driven animations.
- All existing invariants hold (motion fallbacks, Lighthouse >=95, no secrets).

## Success

A visitor scrolling the page should feel a narrative, not read a spec sheet.
