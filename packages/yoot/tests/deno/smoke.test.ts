import {describe, it} from 'jsr:@std/testing/bdd';
import {expect} from 'jsr:@std/expect';
import {yoot, defineAdapter, registerAdapters} from '../../src/index.ts';
import * as html from '../../src/html.ts';
import * as jsx from '../../src/jsx.ts';

const IMAGE_URL = 'https://cdn.example.com/file.png';

// Normalize URL by removing search and hash
function normalizeUrl(url: URL): string {
  const baseUrl = new URL(url.href);
  baseUrl.search = '';
  baseUrl.hash = '';
  return baseUrl.href;
}

describe('Deno `yoot` smoke tests', () => {
  it('should initialize a Yoot object with core methods', () => {
    expect(typeof yoot).toBe('function');

    const ute = yoot(IMAGE_URL);
    expect(typeof ute).toBe('function');

    // Test `ute` attributes methods
    expect(typeof ute.src).toBe('function');
    expect(typeof ute.alt).toBe('function');

    // Test `ute` directive methods
    expect(typeof ute.aspectRatio).toBe('function');
    expect(typeof ute.crop).toBe('function');
    expect(typeof ute.fit).toBe('function');
    expect(typeof ute.format).toBe('function');
    expect(typeof ute.height).toBe('function');
    expect(typeof ute.h).toBe('function');
    expect(typeof ute.width).toBe('function');
    expect(typeof ute.w).toBe('function');

    // Test `ute` output methods
    expect(typeof ute.toJSON).toBe('function');
    expect(typeof ute.toString).toBe('function');
  });

  it('should create and register an adapter', () => {
    expect(typeof defineAdapter).toBe('function');
    expect(typeof registerAdapters).toBe('function');

    expect(() => {
      defineAdapter({
        supports: () => true,
        generateUrl: ({src}) => src,
        normalizeUrl,
      });
    }).not.toThrow();

    // Create an adapter for further checks
    const adapter = defineAdapter({
      supports: () => true,
      generateUrl: ({src}) => src,
      normalizeUrl,
    });

    expect(typeof adapter).toBe('object');
    expect(adapter).not.toBeNull();
    expect(typeof adapter.supports).toBe('function');
    expect(typeof adapter.generateUrl).toBe('function');

    // Verify adapter registration
    expect(() => registerAdapters(adapter)).not.toThrow();
    expect(() => registerAdapters()).not.toThrow();
  });

  it('should have HTML/JSX utilities with expected methods', () => {
    expect(typeof html.buildSrcSet).toBe('function');
    expect(typeof jsx.buildSrcSet).toBe('function');

    expect(typeof html.defineSrcSetBuilder).toBe('function');
    expect(typeof jsx.defineSrcSetBuilder).toBe('function');

    expect(typeof html.getImgAttrs).toBe('function');
    expect(typeof jsx.getImgAttrs).toBe('function');

    expect(typeof html.getSourceAttrs).toBe('function');
    expect(typeof jsx.getSourceAttrs).toBe('function');

    expect(typeof html.withImgAttrs).toBe('function');
    expect(typeof jsx.withImgAttrs).toBe('function');

    expect(typeof html.withSourceAttrs).toBe('function');
    expect(typeof jsx.withSourceAttrs).toBe('function');
  });
});
