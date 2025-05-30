import {IMAGE_URL} from './constants';
import {defineCases, describe, expectString, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should generate correct path segment when quality is given',
    input: {directives: {quality: 75}},
    expected: expectString(IMAGE_URL),
  },
]);

describe('Shopify Adapter - Quality', () => testEach(testCases));
