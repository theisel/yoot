#!/usr/bin/env zx

// Clean the docs/packages directory
echo('Cleaning up docs/packages directory...');
await $`rimraf ./docs/packages`;
