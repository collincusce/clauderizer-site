# Vision

## What & Why

The marketing site for **Clauderizer** — durable, cross-session working memory for
coding agents. It exists to make a visitor instantly *get* the "brilliant but
amnesiac agent" problem and want to clauderize their next repo. It's a fast,
static, motion-rich single page deployed to the project owner's own AWS, fronted
by a signature "living memory-graph" hero and a live SessionStart-terminal demo.

It dogfoods Clauderizer end to end: this very gameplan planned, tracked, and
shipped the site through the `cz_*` tools — the same "built by dogfooding itself"
story the product tells.

## Differentiation

Most dev-tool sites are abstract. This one *shows the product working*: a WebGL
dependency-graph hero whose nodes map to real Clauderizer entities (phases,
decisions, invariants, subsystems), and a terminal that types this site's own
SessionStart digest and ticks its real phases. Concrete and product-true over
decorative. Every motion flourish degrades to finished static content
(INVARIANT-03), so the spectacle never costs accessibility.

## Scope Boundaries

Not a docs site or web app — a single marketing page (plus a 404). No backend, no
email capture, no PII collection; CTAs are outbound (GitHub, PyPI). Product
documentation lives in the Clauderizer repo, not here. Repo visibility is public
by design; it carries no secrets or PII (INVARIANT-07).
