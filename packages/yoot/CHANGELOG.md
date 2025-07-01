# @yoot/yoot

## 0.5.0

### Minor Changes

- 93fdbc9: Adds the `toResolvedJSON` method, which returns a fully resolved state object where the directives are computed and normalized.
- 93fdbc9: **BREAKING CHANGE:** The behavior of the `.toJSON()` method has changed.

  `.toJSON()` now returns a raw copy of the object's state and ignores any previous normalized directives.

  **Migration:** Use `.toResolvedJSON()` to get fully resolved and normalized state.

### Patch Changes

- 93fdbc9: Aligns the `YootInput` type with runtime logic, which already supports `null` and `undefined` values.
- 93fdbc9: Corrects the `style` attribute typing to accurately reflect its runtime transformation from an object to a string.
- 93fdbc9: Corrects attributes returned by `getSourceAttrs` helper:

  - The `width` and `height` attributes now reflect the final transformed dimensions instead of the original.
  - The `type` attribute is no longer being set when `format` directive is `auto`.

## 0.4.3

### Patch Changes

- 67ecce0: Skips applying the `dpr` directive in `buildSrcSet` for density `1` to avoid generating redundant URLs.

## 0.4.2

### Patch Changes

- 11a8382: Relaxes `YootInput` type to accept generic object shapes (`Record<string, unknown>`).

## 0.4.1

### Patch Changes

- d93e38b: Ensures `.map()` returns a new immutable Yoot object to prevent unintended mutations.
- d93e38b: Ensures `buildSrcSet` updates the `height` directive using aspect ratio when the directive is defined.

## 0.4.0

### Minor Changes

- a5d3d8b: Adds `baseUrl` getter to `Yoot` object, returning the normalized base URL or null when `src` is empty.
  Adapters now implement the `normalizeUrl` handler to perform this conversion.
- a5d3d8b: Adds `hasSrc` getter to `Yoot` object, returns true if `src` has been given.

### Patch Changes

- a5d3d8b: Enhances `Yoot` object by validating `.src()` to accept only valid URL strings.
  Use `.map()` to unset `src`. Fixes type to accept only strings.

## 0.3.0

### Minor Changes

- d2d76fa: Adds `defineAdapter` TS helper function for adapter creation, replacing `createAdapter` and marking it as deprecated.

### Patch Changes

- d2d76fa: Adds validation to the `registerAdapters` function and freezes the adapters before being stored.
- 60b87d5: Added ISC license to `deno.json` files for public packages.

## 0.2.1

### Patch Changes

- 1bb1601: Applied module-level JSDoc annotations across all public packages for better clarity and JSR compatibility.

## 0.2.0

### Minor Changes

- 256e6ae: Enabled `allowImportingTsExtensions: true` in `tsconfig.base.json` and updated all relevant imports in the packages directory to ensure consistent compatibility across environments.
- 256e6ae: Added `deno.ns`, `dom`, and `esnext` to `compilerOptions.lib` in `deno.json` for all packages to fix Deno type errors and ensure compatibility.

## 0.1.1

### Patch Changes

- 28a2b56: Adds explicit return type to public API.

  - Fixes JSR error "missing-explicit-return-type".
  - Updates API report.
