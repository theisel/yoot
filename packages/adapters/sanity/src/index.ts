/**
 * Sanity adapter entry for Yoot, exported as both a `default` and a `named` export.
 *
 * @module @yoot/sanity
 * @packageDocumentation
 * @public
 *
 * @example Default import
 * ```ts
 * import sanity from '@yoot/sanity';
 * ```
 *
 * @example Named import
 * ```ts
 * import {sanityAdapter} from '@yoot/sanity';
 * ```
 */
export {adapter as sanityAdapter, adapter as default} from './core/adapter.ts';
