// -- Module Exports --
export {hasIntrinsicDimensions, invariant};
export {isKeyOf, isEmpty, isFunction, isNullish, isNumber, isString, isUrl};

/**
 * Determines if a value is a valid URL string.
 *
 * @internal
 * @param value - The value to check.
 * @returns True if the value is a valid URL.
 */
function isUrl(value: unknown): value is string {
  try {
    new URL(String(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if the input object possesses defined numeric `width` and `height` properties.
 *
 * @remarks This is a type predicate that narrows the input's type if true. *
 * @internal
 * @typeParam Dimensions - The shape of the dimensions object.
 * @typeParam Input - The shape of the input object.
 * @param input - The object to check, potentially having optional width and height.
 * @returns True if `input.width` and `input.height` are both valid numbers.
 */
function hasIntrinsicDimensions<Dimensions extends {width: number; height: number}, Input extends Partial<Dimensions>>(
  input?: Input,
): input is Dimensions & Input {
  if (!input) return false;
  return isNumber(input.width) && isNumber(input.height);
}

/**
 * Determines if a value is a function.
 *
 * @internal
 * @param value - The value to check.
 * @returns True if the value is a function.
 */
function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * Determines if a value is a string.
 *
 * @internal
 * @param value - The value to check.
 * @returns True if the value is a string.
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Determines if a value is a finite number.
 *
 * @internal
 * @param value - The value to check.
 * @returns True if the value is a number and finite.
 */
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value);
}

/**
 * Determines if a value is empty — `null`, `undefined`, or an empty string.
 *
 * @internal
 * @param value - The value to check.
 * @returns True if the value is nullish or an empty string.
 */
function isEmpty(value: unknown): value is null | undefined | '' {
  return isNullish(value) || value === '';
}

/**
 * Determines if a value is `null` or `undefined`.
 *
 * @internal
 * @param value - The value to check.
 * @returns True if the value is nullish.
 */
function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Returns true if `key` exists in `map`; narrows to known keys.
 * @internal
 */
function isKeyOf<K extends keyof T, T extends object>(key: unknown, map: T): key is K {
  return (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') && key in map;
}

/**
 * Provide a condition and if that condition is falsey, this throws an error
 * with the given message.
 *
 * @remarks
 * Based on https://github.com/epicweb-dev/invariant/blob/main/src/index.ts
 * License: MIT
 *
 * @example
 * invariant(typeof value === 'string', `value must be a string`)
 *
 * @internal
 * @param condition - Condition to check
 * @param message - Message to throw (or a callback to generate the message)
 * @throws InvariantError if condition is falsey
 */
function invariant(condition: unknown, message: string | (() => string)): asserts condition {
  if (condition) return;
  throw new InvariantError(typeof message === 'function' ? message() : message);
}

/**
 * Custom error type thrown by the `invariant` function when a condition is not met.
 * @internal
 */
class InvariantError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvariantError.prototype);
  }
}
