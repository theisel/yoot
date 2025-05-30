import {describe, expectString, getImageUrl, it, runTestCase} from './utils';

const testFit = it.each([
  {fit: 'cover', expected: 'c_fill'},
  {fit: 'contain', expected: 'c_fit'},
]);

describe('Cloudinary Adapter - Fit', () => {
  testFit('should generate correct path segment when fit is $fit', ({fit, expected}) => {
    runTestCase({
      // @ts-expect-error Accept any fit value for test purposes
      input: {directives: {fit}},
      expected: expectString(getImageUrl(expected)),
    });
  });
});
