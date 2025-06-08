import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {getImageUrl, testEach} from './utils';

const qualityTestCases: TestCase[] = [
  {
    description: 'should add q_75 path segment to URL',
    input: {directives: {quality: 75}},
    expected: expectString(getImageUrl('q_75')),
  },
];

describe('Cloudinary Adapter - Quality', () => testEach(qualityTestCases));
