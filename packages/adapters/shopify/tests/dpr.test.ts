import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {getImageUrl, testEach} from './utils';

const validDprTestCases: TestCase[] = [
  {
    description: 'should add dpr path segment to URL',
    input: {directives: {dpr: 2}},
    expected: expectString(getImageUrl('@2x')),
  },
  {
    description: 'should cap dpr to 3 when dpr is greater than 3',
    input: {directives: {dpr: 4}},
    expected: expectString(getImageUrl('@3x')),
  },
  {
    description: 'should round dpr 2.5 to 3',
    input: {directives: {dpr: 2.5}},
    expected: expectString(getImageUrl('@3x')),
  },
  {
    description: 'should round dpr 2.4 to 2',
    input: {directives: {dpr: 2.4}},
    expected: expectString(getImageUrl('@2x')),
  },
];

const invalidDprTestCases: TestCase[] = [
  {
    description: 'should ignore numeric strings',
    /* @ts-expect-error Intentionally passing invalid type */
    input: {directives: {dpr: '2'}},
    expected: expectString(getImageUrl('')),
  },
  {
    description: 'should ignore dpr less than 1',
    input: {directives: {dpr: 0.5}},
    expected: expectString(getImageUrl('')),
  },
  {
    description: 'should ignore negative value',
    input: {directives: {dpr: -2}},
    expected: expectString(getImageUrl('')),
  },
  {
    description: 'should treat null dpr as invalid and ignore',
    /* @ts-expect-error Intentionally passing invalid value */
    input: {directives: {dpr: null}},
    expected: expectString(getImageUrl('')),
  },
  {
    description: 'should ignore NaN dpr',
    input: {directives: {dpr: NaN}},
    expected: expectString(getImageUrl('')),
  },
];

describe('Shopify Adapter - Dpr', () => {
  describe('Valid DPRs', () => {
    testEach(validDprTestCases);
  });

  describe('Invalid DPRs', () => {
    testEach(invalidDprTestCases);
  });
});
