import {describe, expectParams, it, runTestCase} from './utils';

const testCrops = it.each([
  {crop: 'center', expected: 'center'},
  {crop: 'top', expected: 'top'},
  {crop: 'bottom', expected: 'bottom'},
  {crop: 'left', expected: 'left'},
  {crop: 'right', expected: 'right'},
]);

describe('Sanity Adapter - Crop', () => {
  testCrops('should generate correct parameter when crop is $crop', ({crop, expected}) => {
    runTestCase({
      // @ts-expect-error Accept any crop value for test purposes
      input: {directives: {crop}},
      expected: expectParams({crop: expected}),
    });
  });
});
