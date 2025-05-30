import {createTemplate, defineCases, describe, expectParams, testEach} from './utils';

const describeCrop = createTemplate('should add `crop=%s` parameter to URL');

const testCases = defineCases([
  {
    description: describeCrop`center`,
    input: {directives: {crop: 'center'}},
    expected: expectParams({}),
  },
  {
    description: describeCrop`top`,
    input: {directives: {crop: 'top'}},
    expected: expectParams({crop: 'top'}),
  },
  {
    description: describeCrop`bottom`,
    input: {directives: {crop: 'bottom'}},
    expected: expectParams({crop: 'bottom'}),
  },
  {
    description: describeCrop`left`,
    input: {directives: {crop: 'left'}},
    expected: expectParams({crop: 'left'}),
  },
  {
    description: describeCrop`right`,
    input: {directives: {crop: 'right'}},
    expected: expectParams({crop: 'right'}),
  },
]);

describe('Imgix Adapter - Crop', () => testEach(testCases));
