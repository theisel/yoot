import {IMAGE_URL} from './constants';
import {defineCases, describe, expectString, getImageUrl, it, runTestCase, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should ignore crop directive when width and height are omitted',
    input: {directives: {crop: 'center'}},
    expected: expectString(IMAGE_URL),
  },
  {
    description: 'should ignore invalid crop directive',
    // @ts-expect-error Intentionally passing an invalid crop value
    input: {directives: {crop: 'oops'}},
    expected: expectString(IMAGE_URL),
  },
]);

const crops = ['top', 'bottom', 'left', 'right', 'center'];
const testCropWithWidth = it.each(crops);
const testCropWithHeight = it.each(crops);

describe('Shopify Adapter - Crop', () => {
  testEach(testCases);

  testCropWithWidth('should generate _100x_crop_%s path segment when crop and width are given', (crop: string) => {
    runTestCase({
      // @ts-expect-error Accept any value for test purposes
      input: {directives: {width: 100, crop}},
      expected: expectString(getImageUrl(`_100x_crop_${crop}`)),
    });
  });

  testCropWithHeight('should generate _x100_crop_%s path segment when crop and height are given', (crop: string) => {
    runTestCase({
      // @ts-expect-error Accept any crop value for test purposes
      input: {directives: {height: 100, crop}},
      expected: expectString(getImageUrl(`_x100_crop_${crop}`)),
    });
  });
});
