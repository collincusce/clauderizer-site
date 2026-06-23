#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SiteStack } from '../lib/site-stack';

const app = new cdk.App();

const account = app.node.tryGetContext('account') as string;
// CloudFront's ACM cert must live in us-east-1 (INVARIANT-05), so the whole
// stack is pinned there. Account is fixed to 063337706623 (INVARIANT-01).
const region = (app.node.tryGetContext('region') as string) || 'us-east-1';

new SiteStack(app, 'ClauderizerSiteStack', {
  env: { account, region },
  description:
    'Clauderizer marketing site — private S3 (OAC) + CloudFront + ACM + Route53 across 5 TLDs; www + non-canonical TLDs 301 -> clauderizer.com.',
  tags: { project: 'clauderizer-site' },
});

app.synth();
