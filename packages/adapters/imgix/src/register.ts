/**
 * Automatically registers the Imgix adapter with Yoot at runtime.
 *
 * @module @yoot/imgix/register
 * @packageDocumentation
 * @public
 *
 * @example
 * ```ts
 * import '@yoot/imgix/register';
 * ```
 */
import {registerAdapters} from '@yoot/yoot';
import {adapter} from './core/adapter.ts';

/** Empty export to ensure this file is treated as a module */
export {};

registerAdapters(adapter);
