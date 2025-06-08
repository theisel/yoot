import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {getImageUrl, testEach} from './utils';

const fitTestCases: TestCase[] = [
  {
    description: 'should generate _100x_crop_center path segment when fit directive is cover',
    input: {directives: {fit: 'cover', width: 100}},
    expected: expectString(getImageUrl('_100x_crop_center')),
  },
  {
    description: 'should ignore generating path segment when fit directive is contain',
    input: {directives: {fit: 'contain', width: 100}},
    expected: expectString(getImageUrl('_100x')),
  },
];

describe('Shopify Adapter - Fit', () => testEach(fitTestCases));
