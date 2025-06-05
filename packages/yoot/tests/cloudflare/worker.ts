import assert from 'node:assert';
import {yoot, defineAdapter, registerAdapters} from '../../src/index.ts';
import * as html from '../../src/html.ts';
import * as jsx from '../../src/jsx.ts';

const IMAGE_URL = 'https://cdn.example.com/file.png';

export default {
  fetch() {
    // Test yoot factory
    assert.equal(typeof yoot, 'function', 'Expected yoot to be a function');
    const ute = yoot(IMAGE_URL);
    assert.equal(typeof ute, 'function', 'Expected ute to be a function');

    // Test `ute` attributes methods
    assert.equal(typeof ute.src, 'function', 'Expected ute.src to be a function');
    assert.equal(typeof ute.alt, 'function', 'Expected ute.alt to be a function');

    // Test `ute` directive methods
    assert.equal(typeof ute.aspectRatio, 'function', 'Expected ute.aspectRatio to be a function');
    assert.equal(typeof ute.crop, 'function', 'Expected ute.crop to be a function');
    assert.equal(typeof ute.fit, 'function', 'Expected ute.fit to be a function');
    assert.equal(typeof ute.format, 'function', 'Expected ute.format to be a function');
    assert.equal(typeof ute.height, 'function', 'Expected ute.height to be a function');
    assert.equal(typeof ute.h, 'function', 'Expected ute.h to be a function');
    assert.equal(typeof ute.width, 'function', 'Expected ute.width to be a function');
    assert.equal(typeof ute.w, 'function', 'Expected ute.w to be a function');

    // Test `ute` output methods
    assert.equal(typeof ute.toJSON, 'function', 'Expected ute.toJSON to be a function');
    assert.equal(typeof ute.toString, 'function', 'Expected ute.toString to be a function');

    // Test ute.toString() output
    const url = ute.toString();
    assert.equal(typeof url, 'string', 'Expected URL from ute.toString() to be a string');
    assert.equal(url, IMAGE_URL, 'Expected URL to match the input');

    // -- Verify adapter creation and registration --
    // Test Adapter factory methods
    assert.equal(typeof defineAdapter, 'function', 'Expected defineAdapter to be a function');
    assert.equal(typeof registerAdapters, 'function', 'Expected registerAdapters to be a function');

    // Test defineAdapter
    assert.doesNotThrow(() => {
      defineAdapter({
        supports: () => true,
        generateUrl: ({src}) => src,
      });
    }, 'Expected defineAdapter to not throw');

    // Create an adapter for further checks
    const adapter = defineAdapter({
      supports: () => true,
      generateUrl: ({src}) => src,
    });

    assert.ok(typeof adapter === 'object' && adapter !== null, 'Expected adapter instance to be a non-null object');
    assert.equal(typeof adapter.supports, 'function', 'Expected adapter.supports to be a function');
    assert.equal(typeof adapter.generateUrl, 'function', 'Expected adapter.generateUrl to be a function');

    // Verify adapter registration
    assert.doesNotThrow(() => registerAdapters(adapter), 'Expected registerAdapters(adapter) to not throw');
    assert.doesNotThrow(() => registerAdapters(), 'Expected registerAdapters() to not throw without arguments');

    // -- HTML/JSX Utilities --
    // For each utility, check its type and then assert if html and jsx versions are the same
    assert.equal(typeof html.buildSrcSet, 'function', 'Expected html.buildSrcSet to be a function');
    assert.equal(typeof jsx.buildSrcSet, 'function', 'Expected jsx.buildSrcSet to be a function');

    assert.equal(typeof html.defineSrcSetBuilder, 'function', 'Expected html.defineSrcSetBuilder to be a function');
    assert.equal(typeof jsx.defineSrcSetBuilder, 'function', 'Expected jsx.defineSrcSetBuilder to be a function');

    assert.equal(typeof html.getImgAttrs, 'function', 'Expected html.getImgAttrs to be a function');
    assert.equal(typeof jsx.getImgAttrs, 'function', 'Expected jsx.getImgAttrs to be a function');

    assert.equal(typeof html.getSourceAttrs, 'function', 'Expected html.getSourceAttrs to be a function');
    assert.equal(typeof jsx.getSourceAttrs, 'function', 'Expected jsx.getSourceAttrs to be a function');

    assert.equal(typeof html.withImgAttrs, 'function', 'Expected html.withImgAttrs to be a function');
    assert.equal(typeof jsx.withImgAttrs, 'function', 'Expected jsx.withImgAttrs to be a function');

    assert.equal(typeof html.withSourceAttrs, 'function', 'Expected html.withSourceAttrs to be a function');
    assert.equal(typeof jsx.withSourceAttrs, 'function', 'Expected jsx.withSourceAttrs to be a function');

    return new Response('test success');
  },
};
