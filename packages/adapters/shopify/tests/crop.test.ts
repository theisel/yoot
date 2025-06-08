import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {IMAGE_URL} from './constants';
import {getImageUrl, testEach} from './utils';

const CROP_OPTIONS = ['center', 'top', 'bottom', 'left', 'right'] as const;

const cropTestCases: TestCase[] = CROP_OPTIONS.map((crop) => {
  return {
    description: `should add _100x__crop_${crop} path segment to URL`,
    input: {directives: {crop, width: 100}},
    expected: expectString(getImageUrl(`_100x_crop_${crop}`)),
  };
});

const additionalCropTestCases: TestCase[] = [
  {
    description: 'should ignore crop directive when width and height are omitted',
    input: {directives: {crop: 'center'}},
    expected: expectString(IMAGE_URL),
  },
];

describe('Shopify Adapter - Crop', () => testEach(cropTestCases.concat(additionalCropTestCases)));
