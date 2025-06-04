# @yoot/shopify

## 0.2.0

### Minor Changes

- 256e6ae: Enabled `allowImportingTsExtensions: true` in `tsconfig.base.json` and updated all relevant imports in the packages directory to ensure consistent compatibility across environments.
- 33e99f6: Fixes missing `@yoot/yoot` import in adapter packages' `deno.json` files.
- 256e6ae: Added `deno.ns`, `dom`, and `esnext` to `compilerOptions.lib` in `deno.json` for all packages to fix Deno type errors and ensure compatibility.
- 33e99f6: Moved `@yoot/yoot` from `peerDependencies` to `dependencies` in package.json.

### Patch Changes

- Updated dependencies [256e6ae]
- Updated dependencies [256e6ae]
  - @yoot/yoot@0.2.0

## 0.1.1

### Patch Changes

- 28a2b56: Adds explicit return type to public API.

  - Fixes JSR error "missing-explicit-return-type".
  - Updates API report.

- Updated dependencies [28a2b56]
  - @yoot/yoot@0.1.1
