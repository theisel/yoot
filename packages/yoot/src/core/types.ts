// -- Module Exports --
export type {HTMLImageAttributes, HTMLSourceAttributes, Maybe, Primitive, Prettify};

/**
 * HTML attributes for `<img>` elements.
 * @remarks Includes filtered native properties, specific overrides, data, ARIA, and global attributes.
 * @public
 */
type HTMLImageAttributes = Prettify<
  {
    [K in keyof FilteredImageProps]?: Maybe<FilteredImageProps[K]>;
  } & {
    crossOrigin?: Maybe<'anonymous' | 'use-credentials' | ''>;
    referrerPolicy?: Maybe<ReferrerPolicy>;
    style?: Record<string, string | number>;
  } & DataAttributes &
    AriaAttributes
>;

/**
 * Properties from `HTMLImageElement` suitable for `HTMLImageAttributes`.
 * @remarks Filters for writable, primitive-like props. Excludes some handled explicitly.
 * @internal
 */
type FilteredImageProps = Pick<HTMLImageElement, ImgAttrKeys>;

type ImgAttrKeys =
  | 'alt'
  | 'crossOrigin'
  | 'decoding'
  | 'fetchPriority'
  | 'height'
  | 'loading'
  | 'referrerPolicy'
  | 'sizes'
  | 'src'
  | 'srcset'
  | 'title'
  | 'width';

/**
 * HTML attributes for `<source>` elements.
 * @remarks Includes relevant native properties and data attributes.
 * @public
 */
type HTMLSourceAttributes = Prettify<
  {type?: 'image/jpeg' | 'image/png' | 'image/webp' | (string & {})} & {
    [K in keyof FilteredSourceProps]?: Maybe<FilteredSourceProps[K]>;
  } & DataAttributes
>;

/**
 * Properties from `HTMLSourceElement` suitable for `HTMLSourceAttributes`.
 * @internal
 */
type FilteredSourceProps = Pick<HTMLSourceElement, SourceAttrKeys>;

type SourceAttrKeys = 'height' | 'media' | 'sizes' | 'src' | 'srcset' | 'type' | 'width';

/**
 * Base type for `data-*` attributes.
 * @internal
 */
type DataAttributes = {
  [key: `data-${string}`]: Maybe<Primitive>;
};

/**
 * Base type for ARIA attributes, kebab-cased.
 * @internal
 */
type AriaAttributes = {
  'aria-label'?: Maybe<string>;
  'aria-labelledby'?: Maybe<string>;
  'aria-describedby'?: Maybe<string>;
  'aria-hidden'?: Maybe<Booleanish>;
};

/**
 * Represents a value that can be T, null, or undefined.
 * @internal
 */
type Maybe<T> = T | null | undefined;

// -- Utility Types --

/**
 * Allowed primitive types for HTML attribute values.
 * @internal
 */
type Primitive = string | number | boolean;

type Booleanish = boolean | 'true' | 'false';

/**
 *
 */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
