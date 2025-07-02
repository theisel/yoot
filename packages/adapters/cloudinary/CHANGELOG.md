# @yoot/cloudinary

## 0.3.5

### Patch Changes

- Updated dependencies [d08f71f]
  - @yoot/yoot@0.5.1

## 0.3.4

### Patch Changes

- Updated dependencies [93fdbc9]
- Updated dependencies [93fdbc9]
- Updated dependencies [93fdbc9]
- Updated dependencies [93fdbc9]
- Updated dependencies [93fdbc9]
  - @yoot/yoot@0.5.0

## 0.3.3

### Patch Changes

- Updated dependencies [67ecce0]
  - @yoot/yoot@0.4.3

## 0.3.2

### Patch Changes

- Updated dependencies [11a8382]
  - @yoot/yoot@0.4.2

## 0.3.1

### Patch Changes

- Updated dependencies [d93e38b]
- Updated dependencies [d93e38b]
  - @yoot/yoot@0.4.1

## 0.3.0

### Minor Changes

- a5d3d8b: Adds `baseUrl` getter to `Yoot` object, returning the normalized base URL or null when `src` is empty.
  Adapters now implement the `normalizeUrl` handler to perform this conversion.

### Patch Changes

- Updated dependencies [a5d3d8b]
- Updated dependencies [a5d3d8b]
- Updated dependencies [a5d3d8b]
  - @yoot/yoot@0.4.0

## 0.2.2

### Patch Changes

- 60b87d5: Added ISC license to `deno.json` files for public packages.
- d2d76fa: **Internal:** Replaces deprecated `createAdapter` with `defineAdapter`.
- Updated dependencies [d2d76fa]
- Updated dependencies [60b87d5]
- Updated dependencies [d2d76fa]
  - @yoot/yoot@0.3.0

## 0.2.1

### Patch Changes

- 1bb1601: Applied module-level JSDoc annotations across all public packages for better clarity and JSR compatibility.
- Updated dependencies [1bb1601]
  - @yoot/yoot@0.2.1

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
