import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {getImageUrl, testEach} from './utils';

const dprTestCases: TestCase[] = [
  {
    description: 'should add dpr (@2x) path segment to URL',
    input: {directives: {dpr: 2}},
    expected: expectString(getImageUrl('@2x')),
  },
];

describe('Shopify Adapter - Dpr', () => testEach(dprTestCases));
