/**
 * Automatically registers the Cloudinary adapter with Yoot at runtime.
 *
 * @module @yoot/cloudinary/register
 * @packageDocumentation
 * @public
 *
 * @example
 * ```ts
 * import '@yoot/cloudinary/register';
 * ```
 */
import {registerAdapters} from '@yoot/yoot';
import {adapter} from './core/adapter.ts';

/** Empty export to ensure this file is treated as a module */
export {};

registerAdapters(adapter);
