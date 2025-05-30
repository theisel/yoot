import type {Adapter} from './adapter';

// -- Module Exports --
export {defineConfig, mergeConfig};
export type {YootConfig};
// The following are prefixed with underscored to show they are internal
export {getConfig as _getConfig};

let state: YootConfig = {};

// Singleton config manager
const config: Config = {
  get: () => ({...state}),
  set: (options) => {
    state = {...options};
  },
  merge: (options) => {
    state = {...state, ...options};
  },
};

/**
 * Defines the shape of the internal configuration manager.
 * @internal
 */
type Config = {
  /** Retrieves a shallow copy of the current configuration options. */
  get: () => YootConfig;
  /** Replaces the entire current configuration with the provided options. */
  set: (options: YootConfig) => void;
  /** Merges new options into the current configuration. */
  merge: (options: YootConfig) => void;
};

/**
 * Sets or replaces the global configuration for Yoot.
 *
 * @remarks
 * To incrementally add or update options, use `mergeConfig`.
 *
 * @public
 * @param options - The complete configuration object to set.
 */
const defineConfig = config.set;

/**
 * Merges the provided options into the existing global Yoot configuration.
 *
 * @remarks
 * Properties in the provided `options` will overwrite existing ones if keys match.
 *
 * @public
 * @param options - Configuration options to merge.
 */
const mergeConfig = config.merge;
/**
 * Retrieves the current global Yoot configuration.
 *
 * @remarks
 * Returns a shallow copy, so direct modification of the returned object
 * will not affect the internal configuration.
 *
 * @internal
 */
const getConfig = config.get;

/**
 * Configuration options for Yoot.
 * @public
 */
type YootConfig = {
  /**
   * Called when no adapter is found for a given URL.
   * @returns An adapter or throws.
   */
  onMissingAdapter?: (url: URL) => Adapter | never;
};
