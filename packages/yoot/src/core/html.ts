import {getImgAttrs as _getImgAttrs, getSourceAttrs as _getSourceAttrs} from './helpers.ts';
import type {
  BuildSrcSetOptions,
  ImgAttrs as _ImgAttrs,
  ImgAttrsOptions,
  SourceAttrs as _SourceAttrs,
  SourceAttrsOptions,
  WithSrcSetBuilder,
} from './helpers.ts';
import type {Yoot} from './yoot.ts';
import {isEmpty, isNullish} from './utils.ts';

// -- Module Exports --
export {buildSrcSet, defineSrcSetBuilder} from './helpers.ts';
export {getImgAttrs, getSourceAttrs, withImgAttrs, withSourceAttrs};
export type {BuildSrcSetOptions, ImgAttrs, ImgAttrsOptions, SourceAttrs, SourceAttrsOptions, WithSrcSetBuilder};
// For testing purposes
export {propsToHtmlAttrs, toInlineStyle};

/**
 * Returns `<img>` attributes generated from a `Yoot` object, merged with optional custom attributes.
 *
 * @public
 * @param yoot - A `Yoot` object.
 * @param options - Optional `<img>` attributes and `srcSetBuilder`.
 * @returns HTML attributes for an `<img>` element.
 *
 * @example
 * ```ts
 * import {yoot, getImgAttrs} from '@yoot/yoot';
 *
 * const thumbnail = yoot({
 *    src: 'https://cdn.example.com/image.jpg',
 *    alt: 'Thumbnail'
 * }).width(96).aspectRatio(1);
 *
 * const attrs = getImgAttrs(thumbnail);
 * // Output (urls differ between adapters):
 * // { src: 'https://cdn.example.com/image.jpg&w=96&h=96',
 * //   width: 96, height: 96}
 * ```
 *
 * @example
 * ```ts
 * import {yoot, getImgAttrs} from '@yoot/yoot';
 *
 * const thumbnail = yoot({
 *    src: 'https://cdn.example.com/image.jpg',
 *    alt: 'Thumbnail'
 * }).width(96).aspectRatio(1);
 *
 * const attrs = getImgAttrs(thumbnail, {loading: 'lazy', 'data-img': 'thumbnail'});
 * // Output (urls differ between adapters):
 * // { src: 'https://cdn.example.com/image.jpg&w=96&h=96',
 * //   width: 96, height: 96, loading: 'lazy', 'data-img': 'thumbnail'}
 * ```
 */
function getImgAttrs(yoot: Yoot, options?: ImgAttrsOptions): ImgAttrs {
  return propsToHtmlAttrs(_getImgAttrs(yoot, options));
}

/**
 * Returns a function that generates HTML attributes for an `<img>` tag.
 *
 * @remarks Merges provided attributes with derived ones. Supports fallback for `alt`.
 *
 * @public
 * @param options - `<img>` attributes and optional `srcSetBuilder`.
 * @returns A function that accepts a `Yoot` object and returns HTML `<img>` attributes.
 */
function withImgAttrs(options: ImgAttrsOptions): (yoot: Yoot, overrideOptions?: ImgAttrsOptions) => ImgAttrs {
  return (yoot, overrideOptions) => propsToHtmlAttrs(_getImgAttrs(yoot, {...options, ...overrideOptions}));
}

/**
 * Returns `<source>` attributes generated from a `Yoot` object, merged with optional custom attributes.
 *
 * @public
 * @param yoot - A `Yoot` object.
 * @param options - Optional `<source>` attributes and `srcSetBuilder`.
 * @returns HTML attributes for a `<source>` element.
 */
function getSourceAttrs(yoot: Yoot, options?: SourceAttrsOptions): SourceAttrs {
  return propsToHtmlAttrs(_getSourceAttrs(yoot, options));
}

/**
 * Returns a function that generates HTML attributes for a `<source>` tag.
 *
 * @remarks Merges provided attributes with derived ones.
 *
 * @public
 * @param options - `<source>` attributes and optional `srcSetBuilder`.
 * @returns A function that accepts a `Yoot` object and returns HTML `<source>` attributes.
 *
 * @example
 * ```tsx
 * // yoot-presets.ts
 * import {withSourceAttrs} from '@yoot/yoot';
 *
 * export const thumbnailPreset = yoot().width(96).aspectRatio(1);
 *
 * export const getThumbnailSourceAttrs = withSourceAttrs({
 *   srcSetBuilder: buildSrcSet({widths: [96, 192]}), // Or, buildSrcSet({densities: [1, 2, 3]})
 *   sizes: '96w',
 * });
 *
 * // somewhere else in your app
 * import {yoot, getImgAttrs} from '@yoot/yoot';
 * import {thumbnailPreset, getThumbnailSourceAttrs} from '@/yoot-presets';
 *
 * const thumbnail = thumbnailPreset({src: 'https://cdn.example.com/image.jpg', alt: 'Thumbnail'});
 *
 * <picture>
 *  <source {...getThumbnailSourceAttrs(thumbnail)} />
 *  <img {...getImgAttrs(thumbnail)} />
 * </picture>
 * ```
 */
function withSourceAttrs(
  options: SourceAttrsOptions,
): (yoot: Yoot, overrideOptions?: SourceAttrsOptions) => SourceAttrs {
  return (yoot, overrideOptions) => propsToHtmlAttrs(_getSourceAttrs(yoot, {...options, ...overrideOptions}));
}

/**
 * Converts an object's keys to kebab-case.
 *
 * @remarks Special handling:
 * - `aria*` keys: only the first capital letter is kebabed (e.g., `ariaAutoComplete` → `aria-autocomplete`)
 * - `style` key: value is converted to an inline style string
 * - Nullish values and empty styles are excluded.
 *
 * @internal
 */
function propsToHtmlAttrs<T extends Record<string, unknown>>(attributes: T): PropsToHtmlAttrs<T> {
  const attrs: Record<string, unknown> = {};

  for (const key of Object.keys(attributes)) {
    let value = attributes[key];

    if (isNullish(value)) continue;

    let attr: string;

    if (key.startsWith('aria')) {
      // Only kebab the first uppercase letter
      attr = key.replace(/([A-Z])/, '-$1').toLowerCase() as keyof typeof attrs;
    } else {
      // Kebab all uppercase letters
      attr = key.replace(/([A-Z])/g, '-$1').toLowerCase() as keyof typeof attrs;
    }

    if (key === 'style') {
      value = toInlineStyle(value);
      if (isEmpty(value)) continue;
    }

    attrs[attr] = value;
  }

  return attrs as PropsToHtmlAttrs<T>;
}

/**
 * Converts a style object to a CSS inline-style string.
 *
 * @example toInlineStyle({ backgroundColor: 'red' }) // 'background-color:red;'
 * @internal
 */
function toInlineStyle(props: unknown): string {
  let style = '';

  if (isNullish(props)) return style;

  for (const [key, value] of Object.entries(props)) {
    if (isEmpty(value)) continue;
    const cssProp = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    style += `${cssProp}:${value};`;
  }

  return style;
}

// --- Internal Utility Types ---

type ImgAttrs = PropsToHtmlAttrs<_ImgAttrs>;
type SourceAttrs = PropsToHtmlAttrs<_SourceAttrs>;

/**
 * Converts the keys of type T to kebab-case.
 */
type PropsToHtmlAttrs<T> = {
  [K in keyof T as KebabCase<string & K>]: T[K];
} & {style?: string};

/**
 * Converts a string literal type to kebab-case.
 *
 * @example KebabCase<'fooBarBaz'> -> 'foo-bar-baz'
 */
type KebabCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Lowercase<First>
    ? `${First}${KebabCase<Rest>}`
    : `-${Lowercase<First>}${KebabCase<Rest>}`
  : S;
