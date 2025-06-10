<div align="center" style="display:grid;row-gap:0.5rem">

  <h1>@yoot/sanity</h1>

  <p style="font-size:1.25rem;opacity:0.6">
    Sanity adapter for <code>yoot</code>
  </p>

  <p style="margin-inline:auto">
    Generate Sanity image URLs with a unified, chainable API focused on core transformations.
  </p>

  <div style="max-width:80ch;margin-inline:auto">
    <a href="https://npmjs.com/package/@yoot/sanity">
      <img src="https://img.shields.io/npm/v/@yoot/sanity?style=flat-square&logo=npm&logoColor=white" alt="NPM version for @yoot/sanity" />
    </a>
    <a href="https://jsr.io/@yoot/sanity">
      <img src="https://img.shields.io/jsr/v/@yoot/sanity?style=flat-square&logo=jsr&logoColor=white" alt="JSR version for @yoot/sanity" />
    </a>
    <a href="https://bundlephobia.com/result?p=@yoot/sanity">
      <img src="https://img.shields.io/bundlephobia/minzip/@yoot/sanity?style=flat-square&label=minzipped" alt="Bundle size"  />
    </a>
    <img src="https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/npm/l/@yoot/sanity?style=flat-square" alt="License" />
  </div>

</div>

&nbsp;

## Installation

### Node / NPM

```bash
npm install @yoot/sanity
```

> The core library (`@yoot/yoot`) is automatically installed.

### Deno / JSR

```ts
import {yoot} from 'jsr:@yoot/yoot';
import sanity from 'jsr:@yoot/sanity';
```

### Browser (importmap)

```html
<script type="importmap">
  {
    "imports": {
      "@yoot/yoot": "https://cdn.jsdelivr.net/npm/@yoot/yoot/+esm",
      "@yoot/sanity": "https://cdn.jsdelivr.net/npm/@yoot/sanity/+esm"
    }
  }
</script>
<script type="module">
  import {yoot} from '@yoot/yoot';
  import sanity from '@yoot/sanity';
</script>
```

&nbsp;

## Quick start

### Step 1. Register the adapter

```ts
import {registerAdapters} from '@yoot/yoot';
import sanity from '@yoot/sanity';

registerAdapters(sanity);
```

### Step 2. Transform images

#### Initialize

Use the `yoot` function to build transformations:

```ts
import {yoot} from '@yoot/yoot';

// Without arguments
const preset = yoot();

// With image URL
const preset = yoot('https://cdn.sanity.io/...');

// With an object
const preset = yoot({
  src: 'https://cdn.sanity.io/...',
  alt: 'Alt text',
  width: 1024, // Optional: intrinsic width
  height: 1024, // Optional: intrinsic height
});
```

#### Get the transformed URL

```ts
const preset = yoot('https://cdn.sanity.io/...').width(1024).format('webp');

const transformedUrl = preset.url;
```

#### Get responsive image attributes

Supports both JSX and HTML rendering via `@yoot/yoot/jsx` or `@yoot/yoot/html`.

```tsx
import {yoot} from '@yoot/yoot';
import {defineSrcSetBuilder, getImgAttrs, getSourceAttrs} from '@yoot/yoot/jsx'; // Or '@yoot/yoot/html'

// Define transformation directives
const preset = yoot({
  src: 'https://cdn.sanity.io/...',
  alt: 'Thumbnail',
})
  .width(200)
  .aspectRatio(1)
  .fit('cover');

// Derive <img> attributes
const imgAttrs = getImgAttrs(preset, {loading: 'lazy'});

// Derive <source> attributes
const sourceAttrs = getSourceAttrs(preset, {
  type: 'image/webp', // this helper modifies the format to webp
  sizes: '200px',
  srcSetBuilder: defineSrcSetBuilder({widths: [200, 300, 400]}),
});

return (
  <picture>
    <source {...sourceAttrs} />
    <img {...imgAttrs} />
  </picture>
);
```

#### Define presets (DRY)

```tsx
// -- presets.ts --
import {yoot} from '@yoot/yoot';
import {defineSrcSetBuilder, withImgAttrs, withSourceAttrs} from '@yoot/yoot/jsx'; // Or '@yoot/yoot/html'

export const thumbnailPreset = yoot().width(200).aspectRatio(1).fit('cover');

// Define the base <source> attributes
export const getThumbnailSourceAttrs = withSourceAttrs({
  sizes: '200px',
  srcSetBuilder: defineSrcSetBuilder({widths: [200, 300, 400]}),
});

// Define the base <img> attributes
export const getImgAttrs = withImgAttrs({loading: 'lazy'});

// -- Usage --
import {thumbnailPreset, getImgAttrs, getThumbnailSourceAttrs} from '@/presets';

const thumbnail = thumbnailPreset({
  src: 'https://cdn.sanity.io/...',
  alt: 'Thumbnail',
});
// Or thumbnailPreset.src('https://cdn.sanity.io/...').alt('Thumbnail');

const imgAttrs = getImgAttrs(thumbnail);

const webpSourceAttrs = getThumbnailSourceAttrs(thumbnail, {
  type: 'image/webp', // this helper modifies the format to webp
});

const jpegSourceAttrs = getThumbnailSourceAttrs(thumbnail, {
  type: 'image/jpeg', // this helper modifies the format to jpeg
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
- ⚙️ [Available adapters](https://github.com/theisel/yoot)

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
