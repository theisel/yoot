import {_getAdapter as getAdapter} from './adapter.ts';
import {mustBeOneOf, mustBeInRange, normalizeDirectives} from './helpers.ts';
import {YOOT_BRAND} from './store.ts';
import {invariant, isEmpty, isNullish, isNumber, isString, isUrl} from './utils.ts';

// -- Module Exports --
// API function and helpers
export {createYoot as yoot};
// Yoot related types
export type {Yoot, YootFactory, YootInput, YootState, PrimeStateInput};
// Directive related types
export type {Directives, DirectiveHandler, DirectiveMethods, DirectiveNames, OutputMethods, Horizontal, Vertical};

/**
 * Creates a new Yoot image transformation object.
 *
 * @remarks Entry point for all image transformations. *
 * @public
 * @param init - Optional initial state or image source URL string.
 * @returns A new chainable Yoot object.
 */
const createYoot = (init?: YootInput): Yoot => {
  return yoot(deriveState(unwrapInput(init)));
};

/**
 * Core factory for Yoot objects, enabling immutable chaining.
 *
 * @internal
 * @param state- The state for this Yoot object.
 * @returns A chainable Yoot object.
 */
function yoot(state: YootState): Yoot {
  /**
   * Creates a handler to apply a directive.
   *
   * @param key - The directive key.
   * @returns A function to set the directive's value and return a new Yoot.
   */
  function applyDirective<K extends keyof Directives>(
    key: K,
    validation: (key: string, value: unknown) => void,
  ): DirectiveHandler<K> {
    // When the value is `undefined`, skip applying this directive (no change).
    return (value) => {
      validation(key, value);
      return value === undefined ? api() : api({directives: {[key]: value}});
    };
  }

  // --- Internal State & Computation ---

  // Lazily computed and cached URL and normalized directives
  let _generatedUrl: string | undefined;
  let _normalizedDirectives: Directives | undefined;

  /**
   * Generates and caches the final image URL and normalized directives.
   *
   * @returns The generated image URL.
   * @throws If `state.src` is missing.
   */
  function generateUrl() {
    if (_generatedUrl) return _generatedUrl;

    assertSrc(state, 'Image source URL is required');

    const adapter = getAdapter(new URL(state.src));
    const primedState = adapter.primeState?.({...state}) ?? {...state};

    _normalizedDirectives = normalizeDirectives(primedState);

    _generatedUrl = adapter.generateUrl({
      src: state.src,
      directives: _normalizedDirectives,
    });

    return _generatedUrl;
  }

  /**
   * Normalizes the url to its base URL.
   * @returns The normalized URL or `null` if `state.src` is empty.
   */
  function baseUrl() {
    const src = state.src;
    // If src is empty, return null
    if (isEmpty(src)) return null;
    try {
      const url = new URL(src);
      const adapter = getAdapter(url);
      return adapter?.normalizeUrl(url) ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Clones the current state, suitable for serialization.
   *
   * @returns The current state as a JSON object
   */
  function toJSON(): YootState {
    return {...state, directives: {...(_normalizedDirectives ?? state.directives)}};
  }

  // -- API Object --

  // The core function representing this API object.
  // Calling it creates the *next* API object with the provided state.
  const api = (input?: YootInput) => {
    if (isNullish(input)) return yoot(deriveState(state));
    return yoot(deriveState(state, unwrapInput(input)));
  };

  // -- Image metadata and map to change state --
  api.src = (src: string) => {
    invariant(isUrl(src), "[yoot] src isn't a valid URL");
    return api({src});
  };
  api.alt = (alt: string) => api({alt});
  api.map = (fn: (state: YootState) => YootState) => api(fn({...state}));
  // -- Directive methods --
  api.aspectRatio = api.ar = applyDirective('aspectRatio', mustBeInRange(1, Infinity));
  api.crop = applyDirective('crop', mustBeOneOf(allowedCrops));
  api.dpr = applyDirective('dpr', mustBeInRange(1, Infinity));
  api.fit = applyDirective('fit', mustBeOneOf(allowedFits));
  api.format = api.fm = applyDirective('format', mustBeOneOf(allowedFormats));
  api.height = api.h = applyDirective('height', mustBeInRange(1, Infinity));
  api.quality = api.q = applyDirective('quality', mustBeInRange(0, 100));
  api.width = api.w = applyDirective('width', mustBeInRange(1, Infinity));

  // -- Output methods --
  Object.defineProperties(api, {
    // Branding symbol
    [YOOT_BRAND]: {value: true},
    // -- Output methods --
    toJSON: {value: toJSON},
    toString: {value: generateUrl},
    url: {get: generateUrl},
    baseUrl: {get: baseUrl},
    hasSrc: {get: () => !isEmpty(state.src)},
  });

  return Object.freeze(api) as Yoot;
}

/**
 * Normalizes input into a `SomeYootState` object.
 * @remarks Accepts a URL string, JSON string, partial state, or a `Yoot` instance.
 * @internal
 */
function unwrapInput(input?: YootInput): SomeYootState {
  if (isString(input)) {
    if (isUrl(input)) return {src: input};

    try {
      // We may have a JSON string representing a state.
      return JSON.parse(input);
    } catch {
      return {};
    }
  }

  // Is this a Yoot object?
  if (isYoot(input)) return input.toJSON();

  return {...input};
}

/**
 * Checks if a value has a `toJSON` method.
 * @internal
 */
function isYoot(value: unknown): value is Yoot {
  return typeof value === 'function' && YOOT_BRAND in value;
}

/**
 * Allowed values for the `fit` directive.
 * @internal
 */
const allowedFits: Set<Exclude<Directives['fit'], undefined>> = new Set(['contain', 'cover']);

/**
 * Allowed values for the `format` directive.
 * @internal
 */
const allowedFormats: Set<Exclude<Directives['format'], undefined>> = new Set(['auto', 'jpg', 'png', 'webp']);

/**
 * Allowed values for the `crop` directive.
 * @internal
 */
const allowedCrops: Set<Exclude<Directives['crop'], undefined>> = new Set(['center', 'top', 'bottom', 'left', 'right']);

/**
 * Merges 'next' state into 'current', with 'next' values taking precedence.
 *
 * @internal
 * @param current - Base YootState (or partial).
 * @param next - Changes to merge into current.
 * @returns A new `YootState` with `next` values overriding `current`.
 */
function deriveState(current: SomeYootState, next: SomeYootState = {}): YootState {
  const src = 'src' in next ? next.src : current.src;
  const alt = 'alt' in next ? next.alt : current.alt;
  const width = 'width' in next ? next.width : current.width;
  const height = 'height' in next ? next.height : current.height;

  const state: YootState = {
    directives: {...current.directives, ...next.directives},
  };

  if (isUrl(src)) state.src = src;
  if (isString(alt)) state.alt = alt;
  if (isNumber(width)) state.width = width;
  if (isNumber(height)) state.height = height;

  return state;
}

/**
 * Asserts that `input.src` is a non-empty string. Throws if not.
 * @internal
 */
function assertSrc(input: YootState, message: string): asserts input is {src: string} & Omit<YootState, 'src'> {
  invariant(typeof input.src === 'string', message);
}

/**
 * Vertical crop options.
 * @public
 */
type Vertical = 'top' | 'bottom';

/**
 * Horizontal crop options.
 * @public
 */
type Horizontal = 'left' | 'right';

/**
 * Object map of image transformation directives.
 * @public
 */
type Directives = {
  aspectRatio?: number;
  crop?: 'center' | Vertical | Horizontal;
  dpr?: number;
  fit?: 'contain' | 'cover';
  format?: 'auto' | 'jpg' | 'png' | 'webp';
  height?: number;
  quality?: number;
  width?: number;
};

/**
 * Keys of the `Directives` object.
 * @public
 */
type DirectiveNames = keyof Directives;

/**
 * Function that applies a directive and returns a new `Yoot` object.
 * @public
 */
type DirectiveHandler<K extends keyof Directives> = (value: NonNullable<Directives[K]> | null) => Yoot;

/**
 * Input for `yoot()`: a source URL string or a partial `YootState` object.
 * @public
 */
type YootInput = string | Yoot | SomeYootState;

/**
 * The public Yoot API: a callable factory for new states, with chainable methods.
 * @public
 */
interface Yoot extends YootFactory, DirectiveMethods, OutputMethods {
  /**
   * Marks this object as Yoot.
   * @internal
   */
  readonly [YOOT_BRAND]: true;
  /**
   * Sets the image source URL.
   * @param src - The image URL.
   * @throws If `src` is not a valid URL string.
   */
  src(src: string): Yoot;
  /**
   * Sets the image alt text (stored in state).
   * @param alt - The alt text.
   */
  alt(alt: string): Yoot;
  /**
   * Applies custom transformations to the current state.
   *
   * @remarks
   * The callback receives a mutable copy of the current state.
   *
   * @param fn - Function `(state: YootState) => SomeYootState` to modify state.
   *
   * @example
   * ```ts
   * yoot().src('https://cdn.example.com/images/image-1.png').width(100).map((state) => {
   *   state.alt ||= 'Fallback Alt Text';
   *   state.directives.format = 'webp';
   *   return state;
   * }).url;
   * ```
   */
  map(fn: (state: YootState) => YootState): Yoot;
}

/**
 * Callable signature of the Yoot object.
 * @public
 */
interface YootFactory {
  (input?: YootInput): Yoot;
}

/**
 * Image transformation directive methods available on the Yoot object.
 * @public
 */
interface DirectiveMethods {
  /** Sets aspect ratio. */
  aspectRatio: DirectiveHandler<'aspectRatio'>;
  /** Alias for `aspectRatio`. */
  ar: DirectiveHandler<'aspectRatio'>;
  /** Sets crop mode. */
  crop: DirectiveHandler<'crop'>;
  /** Sets device pixel ratio. */
  dpr: DirectiveHandler<'dpr'>;
  /** Sets fit mode. */
  fit: DirectiveHandler<'fit'>;
  /** Sets output format. */
  format: DirectiveHandler<'format'>;
  /** Alias for `format`. */
  fm: DirectiveHandler<'format'>;
  /** Sets target height. */
  height: DirectiveHandler<'height'>;
  /** Alias for `height`. */
  h: DirectiveHandler<'height'>;
  /** Sets quality. */
  quality: DirectiveHandler<'quality'>;
  /** Alias for `quality`. */
  q: DirectiveHandler<'quality'>;
  /** Sets target width. */
  width: DirectiveHandler<'width'>;
  /** Alias for `width`. */
  w: DirectiveHandler<'width'>;
}

/**
 * Output methods available on the Yoot object.
 * @public
 */
interface OutputMethods {
  /**
   * Returns a serializable copy of the current state.
   * @remarks Called by `JSON.stringify()`.
   * @returns A shallow-cloned `YootState` object.
   */
  toJSON: () => YootState;
  /**
   * Returns the transformed image URL. Same as `url()`.
   * @throws Error If `state.src` is not a valid string.
   */
  toString: () => string;
  /**
   * Returns true if `src` has been given.
   */
  readonly hasSrc: boolean;
  /**
   * Returns the generated image URL.
   * @throws Error If `state.src` is not a valid string.
   */
  readonly url: string;
  /**
   * Returns the base (normalized) URL.
   * @remarks This is `null` if `src` is empty.
   */
  readonly baseUrl: string | null;
}

/**
 * Represents the state of a Yoot object.
 *
 * @remarks
 * Suitable for `toJSON()` output.
 *
 * @public
 */
type YootState = {
  /** Image source URL. */
  src?: string;
  /** Image alt text. */
  alt?: string;
  /** Intrinsic width of the source image, if known. */
  width?: number;
  /** Intrinsic height of the source image, if known. */
  height?: number;
  /** Object map of transformation directives (e.g., `{ width: 300, format: 'webp' }`). */
  directives: Directives;
};

/**
 * Represents a version of `YootState` that guarantees the presence of `src`
 *
 * @remarks Used as input to adapter `primeState` methods.
 * @public
 */
type PrimeStateInput = {src: string} & Omit<YootState, 'src'>;

/**
 * A partial `YootState`, used for updates and initial input.
 * @public
 */
type SomeYootState = Partial<YootState>;
