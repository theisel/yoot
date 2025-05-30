import {defineWorkspace} from 'vitest/config';

export default defineWorkspace([
  './packages/yoot/vite.config.ts',
  './packages/adapters/sanity/vite.config.ts',
  './packages/adapters/shopify/vite.config.ts',
  './packages/adapters/imgix/vite.config.ts',
  './packages/adapters/cloudinary/vite.config.ts',
]);
