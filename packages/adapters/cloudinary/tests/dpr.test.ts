import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {getImageUrl, testEach} from './utils';

const dprTestCases: TestCase[] = [
  {
    description: 'should add dpr_2 path segment to URL',
    input: {directives: {dpr: 2}},
    expected: expectString(getImageUrl('dpr_2')),
  },
];

describe('Cloudinary Adapter - Dpr', () => testEach(dprTestCases));
