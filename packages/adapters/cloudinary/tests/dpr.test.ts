import {defineCases, describe, expectString, getImageUrl, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should generate correct path segment when dpr is given',
    input: {directives: {dpr: 2}},
    expected: expectString(getImageUrl('dpr_2')),
  },
]);

describe('Cloudinary Adapter - Dpr', () => testEach(testCases));
