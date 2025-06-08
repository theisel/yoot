import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {getImageUrl, testEach} from './utils';

const formatTestCases: TestCase[] = (['jpg', 'png', 'webp'] as const).map((format) => {
  return {
    description: `should add format ${format} extension to URL`,
    input: {directives: {format}},
    expected: expectString(getImageUrl('', `.${format}`)),
  };
});

const autoFormatTestCase: TestCase = {
  description: 'should not add format extension to URL when format is auto',
  input: {directives: {format: 'auto'}},
  expected: expectString(getImageUrl('')),
};

describe('Shopify Adapter - Format', () => testEach(formatTestCases.concat(autoFormatTestCase)));
