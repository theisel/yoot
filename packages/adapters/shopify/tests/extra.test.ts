import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {IMAGE_URL_WITH_DIRECTIVES} from './constants';
import {getImageUrl, testEach} from './utils';

const testCases: TestCase[] = [
  {
    description: 'should generate correct url from a previously transformed URL',
    input: {src: IMAGE_URL_WITH_DIRECTIVES, directives: {width: 200}},
    expected: expectString(getImageUrl('_200x')),
  },
];

describe('Shopify Adapter - Extra', () => testEach(testCases));
