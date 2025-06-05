import {beforeEach, describe, expect, it} from 'vitest';
import {createTemplate} from '@yoot/test-kit';
import type {YootFactory, YootInput} from '../src';

const IMAGE_URL = 'https://foo.com/images/file.webp';

const randomHash = () => Math.random().toString(16).substring(2, 15);
const generateUrl = () => `https://foo.com/images/image-${randomHash()}.webp`;

let yoot: YootFactory;

beforeEach(async () => {
  const {defineAdapter, registerAdapters, ...exports} = await import('../src');
  yoot = exports.yoot;

  const adapter = defineAdapter({
    supports: (url: URL) => url.hostname === 'foo.com',
    generateUrl: (input) => {
      const url = new URL(input.src);
      const params = Object.entries({...input.directives}).reduce((params, [key, value]) => {
        return params.set(key, String(value)), params;
      }, new URLSearchParams());
      url.search = String(params);
      return url.href;
    },
  });

  registerAdapters(adapter);
});

describe('@yoot/yoot - Core Functionality', () => {
  describe('Initialization', () => {
    it('should initialize with empty state if no input is provided', () => {
      const api = yoot();

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
      const nvc = yoot(IMAGE_URL);
      const nvc2 = yoot(nvc);

      expect(nvc.toJSON().src).toBe(IMAGE_URL);
      expect(nvc2.toJSON().src).toBe(IMAGE_URL);
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
      const baseSrc = generateUrl();
      const base = yoot({src: baseSrc});

      const updatedSrc = generateUrl();
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
      const nvc = yoot(IMAGE_URL).width(300).height(200).format('webp');
      expect(nvc.url).toBe(`${IMAGE_URL}?width=300&height=200&format=webp`);
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
      const nvc = yoot({src: IMAGE_URL, alt: 'Test', directives: undefined});
      const serialized = JSON.stringify(nvc);
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
