import {vi} from 'vitest';
import {beforeEach, describe, expect, it} from '@yoot/test-kit';
import {defineAdapter, yoot, registerAdapters, type Yoot} from '../src';
import * as jsx from '../src/jsx';
import * as html from '../src/html';
import {getAttrs, mustBeOneOf, mustBeInRange} from '../src/core/helpers';
import {invariant} from '../src/core/utils';

const IMAGE_URL = 'https://cdn.example.com/images/image.jpg';

const adapter = defineAdapter({
  supports: () => true,
  normalizeUrl: (url) => (((url.search = ''), (url.hash = '')), url.href),
  generateUrl: (input) => {
    const url = new URL(input.src);
    const params = Object.entries(input.directives).reduce((params, [key, value]) => {
      if (!value) return params;
      params.set(key, String(value));
      return params;
    }, new URLSearchParams());
    url.search = String(params);
    return url.href;
  },
});

const ute = yoot(IMAGE_URL);

beforeEach(() => {
  registerAdapters(adapter);
});

describe('@yoot/yoot - Helpers', () => {
  describe('buildSrcSet', () => {
    it('builds srcset with width descriptors', () => {
      const jsxSrcset = jsx.buildSrcSet({widths: [300, 600]}, ute);
      const htmlSrcset = html.buildSrcSet({widths: [300, 600]}, ute);

      expect(jsxSrcset).toBe(`${IMAGE_URL}?width=300 300w, ${IMAGE_URL}?width=600 600w`);
      expect(htmlSrcset).toBe(jsxSrcset);
    });

    it('builds srcset with width descriptors and initial width and height', () => {
      const uteWithDimensions = ute.width(600).height(300);
      const jsxSrcset = jsx.buildSrcSet({widths: [600, 900]}, uteWithDimensions);
      const htmlSrcset = html.buildSrcSet({widths: [600, 900]}, uteWithDimensions);

      expect(jsxSrcset).toBe(`${IMAGE_URL}?width=600&height=300 600w, ${IMAGE_URL}?width=900&height=450 900w`);
      expect(htmlSrcset).toBe(jsxSrcset);
    });

    it('builds srcset with density descriptors', () => {
      const jsxSrcset = jsx.buildSrcSet({densities: [1, 2]}, ute);
      const htmlSrcset = html.buildSrcSet({densities: [1, 2]}, ute);

      expect(jsxSrcset).toBe(`${IMAGE_URL} 1x, ${IMAGE_URL}?dpr=2 2x`);
      expect(htmlSrcset).toBe(jsxSrcset);
    });

    it('builds srcset with density descriptors with initial width and height', () => {
      const uteWithDimensions = ute.width(600).height(300);
      const jsxSrcset = jsx.buildSrcSet({densities: [1, 2]}, uteWithDimensions);
      const htmlSrcset = html.buildSrcSet({densities: [1, 2]}, uteWithDimensions);

      expect(jsxSrcset).toBe(`${IMAGE_URL}?width=600&height=300 1x, ${IMAGE_URL}?width=600&height=300&dpr=2 2x`);
      expect(htmlSrcset).toBe(jsxSrcset);
    });

    it('prioritizes widths over densities if both provided', () => {
      const jsxSrcset = jsx.buildSrcSet({widths: [300], densities: [1, 2]}, ute);
      const htmlSrcset = html.buildSrcSet({widths: [300], densities: [1, 2]}, ute);

      expect(jsxSrcset).toBe(`${IMAGE_URL}?width=300 300w`);
      expect(htmlSrcset).toBe(jsxSrcset);
    });

    it('returns empty string for empty or invalid inputs', () => {
      expect(jsx.buildSrcSet({}, ute)).toBe('');
      expect(html.buildSrcSet({}, ute)).toBe('');

      expect(jsx.buildSrcSet({widths: []}, ute)).toBe('');
      expect(html.buildSrcSet({widths: []}, ute)).toBe('');

      expect(jsx.buildSrcSet({densities: []}, ute)).toBe('');
      expect(html.buildSrcSet({densities: []}, ute)).toBe('');

      expect(jsx.buildSrcSet({widths: [0, -100]}, ute)).toBe('');
      expect(html.buildSrcSet({widths: [0, -100]}, ute)).toBe('');

      expect(jsx.buildSrcSet({densities: [0, -1]}, ute)).toBe('');
      expect(html.buildSrcSet({densities: [0, -1]}, ute)).toBe('');
    });

    it('skips invalid width and density values', () => {
      const jsxSrcsetWidths = jsx.buildSrcSet({widths: [0, -100, 300, 400]}, ute);
      const htmlSrcsetWidths = html.buildSrcSet({widths: [0, -100, 300, 400]}, ute);

      expect(jsxSrcsetWidths).toBe(`${IMAGE_URL}?width=300 300w, ${IMAGE_URL}?width=400 400w`);
      expect(htmlSrcsetWidths).toBe(jsxSrcsetWidths);

      const jsxSrcsetDensities = jsx.buildSrcSet({densities: [0, -1, 1, 2]}, ute);
      const htmlSrcsetDensities = html.buildSrcSet({densities: [0, -1, 1, 2]}, ute);

      expect(jsxSrcsetDensities).toBe(`${IMAGE_URL} 1x, ${IMAGE_URL}?dpr=2 2x`);
      expect(htmlSrcsetDensities).toBe(jsxSrcsetDensities);
    });

    it('includes transformations from Yoot instance', () => {
      const _ute = ute.format('webp').quality(80);
      const srcset = jsx.buildSrcSet({widths: [300]}, _ute);

      const [href] = srcset.split(' ');
      const url = new URL(String(href));

      expect(srcset.endsWith(' 300w')).toBe(true);
      expect(url.searchParams.get('format')).toBe('webp');
      expect(url.searchParams.get('quality')).toBe('80');
      expect(url.searchParams.get('width')).toBe('300');
    });
  });

  describe('defineSrcSetBuilder', () => {
    it('should be callable', () => {
      const jsxSrcSetBuilder = jsx.defineSrcSetBuilder({widths: [400]});
      const jsxBuildResult = jsxSrcSetBuilder(ute);

      expect(jsxBuildResult).toBe(`${IMAGE_URL}?width=400 400w`);

      const htmlSrcSetBuilder = html.defineSrcSetBuilder({widths: [400]});
      const htmlBuildResult = htmlSrcSetBuilder(ute);

      expect(htmlBuildResult).toBe(`${IMAGE_URL}?width=400 400w`);
    });
  });

  describe('getAttrs', () => {
    it('returns alt and intrinsic dimensions', () => {
      const attrs = getAttrs(ute({alt: 'test alt', width: 1000, height: 800}));
      expect(attrs.alt).toBe('test alt');
      expect(attrs.width).toBe(1000);
      expect(attrs.height).toBe(800);
    });

    it('returns only src when no alt or dimensions set', () => {
      const attrs = getAttrs(ute);
      expect(attrs.src).toBe(IMAGE_URL);
      expect(attrs.alt).toBeUndefined();
      expect(attrs.width).toBeUndefined();
      expect(attrs.height).toBeUndefined();
    });

    it('returns overridden width and height separately and combined', () => {
      expect(getAttrs(ute({width: 1000, height: 800}).width(500)).width).toBe(500);
      expect(getAttrs(ute({width: 1000, height: 800}).height(500)).height).toBe(500);

      const attrs = getAttrs(ute({width: 1000, height: 800}).width(500).height(500));
      expect(attrs.width).toBe(500);
      expect(attrs.height).toBe(500);
    });
  });

  describe('getImgAttrs', () => {
    it('prefers initial alt over options alt', () => {
      const jsxImgAttrs = jsx.getImgAttrs(ute({alt: 'Initial Alt'}), {alt: 'New Alt'});
      expect(jsxImgAttrs.alt).toBe('Initial Alt');
      expect(jsx.getImgAttrs(ute, {alt: 'New Alt'}).alt).toBe('New Alt');

      const htmlImgAttrs = html.getImgAttrs(ute({alt: 'Initial Alt'}), {alt: 'New Alt'});
      expect(htmlImgAttrs.alt).toBe('Initial Alt');
      expect(html.getImgAttrs(ute, {alt: 'New Alt'}).alt).toBe('New Alt');
    });

    it('uses srcSetBuilder when provided', () => {
      const srcSetBuilder = vi.fn((yoot: Yoot) => `${yoot.url} 1x, ${ute.dpr(2).url} 2x`);
      const attrs = jsx.getImgAttrs(ute, {srcSetBuilder});

      expect(srcSetBuilder).toHaveBeenCalledWith(ute);
      expect(attrs.srcset).toBe(`${IMAGE_URL} 1x, ${IMAGE_URL}?dpr=2 2x`);
    });

    it('prioritizes srcSetBuilder over srcset string and includes sizes', () => {
      const srcSetBuilder = vi.fn((yoot: Yoot) => yoot.url.concat(' 1000w'));
      const attrs = jsx.getImgAttrs(ute, {
        srcset: `${IMAGE_URL} 500w`,
        srcSetBuilder,
        sizes: '50vw',
      });
      expect(srcSetBuilder).toHaveBeenCalledWith(ute);
      expect(attrs.srcset).toBe(`${IMAGE_URL} 1000w`);
      expect(attrs.sizes).toBe('50vw');
    });

    it('should return sizes only if srcset has been given or generated via srcSetBuilder', () => {
      // `srcset` is provided
      const attrsWithSrcset = jsx.getImgAttrs(ute, {
        srcset: jsx.buildSrcSet({widths: [300]}, ute),
        sizes: '50vw',
      });

      expect(attrsWithSrcset.sizes).toBe('50vw');

      // `srcSetBuilder` is provided
      const attrsWithSrcSetBuilder = jsx.getImgAttrs(ute, {
        srcSetBuilder: jsx.defineSrcSetBuilder({widths: [300]}),
        sizes: '50vw',
      });

      expect(attrsWithSrcSetBuilder.sizes).toBe('50vw');

      // No `srcset` or `srcSetBuilder` provided
      const attrsWithoutSrcset = jsx.getImgAttrs(ute, {sizes: '100vw'});
      expect(attrsWithoutSrcset.sizes).toBeUndefined();
    });

    it('should return style and not width and height when fit is contain', () => {
      const attrs = jsx.getImgAttrs(ute.fit('contain').width(1000).height(1000));

      expect(attrs.style).toEqual({maxWidth: '1000px', maxHeight: '1000px'});
      expect(attrs.width).toBeUndefined();
      expect(attrs.height).toBeUndefined();
    });

    it('HTML version converts keys to kebab-case', () => {
      const attrs = html.getImgAttrs(ute, {crossOrigin: 'anonymous'});
      expect(attrs['cross-origin']).toBe('anonymous');
    });
  });

  describe('withImgAttrs', () => {
    it('is callable and returns src', () => {
      expect(jsx.withImgAttrs({})(ute).src).toBe(IMAGE_URL);
      expect(html.withImgAttrs({})(ute).src).toBe(IMAGE_URL);
    });
  });

  describe('getSourceAttrs', () => {
    it('returns srcset instead of src for images', () => {
      const jsxSourceAttrs = jsx.getSourceAttrs(ute);
      expect(jsxSourceAttrs.src).toBeUndefined();
      expect(jsxSourceAttrs.srcset).toBe(IMAGE_URL);

      const htmlSourceAttrs = html.getSourceAttrs(ute);
      expect(htmlSourceAttrs.src).toBeUndefined();
      expect(htmlSourceAttrs.srcset).toBe(IMAGE_URL);
    });

    it('returns src instead of srcset for videos', () => {
      const videoUrl = 'https://cdn.example.com/videos/video.mp4';
      const ute = yoot(videoUrl);

      const jsxSourceAttrs = jsx.getSourceAttrs(ute);
      expect(jsxSourceAttrs.srcset).toBeUndefined();
      expect(jsxSourceAttrs.src).toBe(videoUrl);

      const htmlSourceAttrs = html.getSourceAttrs(ute);
      expect(htmlSourceAttrs.srcset).toBeUndefined();
      expect(htmlSourceAttrs.src).toBe(videoUrl);
    });

    it('does not return alt attribute', () => {
      // @ts-expect-error test for alt attribute
      expect(jsx.getSourceAttrs(ute.alt('test alt')).alt).toBeUndefined();
      // @ts-expect-error test for alt attribute
      expect(html.getSourceAttrs(ute.alt('test alt')).alt).toBeUndefined();
    });

    it('returns correct type attribute by file extension and format', () => {
      expect(jsx.getSourceAttrs(yoot(IMAGE_URL)).type).toBe('image/jpeg');
      expect(html.getSourceAttrs(yoot(IMAGE_URL)).type).toBe('image/jpeg');

      expect(jsx.getSourceAttrs(ute.format('jpg')).type).toBe('image/jpeg');
      expect(html.getSourceAttrs(ute.format('jpg')).type).toBe('image/jpeg');

      expect(jsx.getSourceAttrs(ute.format('png')).type).toBe('image/png');
      expect(html.getSourceAttrs(ute.format('png')).type).toBe('image/png');

      expect(jsx.getSourceAttrs(ute.format('webp')).type).toBe('image/webp');
      expect(html.getSourceAttrs(ute.format('webp')).type).toBe('image/webp');
    });

    it('mime type takes precedence over format', () => {
      expect(jsx.getSourceAttrs(ute.format('webp'), {type: 'image/jpeg'}).type).toBe('image/jpeg');
      expect(html.getSourceAttrs(ute.format('webp'), {type: 'image/jpeg'}).type).toBe('image/jpeg');
    });

    it('unsupported mime type should throw an error', () => {
      expect(() => jsx.getSourceAttrs(ute.format('webp'), {type: 'image/unsupported'})).toThrow();
      expect(() => html.getSourceAttrs(ute.format('webp'), {type: 'image/unsupported'})).toThrow();
    });

    it('uses srcSetBuilder if provided', () => {
      const srcSetBuilder = vi.fn((yoot: Yoot) => `${yoot.url} 1x`);
      const attrs = jsx.withSourceAttrs({srcSetBuilder})(yoot(IMAGE_URL).format('png'));

      expect(srcSetBuilder).toHaveBeenCalled();
      expect(attrs.srcset).toContain('format=png');
    });

    it('should not include type attribute when format is auto', () => {
      const _ute = ute.format('auto');

      const jsxAttrs = jsx.getSourceAttrs(_ute);
      const htmlAttrs = html.getSourceAttrs(_ute);

      expect(jsxAttrs.type).toBeUndefined();
      expect(htmlAttrs.type).toBeUndefined();
    });

    it('should return transformed dimensions', () => {
      const ute = yoot({src: IMAGE_URL, width: 2048, height: 2048}).width(200).height(100);

      const jsxAttrs = jsx.getSourceAttrs(ute);
      const htmlAttrs = html.getSourceAttrs(ute);

      expect(jsxAttrs.width).toBe(200);
      expect(jsxAttrs.height).toBe(100);

      expect(htmlAttrs.width).toBe(200);
      expect(htmlAttrs.height).toBe(100);
    });
  });

  describe('withSourceAttrs', () => {
    it('includes sizes if srcset is generated', () => {
      // -- JSX --
      const jsxSourceAttrs = jsx.withSourceAttrs({
        srcSetBuilder: (yoot: Yoot) => yoot.url.concat(' 100w'),
        sizes: '100vw',
      })(yoot(IMAGE_URL).format('webp'));

      expect(jsxSourceAttrs.srcset).toContain('format=webp');
      expect(jsxSourceAttrs.sizes).toBe('100vw');

      // -- HTML --
      const htmlSourceAttrs = html.withSourceAttrs({
        srcSetBuilder: (yoot: Yoot) => yoot.url.concat(' 100w'),
        sizes: '100vw',
      })(yoot(IMAGE_URL).format('webp'));

      expect(htmlSourceAttrs.srcset).toContain('format=webp');
      expect(htmlSourceAttrs.sizes).toBe('100vw');
    });
  });

  describe('invariant', () => {
    it('throws if condition is false', () => {
      expect(() => invariant(false, 'Error message')).toThrow('Error message');
    });

    it('does not throw if condition is true', () => {
      expect(() => invariant(true, 'Error message')).not.toThrow();
    });
  });

  describe('mustBeInRange', () => {
    it('throws if value outside of range and does not throw within range', () => {
      expect(() => mustBeInRange(1, 100)('width', 0)).toThrow();
      expect(() => mustBeInRange(1, 100)('width', 101)).toThrow();
      expect(() => mustBeInRange(1, 100)('width', 50)).not.toThrow();
      expect(() => mustBeInRange(1, 100)('width', 1)).not.toThrow();
      expect(() => mustBeInRange(0, 100)('width', 0)).not.toThrow();
    });
  });

  describe('mustBeOneOf', () => {
    it('throws if value not in set and does not throw if in set', () => {
      const allowed = new Set(['jpg', 'png']);
      expect(() => mustBeOneOf(allowed)('format', 'gif')).toThrow();
      expect(() => mustBeOneOf(allowed)('format', 'webp')).toThrow();
      expect(() => mustBeOneOf(allowed)('format', 'jpg')).not.toThrow();
      expect(() => mustBeOneOf(allowed)('format', 'png')).not.toThrow();
    });
  });
});
