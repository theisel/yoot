import path from 'node:path';
import {defineConfig} from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@yoot/yoot': path.resolve(__dirname, 'packages/yoot/src'),
      '@yoot/yoot/internal': path.resolve(__dirname, 'packages/yoot/src/internal'),
    },
  },
  build: {
    target: 'ES2020',
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: {},
      formats: ['es'],
    },
    rollupOptions: {
      preserveEntrySignatures: 'exports-only',
      external: (id) => /^@yoot\/yoot(\/.*)?$/.test(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  test: {
    include: ['**/*.test.ts'],
    exclude: ['node_modules', '**/tests/bun/**', '**/tests/deno/**'],
    setupFiles: [path.resolve(__dirname, 'vitest.setup.ts')],
    chaiConfig: {
      truncateThreshold: 0,
    },
    coverage: {
      include: ['packages/**/src'],
      exclude: ['**/*.d.ts', '**/index.ts', '**/api-extractor.ts', '**/register.ts', 'packages/test-kit'],
    },
  },
});
