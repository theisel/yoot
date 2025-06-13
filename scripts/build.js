#!/usr/bin/env node
import 'zx/globals';

// Run pre-processing script for the build
echo('Running pre-processing script for the build...');
await $`zx ./scripts/build-preprocess.js`;
// Build the core library
echo('Building the core library...');
await $`pnpm --filter @yoot/yoot build`;
// Build all adapter libraries in parallel
echo('Building all adapter libraries in parallel...');
await $`pnpm --filter './packages/adapters/**' --parallel -r build`;
// Run post-processing script for the build
echo('Running post-processing script for the build...');
await $`zx ./scripts/build-postprocess.js`;
