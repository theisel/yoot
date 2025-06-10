import {describe, expect, expectParams, it} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {adapter} from '../src/core/adapter';
import {IMAGE_URL, IMAGE_URL_WITH_DIRECTIVES} from './constants';
import {testEach} from './utils';

const testCases: TestCase[] = [
  {
    description: 'should generate correct url from a previously transformed URL',
    input: {src: IMAGE_URL_WITH_DIRECTIVES, directives: {width: 100, height: 100}},
    expected: expectParams({w: '100', h: '100'}),
  },
];

describe('Imgix Adapter - Extra', () => {
  testEach(testCases);

  it('should support `imgix.net` hostname', () => {
    expect(adapter.supports(new URL('https://assets.imgix.net'))).toBe(true);
    expect(adapter.supports(new URL('https://cdn.imgix.net'))).toBe(true);
    // Should return false for the following hostnames
    expect(adapter.supports(new URL('https://foo.com'))).toBe(false);
  });

  it('should return a normalized url', () => {
    // Ensure base URL strips directives and hash
    const transformedUrl = new URL(IMAGE_URL_WITH_DIRECTIVES);
    transformedUrl.hash = '#baz';

    const baseUrl = adapter.normalizeUrl(transformedUrl);

    expect(baseUrl).toBe(IMAGE_URL);
  });
});
