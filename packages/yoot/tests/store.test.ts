import {beforeEach, vi} from 'vitest';
import {describe, expect, it} from '@yoot/test-kit';
import {defineAdapter} from '../src';
import type {AdapterStore} from '../src/core/store';

let adapterStore: AdapterStore;

beforeEach(async () => {
  const module = await import('../src/core/store');

  adapterStore = module.adapterStore;
  adapterStore.reset();
});

describe('@yoot/yoot - Store', () => {
  it('registers and retrieves a single adapter', () => {
    const adapter = defineAdapter({
      supports: () => true,
      generateUrl: () => '',
    });

    adapterStore.register(adapter);

    const url = new URL('https://foo.com/file.webp');
    expect(adapterStore.get(url)).toBe(adapter);
  });

  it('respects adapter support logic and retrieves the correct adapter', () => {
    const adapter1 = defineAdapter({
      supports: (url) => url.hostname === 'foo.com',
      generateUrl: () => 'foo',
    });

    const adapter2 = defineAdapter({
      supports: (url) => url.hostname === 'bar.com',
      generateUrl: () => 'bar',
    });

    adapterStore.register(adapter1, adapter2);

    expect(adapterStore.get(new URL('https://foo.com/file.webp'))).toBe(adapter1);
    expect(adapterStore.get(new URL('https://bar.com/file.webp'))).toBe(adapter2);
  });

  it('caches adapter by hostname after first lookup', () => {
    const supports = vi.fn(() => true);
    const adapter = defineAdapter({supports, generateUrl: () => ''});

    adapterStore.register(adapter);

    const url = new URL('https://foo.com/file.webp');

    expect(adapterStore.get(url)).toBe(adapter);
    expect(adapterStore.get(url)).toBe(adapter);
    expect(supports).toHaveBeenCalledTimes(1);
  });

  it('does not add duplicate adapter instances', () => {
    const adapter = defineAdapter({supports: () => true, generateUrl: () => 'a'});
    adapterStore.register(adapter, adapter); // Duplicate

    expect(adapterStore.size()).toBe(1);
  });

  it('returns undefined if no adapters are registered', () => {
    const result = adapterStore.get(new URL('https://foo.com/file.webp'));

    expect(result).toBeUndefined();
  });

  it('returns undefined if no adapter supports the URL', () => {
    const adapter = defineAdapter({
      supports: (url) => url.hostname === 'bar.com',
      generateUrl: () => '',
    });

    adapterStore.register(adapter);

    const result = adapterStore.get(new URL('https://foo.com/file.webp'));

    expect(result).toBeUndefined();
  });

  it('reset clears all adapters and cache', () => {
    const adapter = defineAdapter({supports: () => true, generateUrl: () => ''});
    adapterStore.register(adapter);

    expect(adapterStore.size()).toBe(1);

    adapterStore.reset();

    expect(adapterStore.size()).toBe(0);
    expect(adapterStore.get(new URL('https://foo.com/file.webp'))).toBeUndefined();
  });
});
