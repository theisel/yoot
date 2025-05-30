import type {GenerateUrlInput} from './adapter';
import type {Directives, Yoot, YootState} from './yoot';
import type {HTMLImageAttributes, HTMLSourceAttributes, Maybe, Prettify} from './types';
import {isKeyOf, isFunction, hasIntrinsicDimensions, invariant, isNumber, isString, isNullish} from './utils';

export {
  buildSrcSet,
  defineSrcSetBuilder,
  getImgAttrs,
  getSourceAttrs,
  normalizeDirectives,
  withImgAttrs,
  withSourceAttrs,
};
export type {BuildSrcSetOptions, ImgAttrs, ImgAttrsOptions, SourceAttrs, SourceAttrsOptions, WithSrcSetBuilder};
// Internal exports used in tests
export {getAttrs, getMimeType, mustBeInRange, mustBeOneOf};

// --- buildSrcSet, defineSrcSetBuilder & BuildSrcSetOptions type ---

/**
 * Options for `buildSrcSet` and `defineSrcSetBuilder`: target image widths or pixel densities.
 *
 * @remarks `widths` take precedence if both are provided.
 * @public
 */
interface BuildSrcSetOptions {
  /** Array of image widths (pixels) for 'w' descriptors. */
  widths?: number[];
  /** Array of pixel density multipliers (e.g., [1, 2]) for 'x' descriptors. */
  densities?: number[];
}

/**
 * Returns a function that generates a `srcset` string using the given configuration.
 *
 * @public
 * @param options - Configuration for srcset variants.
 * @returns A function accepting a `Yoot` object that returns a `srcset` string.
 *
 * @example
 * ```ts
 * // yoot-presets.ts
 * import {yoot, defineSrcSetBuilder, withImgAttrs} from '@yoot/yoot';
 *
 * export const thumbnailPreset = yoot().width(96).aspectRatio(1);
 *
 * export const getThumbnailAttrs = withImgAttrs({
 *    loading: 'lazy',
 *    'data-img': 'thumbnail',
 *    srcSetBuilder: defineSrcSetBuilder({widths: [96, 192]}) // Or, defineSrcSetBuilder({densities: [1, 2, 3]})
 * });
 *
 * // somewhere else in your app
 * import {getThumbnailAttrs, thumbnailPreset} from '@/yoot-presets';
 *
 * const thumbnail = thumbnailPreset({src: 'https://cdn.example.com/image.jpg', alt: 'Thumbnail'});
 *
 * <img {...getThumbnailAttrs(thumbnail)} />
 * // Output (urls differ between adapters):
 * // { src: 'https://cdn.example.com/image.jpg&w=96&h=96',
 * //   srcset: 'https://cdn.example.com/image.jpg&w=96&h=96 96w,
 * //            https://cdn.example.com/image.jpg&w=192&h=192 192w'
 * //   width: 96, height: 96, loading: 'lazy', 'data-img': 'thumbnail'}
 * ```
 */
function defineSrcSetBuilder(options: BuildSrcSetOptions): (yoot: Yoot) => string {
  return (yoot: Yoot) => buildSrcSet(options, yoot);
}

/**
 * Returns a `srcset` string from a `Yoot` object using the given configuration.
 *
 * @public
 * @param options - Configuration for srcset variants.
 * @param yoot - The configured `Yoot` object.
 * @returns A `srcset` string.
 *
 * @example
 * ```tsx
 * import {yoot, buildSrcSet, getImgAttrs} from '@yoot/yoot';
 *
 * const thumbnail = yoot({src: 'https://cdn.example.com/image.jpg', alt: 'Thumbnail'}).width(96).aspectRatio(1);
 * const thumbnailAttrs = getImgAttrs(thumbnail);
 * // Output (urls differ between adapters):
 * // {  src: 'https://cdn.example.com/image.jpg&w=96&h=96', alt: 'Thumbnail', width: 96, height: 96 }
 * const thumbnailSrcSet = buildSrcSet({widths: [96, 192]}, thumbnail);
 * // 'https://cdn.example.com/image.jpg&w=96&h=96 96w, https://cdn.example.com/image.jpg&w=192&h=192 192w'
 *
 * <img {...thumbnailAttrs} srcset={thumbnailSrcSet} />
 * ```
 */
function buildSrcSet(options: BuildSrcSetOptions, yoot: Yoot): string {
  const {widths, densities} = options;
  const srcsetParts = [];

  // `widths` takes precedence over `densities`.
  if (Array.isArray(widths) && widths.length > 0) {
    for (const width of widths) {
      if (!isNumber(width) || width < 1) continue;
      srcsetParts.push(yoot.width(width).toString().concat(` ${width}w`));
    }
  } else if (Array.isArray(densities) && densities.length > 0) {
    for (const density of densities) {
      if (!isNumber(density) || density < 1) continue;
      srcsetParts.push(yoot.dpr(density).toString().concat(` ${density}x`));
    }
  }

  return srcsetParts.join(', ');
}

// /**
//  * Returns a `srcset` string, or a function to generate one based on the given configuration.
//  *
//  * @remarks Supports currying: `buildSrcSet(options)(yoot)`.
//  * Uses `widths` if available; otherwise falls back to `densities`.
//  * @public
//  * @param options - Configuration for srcset variants.
//  * @param yoot - Optional Yoot object for immediate use.
//  * @returns A `srcset` string or a function that returns one.
//  */
// function buildSrcSet(options: BuildSrcSetOptions, yoot?: Yoot) {
//   const provideSrcSet = (_yoot: Yoot) => {
//     const {widths, densities} = options;
//     const srcsetParts = [];

//     // `widths` takes precedence over `densities`.
//     if (Array.isArray(widths) && widths.length > 0) {
//       for (const width of widths) {
//         if (!isNumber(width) || width < 1) continue;
//         srcsetParts.push(_yoot.width(width).toString().concat(` ${width}w`));
//       }
//     } else if (Array.isArray(densities) && densities.length > 0) {
//       for (const density of densities) {
//         if (!isNumber(density) || density < 1) continue;
//         srcsetParts.push(_yoot.dpr(density).toString().concat(` ${density}x`));
//       }
//     }

//     return srcsetParts.join(', ');
//   };

//   return yoot ? provideSrcSet(yoot) : provideSrcSet;
// }

/**
 * Extracts base attributes from a `Yoot` object's `toJSON()` state.
 *
 * @remarks Prefers `directives` for `width`/`height` over intrinsic values.
 * Includes `src`, `alt`, calculated `width`/`height`, and other non-directive state properties.
 * @internal
 * @param yoot - A `Yoot` object.
 * @returns Object of derived HTML attributes.
 */
function getAttrs(yoot: Yoot): Attrs {
  const src = yoot.url;
  const {width: intrinsicWidth, height: intrinsicHeight, directives, ...rest} = yoot.toJSON();
  const hasTransformedDims = isNumber(directives.width) || isNumber(directives.height);

  // Prioritize transformation dimensions; fallback to intrinsic if no transform dims specified.
  const width = hasTransformedDims ? directives.width : intrinsicWidth;
  const height = hasTransformedDims ? directives.height : intrinsicHeight;
  // Initialize attributes with intrinsic dimensions and source URL
  const attrs: Attrs = {...rest, intrinsicWidth, intrinsicHeight, src};

  if (isNumber(width)) attrs.width = width;
  if (isNumber(height)) attrs.height = height;

  return attrs;
}

/**
 * Attributes derived by `getAttrs` from a `Yoot` object's state.
 * @internal
 */
type Attrs = {
  /** Source URL */
  src: string;
  /** Alt text */
  alt?: Maybe<string>;
  /** Intrinsic height */
  intrinsicHeight?: number;
  /** Intrinsic width */
  intrinsicWidth?: number;
  /** Derived width */
  width?: Maybe<number>;
  /** Derived height */
  height?: Maybe<number>;
};

// --- getImgAttrs, withImgAttrs, & ImgAttrsOptions type ---

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
  const {alt: alternateAlt, sizes, srcSetBuilder, ...passThroughAttrs} = options ?? {};
  const {src, height, width, intrinsicHeight: __0, intrinsicWidth: __1, ...derivedAttrs} = getAttrs(yoot);
  const attrs: HTMLImageAttributes = {...passThroughAttrs, ...derivedAttrs};
  const imgAttrs: ImgAttrs = {src};

  // Apply non-nullish pass-through attributes
  for (const [key, value] of Object.entries(attrs)) {
    if (isNullish(value)) continue;
    // TODO - Is there a better way to type this?
    (imgAttrs as Record<string, unknown>)[key] = value;
  }

  // Apply `alt`
  let {alt} = derivedAttrs;
  alt ||= alternateAlt;

  if (isString(alt)) imgAttrs.alt = alt;

  // -- Apply `srcset` and fallback to `src` if not defined --
  // Overrides `srcset` if given
  if (isFunction(srcSetBuilder)) imgAttrs.srcset = srcSetBuilder(yoot);
  if (isString(sizes) && isString(attrs.srcset)) imgAttrs.sizes = sizes;

  const hasWidth = isNumber(width);
  const hasHeight = isNumber(height);

  // -- Apply style to fit `contain` directive --
  const state = yoot.toJSON();

  if (state.directives.fit === 'contain') {
    imgAttrs.style = {};
    if (hasWidth) imgAttrs.style.maxWidth = `${width}px`;
    if (hasHeight) imgAttrs.style.maxHeight = `${height}px`;
    return imgAttrs;
  }

  // -- Apply dimensions if available --
  if (hasWidth) imgAttrs.width = width;
  if (hasHeight) imgAttrs.height = height;

  return imgAttrs;
}

/**
 * Return type for `getImgAttrs`.
 * @public
 */
type ImgAttrs = Prettify<
  {src: string} & {
    [Key in keyof HTMLImageAttributes]?: NonNullable<HTMLImageAttributes[Key]>;
  }
>;

/**
 * Options for `getImgAttrs` and `withImgAttrs`.
 *
 * @remarks Allows passthrough of `HTMLImgAttributes`.
 * `srcSetBuilder` is used for `srcset`. `alt` acts as a fallback.
 * @public
 */
type ImgAttrsOptions = Prettify<WithSrcSetBuilder & Omit<ImgAttrs, 'height' | 'src' | 'width'>>;

/**
 * Returns a function that generates HTML attributes for an `<img>` tag.
 *
 * @remarks Merges provided attributes with derived ones. Supports fallback for `alt`.
 *
 * @public
 * @param options - `<img>` attributes and optional `srcSetBuilder`.
 * @returns A function that accepts a `Yoot` object and returns HTML `<img>` attributes.
 */
function withImgAttrs(options: ImgAttrsOptions) {
  return (yoot: Yoot, overrideOptions?: ImgAttrsOptions) => getImgAttrs(yoot, {...options, ...overrideOptions});
}

// --- getSourceAttrs, withSourceAttrs, & WithSourceAttrsOptions type ---

/**
 * Returns `<source>` attributes generated from a `Yoot` object, merged with optional custom attributes.
 *
 * @public
 * @param yoot - A `Yoot` object.
 * @param options - Optional `<source>` attributes and `srcSetBuilder`.
 * @returns HTML attributes for a `<source>` element.
 */
function getSourceAttrs(yoot: Yoot, options?: SourceAttrsOptions): SourceAttrs {
  const {srcset, srcSetBuilder, ...passThroughAttrs} = options ?? {};

  // -- Apply directives to `yoot` object --
  // Apply format if `type` has been explicitly set
  if (isString(passThroughAttrs.type) && passThroughAttrs.type.startsWith('image/')) {
    const [, rawFormat] = passThroughAttrs.type.split('/') as [never, string];
    // Normalize format: 'jpeg' → 'jpg'
    const format = rawFormat === 'jpeg' ? 'jpg' : rawFormat;
    // Apply format to the `yoot` object
    yoot = yoot.format(format as Exclude<Directives['format'], undefined>);
  }

  /** @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source */
  const {intrinsicHeight, intrinsicWidth, src} = getAttrs(yoot);
  const sourceAttrs: SourceAttrs = {}; // Ignore `src` from the initial `sourceAttrs` object

  // Apply non-nullish pass-through attributes
  for (const [key, value] of Object.entries(passThroughAttrs)) {
    if (isNullish(value)) continue;
    // TODO - Is there a better way to type this?
    (sourceAttrs as Record<string, unknown>)[key] = value;
  }

  // Apply inferred `type` if not explicitly provided
  const mimeType = passThroughAttrs.type || getMimeType(yoot);
  if (mimeType) sourceAttrs.type = mimeType;

  // Are we dealing with an image?
  if (mimeType?.startsWith('image/')) {
    // Apply `srcset`
    if (isFunction(srcSetBuilder)) sourceAttrs.srcset = srcSetBuilder(yoot);
    else if (isString(srcset)) sourceAttrs.srcset = srcset;
    else sourceAttrs.srcset = src;
  } else {
    sourceAttrs.src = src; // Only set `src` if it's not an image type (video/audio)
  }

  // Apply intrinsic dimensions if available
  if (isNumber(intrinsicWidth)) sourceAttrs.width = intrinsicWidth;
  if (isNumber(intrinsicHeight)) sourceAttrs.height = intrinsicHeight;

  return sourceAttrs;
}

/**
 * Return type for `getSourceAttrs`.
 * @public
 */
type SourceAttrs = {
  [Key in keyof HTMLSourceAttributes]: NonNullable<HTMLSourceAttributes[Key]>;
};

/**
 * Options for `getSourceAttrs` and `withSourceAttrs`.
 *
 * @remarks Allows `HTMLSourceAttributes` with an optional `srcSetBuilder` function.
 * @public
 */
type SourceAttrsOptions = Prettify<Omit<SourceAttrs, 'height' | 'src' | 'width'> & WithSrcSetBuilder>;

/**
 * Optional function to generate a `srcset` string.
 * @public
 */
type WithSrcSetBuilder = {
  /** Receives a Yoot object to generate a `srcset` string. */
  srcSetBuilder?: (yoot: Yoot) => string;
};

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
 *   media:'(min-width: 1024px)'
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
function withSourceAttrs(options: SourceAttrsOptions) {
  return (yoot: Yoot, overrideOptions?: SourceAttrsOptions) => getSourceAttrs(yoot, {...options, ...overrideOptions});
}

/**
 * Normalizes dimension directives (width, height, aspectRatio) in YootState.
 *
 * @remarks Calculates explicit `width` and `height` based on the following priority:
 * 1. Explicit `width` and `height` directives (ignores `aspectRatio`).
 * 2. An `aspectRatio` directive, used with any existing width/height or intrinsics.
 * 3. Intrinsic aspect ratio, used to compute missing dimensions.
 * The `aspectRatio` directive is set to `undefined` after processing.
 *
 * @internal
 * @param input - The YootState with current directives and (optional) intrinsic dimensions.
 * @returns A new Directives object with normalized width and height.
 */
function normalizeDirectives(input: YootState): Directives {
  const mutDirectives = {...input.directives};
  const {height, width} = mutDirectives;

  const hasWidth = isNumber(width);
  const hasHeight = isNumber(height);

  // If both width and height are provided,
  // or aspectRatio is not a valid number, set aspectRatio to undefined
  if ((hasWidth && hasHeight) || !isNumber(mutDirectives.aspectRatio) || mutDirectives.aspectRatio <= 0) {
    mutateAspectRatioToUndefined(mutDirectives);
    return {...mutDirectives};
  }

  // We are going to normalize aspect ratio by defining width and height,
  // as some image service providers do not support aspect ratio directly.
  const {aspectRatio} = mutDirectives;

  if (hasWidth) {
    mutDirectives.height = Math.round(width / aspectRatio);
    mutateAspectRatioToUndefined(mutDirectives);
  } else if (hasHeight) {
    mutDirectives.width = Math.round(height * aspectRatio);
    mutateAspectRatioToUndefined(mutDirectives);
  } else if (hasIntrinsicDimensions(input)) {
    mutDirectives.width = input.width;
    mutDirectives.height = Math.round(mutDirectives.width / aspectRatio);
    mutateAspectRatioToUndefined(mutDirectives);
  }

  return {...mutDirectives};
}

/**
 * Clears the `aspectRatio` directive by setting it to `undefined`.
 * @internal
 */
function mutateAspectRatioToUndefined(directives: GenerateUrlInput['directives']): void {
  if ('aspectRatio' in directives) {
    directives.aspectRatio = undefined;
  }
}

/**
 * MIME types supported directly by the `yoot` API
 * @internal
 */
export const MIME_TYPES = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
} as const;

/**
 * Type representing the supported MIME types.
 * @internal
 */
type MimeType = (typeof MIME_TYPES)[keyof typeof MIME_TYPES];

/**
 * Infers MIME type from the `format` directive otherwise falls back to image extension.
 * @internal
 */
function getMimeType(yoot: Yoot): MimeType | undefined {
  const {format} = yoot.toJSON().directives;
  // Try to get the format from the directives first
  if (isKeyOf(format, MIME_TYPES)) return MIME_TYPES[format];
  // If no format is specified, try to get it from the file extension
  const extension = new URL(yoot.toString()).pathname.split('.').pop()?.toLowerCase();

  return isKeyOf(extension, MIME_TYPES) ? MIME_TYPES[extension] : undefined;
}

/**
 * Returns a validator that asserts the value is a number within the specified range [start, end]
 * @internal
 */
function mustBeInRange(start: number, end: number) {
  return (key: string, value: unknown) => {
    invariant(isNumber(value), `${key} must be a number`);
    invariant(isFinite(value), `${key} must be a finite number`);
    invariant(value >= start && value <= end, `${key} must be between ${start} and ${end}`);
  };
}

/**
 * Returns a validator that asserts the value is a member of the allowed set.
 * @internal
 */
function mustBeOneOf<T extends string>(allowed: Set<T>): (key: string, value: unknown) => void {
  return (key, value) => {
    invariant(allowed.has(value as T), `${key} must be one of: ${[...allowed].join(', ')}`);
  };
}
