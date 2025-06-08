import {describe, expectParams} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {testEach} from './utils';

const qualityTestCases: TestCase[] = [
  {
    description: 'should add q=75 query parameter to URL',
    input: {directives: {quality: 75}},
    expected: expectParams({q: '75'}),
  },
];

describe('Imgix Adapter - Quality', () => testEach(qualityTestCases));
