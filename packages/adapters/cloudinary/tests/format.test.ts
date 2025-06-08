import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {getImageUrl, testEach} from './utils';

const FORMAT_TO_PATH_SEGMENT = [
  ['auto', 'f_auto'],
  ['jpg', 'f_jpg'],
  ['png', 'f_png'],
  ['webp', 'f_webp'],
] as const;

const formatTestCases: TestCase[] = FORMAT_TO_PATH_SEGMENT.map(([format, pathSegment]) => {
  return {
    description: `should add ${pathSegment} path segment to URL`,
    input: {directives: {format}},
    expected: expectString(getImageUrl(pathSegment)),
  };
});

describe('Cloudinary Adapter - Format', () => testEach(formatTestCases));
