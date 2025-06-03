import assert from 'node:assert';
import adapter, {shopifyAdapter} from '../../src/index.ts';

export default {
  fetch() {
    assert(typeof adapter !== 'undefined', 'Adapter is undefined');
    assert.strictEqual(adapter, shopifyAdapter, 'Default export and named export are not the same');
    // Verify core methods are present and are functions
    assert(typeof adapter.supports === 'function', 'supports method is not a functiion');
    assert(typeof adapter.generateUrl === 'function', 'generateUrl method is not a functiion');

    return new Response('test success');
  },
};
