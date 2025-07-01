/**
 * HTML helpers for Yoot that generate attributes tailored for HTML-style syntax environments, e.g. Astro and Svelte.
 * @module @yoot/yoot/html
 * @packageDocumentation
 * @public
 */
export {
  buildSrcSet,
  defineSrcSetBuilder,
  getImgAttrs,
  getSourceAttrs,
  withImgAttrs,
  withSourceAttrs,
} from './core/html.ts';
export type * from './core/helpers.ts';
