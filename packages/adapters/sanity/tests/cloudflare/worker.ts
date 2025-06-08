import {assert, assertStrictEquals} from '@std/assert';
import adapter, {sanityAdapter} from '../../src/index.ts';

export default {
  fetch() {
    assert(typeof adapter !== 'undefined', 'Adapter is undefined');
    assertStrictEquals(adapter, sanityAdapter, 'Default export and named export are not the same');
    // Verify core methods are present and are functions
    assert(typeof adapter.supports === 'function', 'supports method is not a functiion');
    assert(typeof adapter.generateUrl === 'function', 'generateUrl method is not a functiion');

    return new Response('test success');
  },
};
