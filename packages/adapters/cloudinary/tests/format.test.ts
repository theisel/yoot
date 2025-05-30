import {describe, expectString, getImageUrl, it, runTestCase} from './utils';

const testFormats = it.each(['auto', 'jpg', 'png', 'webp']);

describe('Cloudinary Adapter - Format', () => {
  testFormats('should generate correct path segment when format is %s', (format) => {
    runTestCase({
      // @ts-expect-error Accept any format value for test purposes
      input: {directives: {format}},
      expected: expectString(getImageUrl(`f_${format}`)),
    });
  });
});
