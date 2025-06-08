import {describe, expectParams} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {testEach} from './utils';

const FIT_TO_QUERY_PARAM_VALUE = [
  ['cover', 'crop'],
  ['contain', 'clip'],
] as const;

const fitTestCases: TestCase[] = FIT_TO_QUERY_PARAM_VALUE.map(([fit, paramValue]) => {
  return {
    description: `should add fit=${paramValue} query parameter to URL`,
    input: {directives: {fit}},
    expected: expectParams({fit: paramValue}),
  };
});

describe('Imgix Adapter - Fit', () => testEach(fitTestCases));
