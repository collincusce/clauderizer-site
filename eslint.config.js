import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

// ESLint 10 flat config. typescript-eslint's config() helper composes the
// recommended sets; eslint-plugin-astro adds the .astro-aware rules.
export default tseslint.config(
  { ignores: ['dist/', '.astro/', 'node_modules/', 'infra/', 'docs/'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
);
