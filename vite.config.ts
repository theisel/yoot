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
    setupFiles: [path.resolve(__dirname, 'vitest.setup.ts')],
    /** @ts-expect-error The `projects` field in Vitest is not yet part of the Vite type definitions. */
    projects: [
      path.resolve(__dirname, 'packages/yoot/vitest.config.ts'),
      path.resolve(__dirname, 'packages/adapters/cloudinary/vitest.config.ts'),
      path.resolve(__dirname, 'packages/adapters/imgix/vitest.config.ts'),
      path.resolve(__dirname, 'packages/adapters/sanity/vitest.config.ts'),
      path.resolve(__dirname, 'packages/adapters/shopify/vitest.config.ts'),
    ],
    coverage: {
      include: ['packages/**/src'],
      exclude: [
        '**/*.d.ts',
        '**/index.ts',
        '**/types.ts',
        '**/api-extractor.ts',
        '**/register.ts',
        'packages/test-kit',
      ],
    },
  },
  chaiConfig: {
    truncateThreshold: 0,
  },
});
