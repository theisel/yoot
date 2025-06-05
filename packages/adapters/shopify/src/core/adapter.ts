/**
 * Shopify adapter implementation for Yoot.
 * @remarks Handles Shopify CDN URLs and applies transformation directives via path segments.
 * @module
 */
import {defineAdapter} from '@yoot/yoot';
import type {Adapter, Directives, GenerateUrlInput, YootState, PrimeStateInput} from '@yoot/yoot';
import {_isEmpty as isEmpty, _isNumber as isNumber} from '@yoot/yoot/internal';

// -- Module Exports --
export {adapter};

/**
 * An adapter for Shopify URLs.
 *
 * @remarks Supports `cdn.shopify.com` URLs and maps `yoot` directives to Shopify path segments.
 * @public
 */
const adapter: Adapter = defineAdapter({
  supports: (url: URL) => url.hostname === 'cdn.shopify.com',
  generateUrl,
  primeState,
});

/**
 * Returns a Shopify image URL with applied transformation directives as path segments.
 */
function generateUrl(input: GenerateUrlInput): string {
  const {directives} = input;

  const crop = getCropPathSegment(directives);
  const dimensions = getDimensionsPathSegment(directives);
  const dpr = getDprPathSegment(directives);
  const extension = getFileExtension(directives);

  return buildUrl(new URL(input.src), {crop, dimensions, dpr, extension});
}

/**
 * Applies `crop` center when `fit` is cover and at least one dimension is defined.
 */
function primeState(input: PrimeStateInput): YootState {
  const {directives} = input;

  // Ensure crop is applied when fit is `cover` and both width and height are defined
  if (
    directives.fit === 'cover' &&
    isEmpty(directives.crop) &&
    (isNumber(directives.width) || isNumber(directives.height))
  ) {
    directives.crop = 'center';
  }

  return input;
}

type PathSegments = {
  crop: string;
  dimensions: string;
  dpr: string;
  extension: string;
};

/** Returns a URL by injecting Shopify path segments and extension. */
function buildUrl(url: URL, pathSegments: PathSegments): string {
  const {crop, dimensions, dpr, extension} = pathSegments;
  const [pathNameWithoutExt, baseExtension] = url.pathname.split('.') as [string, string];
  const basePathName = normalizedPath(pathNameWithoutExt).concat(`${dimensions}${crop}${dpr}`);

  url.pathname = `${basePathName}.${baseExtension}${extension}`;
  return url.href;
}

// Regex to strip existing Shopify transformations from path
const DIRECTIVES_REGEX = /(_(\d+)?x(\d+)?)?(_crop_[^@]+)?(@\d+x)?$/;

/** Removes existing transformation segments from the Shopify image path. */
function normalizedPath(pathName: string): string {
  return pathName.replace(DIRECTIVES_REGEX, '');
}

/** Returns DPR segment (e.g. '@2x') or empty. */
function getDprPathSegment({dpr}: Directives): string {
  return isNumber(dpr) ? `@${dpr}x` : '';
}

/** Returns the file extension, or an empty string if 'auto' or invalid. */
function getFileExtension({format}: Directives): string {
  return isEmpty(format) || format === 'auto' ? '' : `.${format}`;
}

/** Returns dimensions segment (e.g. '_800x600') or empty. */
function getDimensionsPathSegment({width, height}: Directives): string {
  const hasDimensions = isNumber(width) || isNumber(height);
  return hasDimensions ? `_${width ?? ''}x${height ?? ''}` : '';
}

/** Returns crop segment (e.g. '_crop_center'). */
function getCropPathSegment({crop, width, height}: Directives): string {
  // Crop directives are only applied when at least one dimension is set
  if (isEmpty(crop) || (!isNumber(width) && !isNumber(height))) return '';
  return `_crop_${crop}`;
}
