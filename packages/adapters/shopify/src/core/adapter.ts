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
  normalizeUrl,
  primeState,
});

/**
 * Converts a URL to a base URL by removing transformation directives.
 * @param url - The URL to clean.
 * @returns The base URL without transformation directives.
 */
function normalizeUrl(url: URL): string {
  const version = url.searchParams.get('v'); // Preserve Shopify's 'v' parameter

  const baseUrl = new URL(url.href);
  const [pathNameWithoutExt, baseExtension] = urlParts(baseUrl);
  baseUrl.pathname = stripDirectives(pathNameWithoutExt).concat(baseExtension); // Strip transformation segments from path
  baseUrl.search = ''; // Remove query parameters
  baseUrl.hash = ''; // Remove hash fragment

  if (!isEmpty(version)) {
    baseUrl.searchParams.set('v', version); // Apply 'v' if it existed
  }

  return baseUrl.href;
}

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
  const [pathNameWithoutExt, baseExtension] = urlParts(url);
  const basePathName = stripDirectives(pathNameWithoutExt).concat(`${dimensions}${crop}${dpr}`);

  url.pathname = `${basePathName}${baseExtension}${extension}`;
  return url.href;
}

/**
 * Splits a URL pathname into the base path and original file extension.
 *
 * @remarks The format extension is omitted in the tuple.
 * @param url - The URL to split.
 * @returns A tuple of [basePath, fileExtension].
 */
function urlParts(url: URL): [BasePath, FileExtension] {
  return url.pathname.split(/(\.[^.]+)(\.(jpg|png|webp))?$/) as [BasePath, FileExtension];
}

type BasePath = string;
type FileExtension = `.${string}`;

// Regex to strip existing Shopify transformations from path
const DIRECTIVES_REGEX = /(_(\d+)?x(\d+)?)?(_crop_[^@]+)?(@\d+x)?$/;

/** Removes existing transformation segments from the Shopify image path. */
function stripDirectives(pathName: string): string {
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
