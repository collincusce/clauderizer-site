# Deploy runbook — Clauderizer site infra

> **Status: gated.** `cdk synth` is clean and the stack is complete, but a deploy
> is blocked on **O-01** (least-privilege deploy permissions in account
> `063337706623`) and **O-02** (the real Route 53 hosted-zone IDs). Do not deploy
> until both are resolved. This stack is **us-east-1** (INVARIANT-05: CloudFront's
> ACM cert must be there).

## What this stack creates

- A private S3 bucket `clauderizer-site-063337706623` (no public access, SSE-S3, TLS-enforced, versioned), served **only** through CloudFront via Origin Access Control.
- One ACM certificate (us-east-1) for all 10 names: `clauderizer.{com,co,io,net,org}` + their `www`.
- One CloudFront distribution holding all 10 names + a viewer-request **CloudFront Function** that serves `clauderizer.com` and `301`-redirects every other host to it.
- Route 53 `A`/`AAAA` alias records (apex + www) in each of the 5 hosted zones.
- Cost tag `project=clauderizer-site` on every resource.

## Pre-deploy prerequisites

1. **O-02 — real hosted-zone IDs.** Replace the `zoneIds` placeholders in `cdk.json`
   with the real `Z…` ids (one per TLD). With deploy perms:
   ```bash
   aws route53 list-hosted-zones --profile clauderizer \
     --query "HostedZones[?contains(Name,'clauderizer')].[Name,Id]" --output text
   ```
2. **O-01 — deploy identity.** A role/user in `063337706623` with: Route53
   change-record on the 5 zones, S3 (bucket + object), CloudFront (distribution +
   invalidation), ACM (request/describe), CloudFormation. Prefer the GitHub→AWS
   **OIDC** role (Phase 8) or a local least-privilege named profile — **never static
   keys** (INVARIANT-02). All AWS calls use `--profile clauderizer` → must resolve to
   `063337706623` (INVARIANT-01):
   ```bash
   aws sts get-caller-identity --profile clauderizer   # expect Account = 063337706623
   ```

## Deploy

```bash
cd infra/cdk
npm ci
npx cdk bootstrap aws://063337706623/us-east-1 --profile clauderizer   # once per account/region
npx cdk diff   --profile clauderizer
npx cdk deploy --profile clauderizer --outputs-file cdk-outputs.json
```

ACM DNS validation + Route53 record creation happen during deploy (the cert
validates against the 5 zones). First deploy can take 5–30 min while the cert issues.

## Publish content + invalidate

```bash
# from repo root — build with Node 24 (Astro 7)
npm run build
BUCKET=$(jq -r '.ClauderizerSiteStack.BucketName' infra/cdk/cdk-outputs.json)
DIST=$(jq -r '.ClauderizerSiteStack.DistributionId' infra/cdk/cdk-outputs.json)
aws s3 sync dist/ "s3://$BUCKET/" --delete --profile clauderizer
aws cloudfront create-invalidation --distribution-id "$DIST" --paths '/*' --profile clauderizer
```

## Verify

```bash
for d in com co io net org; do
  echo "https://clauderizer.$d"; curl -sI "https://clauderizer.$d" | head -1
  echo "https://www.clauderizer.$d"; curl -sI "https://www.clauderizer.$d" | head -1
done
# expect clauderizer.com -> 200; every other host -> 301 to https://clauderizer.com
```

(Phase 8 automates build → S3 sync → invalidation via GitHub OIDC; this runbook is
the manual equivalent and the break-glass path.)
