import type {Directives, YootState, PrimeStateInput} from './yoot.ts';
import {_getConfig as getConfig} from './config.ts';
import {adapterStore} from './store.ts';
import {invariant} from './utils.ts';

// --- Module Exports ---
export {createAdapter, passThroughAdapter, registerAdapters};
export type {Adapter, AdapterOptions, GenerateUrlInput};
// The following are prefixed with underscored to show they are internal
export {getAdapter as _getAdapter};

/**
 * Registers one or more adapters for image transformation.
 *
 * @public
 * @param adapters - One or more adapters to register.
 * @returns void
 *
 * @example
 * ```ts
 * registerAdapters(adapterOne, adapterTwo);
 * ```
 */
const registerAdapters: RegisterAdaptersFunction = (...adapters) => adapterStore.register(...adapters);

/**
 * Type definition for the function that registers adapters.
 * @public
 */
type RegisterAdaptersFunction = (...adapters: Adapter[]) => void;

/**
 * Creates a new adapter for image URL transformation.
 *
 * @public
 * @param options - Configuration for the adapter.
 *   - `supports` - A function to determine whether this adapter supports a given URL.
 *   - `generateUrl` - A function to transform the image URL.
 *   - `primeState` - (Optional) A function to modify the input before transformation.
 * @returns An adapter object implementing `supports`, `generateUrl`, and optionally `primeState`.
 * @throws Will throw if `supports` or `generateUrl` is missing or not a function.
 *
 * @example
 * ```ts
 * const myAdapter = createAdapter({
 *   supports: (url) => url.hostname === 'cdn.example.com',
 *   generateUrl: ({src, directives}) => {
 *     const url = new URL(src);
 *     url.searchParams.set('w', String(directives.width));
 *     return url.href;
 *   },
 * });
 * ```
 */
function createAdapter(options: AdapterOptions): Adapter {
  assertAdapterOptions(options);
  return {...options};
}

/**
 * Validates that adapter options implement the required interface.
 *
 * @internal
 * @param options - Adapter configuration to validate.
 */
function assertAdapterOptions(options: AdapterOptions): asserts options is Adapter {
  invariant(typeof options.supports === 'function', 'Adapter must implement `supports` function');
  invariant(typeof options.generateUrl === 'function', 'Adapter must implement `generateUrl` function');
}

/**
 * Retrieves the adapter that supports a given URL.
 *
 * @remarks
 * Checks the internal cache first. If none is found, it uses a fallback strategy via config.
 *
 * @internal
 * @param url - A URL to match against registered adapters.
 * @returns The matching adapter.
 * @throws If no adapter supports the given URL and no `onMissingAdapter` is configured.
 */
function getAdapter(url: URL): Adapter | never {
  invariant(url instanceof URL, 'Expected `url` be an instance of URL');

  const adapter = adapterStore.get(url);

  if (!adapter) {
    const {onMissingAdapter} = getConfig();
    return (
      onMissingAdapter?.(url) ??
      throwError(
        new Error(
          `[yoot] No adapter found for URL: ${url.href}\n` +
            `Did you forget to register an adapter via adapterStore.register(...) or set adapterStore.onMissingAdapter?`,
        ),
      )
    );
  }

  return adapter;
}

/**
 * Throws the provided error.
 *
 * @internal
 * @param error - The error to throw.
 */
const throwError = (error: Error): never => {
  throw error;
};

/**
 * A ready-to-use adapter object that returns the source URL unmodified.
 *
 * @remarks
 * It can be used as a fallback in `onMissingAdapter`.
 * If used with `registerAdapters()`, it MUST be registered last.
 *
 * @public
 *
 * @example Recommended: Using with `onMissingAdapter`
 * ```ts
 * defineConfig({
 *   onMissingAdapter: (url) => {
 *      if (process.env.NODE_ENV === 'development') {
 *        throw new Error(`Adapter not found for URL: ${url}`);
 *      }
 *      return passThroughAdapter;
 *   },
 * });
 * ```
 *
 * @example Alternative: Using with `registerAdapters` - Ensure correct order
 * ```ts
 * import {registerAdapters, passThroughAdapter} from '@yoot/yoot';
 * import {shopifyAdapter} from '@yoot/shopify';
 *
 * registerAdapters(shopifyAdapter, passThroughAdapter); // passThroughAdapter must be last
 * ```
 */
const passThroughAdapter: Adapter = createAdapter({
  supports: () => true,
  generateUrl: ({src}) => src,
});

/**
 * Represents an image adapter.
 * @public
 */
type Adapter = {
  /**
   * Determines whether the adapter supports a given URL.
   * @param url - The image URL to test.
   */
  supports: (url: URL) => boolean;
  /**
   * Generates a transformed image URL.
   * @param input - The transformation input.
   */
  generateUrl: (input: GenerateUrlInput) => string;
  /**
   * (Optional) Primes the state before transformation.
   * @param input - The state to prime.
   */
  primeState?: (input: PrimeStateInput) => YootState;
};

/**
 * Configuration object used to create an adapter.
 * @public
 */
type AdapterOptions = {
  [Key in keyof Adapter]: Adapter[Key];
};

/**
 * Input used to generate transformed image URLs.
 * @public
 */
type GenerateUrlInput = {
  /** The source image URL. */
  src: string;
  /** Transformation directives like width, height, etc. */
  directives: Directives;
};
