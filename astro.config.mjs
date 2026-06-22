// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Canonical origin is clauderizer.com; the other TLDs + www 301-redirect here (D-004).
// Static output (default) -> deployed to a private S3 bucket behind CloudFront (D-001).
export default defineConfig({
  site: 'https://clauderizer.com',
  integrations: [mdx(), sitemap()],
  prefetch: true,
});
