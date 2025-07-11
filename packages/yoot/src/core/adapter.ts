import type {Directives, YootState, PrimeStateInput} from './yoot.ts';
import {_getConfig as getConfig} from './config.ts';
import {adapterStore} from './store.ts';
import {invariant} from './utils.ts';

// --- Module Exports ---
export {createAdapter, defineAdapter, passThroughAdapter, registerAdapters};
export type {Adapter, AdapterOptions, GenerateUrlInput};
// The following are prefixed with underscored to show they are internal
export {getAdapter as _getAdapter};

/**
 * Registers one or more adapters for image transformation.
 *
 * @remarks This function validates each adapter's options,
 * freezes the adapter objects, and registers them in the adapter store.
 *
 * @public
 * @param adapters - One or more adapters to register.
 * @returns void
 * @throws Will throw if any adapter does not implement the required interface.
 *
 * @example
 * ```ts
 * registerAdapters(adapterOne, adapterTwo);
 * ```
 */
const registerAdapters: RegisterAdaptersFunction = (...adapters) => {
  adapters.forEach(assertAdapterOptions); // Validate each adapter's options
  const frozenAdapters = adapters.map<Adapter>(Object.freeze); // Freeze each adapter object
  adapterStore.register(...frozenAdapters); // Register the adapters in the store
};

/**
 * Type definition for the function that registers adapters.
 * @public
 */
type RegisterAdaptersFunction = (...adapters: Adapter[]) => void;

/**
 * Defines a new adapter for image URL transformation.
 *
 * @remarks Use this as a helper to satisfy TypeScript typings to create adapter objects before registration.
 *
 * @public
 * @param options - Configuration for the adapter.
 *   - `supports` - A function to determine whether this adapter supports a given URL.
 *   - `generateUrl` - A function to transform the image URL.
 *   - `primeState` - (Optional) A function to modify the input before transformation.
 * @returns An adapter object implementing `supports`, `generateUrl`, and optionally `primeState`.
 *
 * @example
 * ```ts
 * const myAdapter = defineAdapter({
 *   supports: (url) => url.hostname === 'cdn.example.com',
 *   generateUrl: ({src, directives}) => {
 *     const url = new URL(src);
 *     url.searchParams.set('w', String(directives.width));
 *     return url.href;
 *   },
 * });
 * ```
 */
const defineAdapter = (options: AdapterOptions): Adapter => ({...options});

/**
 * @deprecated Use `defineAdapter` instead.
 * @remarks  This alias exists for backward compatibility.
 */
const createAdapter = defineAdapter;

/**
 * Validates that adapter options implement the required interface.
 *
 * @internal
 * @param options - Adapter configuration to validate.
 * @throws Will throw if the options do not implement the required interface.
 */
function assertAdapterOptions(options: AdapterOptions): asserts options is Adapter | never {
  invariant(typeof options.supports === 'function', 'Adapter must implement `supports` function');
  invariant(typeof options.generateUrl === 'function', 'Adapter must implement `generateUrl` function');
  invariant(typeof options.normalizeUrl === 'function', 'Adapter must implement `normalizeUrl` function');

  if ('primeState' in options) {
    invariant(typeof options.primeState === 'function', 'Adapter `primeState` must be a function');
  }
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
const passThroughAdapter: Adapter = defineAdapter({
  supports: () => true,
  generateUrl: ({src}) => src,
  normalizeUrl: (url) => url.href,
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
   * Normalizes a URL to its natural URL.
   * @param url - The URL to convert.
   */
  normalizeUrl: (url: URL) => string;
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
