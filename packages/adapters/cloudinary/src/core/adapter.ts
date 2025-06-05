/**
 * Cloudinary adapter implementation for Yoot.
 * @remarks Handles Cloudinary CDN URLs and applies transformation directives via path segments.
 * @module
 */
import {defineAdapter} from '@yoot/yoot';
import type {Adapter, DirectiveNames, Directives, GenerateUrlInput} from '@yoot/yoot';
import {_isKeyOf as isKeyOf, _isEmpty as isEmpty} from '@yoot/yoot/internal';

// -- Module Exports --
export {adapter};
// For testing purposes
export {urlParts};

/**
 * Adapter for Cloudinary image URLs.
 *
 * @remarks Transforms `yoot` directives into Cloudinary image URL path directives.
 * Supports URLs from the `res.cloudinary.com` and `cloudinary-a.akamaihd.net` hostnames.
 * @see https://github.com/mayashavin/cloudinary-api/blob/23b18d683dbe5d1d1d47c5a468803560f48f18e4/packages/url/lib/url.ts#L6
 * @public
 */
const adapter: Adapter = defineAdapter({
  supports: (url: URL) => url.hostname === 'res.cloudinary.com' || url.hostname === 'cloudinary-a.akamaihd.net',
  generateUrl,
});

/**
 * Returns a Cloudinary image URL with applied transformation directives as path segments.
 */
function generateUrl(input: GenerateUrlInput): string {
  const {src, directives} = input;

  const formattedDirectives = Object.entries(directives)
    .reduce(directivesReducer, [] as string[])
    .join(',');

  return buildUrl(src, formattedDirectives);
}

type Directive = 'aspectRatio' | 'crop' | 'fit' | 'format';
type DirectiveHandler = (value: unknown, directives: string[]) => string[];

const DIRECTIVE_HANDLERS = {
  aspectRatio: applyAspectRatioDirective,
  crop: applyCropDirective,
  fit: applyFitDirective,
  format: applyFormatDirective,
} as const satisfies Record<Directive, DirectiveHandler>;

/** Reducer that converts known transformation directives into Cloudinary-compatible strings. */
function directivesReducer(directives: string[], [key, value]: [string, unknown]) {
  if (isEmpty(value)) return directives;
  if (isKeyOf(key, DIRECTIVE_HANDLERS)) return DIRECTIVE_HANDLERS[key](value, directives);
  if (isKeyOf(key, API_MAP)) directives.push(formatDirective(API_MAP[key], value));
  return directives;
}

/** Returns a URL by inserting directives before resource path segment. */
function buildUrl(src: string, formattedDirectives: string): string {
  // Append a slash if `formattedDirectives` is not empty
  formattedDirectives &&= formattedDirectives.concat('/');
  const [left, right] = urlParts(src);
  return `${left}${formattedDirectives}${right}`;
}

// Regex to split base path from transformation segments
const URL_SPLIT_REGEX =
  /(^.+(upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)\/)((?:[^_/]+_[^,/]+,?)*\/)?(.+)/;

/** Splits Cloudinary URL into base and resource path. */
function urlParts(url: string) {
  // We need the 1st and 4th match
  const [, left, , , right] = url.split(URL_SPLIT_REGEX);
  return [left, right] as [string, string];
}

/** Returns directive in `key_value` format.  */
function formatDirective(key: string, value: unknown) {
  return `${key}_${value}`;
}

/** Applies `aspectRatio` directive. */
function applyAspectRatioDirective(value: unknown, directives: string[]) {
  directives.push(formatDirective(API_MAP['aspectRatio'], value));
  return directives;
}

const CROP_MAP = {
  center: 'center',
  top: 'north',
  bottom: 'south',
  left: 'west',
  right: 'east',
} as const satisfies Record<Exclude<Directives['crop'], undefined>, string>;

/** Applies `crop` directive. */
function applyCropDirective(value: unknown, directives: string[]) {
  const crop = String(value);
  if (isKeyOf(crop, CROP_MAP)) directives.push(formatDirective(API_MAP['crop'], CROP_MAP[crop]));
  return directives;
}

const FIT_MAP = {
  cover: 'fill',
  contain: 'fit',
} as const satisfies Record<Exclude<Directives['fit'], undefined>, string>;

/** Applies `fit` directive. */
function applyFitDirective(value: unknown, directives: string[]) {
  const fit = String(value);
  if (isKeyOf(fit, FIT_MAP)) directives.push(formatDirective(API_MAP['fit'], FIT_MAP[fit]));
  return directives;
}

/** Applies `format` directive. */
function applyFormatDirective(value: unknown, directives: string[]) {
  directives.push(formatDirective(API_MAP['format'], String(value)));
  return directives;
}

/** Maps `yoot` directive keys to Cloudinary API equivalents. */
const API_MAP = {
  aspectRatio: 'ar',
  dpr: 'dpr',
  crop: 'g',
  fit: 'c',
  format: 'f',
  height: 'h',
  quality: 'q',
  width: 'w',
} as const satisfies Record<DirectiveNames, string>;
