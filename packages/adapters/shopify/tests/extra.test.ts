import {IMAGE_URL_WITH_DIRECTIVES} from './constants';
import {createTemplate, defineCases, describe, expectString, getImageUrl, testEach} from './utils';

const desc = createTemplate('should generate correct url ');

const testCases = defineCases([
  {
    description: desc`using a previously transformed URL`,
    input: {src: IMAGE_URL_WITH_DIRECTIVES, directives: {width: 200}},
    expected: expectString(getImageUrl('_200x')),
  },
]);

describe('Shopify Adapter - Extra', () => testEach(testCases));
