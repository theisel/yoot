import {createAdapter} from '@yoot/yoot';
import type {Adapter, DirectiveNames, Directives, GenerateUrlInput, YootState, PrimeStateInput} from '@yoot/yoot';
import {
  _isKeyOf as isKeyOf,
  _isEmpty as isEmpty,
  _hasIntrinsicDimensions as hasIntrinsicDimensions,
} from '@yoot/yoot/internal';

// -- Module Exports --
export {adapter};
// Exported for testing purposes
export {getDimensionsFromUrl};

/**
 * Adapter for Sanity image URLs.
 *
 * @remarks
 * Supports `cdn.sanity.io` URLs and maps `yoot` directives to Sanity parameters.
 *
 * @public
 */
const adapter: Adapter = createAdapter({
  supports: (url: URL) => url.hostname === 'cdn.sanity.io',
  generateUrl,
  primeState,
});

/**
 * Applies intrinsic image dimensions to the state if they are missing,
 * extracted from the Sanity image URL.
 */
function primeState(input: PrimeStateInput): YootState {
  const hasAspectRatio = 'aspectRatio' in input.directives;
  const isMissingDimensions = !hasIntrinsicDimensions(input);

  if (hasAspectRatio && isMissingDimensions) {
    const dimensions = getDimensionsFromUrl(new URL(input.src));
    return {...input, ...dimensions};
  }

  return input;
}

/** Returns a Sanity image URL with applied transformation directives as query parameters. */
function generateUrl(input: GenerateUrlInput): string {
  const searchParams = Object.entries(input.directives).reduce(searchParamsReducer, new URLSearchParams());

  const url = new URL(input.src);
  url.search = String(searchParams);

  return url.href;
}

type Directive = 'crop' | 'fit' | 'format';
type DirectiveHandler = (value: unknown, params: URLSearchParams) => URLSearchParams;

const DIRECTIVE_HANDLERS = {
  crop: applyCropParam,
  fit: applyFitParam,
  format: applyFormatParam,
} as const satisfies Record<Directive, DirectiveHandler>;

/** Converts directives into Sanity-compatible URLSearchParams. */
function searchParamsReducer(params: URLSearchParams, [key, value]: [string, unknown]): URLSearchParams {
  if (isEmpty(value)) return params;
  if (isKeyOf(key, DIRECTIVE_HANDLERS)) return DIRECTIVE_HANDLERS[key](value, params);
  if (isKeyOf(key, API_MAP)) params.set(API_MAP[key], String(value));
  return params;
}

/** Applies `crop` parameter. */
function applyCropParam(value: unknown, params: URLSearchParams): URLSearchParams {
  const crop = String(value);
  if (crop === 'center') return params;
  params.set(API_MAP['crop'], String(value).replace(' ', ','));
  return params;
}

const FIT_MAP = {
  cover: 'crop',
  contain: 'clip',
} as const satisfies Record<Exclude<Directives['fit'], undefined>, string>;

/** Applies `fit` parameter. */
function applyFitParam(value: unknown, params: URLSearchParams): URLSearchParams {
  const fit = String(value);
  if (isKeyOf(fit, FIT_MAP)) params.set(API_MAP['fit'], FIT_MAP[fit]);
  return params;
}

/** Applies `format` param, with special handling for `auto`. */
function applyFormatParam(value: unknown, params: URLSearchParams): URLSearchParams {
  const format = String(value);
  if (format === 'auto') return params.set('auto', 'format'), params;
  return params.set(API_MAP['format'], format), params;
}

// Extracts intrinsic dimensions from filename in URL
const IMAGE_DIMENSION_REGEX = /-(\d+)x(\d+)\.[^.]+$/;

/** Extracts intrinsic dimensions from URL filename. */
function getDimensionsFromUrl(url: URL): {width: number; height: number} | undefined {
  const [, width, height] = url.pathname.match(IMAGE_DIMENSION_REGEX) ?? [];
  return width && height ? {width: Number(width), height: Number(height)} : undefined;
}

/** Maps `yoot` directive keys to Sanity API equivalents.  */
const API_MAP = {
  crop: 'crop',
  dpr: 'dpr',
  fit: 'fit',
  format: 'fm',
  height: 'h',
  quality: 'q',
  width: 'w',
} as const satisfies Record<Exclude<DirectiveNames, 'aspectRatio'>, string>;
