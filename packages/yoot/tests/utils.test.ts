import {describe, it, expect} from '@yoot/test-kit';

import {
  hasDimensions,
  invariant,
  isFunction,
  isNumber,
  isEmpty,
  isNullish,
  isKeyOf,
  isPlainObject,
  isString,
  isUrl,
} from '../src/core/utils';

describe('utils', () => {
  describe('hasDimensions', () => {
    it('returns true for object with valid width and height', () => {
      expect(hasDimensions({width: 100, height: 200})).toBe(true);
    });

    it('returns false if input is undefined or has non-numeric dimensions', () => {
      expect(hasDimensions(undefined)).toBe(false);
      expect(hasDimensions({width: '100', height: 200})).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('correctly identifies functions and non-functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction('string')).toBe(false);
      expect(isFunction(123)).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('returns true for a plain object literal', () => {
      expect(isPlainObject({a: 1})).toBe(true);
    });

    it('returns true for an object with no prototype', () => {
      const obj = Object.create(null);
      expect(isPlainObject(obj)).toBe(true);
    });

    it('returns false for arrays', () => {
      expect(isPlainObject([1, 2, 3])).toBe(false);
    });

    it('returns false for null', () => {
      expect(isPlainObject(null)).toBe(false);
    });

    it('returns false for class instances', () => {
      class Foo {
        x = 1;
      }
      expect(isPlainObject(new Foo())).toBe(false);
    });

    it('returns false for functions', () => {
      expect(isPlainObject(() => {})).toBe(false);
    });

    it('returns false for primitive types', () => {
      expect(isPlainObject('hello')).toBe(false);
      expect(isPlainObject(42)).toBe(false);
      expect(isPlainObject(true)).toBe(false);
      expect(isPlainObject(Symbol('x'))).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
    });

    it('returns false for Date objects', () => {
      expect(isPlainObject(new Date())).toBe(false);
    });

    it('returns false for RegExp objects', () => {
      expect(isPlainObject(/abc/)).toBe(false);
      expect(isPlainObject(new RegExp('abc'))).toBe(false);
    });

    it('returns false for Map and Set', () => {
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(new Set())).toBe(false);
    });
  });

  describe('isString', () => {
    it('returns true only for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('returns true for finite numbers and false otherwise', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber('123')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('returns true for null, undefined, or empty string', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
    });

    it('returns false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(0)).toBe(false);
    });
  });

  describe('isNullish', () => {
    it('returns true for null and undefined, false otherwise', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
      expect(isNullish(0)).toBe(false);
    });
  });

  describe('isKeyOf', () => {
    const obj = {a: 1, b: 2, 3: 'c'};

    it('returns true for keys in object, false for others', () => {
      expect(isKeyOf('a', obj)).toBe(true);
      expect(isKeyOf(3, obj)).toBe(true);
      expect(isKeyOf('missing', obj)).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should return true with valid URL', () => {
      expect(isUrl('https://foo.com')).toBe(true);
    });

    it('should return false with invalid URL', () => {
      expect(isUrl('foo')).toBe(false);
    });
  });

  describe('invariant', () => {
    it('does not throw if condition is truthy', () => {
      expect(() => invariant(true, 'should not throw')).not.toThrow();
    });

    it('throws with string or lazy message if condition is falsy', () => {
      expect(() => invariant(false, 'failure')).toThrowError('failure');
      expect(() => invariant(false, () => 'lazy')).toThrowError('lazy');
    });
  });
});
