import {describe, expect, expectString, it} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {adapter} from '../src/core/adapter';
import {IMAGE_URL, IMAGE_URL_WITH_DIRECTIVES} from './constants';
import {getImageUrl, testEach} from './utils';

const testCases: TestCase[] = [
  {
    description: 'should generate correct url from a previously transformed URL',
    input: {src: IMAGE_URL_WITH_DIRECTIVES, directives: {width: 200}},
    expected: expectString(getImageUrl('_200x')),
  },
];

describe('Shopify Adapter - Extra', () => {
  testEach(testCases);

  it('should return a normalized url', () => {
    // Ensure base URL strips directives, hash, and query parameters
    const transformedUrl = new URL(IMAGE_URL_WITH_DIRECTIVES);
    transformedUrl.searchParams.set('foo', 'bar');
    transformedUrl.hash = '#baz';

    const baseUrl = adapter.normalizeUrl(transformedUrl);

    expect(baseUrl).toBe(IMAGE_URL);
  });
});
