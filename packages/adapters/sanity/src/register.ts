/**
 * Automatically registers the Sanity adapter with Yoot at runtime.
 *
 * @module @yoot/sanity/register
 * @packageDocumentation
 * @public
 *
 * @example
 * ```ts
 * import '@yoot/sanity/register';
 * ```
 */
import {registerAdapters} from '@yoot/yoot';
import {adapter} from './core/adapter.ts';

/** Empty export to ensure this file is treated as a module */
export {};

registerAdapters(adapter);
