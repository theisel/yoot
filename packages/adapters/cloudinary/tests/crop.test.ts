import {describe, expectString, getImageUrl, it, runTestCase} from './utils';

const testCrop = it.each([
  {crop: 'center', expected: 'g_center'},
  {crop: 'top', expected: 'g_north'},
  {crop: 'bottom', expected: 'g_south'},
  {crop: 'left', expected: 'g_west'},
  {crop: 'right', expected: 'g_east'},
]);

describe('Imgix Adapter - Crop', () => {
  testCrop('should generate correct path segment when crop is $crop', ({crop, expected}) => {
    runTestCase({
      // @ts-expect-error Accept any crop value for test purposes
      input: {directives: {crop}},
      expected: expectString(getImageUrl(expected)),
    });
  });
});
