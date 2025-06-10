import {describe, expect, expectString, it} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {adapter} from '../src/core/adapter';
import {IMAGE_URL, IMAGE_URL_WITH_DIRECTIVES} from './constants';
import {getImageUrl, testEach} from './utils';

const testCases: TestCase[] = [
  {
    description: 'should generate correct url from a previously transformed URL',
    input: {src: IMAGE_URL_WITH_DIRECTIVES, directives: {width: 100}},
    expected: expectString(getImageUrl('w_100')),
  },
];

describe('Cloudinary Adapter - Extra', () => {
  testEach(testCases);

  it('should support `res.cloudinary.com` and `cloudinary-a.akamaihd.net` hostnames', () => {
    expect(adapter.supports(new URL('https://res.cloudinary.com'))).toBe(true);
    expect(adapter.supports(new URL('https://cloudinary-a.akamaihd.net'))).toBe(true);
    // Should return false for the following hostnames
    expect(adapter.supports(new URL('https://cdn.cloudinary.com'))).toBe(false);
    expect(adapter.supports(new URL('https://foo.com'))).toBe(false);
  });

  it('should return a normalized url', () => {
    // Ensure base URL strips directives, hash, and query parameters
    const transformedUrl = new URL(IMAGE_URL_WITH_DIRECTIVES);
    transformedUrl.searchParams.set('foo', 'bar');
    transformedUrl.hash = '#baz';

    const baseUrl = adapter.normalizeUrl(transformedUrl);

    expect(baseUrl).toBe(IMAGE_URL);
  });
});
