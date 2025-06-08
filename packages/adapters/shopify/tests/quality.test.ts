import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {IMAGE_URL} from './constants';
import {testEach} from './utils';

const testCases: TestCase[] = [
  {
    description: "should ignore quality directive when given as it's not supported",
    input: {directives: {quality: 75}},
    expected: expectString(IMAGE_URL),
  },
];

describe('Shopify Adapter - Quality', () => testEach(testCases));
