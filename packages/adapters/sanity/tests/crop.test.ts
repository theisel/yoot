import {describe, expectParams} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {testEach} from './utils';

const CROP_OPTIONS = ['center', 'top', 'bottom', 'left', 'right'] as const;

const cropTestCases: TestCase[] = CROP_OPTIONS.map((crop) => {
  return {
    description: `should add crop=${crop} query parameter to URL`,
    input: {directives: {crop}},
    expected: expectParams({crop}),
  };
});

describe('Sanity Adapter - Crop', () => testEach(cropTestCases));
