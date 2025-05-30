import {describe, it, expect} from '@yoot/test-kit';
import {createAdapter, registerAdapters, defineConfig, yoot} from '../src';

const IMAGE_URL = 'https://foo.com/file.webp';

describe('@yoot/yoot - Adapter Behavior', () => {
  it('throws when no adapter matches and no onMissingAdapter is defined', () => {
    expect(() => yoot(IMAGE_URL).url).toThrow();
  });

  it('uses onMissingAdapter if provided', () => {
    const fallbackAdapter = createAdapter({
      supports: () => true,
      generateUrl: (input) => input.src + '?fallback=true',
    });

    defineConfig({
      onMissingAdapter: () => fallbackAdapter,
    });

    const url = yoot(IMAGE_URL).width(200).url;

    expect(url).toBe(`${IMAGE_URL}?fallback=true`);
  });

  it('resolves adapter via supports()', () => {
    const adapter = createAdapter({
      supports: (url) => url.hostname === 'foo.com',
      generateUrl: (input) => input.src + '?matched=true',
    });

    registerAdapters(adapter);

    const url = yoot(IMAGE_URL).height(300).url;
    expect(url).toBe(`${IMAGE_URL}?matched=true`);
  });

  it('registers multiple adapters and picks the correct one', () => {
    const matchingAdapter = createAdapter({
      supports: (url) => url.hostname === 'foo.com',
      generateUrl: (input) => input.src + '?matched=true',
    });

    const fallbackAdapter = createAdapter({
      supports: () => true,
      generateUrl: (input) => input.src + '?fallback=true',
    });

    registerAdapters(matchingAdapter, fallbackAdapter);

    const url = yoot(IMAGE_URL).url;
    expect(url).toBe(`${IMAGE_URL}?matched=true`);
  });
});
