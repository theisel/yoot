import {describe, expectString, getImageUrl, it, runTestCase} from './utils';

const testFormats = it.each([
  {format: 'auto', expected: ''},
  {format: 'jpg', expected: '.jpg'},
  {format: 'png', expected: '.png'},
  {format: 'webp', expected: '.webp'},
]);

describe('Shopify Adapter - Format', () => {
  testFormats('should generate correct file extension when format is $format', ({format, expected}) => {
    runTestCase({
      // @ts-expect-error Accept any format value for test purposes
      input: {directives: {format}},
      expected: expectString(getImageUrl('', expected)),
    });
  });
});
