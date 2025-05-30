import {urlParts} from '../src/core/adapter';
import {IMAGE_URL, IMAGE_URL_WITH_DIRECTIVES} from './constants';
import {defineCases, describe, expect, expectString, getImageUrl, it, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should generate correct url with a previously transformed URL',
    input: {src: IMAGE_URL_WITH_DIRECTIVES, directives: {width: 100}},
    expected: expectString(getImageUrl('w_100')),
  },
]);

describe('Cloudinary Adapter - Extra', () => {
  testEach(testCases);

  it('should remove previously applied directives', () => {
    const [left, right] = urlParts(IMAGE_URL_WITH_DIRECTIVES);

    expect(`${left}${right}`).toBe(IMAGE_URL);
  });
});
