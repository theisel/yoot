import {describe, expectParams} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {testEach} from './utils';

const FORMAT_OPTIONS = ['jpg', 'png', 'webp'] as const;

const formatTestCases: TestCase[] = FORMAT_OPTIONS.map((format) => {
  return {
    description: `should add fm=${format} query parameter to URL`,
    input: {directives: {format}},
    expected: expectParams({fm: format}),
  };
});

const autoFormatTestCase: TestCase = {
  description: 'should add auto=format query parameter to URL',
  input: {directives: {format: 'auto'}},
  expected: expectParams({auto: 'format'}),
};

describe('Sanity Adapter - Format', () => testEach(formatTestCases.concat(autoFormatTestCase)));
