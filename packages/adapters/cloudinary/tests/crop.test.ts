import {describe, expectString} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {getImageUrl, testEach} from './utils';

const CROP_TO_PATH_SEGMENT = [
  ['center', 'g_center'],
  ['top', 'g_north'],
  ['bottom', 'g_south'],
  ['left', 'g_west'],
  ['right', 'g_east'],
] as const;

const cropTestCases: TestCase[] = CROP_TO_PATH_SEGMENT.map(([crop, pathSegment]) => {
  return {
    description: `should add ${pathSegment} path segment to URL`,
    input: {directives: {crop}},
    expected: expectString(getImageUrl(pathSegment)),
  };
});

describe('Cloudinary Adapter - Crop', () => testEach(cropTestCases));
