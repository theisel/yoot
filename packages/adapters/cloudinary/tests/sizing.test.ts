import {createTemplate, defineCases, describe, divide, expectString, getImageUrl, testEach} from './utils';

const describeWith = createTemplate('should generate correct path segment for %s');

const testCases = defineCases([
  {
    description: describeWith`width only`,
    input: {directives: {width: 100}},
    expected: expectString(getImageUrl('w_100')),
  },
  {
    description: describeWith`height only`,
    input: {directives: {height: 100}},
    expected: expectString(getImageUrl('h_100')),
  },
  {
    description: describeWith`width and height when given`,
    input: {directives: {width: 100, height: 200}},
    expected: expectString(getImageUrl('w_100,h_200')),
  },
  {
    description: describeWith`width and height when aspectRatio and width are given`,
    input: {directives: {width: 100, aspectRatio: 2}},
    expected: expectString(getImageUrl(`w_100,h_50`)), // Height is calculated based on width and aspectRatio
  },
  {
    description: describeWith`width and height when aspectRatio and height are given`,
    input: {directives: {height: 100, aspectRatio: 2}},
    expected: expectString(getImageUrl(`h_100,w_200`)), // Width is calculated based on height and aspectRatio
  },
  {
    description: describeWith`width and height when aspectRatio is 1`,
    input: {directives: {aspectRatio: 1}},
    expected: expectString(getImageUrl('ar_1')),
  },
  {
    description: describeWith`width and height when aspectRatio and intrinsic dimensions are given`,
    input: {
      directives: {aspectRatio: 1.777},
      width: 1000,
      height: 1000,
    },
    expected: expectString(getImageUrl(`w_1000,h_${divide(1000, 1.777, Math.round)}`)),
  },
]);

describe('Cloudinary Adapter - Sizing', () => testEach(testCases));
