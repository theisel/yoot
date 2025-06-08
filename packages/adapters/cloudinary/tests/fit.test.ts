import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {getImageUrl, testEach} from './utils';

const FIT_TO_PATH_SEGMENT = [
  ['cover', 'c_fill'],
  ['contain', 'c_fit'],
] as const;

const fitTestCases: TestCase[] = FIT_TO_PATH_SEGMENT.map(([fit, pathSegment]) => {
  return {
    description: `should add ${pathSegment} path segment to URL`,
    input: {directives: {fit}},
    expected: expectString(getImageUrl(pathSegment)),
  };
});

describe('Cloudinary Adapter - Fit', () => testEach(fitTestCases));
