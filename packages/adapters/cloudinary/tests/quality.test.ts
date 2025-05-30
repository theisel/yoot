import {defineCases, describe, expectString, getImageUrl, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should generate correct path segment when quality is given',
    input: {directives: {quality: 75}},
    expected: expectString(getImageUrl('q_75')),
  },
]);

describe('Cloudinary Adapter - Quality', () => testEach(testCases));
