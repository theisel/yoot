<div align="center" style="display:grid;row-gap:0.5rem">

<h1>Yoot Demo</h1>

<p style="font-size:1.25rem;opacity:0.6">
  <strong>One API. Any CDN. Full control.</strong>
</p>

<p style="max-width:70ch;margin-inline:auto">
    This demo showcases the core functionality of <code>yoot</code>, illustrating its use with various CDN adapters and frontend components within an Astro application.
</p>

<div style="max-width:80ch;margin-inline:auto">
  <img src="https://img.shields.io/badge/Built%20with-Astro-ff5a0d?style=flat-square&logo=astro" alt="Built with Astro" />
  <a href="https://github.com/theisel/yoot/blob/main/packages/yoot">
    <img src="https://img.shields.io/badge/Core%20library-@yoot/yoot-deeppink?style=flat-square" alt="Yoot Core Library" />
  </a>
</div>

</div>

---

> **TL;DR:** This demo provides practical examples of `yoot`'s image transformation capabilities across multiple CDNs (Cloudinary, Imgix, Sanity, Shopify) and UI frameworks (React, Svelte, Solid, Vue).

---

&nbsp;

## About

This application serves as a practical showcase for the [`yoot`](https://github.com/theisel/yoot) library and its adapters. The goal is to provide a clear, hands-on understanding of `yoot` in real-world scenarios. It demonstrates:

- **Adapter integration:** Registering CDN adapters.
- **Preset usage:** Defining and applying reusable transformation sets.
- **Core transformations:** Common image operations like resizing and fitting.
- **Multi-framework rendering:** Using `yoot` with React, Svelte, Solid, and Vue components within an Astro project.

&nbsp;

## Showcasing

Key `yoot` features highlighted:

- **CDN Adapters:**
  - `@yoot/cloudinary`
  - `@yoot/imgix`
  - `@yoot/sanity`
  - `@yoot/shopify`
- **Transformation Presets:** For `square`, `landscape`, and `portrait` aspects.
- **Fit Modes:** Comparison of `fit('cover')` vs. `fit('contain')`.
- **API Usage:** `yoot` initialization, chaining methods, and preset application.

&nbsp;

## Running locally

To run the demo locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/theisel/yoot.git
   cd yoot
   ```
2. **Install dependencies** (from root):
   ```bash
   pnpm install
   ```
3. **Launch the demo:**
   ```bash
   pnpm demo:launch
   ```
   > This runs the app in dev mode. Open your browser to the URL provided in the terminal.

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
