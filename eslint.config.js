import globals from 'globals';
import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';

export default defineConfig([
  {ignores: ['**/.astro/**', '**/.wrangler/**', '**/dist/**', '**/coverage/**']},
  {files: ['**/*.ts'], languageOptions: {globals: {...globals.browser, ...globals.node}}},
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(_$|__)',
          argsIgnorePattern: '^(_$|__)',
        },
      ],
    },
  },
]);
