import {defineCases, describe, expectString, getImageUrl, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should generate _crop_center path segment when fit directive is cover',
    input: {directives: {fit: 'cover', width: 100}},
    expected: expectString(getImageUrl('_100x_crop_center')),
  },
  {
    description: 'should ignore generating path segment when fit directive is contain',
    input: {directives: {fit: 'contain', width: 100}},
    expected: expectString(getImageUrl('_100x')),
  },
]);

describe('Shopify Adapter - Fit', () => testEach(testCases));
