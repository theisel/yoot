<div align="center" style="display:grid;row-gap:0.5rem">

<h1>@yoot/yoot</h1>

<p style="font-size:1.25rem;opacity:0.6">
  <strong>One API. Any CDN. Full control.</strong>
</p>

<p style="max-width:60ch;margin-inline:auto">
    This core package exposes the <code>yoot</code> API and handles adapter registration for image transformations.
</p>

<div style="max-width:80ch;margin-inline:auto">
  <a href="https://npmjs.com/package/@yoot/yoot">
    <img src="https://img.shields.io/npm/v/@yoot/yoot?style=flat-square&logo=npm&logoColor=white" alt="NPM version for @yoot/yoot" />
  </a>
  <img src="https://img.shields.io/jsr/v/@yoot/yoot?style=flat-square&logo=jsr&logoColor=white" alt="JSR version for @yoot/yoot" />
  <a href="https://bundlephobia.com/result?p=@yoot/yoot">
    <img src="https://img.shields.io/bundlephobia/minzip/@yoot/yoot?style=flat-square&label=minzipped" alt="Bundle size"  />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/npm/l/@yoot/yoot?style=flat-square" alt="License" />
</div>

</div>

---

> **TL;DR:** Define image transformations once and apply them across any CDN with a single shared API.

---

&nbsp;

## Installation

Install this core package along with the CDN [adapters](https://github.com/theisel/yoot#packages) you need:

```bash
npm install @yoot/yoot @yoot/shopify @yoot/cloudinary
```

&nbsp;

## Table of contents

- [Installation](#installation)
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Resources](#resources)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

&nbsp;

## Overview

Build predictable image URLs with a modular, chainable API — designed for reusable, CDN-agnostic image transformations.

### Why `yoot`?

- 🧠 Predictable API — chainable, composable, no surprises.
- 🧵 Presets — define once, reuse everywhere.
- 🔄 Portable — safely serialize and hydrate in any SSR framework.
- ⚙️ Lightweight — zero runtime deps, framework-agnostic (Astro, SvelteKit, etc.).

### Design philosophy

- 💅 Layout and delivery only — leave visual effects to CSS.
- 🧱 Small, modular adapters — no global config or hidden logic.
- 🔌 Pluggable architecture — choose an adapter or write your own.

### Adapters

Adapters translate `yoot` directives into CDN-specific URLs — handling each provider's syntax and features.

➕ [See all available adapters](https://github.com/theisel/yoot#packages)

&nbsp;

## Quick start

### Step 1. Register adapters

Do this once per runtime (server/client). Use a bootstrap file:

#### Explicit registration

```ts
// yoot-presets.ts
import {registerAdapters} from '@yoot/yoot';
import shopify from '@yoot/shopify';
import cloudinary from '@yoot/cloudinary';

registerAdapters(shopify, cloudinary);
```

#### Auto registration (via side-effect imports)

```ts
// yoot-presets.ts
import '@yoot/shopify/register';
import '@yoot/cloudinary/register';
```

### Step 2. Use the API

The `yoot` function returns a chainable builder. You can optionally initialize it with an image URL or an image object.

#### Single use

```ts
const imgPreset = yoot(imageUrl).width(1024).format('webp');
const url = imgPreset.url;
const attrs = getImgAttrs(imgPreset);
```

#### Using presets

##### Create presets

```ts
// Hero presets
export const heroPreset = yoot()
  .width(1024)
  .aspectRatio(16 / 9)
  .fit('cover');
export const applyHeroImgAttrs = withImgAttrs({loading: 'eager'});
export const applyHeroSourceAttrs = withSourceAttrs({
  srcSetBuilder: buildSrcSet({densities: [1, 2, 3]}),
});
// Thumbnail presets
export const thumbnailPreset = yoot().width(100).aspectRatio(1).fit('cover');
export const applyThumbnailImgAttrs = withImgAttrs({loading: 'lazy'});
export const applyThumbnailSourceAttrs = withSourceAttrs({
  srcSetBuilder: buildSrcSet({widths: [100, 200, 300]}),
});
```

> 💡 See the [API docs](https://github.com/theisel/yoot/tree/main/docs) for all transformation options.

#### Use presets

```ts
// With a URL string
const thumbnail = thumbnailPreset('https://cdn.example.com/image.jpg');
// Alternatively: thumbnailPreset.src('https://cdn.example.com/image.jpg');

// With an object
const thumbnail = thumbnailPreset({
  src: 'https://cdn.example.com/image.jpg',
  alt: 'Alt text',
  width: 2048, // Intrinsic width
  height: 2048, // Intrinsic height
});
```

#### Output markup (JSX/HTML)

> **Note:** Use environment-specific imports:
>
> - Use `@yoot/yoot/jsx` for React, Preact, Solid
> - Use `@yoot/yoot/html` for Astro, Svelte, plain HTML

```tsx
import {yoot} from '@yoot/yoot';
import {buildSrcSet, getImgAttrs, getSourceAttrs} from '@yoot/yoot/jsx';
// import { buildSrcSet, getImgAttrs, getSourceAttrs } from '@yoot/yoot/html';

const imgPreset = yoot('https://...').format('png').width(800);

const imgAttrs = getImgAttrs(imgPreset);

const webpSourceAttrs = getSourceAttrs(imgPreset, {
  type: 'image/webp', // `type` overrides format 'png'
  media: '(min-width: 800px)',
  sizes: '(min-width: 800px) 800px, 100vw',
  srcSetBuilder: buildSrcSet({widths: [600, 800, 1200]}),
});

const jpegSourceAttrs = getSourceAttrs(imgPreset, {
  type: 'image/jpeg', // `type` overrides format 'png'
  media: '(max-width: 799px)',
  sizes: '(max-width: 799px) 100vw, 50vw',
  srcSetBuilder: buildSrcSet({densities: [1, 2, 3]}),
});

return (
  <picture>
    <source {...webpSourceAttrs} />
    <source {...jpegSourceAttrs} />
    <img {...imgAttrs} />
  </picture>
);
```

&nbsp;

## Resources

- 📘 [Read the docs](https://github.com/theisel/yoot/tree/main/docs)
- 🔍 [View examples](https://github.com/theisel/yoot/tree/main/examples)

&nbsp;

## Demo

Try it live — zero setup:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/theisel/yoot/tree/main/demo)
[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/theisel/yoot/tree/main/demo)

&nbsp;

## Contributing

Found a bug or wish to contribute? [Open an issue](https://github.com/theisel/yoot/issues) or [send a PR](https://github.com/theisel/yoot/blob/main/CONTRIBUTING.md).

&nbsp;

## License

Licensed under the ISC License.
