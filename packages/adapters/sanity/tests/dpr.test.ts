import {describe, expectParams} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {testEach} from './utils';

const dprTestCases: TestCase[] = [
  {
    description: 'should add dpr=2 query parameter to URL',
    input: {directives: {dpr: 2}},
    expected: expectParams({dpr: '2'}),
  },
];

describe('Sanity Adapter - Dpr', () => testEach(dprTestCases));
