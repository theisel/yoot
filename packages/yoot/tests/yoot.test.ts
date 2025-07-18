import {beforeEach, describe, expect, it} from 'vitest';
import {createTemplate} from '@yoot/test-kit';
import type {GenerateUrlInput, YootFactory, YootInput} from '../src';
import {unwrapInput} from '../src/core/yoot';

const IMAGE_URL = 'https://foo.com/images/file.webp';
const IMAGE_URL_WITH_DIRECTIVES = 'https://foo.com/images/file.webp?width=300&height=200&format=webp';

const randomHash = () => Math.random().toString(16).substring(2, 15);
const generateImageUrl = () => `https://foo.com/images/image-${randomHash()}.webp`;

const generateUrl = (input: GenerateUrlInput) => {
  const params = Object.entries({...input.directives}).reduce((params, [key, value]) => {
    return params.set(key, String(value)), params;
  }, new URLSearchParams());

  const url = new URL(input.src);
  url.search = String(params);
  return url.href;
};

const normalizeUrl = (url: URL) => {
  url.search = '';
  url.hash = '';
  return url.href;
};

let yoot: YootFactory;

describe('@yoot/yoot', () => {
  describe('Core Functionality', () => {
    beforeEach(async () => {
      const {defineAdapter, registerAdapters, ...exports} = await import('../src');
      yoot = exports.yoot;

      const adapter = defineAdapter({
        supports: (url: URL) => url.hostname === 'foo.com',
        normalizeUrl,
        generateUrl,
      });

      registerAdapters(adapter);
    });

    describe('Initialization', () => {
      it('should initialize with empty state if no input is provided', () => {
        const api = yoot();
        expect(api.toJSON()).toEqual({directives: {}});
      });

      it('should safely initialize with an invalid string input', () => {
        const api = yoot('oops');
        expect(api.toJSON()).toEqual({directives: {}});
      });

      it('should safely initialize with an invalid JSON string', () => {
        const api = yoot('{oops}');
        expect(api.toJSON()).toEqual({directives: {}});
      });

      it('should initialize state with just an image url', () => {
        const api = yoot(IMAGE_URL);

        expect(api.url).toBe(IMAGE_URL);
        expect(api.toJSON().src).toBe(IMAGE_URL);
      });

      it('should initialize state with an input object', () => {
        const input = {src: IMAGE_URL, alt: 'Test'};
        const api = yoot(input);
        const state = api.toJSON();

        expect(state).toEqual({...input, directives: {}});
      });

      it('should initialize with a Yoot object', () => {
        const ute = yoot(IMAGE_URL);
        const ute2 = yoot(ute);

        expect(ute.toJSON().src).toBe(IMAGE_URL);
        expect(ute2.toJSON().src).toBe(IMAGE_URL);
      });

      it('should be immutable', () => {
        const directives = {width: 100};
        const api = yoot({src: IMAGE_URL, directives});

        // Modify original objects (should not affect API state)
        directives.width = 200;

        const state = api.toJSON();

        expect(state.directives).toEqual({width: 100});
      });

      it('should handle input object with undefined directives', () => {
        const api = yoot({src: IMAGE_URL, directives: undefined});

        const state = api.toJSON();

        expect(state.src).toBe(IMAGE_URL);
        expect(state.directives).toEqual({});
      });
    });

    describe('API Methods and Chaining', () => {
      it('should create immutable API objects on each method call', () => {
        const base = yoot({src: IMAGE_URL});
        const withWidth = base.width(100);
        const withHeight = withWidth.height(200);

        const baseState = base.toJSON();
        const withWidthState = withWidth.toJSON();
        const withHeightState = withHeight.toJSON();

        expect(baseState.directives).toEqual({});
        expect(withWidthState.directives).toEqual({width: 100});
        expect(withHeightState.directives).toEqual({width: 100, height: 200});
      });

      it('should merge directives correctly with .map() method', () => {
        const base = yoot({src: IMAGE_URL, directives: {width: 100, format: 'jpg'}});

        const updated = base.map((state) => {
          state.directives.quality = 80;
          state.directives.format = 'webp';
          return state;
        });

        expect(updated.toJSON().directives).toEqual({width: 100, format: 'webp', quality: 80});
      });

      it('should return a new API object with the same state', () => {
        const base = yoot({src: IMAGE_URL, alt: 'Test'});
        const next = base(); // Call with no arguments

        expect(next).not.toBe(base);
        expect(next.toJSON()).toEqual(base.toJSON());
      });

      it('should update src when invoking the API object directly with a URL string', () => {
        const baseSrc = generateImageUrl();
        const base = yoot({src: baseSrc});

        const updatedSrc = generateImageUrl();
        const updated = base(updatedSrc);

        expect(base.toJSON().src).toBe(baseSrc);
        expect(updated.toJSON().src).toBe(updatedSrc);
      });
    });

    describe('State Merging', () => {
      it('should merge directives with changes taking precedence', () => {
        const base = yoot({
          src: IMAGE_URL,
          alt: 'Old Alt',
          directives: {width: 100},
        });

        const next = base({alt: 'New Alt', directives: {height: 200}});
        const nextState = next.toJSON();

        expect(nextState.alt).toBe('New Alt');
        expect(nextState.directives).toEqual({width: 100, height: 200});
      });

      it('should handle directives being initially undefined in current state', () => {
        const base = yoot({src: IMAGE_URL});
        const withDirectives = base({directives: {width: 100}});

        expect(withDirectives.toJSON().directives).toEqual({width: 100});
      });

      it('should handle "directives" being undefined in changes', () => {
        const base = yoot({src: IMAGE_URL, directives: {width: 100}});
        const changed = base({directives: undefined});

        expect(changed.toJSON().directives).toEqual({width: 100});
      });
    });

    describe('Output Methods', () => {
      it('should return a transformed URL', () => {
        const ute = yoot(IMAGE_URL).width(300).height(200).format('webp');
        expect(ute.url).toBe(`${IMAGE_URL}?width=300&height=200&format=webp`);
      });

      describe('baseUrl', () => {
        it('should return a normalized URL', () => {
          expect(yoot(IMAGE_URL_WITH_DIRECTIVES).baseUrl).toBe(IMAGE_URL);
        });

        it('should return null when a bad src URL is given', () => {
          expect(yoot({src: 'oops'}).baseUrl).toBe(null);
        });
      });

      describe('hasSrc', () => {
        it('should return true when src is given', () => {
          expect(yoot(IMAGE_URL).hasSrc).toBe(true);
        });

        it('should return false when src is empty', () => {
          expect(yoot().hasSrc).toBe(false);
        });
      });

      it('should successfully serialize and deserialize', () => {
        const input: YootInput = {
          src: IMAGE_URL,
          alt: 'Test Alt',
          width: 800,
          height: 600,
          directives: {format: 'webp', quality: 75},
        };

        const serialized = JSON.stringify(yoot(input));
        const deserialized = JSON.parse(serialized);

        expect(deserialized).toEqual({...input});
      });

      it('should serialize correctly when optional directives are nullish', () => {
        const ute = yoot({src: IMAGE_URL, alt: 'Test', directives: undefined});
        const serialized = JSON.stringify(ute);
        const deserialized = JSON.parse(serialized);

        expect(deserialized).toEqual({src: IMAGE_URL, alt: 'Test', directives: {}});
      });
    });

    describe('Image src Handling and Errors', () => {
      const tpl = createTemplate('should throw an error when calling %s with image src is not set');

      it(tpl`.url`, () => {
        expect(() => yoot().url).toThrowError();
      });

      it(tpl`.toString()`, () => {
        expect(() => yoot().toString()).toThrowError();
      });
    });
  });

  describe('Internal Functions', () => {
    describe('unwrapInput', () => {
      it('should unwrap valid inputs', () => {
        expect(unwrapInput({src: IMAGE_URL})).toEqual({src: IMAGE_URL});
        expect(unwrapInput(JSON.stringify({src: IMAGE_URL}))).toEqual({src: IMAGE_URL});
      });

      it('should handle undefined or malformed input gracefully', () => {
        expect(unwrapInput()).toEqual({});
        expect(unwrapInput(undefined)).toEqual({});
        // @ts-expect-error Intentionally passing invalid value
        expect(unwrapInput(null)).toEqual({});
        // @ts-expect-error Intentionally passing invalid value
        expect(unwrapInput([])).toEqual({});
        expect(unwrapInput({})).toEqual({});
      });

      it('should handle invalid string input safely', () => {
        expect(unwrapInput('')).toEqual({});
        expect(unwrapInput('{}')).toEqual({});
        expect(unwrapInput('[]')).toEqual({});
        expect(unwrapInput('null')).toEqual({});
        expect(unwrapInput('undefined')).toEqual({});
      });
    });
  });
});
