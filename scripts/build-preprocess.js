#!/usr/bin/env node
import 'zx/globals';

// Clean the docs/packages directory
echo('Cleaning up docs/packages directory...');
await $`rimraf ./docs/packages`;
