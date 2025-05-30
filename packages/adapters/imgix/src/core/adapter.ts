import {createAdapter} from '@yoot/yoot';
import type {DirectiveNames, Directives, GenerateUrlInput} from '@yoot/yoot';
import {_isKeyOf as isKeyOf, _isEmpty as isEmpty} from '@yoot/yoot/internal';

// -- Module Exports --
export {adapter};

/**
 * An adapter for Imgix URLs.
 *
 * @remarks Supports `.imgix.net` URLs and maps `yoot` directives to Imgix parameters.
 * @public
 */
const adapter = createAdapter({
  supports: (url: URL) => url.hostname.endsWith('.imgix.net'),
  generateUrl,
});

/** Returns an Imgix image URL with applied transformation directives as query parameters. */
function generateUrl(input: GenerateUrlInput): string {
  const searchParams = Object.entries(input.directives).reduce(searchParamsReducer, new URLSearchParams());

  const url = new URL(input.src);
  url.search = String(searchParams);

  return url.href;
}

type Directive = 'aspectRatio' | 'crop' | 'fit' | 'format';
type DirectiveHandler = (value: unknown, params: URLSearchParams) => URLSearchParams;

const DIRECTIVE_HANDLERS = {
  aspectRatio: applyAspectRatioParam,
  crop: applyCropParam,
  fit: applyFitParam,
  format: applyFormatParam,
} as const satisfies Record<Directive, DirectiveHandler>;

/** Converts directives into Imgix-compatible URLSearchParams. */
function searchParamsReducer(params: URLSearchParams, [key, value]: [string, unknown]): URLSearchParams {
  if (isEmpty(value)) return params;
  if (isKeyOf(key, DIRECTIVE_HANDLERS)) return DIRECTIVE_HANDLERS[key](value, params);
  if (isKeyOf(key, API_MAP)) params.set(API_MAP[key], String(value));
  return params;
}

/** Applies `aspectRatio` parameter. */
function applyAspectRatioParam(value: unknown, params: URLSearchParams): URLSearchParams {
  return params.set(API_MAP['aspectRatio'], String(value)), params;
}

/**
 * Applies `crop` parameter.
 *
 * @remarks If crop is `center` we ignore it as Imgix does not have a `center` option.
 * @see https://docs.imgix.com/en-US/apis/rendering/size/crop-mode
 */
function applyCropParam(value: unknown, params: URLSearchParams): URLSearchParams {
  const crop = String(value);
  if (crop === 'center') return params; // Defaults to center
  return params.set(API_MAP['crop'], crop.replace(' ', ',')), params;
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

/** Maps `yoot` directive keys to Imgix API equivalents. */
const API_MAP = {
  aspectRatio: 'ar',
  crop: 'crop',
  dpr: 'dpr',
  format: 'fm',
  fit: 'fit',
  height: 'h',
  quality: 'q',
  width: 'w',
} as const satisfies Record<DirectiveNames, string>;
