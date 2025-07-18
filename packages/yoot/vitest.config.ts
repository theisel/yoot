import {mergeConfig} from 'vitest/config';
import viteConfig from './vite.config';
import {defineConfig} from 'vite';

const isSmokeTest = 'smoke' == process.env.TEST_SUITE?.toLowerCase();

const mergedConfig = mergeConfig(viteConfig, {
  test: {
    include: isSmokeTest ? ['tests/**/smoke.test.ts'] : ['tests/**/*.test.ts'],
    exclude: isSmokeTest ? [] : ['tests/**/smoke.test.ts'],
  },
});

export default defineConfig({
  ...mergedConfig,
  test: {
    ...mergedConfig.test,
    // Remove to avoid circularity
    projects: undefined,
  },
});
