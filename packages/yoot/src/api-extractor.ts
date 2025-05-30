/**
 * Core `yoot` API.
 * @packageDocumentation
 */
export * from './index'; // Assumes './index.ts' exports the curated public core API

/**
 * JSX utilities for `yoot` (React, SolidJS, etc.).
 * @packageDocumentation
 */
export * as jsx from './jsx';

/**
 * HTML utilities for `yoot` (Astro, Svelte, etc.).
 * @packageDocumentation
 */
export * as html from './html';

/**
 * INTERNAL USE ONLY. For `yoot` adapters. Not for public use.
 * @packageDocumentation
 * @internal
 */
export * as internal from './internal';
