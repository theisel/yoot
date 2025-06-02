import type {Adapter} from './adapter.ts';

// -- Module Exports --
export {adapterStore, YOOT_BRAND};
export type {AdapterStore};

// Symbol used to brand callable Yoot objects.
const YOOT_BRAND: unique symbol = Symbol('@yoot/yoot');
// List of all registered adapters.
const adapters: Set<Adapter> = new Set();
// Cache for adapters based on URL hostname.
const cache: Map<string, Adapter> = new Map();

/**
 * Internal adapter store system.
 *
 * @remarks
 * This returns a singleton object used to register adapters and
 * quickly retrieve them based on URL hostname.
 *
 * @internal
 * @returns An object with methods to `register` and `get` adapters.
 */
const adapterStore: AdapterStore = {
  register(...newAdapters) {
    newAdapters.forEach(adapters.add.bind(adapters));
  },
  get(url) {
    let adapter = cache.get(url.hostname);

    if (!adapter) {
      for (const adapterToCheck of adapters) {
        // Check if the adapter supports the URL
        if (adapterToCheck.supports(url)) {
          adapter = adapterToCheck;
          cache.set(url.hostname, adapter);
          break;
        }
      }
    }

    return adapter;
  },
  size() {
    return adapters.size;
  },
  reset() {
    adapters.clear();
    cache.clear();
  },
};

/**
 * Internal adapter store system.
 *
 * @remarks
 * This singleton object manages adapter registration, unique storage (using a Set),
 * and efficient retrieval via a hostname cache.
 * It includes methods for testing, `reset` and `size`.
 *
 * @internal
 * @returns An object with methods to `register`, `get`, `reset`, and get the `size` of the store.
 */
type AdapterStore = {
  /** Registers adapter(s). Duplicate instances are ignored due to internal Set. */
  register(...adapters: Adapter[]): void;
  /**
   * Retrieves an adapter for the given URL.
   *
   * @remarks
   * Checks hostname cache first, then iterates the unique set of registered adapters.
   */
  get(url: URL): Adapter | undefined;
  /**
   * Clears the internal cache and registered adapters.
   *
   * @remarks
   * This is useful for debugging and testing purposes.
   */
  reset(): void;
  /**
   * Returns the number of registered adapters.
   *
   * @remarks
   * This is useful for debugging and testing purposes.
   */
  size(): number;
};
