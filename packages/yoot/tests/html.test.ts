import {describe, it, expect} from '@yoot/test-kit';
import {toInlineStyle, propsToHtmlAttrs} from '../src/core/html';

describe('@yoot/yoot - HTML Utilities', () => {
  describe('toInlineStyle', () => {
    it('converts camelCase CSS props to kebab-case style string', () => {
      const style = {
        maxWidth: '200px',
        maxHeight: '100px',
        objectFit: 'contain',
      };

      const result = toInlineStyle(style);

      expect(result).toBe('max-width:200px;max-height:100px;object-fit:contain;');
    });

    it('skips undefined or empty values', () => {
      const style = {
        maxWidth: undefined,
        maxHeight: '',
        objectFit: 'cover',
      };

      const result = toInlineStyle(style);

      expect(result).toBe('object-fit:cover;');
    });

    it('should return empty string when empty value is given', () => {
      expect(toInlineStyle({})).toBe('');
      expect(toInlineStyle(null)).toBe('');
      expect(toInlineStyle(undefined)).toBe('');
      expect(toInlineStyle('')).toBe('');
    });
  });

  describe('propsToHtmlAttrs', () => {
    it('converts object keys to kebab-case only at first capitalized letter', () => {
      const input = {
        ariaAutoComplete: 'list',
        tabIndex: 0,
      };

      const result = propsToHtmlAttrs(input);

      expect(result).toEqual({
        'aria-autocomplete': 'list',
        'tab-index': 0,
      });
    });

    it('converts style object to inline string', () => {
      const input = {
        src: 'img.png',
        style: {
          maxWidth: '100px',
          objectFit: 'cover',
        },
      };

      const result = propsToHtmlAttrs(input);

      expect(result).toEqual({
        src: 'img.png',
        style: 'max-width:100px;object-fit:cover;',
      });
    });

    it('omits nullish values', () => {
      const input = {
        src: 'file.png',
        alt: '',
        ariaAutoComplete: null,
      };

      const result = propsToHtmlAttrs(input);

      expect(result).toEqual({
        src: 'file.png',
        alt: '',
      });
    });

    it('omits style attribute when empty style value is given', () => {
      expect(propsToHtmlAttrs({style: {}})).toEqual({});
      expect(propsToHtmlAttrs({style: null})).toEqual({});
      expect(propsToHtmlAttrs({style: undefined})).toEqual({});
      expect(propsToHtmlAttrs({style: ''})).toEqual({});
    });
  });
});
