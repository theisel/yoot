import {assertEquals} from '@std/assert';
import {yoot, defineAdapter, registerAdapters} from '../../src/index.ts';
import * as html from '../../src/html.ts';
import * as jsx from '../../src/jsx.ts';

const IMAGE_URL = 'https://cdn.example.com/file.png';

export default {
  fetch() {
    // Test yoot factory
    assertEquals(typeof yoot, 'function', 'Expected yoot to be a function');
    const ute = yoot(IMAGE_URL);
    assertEquals(typeof ute, 'function', 'Expected ute to be a function');

    // Test `ute` attributes methods
    assertEquals(typeof ute.src, 'function', 'Expected ute.src to be a function');
    assertEquals(typeof ute.alt, 'function', 'Expected ute.alt to be a function');

    // Test `ute` directive methods
    assertEquals(typeof ute.aspectRatio, 'function', 'Expected ute.aspectRatio to be a function');
    assertEquals(typeof ute.crop, 'function', 'Expected ute.crop to be a function');
    assertEquals(typeof ute.fit, 'function', 'Expected ute.fit to be a function');
    assertEquals(typeof ute.format, 'function', 'Expected ute.format to be a function');
    assertEquals(typeof ute.height, 'function', 'Expected ute.height to be a function');
    assertEquals(typeof ute.h, 'function', 'Expected ute.h to be a function');
    assertEquals(typeof ute.width, 'function', 'Expected ute.width to be a function');
    assertEquals(typeof ute.w, 'function', 'Expected ute.w to be a function');

    // Test `ute` output methods
    assertEquals(typeof ute.toJSON, 'function', 'Expected ute.toJSON to be a function');
    assertEquals(typeof ute.toString, 'function', 'Expected ute.toString to be a function');

    // Test ute.toString() output
    const url = ute.toString();
    assertEquals(typeof url, 'string', 'Expected URL from ute.toString() to be a string');
    assertEquals(url, IMAGE_URL, 'Expected URL to match the input');

    // -- Verify adapter creation and registration --
    // Test Adapter factory methods
    assertEquals(typeof defineAdapter, 'function', 'Expected defineAdapter to be a function');
    assertEquals(typeof registerAdapters, 'function', 'Expected registerAdapters to be a function');

    // Create an adapter: It should not throw an error
    const adapter = defineAdapter({
      supports: () => true,
      generateUrl: ({src}) => src,
    });

    // Verify adapter registration: It should not throw an error
    registerAdapters(adapter);

    // -- HTML/JSX Utilities --
    // For each utility, check its type and then assert if html and jsx versions are the same
    assertEquals(typeof html.buildSrcSet, 'function', 'Expected html.buildSrcSet to be a function');
    assertEquals(typeof jsx.buildSrcSet, 'function', 'Expected jsx.buildSrcSet to be a function');

    assertEquals(typeof html.defineSrcSetBuilder, 'function', 'Expected html.defineSrcSetBuilder to be a function');
    assertEquals(typeof jsx.defineSrcSetBuilder, 'function', 'Expected jsx.defineSrcSetBuilder to be a function');

    assertEquals(typeof html.getImgAttrs, 'function', 'Expected html.getImgAttrs to be a function');
    assertEquals(typeof jsx.getImgAttrs, 'function', 'Expected jsx.getImgAttrs to be a function');

    assertEquals(typeof html.getSourceAttrs, 'function', 'Expected html.getSourceAttrs to be a function');
    assertEquals(typeof jsx.getSourceAttrs, 'function', 'Expected jsx.getSourceAttrs to be a function');

    assertEquals(typeof html.withImgAttrs, 'function', 'Expected html.withImgAttrs to be a function');
    assertEquals(typeof jsx.withImgAttrs, 'function', 'Expected jsx.withImgAttrs to be a function');

    assertEquals(typeof html.withSourceAttrs, 'function', 'Expected html.withSourceAttrs to be a function');
    assertEquals(typeof jsx.withSourceAttrs, 'function', 'Expected jsx.withSourceAttrs to be a function');

    return new Response('test success');
  },
};
