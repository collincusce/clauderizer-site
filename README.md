# clauderizer.com

The cinematic marketing site for **[Clauderizer](https://github.com/collincusce/Clauderizer)** —
a memory system for coding agents: stop re-explaining your project to your AI.

Built with [Astro](https://astro.build), deployed to AWS (S3 + CloudFront + Route 53 via CDK).
It dogfoods Clauderizer: the entire build is planned and tracked in
[`docs/gameplans/`](docs/gameplans/) through Clauderizer's own tools.

## Develop

```bash
nvm use            # node 24 (Astro 7 needs >=22.12; see .nvmrc)
npm install
npm run dev        # http://localhost:4321
```

## Scripts

| Command           | Does                                                     |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Start the dev server                                     |
| `npm run build`   | Type-check (`astro check`) + production build to `dist/` |
| `npm run preview` | Preview the production build locally                     |
| `npm run lint`    | ESLint (flat config)                                     |
| `npm run format`  | Prettier write                                           |

## Stack

- **Astro** (static, MDX, islands) — near-zero JS by default for a fast, SEO-strong site
- **AWS S3 + CloudFront + Route 53** via **AWS CDK** (TypeScript) — `infra/` (lands in Phase 7)
- **GitHub Actions + OIDC** for CI/CD with no static AWS keys (Phase 8)

## Working memory

This repo carries its own durable memory under [`docs/`](docs/) — the gameplan, decisions,
invariants, and a dependency graph — maintained by
[Clauderizer](https://github.com/collincusce/Clauderizer). Where things stand lives in
[`docs/gameplans/2026-06-22-marketing-site-launch/GAMEPLAN.md`](docs/gameplans/2026-06-22-marketing-site-launch/GAMEPLAN.md).

## License

MIT
