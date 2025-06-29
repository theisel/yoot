import {describe, it, expect} from '@yoot/test-kit';
import {defineAdapter, registerAdapters, defineConfig, yoot} from '../src';

const IMAGE_URL = 'https://foo.com/file.webp';

const normalizeUrl = (url: URL) => {
  url.search = '';
  url.hash = '';
  return url.href;
};

describe('@yoot/yoot - Adapter Behavior', () => {
  it('throws when no adapter matches and no onMissingAdapter is defined', () => {
    expect(() => yoot(IMAGE_URL).url).toThrow();
  });

  it('uses onMissingAdapter if provided', () => {
    const fallbackAdapter = defineAdapter({
      supports: () => true,
      generateUrl: (input) => input.src + '?fallback=true',
      normalizeUrl,
    });

    defineConfig({
      onMissingAdapter: () => fallbackAdapter,
    });

    const url = yoot(IMAGE_URL).width(200).url;

    expect(url).toBe(`${IMAGE_URL}?fallback=true`);
  });

  it('resolves adapter via supports()', () => {
    const adapter = defineAdapter({
      supports: (url) => url.hostname === 'foo.com',
      generateUrl: (input) => input.src + '?matched=true',
      normalizeUrl,
    });

    registerAdapters(adapter);

    const url = yoot(IMAGE_URL).height(300).url;
    expect(url).toBe(`${IMAGE_URL}?matched=true`);
  });

  it('registers multiple adapters and picks the correct one', () => {
    const matchingAdapter = defineAdapter({
      supports: (url) => url.hostname === 'foo.com',
      generateUrl: (input) => input.src + '?matched=true',
      normalizeUrl,
    });

    const fallbackAdapter = defineAdapter({
      supports: () => true,
      generateUrl: (input) => input.src + '?fallback=true',
      normalizeUrl,
    });

    registerAdapters(matchingAdapter, fallbackAdapter);

    const url = yoot(IMAGE_URL).url;
    expect(url).toBe(`${IMAGE_URL}?matched=true`);
  });
});
