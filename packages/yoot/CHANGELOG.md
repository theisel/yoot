# @yoot/yoot

## 0.2.0

### Minor Changes

- 256e6ae: Enabled `allowImportingTsExtensions: true` in `tsconfig.base.json` and updated all relevant imports in the packages directory to ensure consistent compatibility across environments.
- 256e6ae: Added `deno.ns`, `dom`, and `esnext` to `compilerOptions.lib` in `deno.json` for all packages to fix Deno type errors and ensure compatibility.

## 0.1.1

### Patch Changes

- 28a2b56: Adds explicit return type to public API.

  - Fixes JSR error "missing-explicit-return-type".
  - Updates API report.
