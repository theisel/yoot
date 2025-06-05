/**
 * Core library for Yoot, exporting `yoot`, adapter utilities, and configuration helpers.
 * @module @yoot/yoot
 * @packageDocumentation
 * @public
 */
export {yoot} from './core/yoot.ts';
export type * from './core/yoot.ts';

export {createAdapter, defineAdapter, passThroughAdapter, registerAdapters} from './core/adapter.ts';
export type * from './core/adapter.ts';

export {defineConfig, mergeConfig, type YootConfig} from './core/config.ts';
export {hasIntrinsicDimensions} from './core/utils.ts';
