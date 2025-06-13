#!/usr/bin/env node
import 'zx/globals';

// Run the post-processing script for the documentation
echo('Running post-processing script for the documentation...');
await $`node ./scripts/docs-postprocess.js`;
// Format generated documentation files
echo('Formatting generated documentation files with Prettier...');
await $`npx prettier --write ./docs **/etc/*.api.md`;
