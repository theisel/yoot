/**
 * 🚨 INTERNAL API: DO NOT USE IN APPLICATION CODE
 * @remarks This module is strictly for internal use by `@yoot/*` adapter packages.
 * It is not part of the public API and may change or be removed without notice.
 * @module @yoot/yoot/internal
 * @packageDocumentation
 * @internal
 */
export {
  hasDimensions as _hasDimensions,
  hasIntrinsicDimensions as _hasIntrinsicDimensions,
  isKeyOf as _isKeyOf,
  invariant as _invariant,
  isEmpty as _isEmpty,
  isNullish as _isNullish,
  isNumber as _isNumber,
  isString as _isString,
} from './core/utils.ts';
