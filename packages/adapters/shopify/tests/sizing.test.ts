import {IMAGE_METADATA, IMAGE_URL} from './constants';
import {createTemplate, defineCases, describe, expectString, getImageUrl, testEach} from './utils';

const describeWith = createTemplate('should generate correct path segment when %s');

const testCases = defineCases([
  {
    description: describeWith`only width is given`,
    input: {directives: {width: 100}},
    expected: expectString(getImageUrl('_100x')),
  },
  {
    description: describeWith`only height is given`,
    input: {directives: {height: 100}},
    expected: expectString(getImageUrl('_x100')),
  },
  {
    description: describeWith`width and height are given`,
    input: {directives: {width: 100, height: 100}},
    expected: expectString(getImageUrl('_100x100')),
  },
  {
    description: describeWith`width and aspectRatio are given`,
    input: {directives: {width: 200, aspectRatio: 2}},
    expected: expectString(getImageUrl('_200x100')),
  },
  {
    description: describeWith`height and aspectRatio are given`,
    input: {directives: {height: 200, aspectRatio: 2}},
    expected: expectString(getImageUrl('_400x200')),
  },
  {
    description: describeWith`only aspectRatio is given`,
    input: {directives: {aspectRatio: 2}},
    expected: expectString(IMAGE_URL),
  },
  {
    description: describeWith`aspectRatio, width, and height are given`,
    input: {directives: {aspectRatio: 2, width: 200, height: 200}},
    expected: expectString(getImageUrl('_200x200')),
  },
  {
    description: describeWith`aspectRatio and metadata are given`,
    input: {directives: {aspectRatio: 2}, ...IMAGE_METADATA},
    expected: expectString(getImageUrl('_2048x1024')),
  },
  {
    description: describeWith`aspectRatio, width, and metadata are given`,
    input: {
      directives: {aspectRatio: 1.777, width: 333},
      ...IMAGE_METADATA,
    },
    expected: expectString(getImageUrl('_333x187')),
  },
  {
    description: describeWith`aspectRatio, height, and metadata are given`,
    input: {
      directives: {aspectRatio: 1.777, height: 333},
      ...IMAGE_METADATA,
    },
    expected: expectString(getImageUrl('_592x333')),
  },
]);

describe('Shopify Adapter - Sizing', () => testEach(testCases));
